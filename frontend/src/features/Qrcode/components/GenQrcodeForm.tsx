import React, { useEffect, useState } from 'react';
import { genQRcode } from '../services/qrcodeService';
import QRCodeGallery from './QRCodeGallery';

const GenQrcodeForm: React.FC = () => {
  const [qrcodeImages, setQrcodeImages] = useState<string[]>([]); // 加上 state
  const [description, setDescription] = useState('');
  const [hostmsg, setHostmsg] = useState('');
  const [txncode, setTxncode] = useState('');
  const [longStr, setLongStr] = useState('');

  // 在畫面載入時執行資料查詢
  useEffect(() => {
  }, []); // 當組件載入時調用

  const sendGenerateQrcode = async (e: React.FormEvent) => {
    e.preventDefault();

    // submit 檢核
    if (description.trim() === '' || longStr.trim() === '' || txncode.trim() === '') {
      alert('資料有誤，請確認後重新輸入');
      return;
    }

    // 構建 POST 請求
    try {
      const data = await genQRcode(description, longStr, txncode, hostmsg);
      console.log(`Result:${data}`);
      setQrcodeImages(data.qrcodes[0].qrcodes); // 存入圖片 base64 陣列
      setTxncode('');
      setDescription('');
      setLongStr('');
      setHostmsg('');
    } catch (error) {
      alert('Failed to Generate QRcode.');
      console.error('Generate Error:', error);
    }
  };

  return (
    <form onSubmit={sendGenerateQrcode}>
      <h3>新增QRcode</h3>
      <div>
       <label>轉換字串:</label>
       <input
          type="text"
          id="longStr"
          name="longStr"
          style={{ width: '700px' }}
          value={longStr}
          onChange={(e) => setLongStr(e.target.value)}
          placeholder="Enter text to genrate QRcode"
       />
      </div>
      <div>
        <label>交易代號:</label>
        <input
          type="text"
          id="txncode"
          name="txncode"
          style={{ width: '700px' }}
          value={txncode}
          onChange={(e) => setTxncode(e.target.value)}
          placeholder="Enter txncode"
        />
      </div>
      <div>
        <label>電文檔名稱 (HostMsg):</label>
        <input
          type="text"
          id="hostmsg"
          name="hostmsg"
          style={{ width: '700px' }}
          value={hostmsg}
          onChange={(e) => setHostmsg(e.target.value)}
          placeholder="Enter hostmsg"
        />
      </div>
      <div>
        <label>描述:</label>
        <input
          type="text"
          id="description"
          name="description"
          style={{ width: '700px' }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>
      {/* 送出按鈕 */}
      <div>
        <button type="submit">XMT</button>
      </div>

      {/* 新增後顯示 QR Code 區塊 */}
      {qrcodeImages.length > 0 && (
        <div>
          <h3>產生結果</h3>
          <QRCodeGallery qrcodes={qrcodeImages} />
        </div>
      )}
    </form>
  );
};

export default GenQrcodeForm;
