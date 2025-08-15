import React, { useEffect, useState } from 'react';
import PathForm from '../../../components/ui/UpdatePath';
import { fetchPath, updateTargetPath } from '../../../services/pathService';

interface SetInfoFormProps {
  onFileNameChange: (fileName: string) => void;
}

const SetInfoForm: React.FC<SetInfoFormProps> = ({ onFileNameChange }) => {
  const [projectDirPath, setProjectDirPath] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 在畫面載入時執行資料查詢
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 假設從後端取得的初始數據格式為：
        // [{ name: 'compress', path: '/some/path1' }, { name: 'jbranch', path: '/some/path2' }]
        const projectDirData = await fetchPath('local', 'bis-project-dir');
        console.log(projectDirData);
        
        const projectDir = projectDirData.toString();
        console.log(projectDir);

        const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        setFileName(todayStr);
        onFileNameChange(todayStr);

        setProjectDirPath(projectDir || ''); // 初始化 projectDirPath
      } catch (err) {
        setError('Failed to load initial data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleProjectDirPathSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 構建 PUT 請求
    try {
      const result = await updateTargetPath('local', 'bis-project-dir', projectDirPath);
      console.log(`ProjectDirPath updated successfully:${result.message}`);
      alert(`✅ 更新成功：${result.message}`);
    } catch (error) {
      alert('❌ 更新 ProjectDir Path 失敗');
      console.error('Form Error updating ProjectDirPath:', error);
    }
  };

  if (isLoading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <PathForm
        label="BIS專案目錄路徑"
        value={projectDirPath}
        onChange={setProjectDirPath}
        onSubmit={handleProjectDirPathSubmit}
        inputWidth="w-50"
      />
      <PathForm
        label="建檔名稱"
        value={fileName}
        onChange={(val) => {
          setFileName(val);
          onFileNameChange(val); // 即時同步到父層
        }}
        inputWidth="w-50"
        haveBTN={false}
      />
    </div>
  );
};

export default SetInfoForm;
