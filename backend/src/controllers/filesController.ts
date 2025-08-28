import { Request, Response } from 'express';
import * as pathService from '../services/pathService';
import * as fileService from '../services/fileService';
import path from "path";
import fs from 'fs';
import fs_extra from 'fs-extra';
import { FileItem, Files } from '../types';

// 功能：取local存放.csv的路徑返回給前端
export const getFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetPath, fileType } = req.body; // 從路徑參數取得 serverType 和 name
    let result: FileItem[] = [];
    
    if (!targetPath) {
      res.status(400).json({ error: 'targetPath or fileType is required' });
      return;
    }

    // 檢查該路徑是否存在
    await fs.promises.access(targetPath.toString()); // 檢查檔案夾是否存在
  
    // 讀取該路徑下所有檔案
    const allFiles = await fs.promises.readdir(targetPath.toString());

    // 篩選出 .csv/ .txt 檔案
    if (fileType === '.csv') {
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // 20250808
      const files = allFiles.filter((file) => path.extname(file).toLowerCase() === '.csv');

      result = files.map(file => ({
        name: file,
        disabled: file.includes(todayStr) // 檔名包含今天日期就不可選
      }));
      
    } else if (fileType === '.txt') {
      const files = allFiles.filter((file) => path.extname(file).toLowerCase() === '.txt');
      result = files.map(file => ({
        name: file,
        disabled: false,
      }));
    }

    // 將檔案清單返回給前端
    res.json({ files: result });
  } catch (error: any) {
    console.error('Error fetching files:', error);
    // 捕捉並返回 HTTP 500 錯誤碼，並附上錯誤訊息
    if (error.code === 'ENOENT') {
      res.status(400).json({ error: 'Path not found' });
    } else {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
};

/**
 * 建檔
 */
export const genFile = async (req: Request, res: Response) => {
  try {
    const { 
      fileName, // 檔案名稱
      fileType, // 檔案類型
      fileContent, // 檔案內容
      fileDir // 建檔目錄
    } = req.body;

    // 建立資料夾
    const filePath = path.join(fileDir, "\\", fileName);
    await fs_extra.ensureDir(filePath);

    res.json({ success: true, message: `${fileName}` });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 搬移檔案（除 .svn 資料夾）
 */
export const moveFiles = async (req: Request, res: Response) => {
  try {
    const { 
      startDir, // 搬檔目錄
      endDir // 目標目錄
    } = req.body;

    // Step 3: 搬移檔案（排除 .svn 資料夾）
    const files = await fs_extra.readdir(startDir);
    for (const file of files) {
      if (file === '.svn') {
        continue; // 跳過 .svn 設定檔
      }
      const startPath = path.join(startDir, file);
      const endPath = path.join(endDir, file);
      await fs_extra.move(startPath, endPath, { overwrite: true });
    }
    res.json({ success: true, message: `From： ${startDir}\n    To： ${endDir}` });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * merge .csv
 */
export const mergeCSV = async (req: Request, res: Response) => {
  try {
    const { 
      files,
      fileName, // 檔案名稱
      csvName
     } = req.body;
     
     const bisProjectPath = await pathService.getPath('local', 'bis-project-dir');
     const scannedPath = await pathService.getPath('local', 'scanned');
     const targetPath = path.join(bisProjectPath, scannedPath, fileName);

    // 1. 產生 CSV Buffer
    const csvBuffer = await fileService.mergeCSV(files, targetPath);

    // 2. 存檔，避免覆蓋
    const genfileName = await fileService.getUniqueFileName(targetPath, csvName + '.csv');
    const filePath = path.join(targetPath, genfileName);

    // 3. 寫檔
    fs.writeFileSync(filePath, csvBuffer);

    // 4. 設定下載回應
    // res.setHeader('Content-Type', 'text/csv;');
    // res.setHeader('Content-Disposition', 'attachment; filename=merged.csv');
    // res.send(csvBuffer);
    res.status(200).json({ success: true, message: `${genfileName}` });
  } catch (error: any) {
    console.error('[mergeCSVController] Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || '合併 CSV 發生錯誤'
    });
  }
};