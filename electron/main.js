const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, protocol } = require('electron');
const { spawn } = require('child_process');
const os = require('os');
const net = require('net');
const http = require('http');

// 單一實例鎖
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

let mainWindow;
let backendProcess = null;
const isDev = !app.isPackaged;

// 設定 NODE_PATH 並初始化模組路徑
const vendorPath = path.join(process.resourcesPath, 'backend', 'vendor_modules');
process.env.NODE_PATH = vendorPath;
require('module').Module._initPaths();
const treeKill = require(path.join(vendorPath, 'tree-kill'));

// Debug log
const debugLogPath = path.join(app.getPath('temp'), 'bis-electron-main.log');
const debugStream = fs.createWriteStream(debugLogPath, { flags: 'a' });
console.log = (...args) => debugStream.write(`[console.log] ${args.join(' ')}\n`);
console.error = (...args) => debugStream.write(`[console.error] ${args.join(' ')}\n`);

// 註冊安全協定
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    const devPath = path.join(__dirname, '..', 'frontend', 'build', 'index.html');
    win.loadFile(devPath);
  } else {
    const htmlPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'build', 'index.html');
    win.loadFile(htmlPath);
  }

  if (isDev || process.env.DEBUG_UI === 'true') {
    win.webContents.openDevTools();
  }

  mainWindow = win;
}

function isPortInUse(port) {
  return new Promise(resolve => {
    const tester = net.createServer()
      .once('error', err => resolve(err.code === 'EADDRINUSE'))
      .once('listening', () => tester.close(() => resolve(false)))
      .listen(port);
  });
}

// ✅ 健康檢查等待
async function waitForServer(url, timeout = 15000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      await new Promise((resolve, reject) => {
        http.get(url, (res) => {
          if (res.statusCode === 200) resolve(true);
          else reject();
        }).on('error', reject);
      });
      console.log('✅ 後端已就緒');
      return true;
    } catch {
      console.log('⏳ 等待後端啟動中...');
      await new Promise(r => setTimeout(r, 500));
    }
  }
  throw new Error('❌ 後端啟動超時');
}

// ✅ 直接 spawn 啟動後端
function startBackend() {
  const nodePath = path.join(process.resourcesPath, 'backend', 'node.exe');
  const serverPath = path.join(process.resourcesPath, 'backend', 'dist', 'server.js');

  if (!fs.existsSync(nodePath) || !fs.existsSync(serverPath)) {
    console.error(`❌ 找不到後端啟動檔案：${nodePath} / ${serverPath}`);
    return;
  }

  console.log('🚀 啟動後端：', nodePath, serverPath);

  backendProcess = spawn(nodePath, [serverPath], {
    cwd: path.join(process.resourcesPath, 'backend')
  });

  backendProcess.stdout?.on('data', data => console.log(`[stdout] ${data}`));
  backendProcess.stderr?.on('data', data => console.error(`[stderr] ${data}`));
  backendProcess.on('error', err => console.error('❌ 後端啟動失敗：', err.message));
  backendProcess.on('exit', code => console.log(`ℹ️ 後端結束，代碼：${code}`));
}

app.whenReady().then(async () => {
  console.log('✅ App is ready');

  if (!isDev) {
    // 註冊 app:// 協定
    await protocol.handle('app', (request) => {
      const url = request.url.replace('app://', '').replace(/^\/+/, '');
      const finalPath = url === '' || url === '-' || url === '-/' ? 'index.html' : url;
      const filePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'build', finalPath);

      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.ico': 'image/x-icon',
        '.svg': 'image/svg+xml',
      };
      const mimeType = mimeTypes[ext] || 'text/plain';

      return fs.promises.readFile(filePath).then(data => ({
        data,
        mimeType,
      })).catch(err => ({
        data: Buffer.from(`<h1>Failed to load frontend</h1><pre>${err.message}</pre>`),
        mimeType: 'text/html',
      }));
    });

    const port = 3000;
    const inUse = await isPortInUse(port);
    if (inUse) {
      console.error(`❌ Port ${port} 已被使用，跳過後端啟動`);
    } else {
      startBackend();
      await waitForServer(`http://localhost:${port}/api/health`); // 需要後端有 /api/health
    }
  }

  createWindow();
});

// 關閉視窗時退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// 關閉 app 時殺掉後端
app.on('before-quit', () => {
  if (backendProcess && !backendProcess.killed) {
    console.log('🛑 Killing backend...');
    treeKill(backendProcess.pid, 'SIGTERM', (err) => {
      if (err) console.error('❌ Failed to kill backend process:', err);
      else console.log('✅ Backend process killed.');
    });
  }
});
