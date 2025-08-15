import React, { useState } from 'react';
import FlowModal from '../components/FlowModal';

export default function MainPage() {
  const [isFlowOpen, setIsFlowOpen] = useState(false);

  const handleStart = () => {
    // 這裡檢查使用者設定資料是否都填好
    // 如果OK就打開流程 Modal
    setIsFlowOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">設定頁面</h1>

      {/* 這裡是你原本的設定表單 */}
      <div className="mt-4">
        {/* ... 表單內容 */}
      </div>

      {/* 開始按鈕 */}
      <button
        onClick={handleStart}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        開始流程
      </button>

      {/* 流程彈窗 */}
      <FlowModal isOpen={isFlowOpen} onClose={() => setIsFlowOpen(false)} />
    </div>
  );
}
