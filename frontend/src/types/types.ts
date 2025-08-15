export interface Path {
  path: string;
  name: string;
}

export interface Files {
  files: FileItem[];
}

export interface FileItem {
  name: string;
  disabled: boolean;
}