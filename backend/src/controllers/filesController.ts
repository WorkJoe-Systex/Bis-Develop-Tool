import { Request, Response } from 'express';
import * as filesService from '../service/filesService';
import path from "path";
import fs from 'fs';

// 功能：取local存放.csv的路徑返回給前端
export const getFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serverType, name } = req.query; // 從路徑參數取得 serverType 和 name

    if (!serverType || !name) {
      res.status(400).json({ error: 'serverType and name are required' });
      return;
    }

    // 以`await`非同步方式從資料庫獲取所有用戶資料
    const gettargetPath = await filesService.getFiles(serverType as string, name as string);

    // 檢查是否找到對應的路徑
    if (!gettargetPath.length) {
      res.status(404).json({ error: 'No path found in the database' });
      return;
    }

    // 檢查該路徑是否存在
    const targetPath = gettargetPath[0].path;
    try {
      await fs.promises.access(targetPath); // 檢查檔案夾是否存在
    } catch {
      res.status(400).json({ error: 'Path not found' });
      return;
    }

    // 讀取該路徑下所有檔案
    const allFiles = await fs.promises.readdir(targetPath);

    // 篩選出 .csv 檔案
    const files = allFiles.filter((file) => path.extname(file).toLowerCase() === '.csv');

    // 將檔案清單返回給前端
    res.json({ files });
  } catch (error: any) {
    console.error('Error fetching files:', error);
    // 捕捉並返回 HTTP 500 錯誤碼，並附上錯誤訊息
    res.status(500).json({ error: error.message });
  }
};
