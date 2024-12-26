import React, { useEffect, useState } from 'react';
import { searchFiles, compressToZip } from '../services/compressedService';

const FileListForm: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // 在畫面載入時執行資料查詢
  useEffect(() => {
    const fetchFiles = async () => {
      setError(''); // 清空先前的錯誤訊息
      setIsLoading(true);
      try {
        const data = await searchFiles('?serverType=local&name=target');
        setFiles(data.files); // 使用返回的檔案列表
        console.log(files);
      } catch (err: any) {
        setError('Failed to load files');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFiles();
  }, []); // 當組件載入時調用

  // 處理檔案選擇
  const handleFileSelect = (file: string) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(file)
        ? prevSelected.filter((f) => f !== file)  // 取消選擇
        : [...prevSelected, file]  // 選擇檔案
    );
  };

  // 處理下一步操作
  const handleNextStep = async  () => {
    // 這裡可以執行使用者選擇檔案後的操作，例如發送至伺服器
    console.log('Selected files:', selectedFiles);

    try {
      const data = await compressToZip(selectedFiles);
      console.log('Compression successful:', data);
    } catch (err: any) {
      console.error('Error:', err.message);
      alert('An error occurred.');
    }
  };

  return (
    <div>
      <h1>File List</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {files.map((file) => (
          <li key={file}>
            <input
              type="checkbox"
              checked={selectedFiles.includes(file)}
              onChange={() => handleFileSelect(file)}
            />
            {file}
          </li>
        ))}
      </ul>
      <button onClick={handleNextStep}>Next Step</button>
    </div>
  );
};

export default FileListForm;
