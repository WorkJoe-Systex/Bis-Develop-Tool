import db from '../config/database';
import { HostMsg } from '../types';

export async function qryAllHostMsg(): Promise<HostMsg[]> {
  const sql = db.prepare(`SELECT id, txncode, hostmsg, description, status, original_text FROM TB_HOSTMSG`);
  return sql.all() as HostMsg[];
}

export function updateHostMsgStatus(id: string, status: string): void {
  const sql = db.prepare('UPDATE TB_HOSTMSG SET status = ? WHERE id = ?');
  const result = sql.run(status, id);

  if (result.changes === 0) {
    throw new Error(`TB_HOSTMSG id not found or no changes made.`);
  }
}

export const validateHostMsgRequest = (data: any): string | null => {
  if (!Array.isArray(data.files) || data.files.length === 0) {
    return 'Invalid input: files must be a non-empty array';
  }
  return null;
}
  