import { Request, Response } from 'express';
import * as qrcodeService from '../services/qrcodeService';

export const genQRCodes = async (req: Request, res: Response) => {
	const { description, longText } = req.body;
  
	if (!description || !longText) {
	  res.status(400).json({ error: 'Missing description or longText' });
	}
	try {
		const qrcodes = await qrcodeService.generateQRCodes(longText);
		const result = await qrcodeService.saveQRcode(description, longText, qrcodes);
	  
		res.json({
		  message: 'QR Codes generated successfully',
		  recordId: result.lastInsertRowid,
		  qrcodes,
		});
  } catch (error: any) {
		res.status(500).json({ error: 'Failed to generate QR Codes' });
  }
}