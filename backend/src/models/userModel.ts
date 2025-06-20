import db from '../config/database';
import { Path } from '../types';

export function getUserInfo(name: string): Path[] {
  const sql = db.prepare('SELECT compressedDir, zipType FROM TB_USERINFO WHERE name = ?');
  return sql.all(name) as Path[];
}

export function updateCompressedType(compressedDir: string, zipType: string, name: string): void {
  const sql = db.prepare('UPDATE TB_USERINFO SET compressedDir = ?, zipType = ? WHERE name = ?');
  const result = sql.run(compressedDir, zipType, name);

  if (result.changes === 0) {
    throw new Error(`TB_USERINFO Name not found or no changes made.`);
  }
}
