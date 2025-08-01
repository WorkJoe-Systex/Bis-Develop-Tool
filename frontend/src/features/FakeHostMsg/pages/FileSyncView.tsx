import React, { useEffect, useRef, useState } from 'react';
import { useHostMsgManager } from '../hooks/useHostMsgManager';
import FileList from '../components/FileList';
import HostMsgList from '../components/HostMsgList';
import BackToHomeButton from '../../../components/ui/BackToHomeButton';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import PanelBox from '../../../components/ui/PanelBox';
import Modal from '../../../components/ui/Modal';
import Select from '../../../components/ui/Select';
import Textarea from '../../../components/ui/Textarea';

const FileSyncView: React.FC = () => {
  // 新增 Modal 狀態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTxncode, setNewTxncode] = useState('');
  const [newHostMsg, setNewHostMsg] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newOriginalTxt, setNewOriginalTxt] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    files,
    dbHostMsg,
    localHostMsg,
    moveToDatabase,
    moveToLocal,
  } = useHostMsgManager();

  const [searchKeyword_DB, setSearchKeyword_DB] = useState('');
  const [searchKeyword_Local, setSearchKeyword_Local] = useState('');

  const filterMessages_Local = (msgs: typeof localHostMsg) =>
    msgs.filter((msg) =>
     msg.hostmsg.includes(searchKeyword_Local) || msg.txncode.includes(searchKeyword_Local)
    );

  const filterMessages_DB = (msgs: typeof localHostMsg) =>
    msgs.filter((msg) =>
     msg.hostmsg.includes(searchKeyword_DB) || msg.txncode.includes(searchKeyword_DB)
    );

  // 進入 modal 時自動 focus
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isModalOpen]);
  
  // 提交邏輯
  const handleAdd = () => {
    if (!newHostMsg.trim() || !newDescription.trim() || !newTxncode.trim() || !newStatus.trim() || !newOriginalTxt.trim()) {
      setErrorMsg('請填寫完整資訊');
      return;
    }

    console.log('新增:', newHostMsg, newDescription);

    setNewTxncode('');
    setNewHostMsg('');
    setNewStatus('');
    setNewOriginalTxt('');
    setNewDescription('');
    setErrorMsg('');
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setErrorMsg('');
    setNewTxncode('');
    setNewHostMsg('');
    setNewStatus('');
    setNewOriginalTxt('');
    setNewDescription('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      {/* 🔹 Toolbar 上方按鈕列 */}
      <div className="w-full flex justify-between items-center mb-4">
        <Button variant="success" onClick={() => setIsModalOpen(true)}>
          ➕ 新增電文
        </Button>
        <BackToHomeButton />
      </div>

      {/* 🔸 主內容三欄區域 */}
      <div className="flex justify-center items-start gap-6 flex-1 overflow-auto">
        {/* 本機檔案 */}
        <PanelBox title="📁 本機檔案" width="w-[320px]" height="h-[600px]">
          <FileList files={files} />
        </PanelBox>

        {/* 本機電文 */}
        <PanelBox title="🗃️ 本機電文" width="w-[400px]" height="h-[600px]">
          <Input
            className="mb-2 mt-1 ml-1"
            type="text"
            value={searchKeyword_Local}
            onChange={(e) => setSearchKeyword_Local(e.target.value)}
            placeholder="搜尋電文..."
            width="w-88"
            height="h-8"
          />
          <HostMsgList type="local" data={filterMessages_Local(localHostMsg)} onMove={moveToDatabase} />
        </PanelBox>

        {/* 中間移動按鈕 */}
        <div className="flex flex-col gap-4 self-center">
          <Button
            width="w-9"
            height="h-7"
            variant="primary"
            className="text-white font-bold"
            onClick={() => {
              const idx = localHostMsg.findIndex((msg) =>
                msg.hostmsg.includes(searchKeyword_DB) || msg.description.includes(searchKeyword_DB)
              );
              if (idx !== -1) moveToDatabase(idx);
            }}
          >
            {'>'}
          </Button>
          <Button
            width="w-9"
            height="h-7"
            variant="primary"
            className="text-white font-bold"
            onClick={() => {
              const idx = dbHostMsg.findIndex((msg) =>
                msg.hostmsg.includes(searchKeyword_Local) || msg.description.includes(searchKeyword_Local)
              );
              if (idx !== -1) moveToLocal(idx);
            }}
          >
            {'<'}
          </Button>
        </div>

        {/* 資料庫電文 */}
        <PanelBox title="🗃️ 資料庫電文" width="w-[400px]" height="h-[600px]">
          <Input
            className="mb-2 mt-1 ml-1"
            type="text"
            value={searchKeyword_DB}
            onChange={(e) => setSearchKeyword_DB(e.target.value)}
            placeholder="搜尋電文..."
            width="w-88"
            height="h-8"
          />
          <HostMsgList type="db" data={filterMessages_DB(dbHostMsg)} onMove={moveToLocal} />
        </PanelBox>
      </div>

      {/* 🔸 彈窗元件 */}
      <Modal isOpen={isModalOpen} onClose={handleCancel}>
        <h2 className="text-lg font-bold mb-4 border-b">新增電文</h2>
        <div className="space-y-3" onKeyDown={handleKeyDown}>
          <label htmlFor="newTxncode">交易代號：</label>
          <Input
            id="newTxncode"
            ref={inputRef}
            placeholder="輸入交易代號"
            value={newTxncode}
            onChange={(e) => setNewTxncode(e.target.value)}
            width="w-17"
            maxLength={5}
          />

          <label htmlFor="newStatus" className="ml-10">儲存位置：</label>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={[
              { label: '資料庫', value: 'D' },
              { label: '本機', value: 'L' },
            ]}
            width="w-25"
            height="h-10"
          />

          <br />
          <label htmlFor="newHostMsg">Tita 名稱：</label>
          <Input
            id="newHostMsg"
            placeholder="輸入 Tita 名稱"
            value={newHostMsg}
            onChange={(e) => setNewHostMsg(e.target.value)}
            width="w-50"
            maxLength={15}
          />

          <br />
          <label htmlFor="newDescription">描述：</label>
          <Input
            placeholder="輸入描述"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            width="w-42"
            maxLength={10}
          />

          <br />
          <label htmlFor="newOriginalTxt">電文：</label>
          <Textarea
            placeholder="輸入電文"
            value={newOriginalTxt}
            onChange={(e) => setNewOriginalTxt(e.target.value)}
            width="w-full"
          />

          {errorMsg && (
            <div className="text-red-600 text-sm">{errorMsg}</div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={handleCancel}>取消</Button>
            <Button variant="primary" onClick={handleAdd}>送出</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FileSyncView;