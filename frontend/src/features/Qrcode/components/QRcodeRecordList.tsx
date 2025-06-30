import React from 'react';
import { QRCodeRecord } from '../types';
import { delQRcode } from '../services/qrcodeService';

interface QRCodeRecordListProps {
  records: QRCodeRecord[];
  currentRecord: QRCodeRecord | null;
  setCurrentRecord: (record: QRCodeRecord | null) => void;
  setRecords: (records: QRCodeRecord[]) => void;
}

const QRCodeRecordList: React.FC<QRCodeRecordListProps> = ({
  records,
  currentRecord,
  setCurrentRecord,
  setRecords,
}) => {
  return (
    <div className="result-section">
      <h4 className="result-title">查詢結果（共 {records.length} 筆）</h4>

      <div className="record-table">
        {/* 表頭 */}
        <div className="record-header">
          <div className="header-cell">Txncode</div>
          <div className="header-cell">Hostmsg</div>
          <div className="header-cell">Description</div>
          <div className="header-cell">操作</div>
        </div>

        {/* 每筆資料 */}
        {records.map((record, index) => (
          <div
            key={index}
            className={`record-row ${currentRecord === record ? 'selected' : ''}`}
            onClick={() => setCurrentRecord(record)}
          >
            <div className="record-cell">{record.txncode}</div>
            <div className="record-cell">{record.hostmsg}</div>
            <div className="record-cell">{record.description}</div>
            <div className="record-cell action-cell">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const ok = window.confirm(`確定要刪除 txncode: ${record.txncode}？`);
                  if (ok) {
                    delQRcode(record.id)
                      .then(() => {
                        const updated = records.filter((r) => r !== record);
                        setRecords(updated);
                        
                        if (currentRecord === record) {
                          setCurrentRecord(null);
                        }
                      })
                      .catch((err) => {
                        alert(err.message);
                      });
                  }
                }}
                className="delete-btn"
              >
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRCodeRecordList;
