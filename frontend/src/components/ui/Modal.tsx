import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;  // 新增
  height?: string; // 新增
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, width = 'max-w-lg', height = 'auto' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Modal 主體 */}
      <div
        className={`relative bg-white rounded-2xl shadow-lg w-full p-6 flex flex-col`}
        style={{ maxWidth: width, maxHeight: height }}
      >
        {children}

        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Modal;
