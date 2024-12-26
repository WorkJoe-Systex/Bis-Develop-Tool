import db from '../database';

export async function getFileType(): Promise<{ name: string; type: string; fileType: string }[]> {
  const database = await db;
  return database.all('SELECT name, type, fileType FROM TB_FILETYPE');
}
