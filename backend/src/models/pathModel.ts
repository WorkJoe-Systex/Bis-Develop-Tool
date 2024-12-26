import db from '../database';

export async function getPath(serverType: string, name: string): Promise<{ path: string }[]> {
  const database = await db;
  return database.all('SELECT path FROM TB_PATH WHERE serverType = ? AND name = ?', [serverType, name]);
}

export async function getPathByServerType(serverType: string): Promise<{ path: string; name: string; serverType: string }[]> {
  const database = await db;
  return database.all('SELECT path, name, serverType FROM TB_PATH WHERE serverType = ?', [serverType]);
}

export async function updatePath(path: string, serverType: string, name: string): Promise<void> {
  const result = await (await db).run(
    'UPDATE TB_PATH SET path = ? WHERE serverType = ? AND name = ?',
    [path, serverType, name]
  );

  if (result.changes === 0) {
    throw new Error(`TB_PATH Path not found or no changes made.`);
  }
}
