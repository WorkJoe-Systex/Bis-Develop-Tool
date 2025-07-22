import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// 判斷是否為 production 模式
const isProd = process.env.NODE_ENV === 'production';

// 🔧 取得資源路徑
const resourcesPath = isProd
  ? (process as any).resourcesPath // Electron production 模式
  : path.resolve(__dirname, '..', '..');

// 🔗 組出資料庫完整路徑
const dbPath = path.join(resourcesPath, 'data', 'data.db');

// ✅ 確保資料夾存在（開發用）
if (!isProd) {
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// ✅ 避免 production 模式下誤建空 DB
if (isProd && !fs.existsSync(dbPath)) {
  throw new Error(`❌ 找不到資料庫檔案：${dbPath}`);
}

// 🧠 重試連線機制（支援硬體 I/O 較慢的環境）
function connectWithRetry(file: string, retries = 3, delay = 500): DatabaseType {
  for (let i = 0; i < retries; i++) {
    try {
      const db = new Database(file);
      console.log(`✅ 成功連接 SQLite（第 ${i + 1} 次嘗試）：${file}`);
      return db;
    } catch (err) {
      console.error(`⚠️ SQLite 連線失敗（第 ${i + 1} 次）：`, err);
      if (i < retries - 1) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delay);
      }
    }
  }
  throw new Error('❌ 無法連接 SQLite，已達最大重試次數');
}

// 🔌 建立連線
const db = connectWithRetry(dbPath);

// ✅ 同步初始化資料表
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS TB_PATH (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      serverType TEXT,
      name TEXT,
      path TEXT
    );

    CREATE TABLE IF NOT EXISTS TB_FILETYPE (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      fileType TEXT
    );

    CREATE TABLE IF NOT EXISTS TB_USERINFO (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      compressedDir TEXT,
      zipType TEXT
    );

    CREATE TABLE IF NOT EXISTS TB_QRCODE (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      txncode TEXT NOT NULL,
      hostmsg TEXT,
      description TEXT NOT NULL,
      original_text TEXT NOT NULL,
      qrcodes TEXT NOT NULL,
      createTime DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ 資料表初始化完成');
} catch (err) {
  console.error('❌ 資料表初始化失敗：', err);
  process.exit(1); // 初始化失敗立即退出
}

// 🚨 全域錯誤監聽（避免沒看到錯誤）
process.on('uncaughtException', (err) => {
  console.error('🚨 未捕捉例外錯誤：', err);
});

export default db;
