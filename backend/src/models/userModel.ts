import db from '../config/database';

export async function getUserInfo(name: string): Promise<{ path: string }[]> {
  const database = await db;
  return database.all('SELECT compressedDir FROM TB_USERINFO WHERE name = ?', [name]);
}

export async function updateCompressedType(compressedDir: string, name: string): Promise<void> {
  const result = await (await db).run(
    'UPDATE TB_USERINFO SET compressedDir = ? WHERE name = ?',
    [compressedDir, name]
  );

  if (result.changes === 0) {
    throw new Error(`TB_USERINFO Name not found or no changes made.`);
  }
}
