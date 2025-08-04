import React, { useState, useEffect, useCallback } from 'react';

interface QRCodeGalleryProps {
  qrcodes: string[];  // Base64 image 陣列
  perPage?: number;
}

const QRCodeGallery: React.FC<QRCodeGalleryProps> = ({ qrcodes, perPage = 6 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // ⚠️ 防呆：確保 qrcodes 是陣列
  if (!Array.isArray(qrcodes)) {
    return <div className="text-red-600">⚠️ 錯誤：收到的 qrcodes 並不是陣列。</div>;
  }

  const totalPages = Math.ceil(qrcodes.length / perPage);
  const startIdx = (currentPage - 1) * perPage;
  const currentQRCodes = qrcodes.slice(startIdx, startIdx + perPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 鍵盤事件處理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedIndex === null) return;

    if (e.key === 'Escape') {
      setSelectedIndex(null);
    } else if (e.key === 'ArrowRight') {
      setSelectedIndex((prev) => {
        if (prev !== null && prev < qrcodes.length - 1) return prev + 1;
        return prev;
      });
    } else if (e.key === 'ArrowLeft') {
      setSelectedIndex((prev) => {
        if (prev !== null && prev > 0) return prev - 1;
        return prev;
      });
    }
  }, [selectedIndex, qrcodes.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="mt-4">
      {/* 圖片展示 */}
      <div className="flex flex-wrap gap-4 justify-start">
        {currentQRCodes.map((src, index) => {
          const globalIndex = startIdx + index;
          return (
            <img
              key={globalIndex}
              src={src}
              alt={`QRCode ${globalIndex}`}
              className="w-28 h-28 border border-gray-300 rounded cursor-pointer hover:scale-105 transition"
              onClick={() => setSelectedIndex(globalIndex)}
            />
          );
        })}
      </div>

      {/* 分頁按鈕 */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一頁
          </button>
          <span>
            第 {currentPage} / {totalPages} 頁
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一頁
          </button>
        </div>
      )}

      {/* Modal：圖片預覽 */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="bg-white p-4 rounded shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 關閉按鈕 */}
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-black text-xl"
              onClick={() => setSelectedIndex(null)}
            >
              ✕
            </button>

            {/* 切換按鈕 */}
            <div className="flex items-center gap-4">
              <button
                className="text-xl px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => setSelectedIndex((prev) => (prev ?? 0) - 1)}
                disabled={selectedIndex === 0}
              >
                ←
              </button>

              <img
                src={qrcodes[selectedIndex]}
                alt={`Preview ${selectedIndex}`}
                className="max-w-[90vw] max-h-[80vh] border"
              />

              <button
                className="text-xl px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => setSelectedIndex((prev) => (prev ?? 0) + 1)}
                disabled={selectedIndex === qrcodes.length - 1}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGallery;
