import { Request, Response } from 'express';
import * as qrcodeService from '../services/qrcodeService';

export const genQRCodes = async (req: Request, res: Response) => {
	const { description, longText, txncode, hostmsg } = req.body;
  
	if (!description || !longText) {
	  res.status(400).json({ error: 'Missing description or longText' });
	}
	try {
		// 將長字串產生QRcode
		const genqrcodes = await qrcodeService.generateQRCodes(longText);
		// 將QRcode及前端資訊存至DB
		const result = await qrcodeService.saveQRcode(txncode, hostmsg, description, longText, genqrcodes);
		// 查詢當筆資訊回傳至前端
		const qrcodes = await qrcodeService.queryQRCodesByID(result.lastInsertRowid.toString());
	  
		res.json({
		  message: 'QR Codes generated successfully',
		  recordId: result.lastInsertRowid,
		  qrcodes,
		});
  } catch (error: any) {
		res.status(500).json({ error: 'Failed to generate QR Codes' });
  }
}

export const qryQRCodes = async (req: Request, res: Response) => {
	const { txncode } = req.params;
  
	if (!txncode) {
	  res.status(400).json({ error: 'Missing txncode' });
	}
	try {
		const qrcodes = await qrcodeService.queryQRCodesByTxncode(txncode);
	  
		res.json({ qrcodes });
  } catch (error: any) {
		res.status(500).json({ error: 'Failed to query QR Codes' });
  }
}

export const delQRCodes = async (req: Request, res: Response) => {
	const { id } = req.params;
  
	if (!id) {
	  res.status(400).json({ error: 'Missing id' });
	}
	try {
		const result = await qrcodeService.deleteQRCodesByID(id);

		if (result.Chgcount === 0) {
    	res.status(404).json({ error: '查無此筆資料' });
    } else {
			res.json({ message: '刪除成功' });
		}
  } catch (error: any) {
		res.status(500).json({ error: 'Failed to delete QR Codes' });
  }
}