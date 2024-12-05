import { Request, Response } from 'express';
import * as userService from '../service/userService';

// 功能：抓取所有用戶資料並返回給前端
export const getUsers = async (req: Request, res: Response) => {
  try {
    // 以`await`非同步方式從資料庫獲取所有用戶資料
    const users = await userService.getUsers();

    // 將資料轉成 JSON 格式返回
    res.json(users);
  } catch (error: any) {
    // 捕捉並返回 HTTP 500 錯誤碼，並附上錯誤訊息
    res.status(500).json({ error: error.message });
  }
};

// 功能：從請求中接收用戶名，將新用戶資料存入資料庫
export const createUser = async (req: Request, res: Response) => {
  try {
    // 從 req.body 提取 name
    const { name } = req.body;

    // 將用戶名進行insert到DB
    await userService.createUser(name);

    // 回傳 HTTP 201 狀態碼（表示創建成功）及成功訊息
    res.status(201).json({ message: 'User added successfully' });

    console.log(`User ${name} added successfully`);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    console.log(`Controller error:${error.message}`);
  }
};

// 功能：根據用戶 ID 刪除資料庫中的用戶
export const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 將用戶名送至DB進行DELETE
    await userService.deleteUser(Number(id));

    // 回傳 HTTP 200 狀態碼及成功訊息
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
