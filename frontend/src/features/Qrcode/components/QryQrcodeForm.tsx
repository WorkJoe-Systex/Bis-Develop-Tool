import React, { useEffect, useState } from 'react';
import { qryQRcode } from '../services/qrcodeService';
import QRCodeGallery from './QRCodeGallery';
import { QRCodeRecord } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import '../css/QryList.css';
import QRCodeRecordList from './QRcodeRecordList';

const QryQrcodeForm: React.FC = () => {
  const [records, setRecords] = useState<QRCodeRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<QRCodeRecord | null>(null);
  const [txncode, setTxncode] = useState('');
  const [noResult, setNoResult] = useState(false);

  const queryQRcode = async (e: React.FormEvent) => {
    e.preventDefault();

    // submit 檢核
    if (txncode.trim() === '') {
      alert('請輸入交易代碼');
      return;
    }

    // 構建 PUT 請求
    try {
      const data = await qryQRcode(txncode);
      
      if (data.qrcodes.length === 0) {
        setNoResult(true);
        setRecords([]);
        setCurrentRecord(null);
      } else {
        setTxncode('');
        setNoResult(false);
        setRecords(data.qrcodes); // 多筆資料
        setCurrentRecord(null); // 清空當前選擇
      }
    } catch (error) {
      alert('查詢失敗');
      console.error(error);
    }
  };

  return (
    <form onSubmit={queryQRcode} className="form-container">
      <h3 className="form-title">查詢QRcode</h3>

      <div className="form-input-group">
        <label>搜尋:</label>
        <input
           type="text"
           value={txncode}
           onChange={(e) => setTxncode(e.target.value)}
           placeholder="Enter txncode"
           className="input"
        />
        {/* 送出按鈕 */}
        <button
          type="submit"
          className="submit-btn"
        >
          XMT
        </button>
      </div>

      {noResult && <p className="text-red-600">查無資料</p>}

      {/* 顯示所有查詢結果 */}
      {records.length > 0 && (
        <QRCodeRecordList
          records={records}
          currentRecord={currentRecord}
          setCurrentRecord={setCurrentRecord}
          setRecords={setRecords}
        />
      )}

      <AnimatePresence>
        {currentRecord && (
          <motion.div
            key="qrcode"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="qrcode-panel"
          >
            <h4 className="preview-title">QRCode 預覽</h4>
            <QRCodeGallery qrcodes={currentRecord.qrcodes} />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default QryQrcodeForm;
