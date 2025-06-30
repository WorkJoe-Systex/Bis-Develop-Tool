import QRCode from 'qrcode';
import * as qrcodeModel from '../models/qrcodeModel'

const MAX_LEN = 500;

export const generateQRCodes = async (text: string): Promise<string[]> => {
  const parts = text.match(new RegExp(`.{1,${MAX_LEN}}`, 'g')) || [];
  const qrcodes: string[] = [];

  for (const part of parts) {
    const base64 = await QRCode.toDataURL(part);
    qrcodes.push(base64);
  }

  return qrcodes;
}

export const saveQRcode = async (txncode:string, hostmsg: string, description:string, longText:string, qrcodes:string[]): Promise<{ lastInsertRowid: number }> => {
  const result = await qrcodeModel.saveQRcode(txncode, hostmsg, description, longText, qrcodes);
  return { lastInsertRowid: result.lastInsertRowid };
}

export const queryQRCodesByTxncode = async (txncode:string): Promise<Object> => {
  const result = await qrcodeModel.queryQRCodesByTxncode(txncode);
  return result;
}

export const queryQRCodesByID = async (id:string): Promise<Object> => {
  const result = await qrcodeModel.queryQRCodesByID(id);
  return result;
}

export const deleteQRCodesByID = async (id:string): Promise<{ Chgcount: number }> => {
  const result = await qrcodeModel.deleteQRCodesByID(id);
  return { Chgcount: result.Chgcount };
}