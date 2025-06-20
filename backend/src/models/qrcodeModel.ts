import db from '../config/database';

export async function saveQRcode(description:string, longText:string, qrcodes:string[]): Promise<{ lastInsertRowid: number }> {
  const sql = db.prepare(`
    INSERT INTO TB_QRCODE (description, original_text, qrcodes)
    VALUES (?, ?, ?)
  `);
  const result = sql.run(description, longText, JSON.stringify(qrcodes));
  // 明確斷言 result.lastID 為 number，不為 undefined
  if (typeof result.lastInsertRowid === 'number') {
    return { lastInsertRowid: result.lastInsertRowid };
  } else {
    throw new Error('Failed to get last inserted ID');
  }
}
