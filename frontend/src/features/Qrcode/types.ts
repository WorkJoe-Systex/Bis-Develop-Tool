export interface QRcode {
  recordId: String;
  qrcodes: string[];
}

export interface QRCodeRecord {
  id: string;
  txncode: string;
  hostmsg: string;
  description: string;
  original_text: string;
  qrcodes: string[];
}