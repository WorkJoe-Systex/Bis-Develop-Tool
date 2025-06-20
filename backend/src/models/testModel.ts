import db from '../config/database';

export interface User {
  id: number;
  name: string;
}

export function getAllUsers(): User[] {
  const sql = db.prepare('SELECT * FROM users');
  return sql.all() as User[];
}

export function findUserByName(name: string): User[] {
  const sql = db.prepare('SELECT * FROM users WHERE name = ?');
  return sql.all(name) as User[];
};

export function addUser(name: string): void {
  const sql = db.prepare('INSERT INTO users (name) VALUES (?)');
  sql.run(name);
}

export function deleteUser(id: number): void {
  const sql = db.prepare('DELETE FROM users WHERE id = ?');
  sql.run(id);
}
