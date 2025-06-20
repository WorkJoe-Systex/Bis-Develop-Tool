import db from '../config/database';
import { FileType } from '../types';

export function getFileType(): FileType[] {
  const sql = db.prepare('SELECT name, type, fileType FROM TB_FILETYPE');
  return sql.all() as FileType[];
}
