import React, { useState } from 'react';
import useNavigateToHome from '../../../hooks/useNavigateToHome';
import GenQrcodeForm from '../components/GenQrcodeForm';
import QryQrcodeForm from '../components/QryQrcodeForm';
import BackToHomeButton from '../../../components/ui/BackToHomeButton';

const QrcodePage: React.FC = () => {
  const { goToHomePage } = useNavigateToHome();
  const [mode, setMode] = useState<'generate' | 'query'>('generate');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold text-center mb-4">QRcode 功能頁</h1>

        {/* 切換按鈕區塊 */}
        <div className="flex rounded-md overflow-hidden mb-6 border border-gray-300">
          <button
            onClick={() => setMode('generate')}
            className={`flex-1 py-2 text-sm font-medium ${
              mode === 'generate'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            產生 QR Code
          </button>
          <button
            onClick={() => setMode('query')}
            className={`flex-1 py-2 text-sm font-medium ${
              mode === 'query'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            查詢 QR Code
          </button>
        </div>

        {/* 動態載入畫面 */}
        <div className="mb-6">
          {mode === 'generate' ? <GenQrcodeForm /> : <QryQrcodeForm />}
        </div>

        <BackToHomeButton />
      </div>
    </div>
  );
};

export default QrcodePage;
