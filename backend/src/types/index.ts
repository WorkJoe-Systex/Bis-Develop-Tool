export interface User {
  id: number;
  name: string;
}

export interface Path {
  path: string;
  name: string;
}

export interface Files {
  files: string[];
  zipPath: string;
  zipName: string;
  delList: string[];
}
