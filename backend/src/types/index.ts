export interface User {
  id: number;
  name: string;
}

export interface Path {
  path: string;
  name: string;
  serverType: string;
}

export interface ZipFiles {
  files: string[];
  zipPath: string;
  zipName: string;
  delList: string[];
}

export interface Files {
  files: FileItem[];
}

export interface FileItem {
  name: string;
  disabled: boolean;
}

export interface FileType {
  name: string;
  type: string;
  fileType: string;
}

export interface QRCodeRecord {
  txncode: string;
  hostmsg: string;
  description: string;
  original_text: string;
  qrcodes: string[];
}

export interface HostMsg {
  txncode: string;
  hostmsg: string;
  description: string;
  status: string;
  original_text: string;
}