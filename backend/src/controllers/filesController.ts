import { Request, Response } from 'express';
import * as pathService from '../services/pathService';
import path from "path";
import fs from 'fs';

// 功能：取local存放.csv的路徑返回給前端
export const getFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serverType, name, fileType } = req.query; // 從路徑參數取得 serverType 和 name

    if (!serverType || !name || !fileType) {
      res.status(400).json({ error: 'serverType or name or fileType is required' });
      return;
    }

    // 以`await`非同步方式從資料庫獲取所有用戶資料
    const getTargetPath = await pathService.getPath(serverType as string, name as string, fileType as string);

    // 檢查是否找到對應的路徑
    if (!getTargetPath.length) {
      res.status(404).json({ error: 'No path found in the database' });
      return;
    }

    // 檢查該路徑是否存在
    const targetPath = getTargetPath[0].path;
    try {
      await fs.promises.access(targetPath); // 檢查檔案夾是否存在
    } catch {
      res.status(400).json({ error: 'Path not found' });
      return;
    }

    // 讀取該路徑下所有檔案
    const allFiles = await fs.promises.readdir(targetPath);

    // 篩選出 .csv/ .txt 檔案
    let files;
    if (fileType === '.csv') {
      files = allFiles.filter((file) => path.extname(file).toLowerCase() === '.csv');
    } else if (fileType === '.txt') {
      files = allFiles.filter((file) => path.extname(file).toLowerCase() === '.txt');
    }

    // 將檔案清單返回給前端
    res.json({ files });
  } catch (error: any) {
    console.error('Error fetching files:', error);
    // 捕捉並返回 HTTP 500 錯誤碼，並附上錯誤訊息
    res.status(500).json({ error: error.message });
  }
};
