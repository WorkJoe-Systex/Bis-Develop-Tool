import db from '../database';

export interface User {
  id: number;
  name: string;
}

export async function getAllUsers(): Promise<User[]> {
  const database = await db;
  return database.all('SELECT * FROM users');
}

export const findUserByName = async (name: string) => {
  const database = await db;
  return database.all('SELECT * FROM users WHERE name = ?', [name]);
};

export async function addUser(name: string): Promise<void> {
  const database = await db;
  await database.run('INSERT INTO users (name) VALUES (?)', [name]);
}

export async function deleteUser(id: number): Promise<void> {
  const database = await db;
  await database.run('DELETE FROM users WHERE id = ?', [id]);
}
