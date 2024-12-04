import express from 'express';
import userRoutes from './routes/userRoutes';
import cors from 'cors';

const app = express();
const port = 3000;

// 允許所有來源訪問 API
// app.use(cors());
// 嚴格限制來源訪問
app.use(cors({
  origin: 'http://localhost:3001'
}));
app.use(express.json());

// for test
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
