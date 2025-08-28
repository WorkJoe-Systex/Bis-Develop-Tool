import React from 'react';
import { useNavigate } from 'react-router-dom';
import UpdatePathForm from '../components/form/UpdatePathForm';
import Button from '../components/ui/Button';
import Section from '../components/ui/Section';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-200 min-h-screen space-y-10"
    >
        {/* 標題 */}
        <h1 className="text-3xl font-bold text-center text-gray-800">📁 BIS 開發工具首頁</h1>

        {/* UpdatePath 表單區塊 */}
        <Section title="🔧 路徑設定">
          <UpdatePathForm />
        </Section>

        {/* 功能按鈕區塊 */}
        <Section title="🧰 功能選單">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button onClick={() => navigate('/hostmessage')} variant="yellow">電文解析</Button>
            <Button onClick={() => navigate('/fakehostmessage')} variant="yellow">假電文</Button>
            <Button onClick={() => navigate('/compressed')} variant="yellow">打包程式</Button>
            <Button onClick={() => navigate('/qrcode')} variant="yellow">QRcode</Button>
            <Button onClick={() => navigate('/fortify')} variant="yellow">打包弱掃程式</Button>
            <Button onClick={() => navigate('/test')} variant="yellow">Test</Button>
          </div>
        </Section>
    </motion.div>
  );
};

export default Home;
