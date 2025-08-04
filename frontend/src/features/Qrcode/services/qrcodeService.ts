import type { QRcode, QRCodeRecord } from "../types";

const API_URL = 'http://localhost:3000/api/qrcode';

export const genQRcode = async (description: string, longText: string, txncode: string, hostmsg:string): Promise<{ qrcodes: QRCodeRecord[] }> => {
  const response = await fetch(`${API_URL}/genQRcode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description: description, longText: longText, txncode: txncode, hostmsg: hostmsg }), // 將 path 作為 JSON 傳遞
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to Insert QRcode');
  }
  return await response.json();
}

export const qryQRcode = async (txncode: string): Promise<{ qrcodes: QRCodeRecord[] }> => {
  const response = await fetch(`${API_URL}/qryQRcode/${txncode}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch QRcode');
  }
  return await response.json();
}

export const delQRcode = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/delQRcode/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete QRcode');
  }
  return await response.json();
}