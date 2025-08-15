import React, { useEffect, useState } from 'react';
import { fetchPath, updateTargetPath } from '../../services/pathService';
import PathForm from '../ui/UpdatePath';

const UpdatePathForm: React.FC = () => {
  const [targetPath, setTargetPath] = useState('');
  const [jbranchPath, setJBranchPath] = useState('');
  const [devPath, setDEVPath] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 在畫面載入時執行資料查詢
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 假設從後端取得的初始數據格式為：
        // [{ name: 'compress', path: '/some/path1' }, { name: 'jbranch', path: '/some/path2' }]
        const targetData = await fetchPath('local', 'compress');
        const jbranchData = await fetchPath('SVN', 'jbranch');
        const devData = await fetchPath('DEV', 'dev-dir');

        console.log(targetData);
        console.log(jbranchData);
        console.log(devData);
        
        // const target = targetData.find((item) => item.path);
        // const jbranch = jbranchData.find((item) => item.path);
        // const dev = devData.find((item) => item.path);

        // console.log(target);
        // console.log(jbranch);
        // console.log(dev);

        setTargetPath(targetData.toString() || ''); // 初始化 tragetPath
        setJBranchPath(jbranchData.toString() || ''); // 初始化 jbranchPath
        setDEVPath(devData.toString() || ''); // 初始化 devPath
      } catch (err) {
        setError('Failed to load initial data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleTargetPathSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 構建 PUT 請求
    try {
      const result = await updateTargetPath('local', 'compress', targetPath);
      console.log(`TragetPath updated successfully:${result.message}`);
      alert(`✅ 更新成功：${result.message}`);
    } catch (error) {
      alert('❌ 更新 Compress Path 失敗');
      console.error('Form Error updating tragetPath:', error);
    }
  };

  const handleJBranchPathSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 構建 PUT 請求
    try {
      const result = await updateTargetPath('SVN', 'jbranch', jbranchPath);
      console.log(`JBranchPath updated successfully:${result.message}`);
      alert(`✅ 更新成功：${result.message}`);
    } catch (error) {
      alert('❌ 更新 JBranch Path 失敗');
      console.error('Form Error updating jbranchPath:', error);
    }
  };

  const handleDEVPathSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 構建 PUT 請求
    try {
      const result = await updateTargetPath('DEV', 'dev-dir', devPath);
      console.log(`DEVPath updated successfully:${result.message}`);
      alert(`✅ 更新成功：${result.message}`);
    } catch (error) {
      alert('❌ 更新 DEV Path 失敗');
      console.error('Form Error updating devPath:', error);
    }
  };

  if (isLoading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <PathForm
        label="壓縮檔路徑"
        value={targetPath}
        onChange={setTargetPath}
        onSubmit={handleTargetPathSubmit}
      />
      <PathForm
        label="SVN 路徑"
        value={jbranchPath}
        onChange={setJBranchPath}
        onSubmit={handleJBranchPathSubmit}
      />
      <PathForm
        label="TBIS 路徑"
        value={devPath}
        onChange={setDEVPath}
        onSubmit={handleDEVPathSubmit}
      />
    </div>
  );
};

export default UpdatePathForm;
