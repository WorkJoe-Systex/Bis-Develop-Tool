import QRCode from 'qrcode';
import * as qrcodeModel from '../models/qrcodeModel'

const MAX_LEN = 1000;

export const generateQRCodes = async (text: string): Promise<string[]> => {
  const parts = text.match(new RegExp(`.{1,${MAX_LEN}}`, 'g')) || [];
  const qrcodes: string[] = [];

  for (const part of parts) {
    const base64 = await QRCode.toDataURL(part);
    qrcodes.push(base64);
  }

  return qrcodes;
}

export const saveQRcode = async (description:string, longText:string, qrcodes:string[]): Promise<{ lastInsertRowid: number }> => {
  const result = await qrcodeModel.saveQRcode(description, longText, qrcodes);
  return { lastInsertRowid: result.lastInsertRowid };
}
