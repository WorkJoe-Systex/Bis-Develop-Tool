import React, { useState } from 'react';
import { useHostMsgManager } from '../hooks/useHostMsgManager';
import FileList from '../components/FileList';
import HostMsgList from '../components/HostMsgList';
import BackToHomeButton from '../../../components/ui/BackToHomeButton';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import PanelBox from '../../../components/ui/PanelBox';

const FileSyncView: React.FC = () => {
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

  return (
    <div className="flex justify-center items-start h-screen p-4 gap-6 bg-gray-100 relative">
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

      {/* 中間箭頭按鈕 */}
      <div className="flex flex-col gap-4 self-center">
        <Button
          width='w-9'
          height='h-7'
          variant='primary'
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
          width='w-9'
          height='h-7'
          variant='primary'
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
            
      {/* 返回按鈕 */}
      <div className="absolute bottom-4 right-4">
        <BackToHomeButton />
      </div>
    </div>
  );
};

export default FileSyncView;
