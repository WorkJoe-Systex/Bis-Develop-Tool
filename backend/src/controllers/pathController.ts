import { Request, Response } from 'express';
import * as pathService from '../services/pathService';

// 功能：取local存放.csv的路徑返回給前端
export const getPath = async (req: Request, res: Response) => {
  try {
    const { serverType, name } = req.params; // 從路徑參數取得 serverType 和 name
    // 以`await`非同步方式從資料庫獲取所有用戶資料
    const path = await pathService.getPath(serverType, name);

    // 將資料轉成 JSON 格式返回
    res.json(path);
  } catch (error: any) {
    // 捕捉並返回 HTTP 500 錯誤碼，並附上錯誤訊息
    res.status(500).json({ error: error.message });
  }
};

// 功能：更新local path
export const updatePath = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serverType, name } = req.params; // 從路徑參數取得 serverType 和 name
    const { path } = req.body; // 從請求體取得 path

    if (!path) {
      res.status(400).json({ error: 'Path is required' });
      return
    }

    await pathService.updatePath(path, serverType, name); // 調用更新函數

    res.status(200).json({ message: 'Path updated successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
