import React, { useState } from 'react';
import useNavigateToHome from '../../../hooks/useNavigateToHome';
import GenQrcodeForm from '../components/GenQrcodeForm';
import QryQrcodeForm from '../components/QryQrcodeForm';

const QrcodePage: React.FC = () => {
  const { goToHomePage } = useNavigateToHome();
  const [mode, setMode] = useState<'generate' | 'query'>('generate');

  return (
    <div>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1>QRcode Page</h1>
        {/* 切換按鈕區塊 */}
        <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
          <button
            onClick={() => setMode('generate')}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: mode === 'generate' ? '#007bff' : '#ccc',
              color: mode === 'generate' ? '#fff' : '#333',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            產生 QR Code
          </button>
          <button
            onClick={() => setMode('query')}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: mode === 'query' ? '#007bff' : '#ccc',
              color: mode === 'query' ? '#fff' : '#333',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            查詢 QR Code
          </button>
        </div>

        {/* 動態載入畫面 */}
        {mode === 'generate' ? <GenQrcodeForm /> : <QryQrcodeForm />}
        <div>
          <p>
            <button onClick={goToHomePage}>Back</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QrcodePage;
