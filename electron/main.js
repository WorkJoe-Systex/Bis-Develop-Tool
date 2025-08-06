const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, protocol } = require('electron');
const { execFile } = require('child_process');
const os = require('os');
const net = require('net');

// 🧱 單一實例鎖
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

// ✅ 設定 NODE_PATH 並初始化模組路徑
const vendorPath = path.join(process.resourcesPath, 'backend', 'vendor_modules');
process.env.NODE_PATH = vendorPath;
require('module').Module._initPaths();

// ✅ 正確使用 NODE_PATH 載入 tree-kill
const treeKill = require(path.join(vendorPath, 'tree-kill'));

const isDev = !app.isPackaged;
let backendProcess = null;

// ✅ 設定 NODE_PATH 給 vendor_modules
process.env.NODE_PATH = path.join(process.resourcesPath, 'backend', 'vendor_modules');
require('module').Module._initPaths();

// ✅ Debug log 輸出路徑
const debugLogPath = path.join(app.getPath('temp'), 'bis-electron-main.log');
const debugStream = fs.createWriteStream(debugLogPath, { flags: 'a' });
console.log = (...args) => debugStream.write(`[console.log] ${args.join(' ')}\n`);
console.error = (...args) => debugStream.write(`[console.error] ${args.join(' ')}\n`);


// ✅ 在這裡註冊一個安全協定（解決 Not allowed to load local resource）
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
    console.log('🚀 App Path:', app.getAppPath());
    console.log('📦 準備載入 index.html：', path.join(app.getAppPath(), 'build', 'index.html'));

    const htmlPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'build', 'index.html');
    win.loadFile(htmlPath); // ✅ 直接用 file path 載入 HTML
  }

  if (isDev || process.env.DEBUG_UI === 'true') {
    win.webContents.openDevTools();
  }
}

function isPortInUse(port) {
  return new Promise(resolve => {
    const tester = net.createServer()
      .once('error', err => resolve(err.code === 'EADDRINUSE'))
      .once('listening', () => tester.close(() => resolve(false)))
      .listen(port);
  });
}

function startBackend() {
  const script = os.platform() === 'win32' ? 'run.bat' : 'run.sh';
  const scriptPath = path.join(process.resourcesPath, 'backend', script);

  if (!fs.existsSync(scriptPath)) {
    console.error(`❌ 無法找到後端啟動腳本：${scriptPath}`);
    return;
  }

  console.log('🔍 PATH:', process.env.PATH);
  console.log('🚀 執行後端腳本：', scriptPath);

  // ✅ 實際執行 backend
  backendProcess = execFile(scriptPath, {
    cwd: path.dirname(scriptPath),
    shell: os.platform() !== 'win32',
  });

  backendProcess.stdout?.on('data', data => {
    console.log(`[stdout] ${data}`);
  });
  backendProcess.stderr?.on('data', data => {
    console.error(`[stderr] ${data}`);
  });
  backendProcess.on('error', err => {
    console.error('❌ 後端啟動失敗：', err.message);
  });
  backendProcess.on('exit', code => {
    console.log(`ℹ️ 後端程式結束，代碼：${code}`);
  });
  console.log(`🧪 backendProcess.pid: ${backendProcess.pid}`);
}

// ✅ 啟動階段註冊自訂協定 主流程
app.whenReady().then(async () => {
  console.log('✅ App is ready');

  if (!isDev) {
    // 註冊 app:// 協定處理器
    await protocol.handle('app', (request) => {
      const url = request.url.replace('app://', '').replace(/^\/+/, '');
      const finalPath = url === '' || url === '-' || url === '-/' ? 'index.html' : url;
      const filePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'build', finalPath);

      console.log('📦 Handling app:// request for', filePath);

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
      })).catch(err => {
        console.error('❌ Failed to read frontend file:', err);
        return {
          data: Buffer.from(`<h1>Failed to load frontend</h1><pre>${err.message}</pre>`),
          mimeType: 'text/html',
        };
      });
    });

    // ✅ 確保 port 沒被占用才啟動後端
    const port = 3000;
    const inUse = await isPortInUse(port);
    if (inUse) {
      console.error(`❌ Port ${port} 已被使用，跳過後端啟動`);
    } else {
      startBackend();
    }
  }
  createWindow();
});

// ✅ 關閉視窗時關閉應用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ✅ 退出 app 時殺掉後端
app.on('before-quit', () => {
  if (backendProcess && !backendProcess.killed) {
    console.log('🛑 Killing backend...');
    treeKill(backendProcess.pid, 'SIGTERM', (err) => {
      if (err) {
        console.error('❌ Failed to kill backend process:', err);
      } else {
        console.log('✅ Backend process killed.');
      }
    });
  }
});
