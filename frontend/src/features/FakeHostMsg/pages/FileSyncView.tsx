import React from 'react';
import { useHostMsgManager } from '../hooks/useHostMsgManager';
import FileList from '../components/FileList';
import HostMsgList from '../components/HostMsgList';
import useNavigateToHome from '../../../hooks/useNavigateToHome';

const FileSyncView: React.FC = () => {
  const { goToHomePage } = useNavigateToHome();
  const {
    files,
    dbHostMsg,
    localHostMsg,
    moveToDatabase,
    moveToLocal,
  } = useHostMsgManager();

  return (
    <div style={{ display: 'flex', height: '100vh', padding: '16px', gap: '16px' }}>
      <FileList files={files} />
      <HostMsgList type="local" data={localHostMsg} onMove={moveToDatabase} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
        <button>{'>'}</button>
        <button>{'<'}</button>
      </div>
      <HostMsgList type="db" data={dbHostMsg} onMove={moveToLocal} />
      <p><button onClick={goToHomePage}>Back</button></p>
    </div>
  );
};

export default FileSyncView;
