import { useEffect, useState } from 'react';
import { searchFiles } from '../../../services/fileService';
import { qryAllHostMsg, updateHostMsgStatus } from '../services/fakeHostMsgService';
import type { HostMsg } from '../types';
import { fetchPath } from '../../../services/pathService';

export const useHostMsgManager = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [dbHostMsg, setDbHostMsg] = useState<HostMsg[]>([]);
  const [localHostMsg, setLocalHostMsg] = useState<HostMsg[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await fetchFiles();
    await fetchHostMsg();
  };

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const path = await fetchPath('SVN', 'fakeHostMsg');
      const data = await searchFiles(path.toString(), '.txt');
      setFiles(data.files.map(f => f.name));
    } catch (err) {
      setError('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHostMsg = async () => {
    try {
      const data = await qryAllHostMsg();
      setLocalHostMsg(data.filter((e) => e.status === 'L'));
      setDbHostMsg(data.filter((e) => e.status === 'D'));
    } catch (err) {
      setError('Failed to load HostMsg from DB');
    }
  };

  const moveToLocal = async (index: number) => {
    const msg = dbHostMsg[index];
    msg.status = 'L';
    try {
      await updateHostMsgStatus(msg);
      await fetchAll();
    } catch (err: any) {
      alert(err.message || '移動到 Local 失敗');
    }
  };

  const moveToDatabase = async (index: number) => {
    const msg = localHostMsg[index];
    msg.status = 'D';
    try {
      await updateHostMsgStatus(msg);
      await fetchAll();
    } catch (err: any) {
      alert(err.message || '移動到 DB 失敗');
    }
  };

  return {
    files,
    dbHostMsg,
    localHostMsg,
    isLoading,
    error,
    moveToDatabase,
    moveToLocal,
  };
};
