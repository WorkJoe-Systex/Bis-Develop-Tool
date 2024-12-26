import { Request, Response } from 'express';
import * as compressService from '../service/compressService';
const { validateCompressRequest } = require('../models/compressModel');

// 功能：取local存放.csv的路徑返回給前端
export const compressFiles = async (req: Request, res: Response) => {
  // schema 驗證邏輯
  const validationError = validateCompressRequest(req.body);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const { files } = req.body; // 接收選擇的檔案列表

  if (!Array.isArray(files) || files.length === 0) {
    res.status(400).json({ error: 'No files provided for compression' });
    return;
  }

  try {
    // 呼叫 Service 進行檔案壓縮
    const zipPath = await compressService.compressFilesService (files);
    res.status(200).json({ files:[''], zipPath: zipPath });
  } catch (error: any) {
    console.error('Error in compressFiles controller:', error);
    res.status(500).json({ error: 'Failed to compress files' });
  }
};
