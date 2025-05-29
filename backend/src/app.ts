import express from 'express';
import cors from 'cors';
import './config/database'; // 執行`自執行函數`
import apiRoutes from './routes/api'
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// 允許所有來源訪問 API
// app.use(cors());
// 嚴格限制來源訪問
app.use(cors({ origin: 'http://localhost:3001' }));
 // 讓 Express 支援 JSON 請求體
app.use(express.json());

app.use('/api', apiRoutes);

// 所有路由註冊之後
app.use(errorHandler);

export default app;