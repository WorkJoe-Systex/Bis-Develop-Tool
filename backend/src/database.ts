import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = open({
  filename: './data/users.db',
  driver: sqlite3.Database,
});

export default db;
