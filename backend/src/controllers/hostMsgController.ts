import { Request, Response } from 'express';
import * as hostMsgService from '../services/hostMsgService';

export const qryAllHostMsg = async (req: Request, res: Response) => {
	try {
		const hostMsg = await hostMsgService.qryAllHostMsg();
	  
		res.json({ hostMsg });
  } catch (error: any) {
		res.status(500).json({ error: 'Failed to query Host Message' });
  }
};

export const updateHostMsg = async (req: Request, res: Response): Promise<any> => {
  try {
	const { id } = req.params; // 從路徑參數取得 serverType 和 name
	const { hostMsg } = req.body; // 從請求體取得 path

	if (!id || !hostMsg) {
	  return res.status(400).json({ error: 'id or status is required' });
	}

	if (hostMsg.status === 'L') {
		try {
			await hostMsgService.writeTextFile(hostMsg.hostmsg, hostMsg.original_text); // 電文寫入.txt
		} catch (error: any) {
			return res.status(409).json({ error: 'File already exists.' });
		}
	} else if (hostMsg.status === 'D') {
		try {
			await hostMsgService.deleteTextFile(hostMsg.hostmsg); // 刪除電文.txt
		} catch (error: any) {
			return res.status(404).json({ error: 'File does not exist.' });
		}
	}
	await hostMsgService.updateHostMsgStatus(id, hostMsg.status); // 更新TB_HOSTMSG status

	return res.status(200).json({ message: 'success' });
  } catch (error: any) {
	console.error(error);
	// res.status(500).json({ error: 'Internal server error' });

	// 將錯誤訊息回傳給前端
  	res.status(400).json({ error: error.message || 'Internal server error' });
  }
};