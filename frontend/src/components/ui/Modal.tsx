import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      // 加入淡出動畫
      setTimeout(() => setVisible(false), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!visible && !isOpen) return null;

  return (
    <div
      ref={(node) => {
  		  overlayRef.current = node;
  		}}
      className={clsx(
			  'fixed inset-0 z-50 flex items-center justify-center',
			  'backdrop-blur-sm bg-gray-400/30 transition-opacity duration-200',
			  isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
			)}
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onClose();
        }
      }}
    >
      <div
			  className={clsx(
			    'bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300',
			    isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
			  )}
			  onClick={(e) => e.stopPropagation()}
			>
        {children}
      </div>
    </div>
  );
};

export default Modal;
