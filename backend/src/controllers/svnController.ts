import { execPromise } from '../services/svnService';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const svnPath = 'C:\\Program Files\\SlikSvn\\bin\\svn.exe'; // loacl TortoiseProc.exe安裝目錄

/**
 * 執行 SVN Update
 */
export const svnUpdateHandler = async (req: Request, res: Response) => {
  try {
    const { 
      targetDir // 要更新的local資料夾
    } = req.body;

    if (!targetDir || !fs.existsSync(svnPath) || !fs.existsSync(targetDir)) {
	    res.status(400).json({ error: 'Missing svnPath or targetDir' });
	  }
    const command = `"${svnPath}" update "${targetDir}"`;
    await execPromise(command);

    res.json({ success: true, message: `SVN 更新完成` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 執行 SVN commit
 */
export const svnCommitHandler = async (req: Request, res: Response) => {
  try {
    const { 
      targetDir, // 要commit的檔案所在目錄
      folderName // 檔案名稱
    } = req.body;

    if (!targetDir || !fs.existsSync(svnPath) || !fs.existsSync(targetDir)) {
	    res.status(400).json({ error: 'Missing svnPath or targetDir' });
	  }
    const commitMessage = `Auto-commit to ${folderName}`;
    await execPromise(`"${svnPath}" commit "${path.join(targetDir, folderName)}" -m "${commitMessage}"`);

    res.json({ success: true, message: `SVN commit 成功：${folderName}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * SVN 新增檔案
 */
export const svnAddHandler = async (req: Request, res: Response) => {
  try {
    const { 
      targetDir, // 要新增的資料夾目錄
      addFilePath // 要新增的檔案路徑
    } = req.body;

    if (!targetDir || !addFilePath || !fs.existsSync(svnPath) || !fs.existsSync(targetDir) || !fs.existsSync(addFilePath)) {
	    res.status(400).json({ error: 'Missing svnPath or targetDir or addFilePath' });
	  }
    await execPromise(`"${svnPath}" add "${addFilePath}" --force`, targetDir);

    res.json({ success: true, message: `SVN 新增檔案完成 - ${addFilePath}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};