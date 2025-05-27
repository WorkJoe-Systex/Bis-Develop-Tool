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

  export interface FieldItem {
    section: string;
    name: string;
    value: string;
    desc: string;
    type: string;
    maxLen: string;
    defaultValue: string;
  }
  
  export interface SectionData {
    res: FieldItem[];
    [key: string]: any;
  }
  
  export interface TiTota {
    Tita: SectionData;
    Tota: SectionData;
    success: boolean;
  }