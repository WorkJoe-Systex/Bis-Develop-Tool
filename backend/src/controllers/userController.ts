import { Request, Response } from 'express';
import * as userService from '../services/userService';

// 功能：取local存放.csv的路徑返回給前端
export const getUserInfo = async (req: Request, res: Response) => {
    try {
      const { name } = req.query; // 從路徑參數取得 serverType 和 name
      // 以`await`非同步方式從資料庫獲取所有用戶資料
      const data = await userService.getUserInfo(name);
  
      // 將資料轉成 JSON 格式返回
      res.json(data[0]);
    } catch (error: any) {
      // 捕捉並返回 HTTP 500 錯誤碼，並附上錯誤訊息
      res.status(500).json({ error: error.message });
    }
};

// 功能：更新local path
export const updateCompressedType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.params; // 從路徑參數取得 name
    const { compressedDir } = req.body; // 從請求體取得 compressedDir

    if (!compressedDir) {
      res.status(400).json({ error: 'CompressedDir is required' });
      return
    }

    await userService.updateCompressedType(compressedDir, name); // 調用更新函數

    res.status(200).json({ message: 'Path updated successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};