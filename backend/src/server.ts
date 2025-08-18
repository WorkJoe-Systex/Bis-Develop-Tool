import app from './app';
import './config/database'; // 執行`自執行函數`

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/api/health', (req, res) => {
  res.status(200).send('ok');
});