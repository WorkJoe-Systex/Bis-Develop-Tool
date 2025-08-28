import { Request, Response } from 'express';
import * as compressService from '../services/compressService';
import { ZipFiles } from '../types';
const { validateCompressRequest } = require('../models/compressModel');

// 功能：.csv檔案壓縮
export const compressFiles = async (req: Request, res: Response) => {
  // schema 驗證邏輯
  const validationError = validateCompressRequest(req.body);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const { zipName, funType, csvPath, files, pathType, zipType } = req.body; // 接收選擇的檔案列表

  if (!Array.isArray(files) || files.length === 0) {
    res.status(400).json({ error: 'No files provided for compression' });
    return;
  }

  try {
    let response: ZipFiles;
    
    // 呼叫 Service 進行檔案壓縮
    if (pathType === 'SVN' || pathType === 'DEV') {
      response = await compressService.compressFilesService(zipName, funType, csvPath, files, pathType, zipType);
      res.status(200).json({ files:response.files, zipPath:response.zipPath, zipName:response.zipName, delList:response.delList });
    } else {
      console.error('Error in compressFiles controller:', 'pathType is required');  
    }
    // res.status(200).json({ files:[''], ZIP: response });
  } catch (error: any) {
    console.error('Error in compressFiles controller:', error);
    res.status(500).json({ error: 'Failed to compress files' });
  }
};
