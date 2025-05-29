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