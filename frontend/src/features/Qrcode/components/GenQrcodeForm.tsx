import React, { useEffect, useState } from 'react';
import { genQRcode } from '../services/qrcodeService';
import QRCodeGallery from './QRCodeGallery';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

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
    <form onSubmit={sendGenerateQrcode} className="bg-white shadow-md rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-2">新增 QR code</h3>

      <div>
       <label className="block font-medium mb-1">轉換字串:</label>
       <Input
          type="text"
          value={longStr}
          onChange={(e) => setLongStr(e.target.value)}
          placeholder="Enter text to genrate QRcode"
          width="w-full"
       />
      </div>
      <div>
        <label className="block font-medium mb-1">交易代號:</label>
        <Input
          type="text"
          value={txncode}
          onChange={(e) => setTxncode(e.target.value)}
          placeholder="Enter txncode"
          width="w-full"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">電文檔名稱 (HostMsg):</label>
        <Input
          type="text"
          value={hostmsg}
          onChange={(e) => setHostmsg(e.target.value)}
          placeholder="Enter hostmsg"
          width="w-full"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">描述:</label>
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          width="w-full"
        />
      </div>
      {/* 送出按鈕 */}
      <div>
        <Button type="submit" variant="primary" className="w-full">送出</Button>
      </div>

      {/* 新增後顯示 QR Code 區塊 */}
      {qrcodeImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">產生結果</h3>
          <QRCodeGallery qrcodes={qrcodeImages} />
        </div>
      )}
    </form>
  );
};

export default GenQrcodeForm;
