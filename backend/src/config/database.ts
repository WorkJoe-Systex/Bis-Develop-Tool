import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// 判斷是否為 production 模式
const isProd = process.env.NODE_ENV === 'production';

// 🔧 動態抓取 resourcesPath（解決打包後 SQLite 無法讀取）
const resourcesPath = isProd
  ? (process as any).resourcesPath // 打包後為 resources 資料夾
  : path.resolve(__dirname, '..', '..');

// 🔗 組出資料庫路徑
const dbPath = path.join(resourcesPath, 'data', 'data.db');

// ✅ 避免 production 模式下誤建空 DB
if (isProd && !fs.existsSync(dbPath)) {
  throw new Error(`❌ 找不到資料庫檔案：${dbPath}`);
}

// ✅ 開發模式才自動建立資料夾
if (!isProd) {
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// 🧠 連線 SQLite
const db = new Database(dbPath);
console.log(`✅ 成功連接 SQLite：${dbPath}`);

// ✅ 初始化資料表
(async () => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS TB_PATH (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      serverType TEXT,
      name TEXT,
      path TEXT
    )
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS TB_FILETYPE (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      fileType TEXT
    )
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS TB_USERINFO (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      compressedDir TEXT,
      zipType TEXT
    )
  `);
  await db.exec(`
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
})();

export default db;
