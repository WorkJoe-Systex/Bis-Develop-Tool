import React, { useEffect, useState } from 'react';
import { searchFiles, compressToZip, updatePathType } from '../services/compressedService';

interface FileListFormProps {
  pathType: 'SVN' | 'DEV';
  zipType: 'DEV' | 'NOFILE';
}

const FileListForm: React.FC<FileListFormProps> = ({ pathType, zipType }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [csvName, setCsvName] = useState<string>(''); // 管理 CSV_NAME
  const [delList, setDelList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // 在畫面載入時執行資料查詢
  useEffect(() => {
    fetchFiles();
  }, []); // 當組件載入時調用

  /**
   * 查詢.csv
   */
  const fetchFiles = async () => {
    setError(''); // 清空先前的錯誤訊息
    setIsLoading(true);
    try {
      const data = await searchFiles('?serverType=local&name=compress');
      setFiles(data.files); // 使用返回的檔案列表
    } catch (err: any) {
      setError('Failed to load files');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  // 處理檔案選擇
  const handleFileSelect = (file: string) => {
    // 多選
    // setSelectedFiles((prevSelected) => {
    //   const updatedSelection = prevSelected.includes(file)
    //     ? prevSelected.filter((f) => f !== file) // 取消選擇
    //     : [...prevSelected, file]; // 選擇檔案

    //   // 如果是第一次勾選檔案，將該檔案名填入 CSV_NAME
    //   if (!prevSelected.includes(file) && updatedSelection.length === 1) {
    //     setCsvName(file);
    //   }
    //   return updatedSelection;
    // });

    // 單選
    if (selectedFiles.includes(file)) {
      // 如果已選中 → 取消勾選
      setSelectedFiles([]);
      setCsvName('');
    } else {
      // 強制單選
      setSelectedFiles([file]);
      setCsvName(file);
    }
  };

  // 處理下一步操作
  const handleNextStep = async  () => {
    // 這裡可以執行使用者選擇檔案後的操作，例如發送至伺服器
    console.log('Selected files:', selectedFiles);

    try {
      if (selectedFiles.length !== 0) {
        const data = await compressToZip(selectedFiles, pathType, zipType);
        if (data.delList) {
          setDelList(data.delList);
          console.log(`data.delList:${data.delList}`)
        }
        console.log('Compression successful:', data.zipName);
        updatePathType(pathType, zipType);
      } else {
        setCsvName('');
        alert('Choose the file first');
      }
    } catch (err: any) {
      console.error('Error:', err.message);
      alert('An error occurred.');
    }
  };

  return (
    <div>
      <h3>File List</h3>
      <div>
        <button onClick={fetchFiles} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'refresh'}
        </button>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <ul>
          {files.map((file) => (
            <li key={file}>
              <input
                id={file}
                type="checkbox"
                checked={selectedFiles.includes(file)}
                onChange={() => handleFileSelect(file)}
              />
              <label htmlFor={file}>{file}</label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label htmlFor="CSV_NAME">CSV File Name</label>
        <input
          id="CSV_NAME"
          name="CSV_NAME"
          type="text"
          style={{ width: '200px' }}
          value={csvName}
          onChange={(e) => setCsvName(e.target.value)} // 實時更新 CSV_NAME 的值
        />
        <button 
          id="BTN_COMPRESS"
          onClick={handleNextStep}
          disabled={!csvName} // 當 CSV_NAME 為空時禁用按鈕
        >
          Next Step
        </button>
      </div>
      <div>
        {/* 只有在 delList 有資料時才顯示 */}
        {delList.length > 0 && (
          <div>
            <h2>Deleted Files:</h2>
            <ul>
              {delList.map((del, index) => (
                <li key={index}>
                  <label>{del}</label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileListForm;
