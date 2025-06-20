import Database from 'better-sqlite3';
// 打開SQLite連線
const dataDB = new Database('./data/data.db');

/**
 * 1.提供一個統一的接口讓其他模組獲取資料庫實例。
 * 2.每次呼叫時，都會等待 dbPromise 被解決，並返回資料庫物件（Database）。
 * 3.確保只有一個資料庫連線，避免每個模組都自行初始化資料庫。
 */
export async function getDatabase() {
  const db = await dataDB;
  return db;
}

(async () => {
  const db = await getDatabase();
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
    CREATE TABLE TB_QRCODE (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      original_text TEXT NOT NULL,
      qrcodes TEXT NOT NULL, -- JSON 字串
      createTime DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Database initialized');
})();

// 初始化只需調用一次
// 1.在應用啟動時初始化資料庫。
// 2.使用 SQL 語句檢查並建立 users 資料表（若尚未存在）。
// 3.初始化邏輯只執行一次，因為是立即執行的自執行函數（(async () => { ... })()）。
// (async () => {
//   const db = await getDatabase();
//   await db.run(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT
//     )
//   `);
//   console.log('Database initialized');
// })();
// 這是一個 立即執行的匿名函數（IIFE, Immediately Invoked Function Expression）。它會在定義後馬上執行，因此無需手動調用。

export default dataDB;
