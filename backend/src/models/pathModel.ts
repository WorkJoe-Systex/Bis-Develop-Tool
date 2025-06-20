import db from '../config/database';
import { Path } from '../types';

export function getPath(serverType: string, name: string): { path: string }[] {
  const sql = db.prepare('SELECT path FROM TB_PATH WHERE serverType = ? AND name = ?');
  return sql.all(serverType, name) as Path[];
}

export function getPathByServerType(serverType: string): { path: string; name: string; serverType: string }[] {
  const sql = db.prepare('SELECT path, name, serverType FROM TB_PATH WHERE serverType = ?');
  return sql.all(serverType) as Path[];
}

export function updatePath(path: string, serverType: string, name: string): void {
  const sql = db.prepare('UPDATE TB_PATH SET path = ? WHERE serverType = ? AND name = ?');
  const result = sql.run(path, serverType, name);

  if (result.changes === 0) {
    throw new Error(`TB_PATH Path not found or no changes made.`);
  }
}
