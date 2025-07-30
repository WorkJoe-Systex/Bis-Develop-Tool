import React from 'react';
import { useNavigate } from 'react-router-dom';
import UpdatePathForm from '../components/form/UpdatePathForm';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-200 min-h-screen space-y-10">
      {/* 標題 */}
      <h1 className="text-3xl font-bold text-center text-gray-800">📁 BIS 開發工具首頁</h1>

      {/* UpdatePath 表單區塊 */}
      <section className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">🔧 路徑設定</h2>
        <UpdatePathForm />
      </section>

      {/* 功能按鈕區塊 */}
      <section className="bg-gray-50 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">🧰 功能選單</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button onClick={() => navigate('/hostmessage')} variant="yellow">Host Msg Parser</Button>
          <Button onClick={() => navigate('/fakehostmessage')} variant="yellow">Fake Host Msg</Button>
          <Button onClick={() => navigate('/compressed')} variant="yellow">Compress</Button>
          <Button onClick={() => navigate('/qrcode')} variant="yellow">QRcode</Button>
          <Button onClick={() => navigate('/test')} variant="yellow">Test</Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
