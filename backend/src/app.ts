import pathRoutes from './routes/pathRoutes';
import userRoutes from './routes/userRoutes';
import testRoutes from './routes/testRoutes';
import filesRoutes from './routes/filesRoutes';
import hostMsgRoutes from './routes/hostMsgRoutes';
import compressRoutes from './routes/compressRoutes';
import express from 'express';
import cors from 'cors';
import './config/database'; // 執行`自執行函數`

const app = express();

// 允許所有來源訪問 API
// app.use(cors());
// 嚴格限制來源訪問
app.use(cors({
  origin: 'http://localhost:3001'
}));
 // 讓 Express 支援 JSON 請求體
app.use(express.json());

// for test
app.use('/api/users', userRoutes);
app.use('/api/test', testRoutes);

// update & select path
app.use('/api/path', pathRoutes);

// view target file directory
app.use('/api/files', filesRoutes);

// compress file to zip
app.use('/api/compress', compressRoutes);

// host message
app.use('/api/hostMsg', hostMsgRoutes);

export default app;