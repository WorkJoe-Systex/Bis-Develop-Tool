export interface User {
  id: number;
  name: string;
}

export interface Path {
  path: string;
  name: string;
  serverType: string;
}

export interface Files {
  files: string[];
  zipPath: string;
  zipName: string;
  delList: string[];
}

export interface FileType {
  name: string;
  type: string;
  fileType: string;
}
