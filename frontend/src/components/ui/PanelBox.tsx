import React from 'react';

interface PanelBoxProps {
  title: string;
  width?: string; // 可選，預設固定高度
  height?: string; // 可選，預設固定高度
  children: React.ReactNode;
}

const PanelBox: React.FC<PanelBoxProps> = ({ title, width = 'w-[320px]', height = 'h-[650px]', children }) => {
  return (
    <div className={`${width} ${height} bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col`}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        {title}
      </h2>
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {children}
      </div>
    </div>
  );
};

export default PanelBox;
