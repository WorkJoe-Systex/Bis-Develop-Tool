import compressedRoutes from './routes/pathRoutes';
import userRoutes from './routes/userRoutes';
import express from 'express';
import cors from 'cors';
import './database'; // 執行`自執行函數`

const app = express();
const port = 3000;

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

// compressed file to .zip
app.use('/api/compressed', compressedRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});