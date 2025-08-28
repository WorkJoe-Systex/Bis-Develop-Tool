import { execPromise } from '../services/svnService';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';

const svnPath = 'C:\\Program Files\\SlikSvn\\bin\\svn.exe'; // loacl TortoiseProc.exe SlikSvn 安裝目錄

/**
 * 執行 SVN Update
 */
export const svnUpdateHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const { 
      targetDir // 要更新的local資料夾
    } = req.body;

    if (!targetDir || !fs.existsSync(svnPath) || !fs.existsSync(targetDir)) {
	    return res.status(400).json({ error: 'Missing svnPath or targetDir' });
	  }
    const command = `"${svnPath}" update "${targetDir}"`;
    await execPromise(command);

    return res.json({ success: true, message: `SVN 更新完成` });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 執行 SVN commit
 */
export const svnCommitHandler = async (req: Request, res: Response): Promise<any> => {
  const { 
    targetDir, // 要commit的檔案所在目錄
    folderName, // 檔案名稱
    deleteScanFlg // 是否檢查移除的檔案
  } = req.body;
  try {
    if (!targetDir || !fs.existsSync(svnPath) || !fs.existsSync(targetDir)) {
	    return res.status(400).json({ error: 'Missing svnPath or targetDir' });
	  }

    if (deleteScanFlg) {
      // Step1. 檢查 SVN 狀態，找出 missing (已刪掉但沒告訴 SVN 的檔案)
      const { stdout } = await execPromise(
        `"${svnPath}" status "${path.join(targetDir, folderName)}"`);

      // 使用 iconv 轉成正確的 utf8
      const output = iconv.decode(stdout, 'big5');

      const missingFiles = output
        .split("\n")
        .filter(line => line.startsWith("!")) // "!" = 檔案遺失
        .map(line => line.replace("!", "").trim());
  
      // Step2. 對 missing 的檔案做 svn delete
      for (const file of missingFiles) {
        await execPromise(`"${svnPath}" delete "${file}"`);
      }
    }

    // Step3. commit 整個資料夾
    const commitMessage = `Auto-commit to ${folderName}`;
    await execPromise(`"${svnPath}" commit "${path.join(targetDir, folderName)}" -m "${commitMessage}"`);

    console.log(`---------------------\nSVN commit successful:\n  目標路徑:${targetDir}\n  目標檔案:${folderName}\n---------------------`);
    return res.json({ success: true, message: `SVN commit 成功：${folderName}` });
  } catch (error: any) {
    console.log(error);
    await svnRevertHandler(targetDir, path.join(targetDir, folderName));
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * SVN 新增檔案
 */
export const svnAddHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const { 
      targetDir, // 要新增的資料夾目錄
      addFilePath // 要新增的檔案路徑
    } = req.body;

    if (!targetDir || !addFilePath || !fs.existsSync(svnPath) || !fs.existsSync(targetDir) || !fs.existsSync(addFilePath)) {
	    return res.status(400).json({ error: 'Missing svnPath or targetDir or addFilePath' });
	  }
    console.log(`---------------------\nSVN add successful:\n  新增檔案所在目錄:${targetDir}\n  新增檔案路徑:${addFilePath}\n---------------------`);
    await execPromise(`"${svnPath}" add "${addFilePath}" --force`, targetDir);

    return res.json({ success: true, message: `SVN 新增檔案完成 - ${addFilePath}` });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * SVN 新增檔案
 */
export const svnRevertHandler = async (targetDir: string, addFilePath: string): Promise<any> => {
  try {
    await execPromise(`"${svnPath}" revert "${addFilePath}"`);
    console.log(`已 rollback 檔案: ${addFilePath}`);
  } catch (error: any) {
    console.error(`revert 失敗: ${error.message}`);
  }
};