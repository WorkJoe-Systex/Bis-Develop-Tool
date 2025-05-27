import React, { useEffect, useState } from 'react';
import { searchFiles, compressToZip } from '../../services/compressedService';

const HostMsgPage1: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [csvName, setCsvName] = useState<string>(''); // 管理 CSV_NAME
  const [delList, setDelList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // 在畫面載入時執行資料查詢
  useEffect(() => {
    const fetchFiles = async () => {
      try {
      } catch (err: any) {
        setError('Failed to load files');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFiles();
  }, []); // 當組件載入時調用

  return (
    <form>
      <h1>File List</h1>
      <div>
        <fieldset>
            <input type="radio" id="fas" name="contact" value="fas" checked/>
            <label htmlFor="fas">fas</label>
            <input type="radio" id="as400" name="contact" value="as400"/>
            <label htmlFor="as400">as400</label>
        </fieldset>
      </div>
      <div>
        <input type="file" />
      </div>
    </form>
  );
};

export default HostMsgPage1;
