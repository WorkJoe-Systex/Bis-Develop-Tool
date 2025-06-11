import express, { Request, Response } from 'express';
import { getUsers, createUser, removeUser } from '../controllers/testController';
import * as pathModel from '../models/pathModel';

const router = express.Router();

// 功能：抓取所有用戶資料並返回給前端
export const getTest = async (req: Request, res: Response) => {
    try {
        // 以`await`非同步方式從資料庫獲取所有用戶資料
        const data = await pathModel.getPathByServerType('ap');
    
        // 將資料轉成 JSON 格式返回
        res.json(data);
    } catch (error: any) {
        // 捕捉並返回 HTTP 500 錯誤碼，並附上錯誤訊息
        res.status(500).json({ error: error.message });
    }
};

router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', removeUser);

router.get('/', getTest);

export default router;
