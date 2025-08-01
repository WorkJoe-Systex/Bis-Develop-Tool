import React, { useState } from 'react';
import type { HostMsg } from '../types';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface HostMsgListProps {
  type: 'local' | 'db';
  data: HostMsg[];
  onMove: (index: number) => void;
}

const HostMsgList: React.FC<HostMsgListProps> = ({ type, data, onMove }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const isLocal = type === 'local';

  return (
    <>
      {data.map((msg, index) => (
        <div
          key={msg.id}
          className="bg-gray-100 px-3 py-2 rounded flex justify-between items-center text-sm hover:bg-gray-200"
        >
          <div className="flex items-center gap-2">
            {isLocal ? (
              <button
                onClick={() => onMove(index)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ➡
              </button>
            ) : (
              <button
                onClick={() => onMove(index)}
                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                ⬅
              </button>
            )}
            <span>{msg.hostmsg} - {msg.description}</span>
          </div>
          
          {/* 右邊操作按鈕 */}
          <div className="flex items-center gap-2">
            <button
              className="py-1 px-2 rounded bg-red-100 hover:bg-rose-200 transition"
              onClick={() => {
                setSelectedIndex(index);
                setDeleteConfirmOpen(true);
              }}
            >
              🗑️
            </button>
            <button
              className="py-1 px-2 rounded bg-amber-100 hover:bg-yellow-300 transition"
              onClick={() => {
                setSelectedIndex(index);
                setEditModalOpen(true);
              }}
            >
              ⋯
            </button>
          </div>
        </div>
      ))}

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <h2 className="text-lg font-bold mb-4">確認刪除</h2>
        <p>確定要刪除這筆電文嗎？</p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={() => setDeleteConfirmOpen(false)}>取消</Button>
          <Button variant="danger" onClick={() => {
            // if (selectedIndex !== null) {
            //   // 實作刪除邏輯
            //   console.log('刪除', data[selectedIndex]);
            //   setDeleteConfirmOpen(false);
            // }
          }}>刪除</Button>
        </div>
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
      >
        <h2 className="text-lg font-bold mb-4">編輯電文</h2>
        {selectedIndex !== null && (
          <div className="space-y-3">
            <Input
              value={data[selectedIndex].txncode}
              disabled
              width="w-full"
            />
            <Input
              value={data[selectedIndex].hostmsg}
              disabled
              width="w-full"
            />
            <Input
              value={data[selectedIndex].description}
              onChange={(e) => {
                data[selectedIndex].description = e.target.value;
              }}
              width="w-full"
            />
            {/* 其他欄位如需編輯亦可加入 */}
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setEditModalOpen(false)}>取消</Button>
              <Button variant="primary" onClick={() => {
                console.log('編輯後', data[selectedIndex]);
                setEditModalOpen(false);
              }}>儲存</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default HostMsgList;
