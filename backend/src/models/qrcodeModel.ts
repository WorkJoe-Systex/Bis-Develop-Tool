import db from '../config/database';
import { QRCodeRecord } from '../types';

export async function saveQRcode(txncode:string, hostmsg: string, description:string, longText:string, qrcodes:string[]): Promise<{ lastInsertRowid: number }> {
  const sql = db.prepare(`
    INSERT INTO TB_QRCODE (txncode, hostmsg, description, original_text, qrcodes)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = sql.run(txncode, hostmsg, description, longText, JSON.stringify(qrcodes));
  // 明確斷言 result.lastID 為 number，不為 undefined
  if (typeof result.lastInsertRowid === 'number') {
    return { lastInsertRowid: result.lastInsertRowid };
  } else {
    throw new Error('Failed to get last inserted ID');
  }
}

export async function queryQRCodesByTxncode(txncode:string): Promise<QRCodeRecord[]> {
  const sql = db.prepare(`SELECT id, txncode, hostmsg, description, original_text, qrcodes FROM TB_QRCODE WHERE txncode = ?`);
  const rows = sql.all(txncode);

  // 手動處理 qrcodes 欄位（JSON.parse）
  const formatted = rows.map((row: any) => ({
    id: row.id,
    txncode: row.txncode,
    hostmsg: row.hostmsg,
    description: row.description,
    original_text: row.original_text,
    qrcodes: JSON.parse(row.qrcodes), // ✅ 將字串轉成陣列
  }));

  return formatted;
}

export async function queryQRCodesByID(id:string): Promise<QRCodeRecord[]> {
  const sql = db.prepare(`SELECT id, txncode, hostmsg, description, original_text, qrcodes FROM TB_QRCODE WHERE id = ?`);
  const rows = sql.all(id);

  // 手動處理 qrcodes 欄位（JSON.parse）
  const formatted = rows.map((row: any) => ({
    id: row.id,
    txncode: row.txncode,
    hostmsg: row.hostmsg,
    description: row.description,
    original_text: row.original_text,
    qrcodes: JSON.parse(row.qrcodes), // ✅ 將字串轉成陣列
  }));

  return formatted;
}

export async function deleteQRCodesByID(id:string): Promise<{ Chgcount:number }> {
  const sql = db.prepare(`DELETE FROM TB_QRCODE WHERE id = ?`);
  const result = sql.run(id);
  return { Chgcount: result.changes };
}