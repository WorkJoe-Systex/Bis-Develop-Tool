import React, { useState } from 'react';

interface QRCodeGalleryProps {
  qrcodes: string[];  // 預期是 Base64 image 的陣列
  perPage?: number;
}

const QRCodeGallery: React.FC<QRCodeGalleryProps> = ({ qrcodes, perPage = 6 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // ⚠️ 防呆：確保 qrcodes 是陣列
  if (!Array.isArray(qrcodes)) {
    return <div style={{ color: 'red' }}>⚠️ 錯誤：收到的 qrcodes 並不是陣列。</div>;
  }

  const totalPages = Math.ceil(qrcodes.length / perPage);
  const startIdx = (currentPage - 1) * perPage;
  const currentQRCodes = qrcodes.slice(startIdx, startIdx + perPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {currentQRCodes.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`QRCode ${index}`}
            style={{ width: '120px', height: '120px', border: '1px solid #ccc' }}
          />
        ))}
      </div>
      {/* 分頁按鈕 */}
      {totalPages > 1 && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            上一頁
          </button>
          <span style={{ margin: '0 10px' }}>
            第 {currentPage} / {totalPages} 頁
          </span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            下一頁
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeGallery;
