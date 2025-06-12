import React, { useEffect, useState } from 'react';
import { fetchPath, updateTargetPath } from '../../services/pathService';

// 子組件：可重複使用的表單
interface PathFormProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const PathForm: React.FC<PathFormProps> = ({ label, value, onChange, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <label>{label}:</label>
    <input
      type="text"
      style={{ width: '700px' }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${label.toLowerCase()}`}
    />
    <button type="submit">Update</button>
  </form>
);

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
        
        const target = targetData.find((item) => item.path);
        const jbranch = jbranchData.find((item) => item.path);
        const dev = devData.find((item) => item.path);

        console.log(target);
        console.log(jbranch);
        console.log(dev);

        setTargetPath(target?.path || ''); // 初始化 tragetPath
        setJBranchPath(jbranch?.path || ''); // 初始化 jbranchPath
        setDEVPath(dev?.path || ''); // 初始化 devPath
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
      console.log(`TragetPath updated successfully:${result}`);
    } catch (error) {
      alert('Failed to update tragetPath.');
      console.error('Form Error updating tragetPath:', error);
    }
  };

  const handleJBranchPathSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 構建 PUT 請求
    try {
      const result = await updateTargetPath('SVN', 'jbranch', jbranchPath);
      console.log(`JBranchPath updated successfully:${result}`);
    } catch (error) {
      alert('Failed to update jbranchPath.');
      console.error('Form Error updating jbranchPath:', error);
    }
  };

  const handleDEVPathSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 構建 PUT 請求
    try {
      const result = await updateTargetPath('DEV', 'dev-dir', devPath);
      console.log(`DEVPath updated successfully:${result}`);
    } catch (error) {
      alert('Failed to update devPath.');
      console.error('Form Error updating devPath:', error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <PathForm
        label="Compress Path"
        value={targetPath}
        onChange={setTargetPath}
        onSubmit={handleTargetPathSubmit}
      />
      <PathForm
        label="JBranch Path"
        value={jbranchPath}
        onChange={setJBranchPath}
        onSubmit={handleJBranchPathSubmit}
      />
      <PathForm
        label="DEV Path"
        value={devPath}
        onChange={setDEVPath}
        onSubmit={handleDEVPathSubmit}
      />
    </div>
    // <div>
    //   <form onSubmit={handleTragetPathSubmit}>
    //     <label>Target Path:</label>
    //     <input
    //       type="text"
    //       id="tragetPath"
    //       name="path"
    //       style={{ width: '700px' }}
    //       value={targetPath}
    //       onChange={(e) => setTargetPath(e.target.value)}
    //       placeholder="Enter target path"
    //     />
    //     <button type="submit">Update</button>
    //   </form>

    //   <form onSubmit={handleJBranchPathSubmit}>
    //     <label>JBranch Path:</label>
    //     <input
    //       type="text"
    //       id="jbranchPath"
    //       name="path"
    //       style={{ width: '700px' }}
    //       value={jbranchPath}
    //       onChange={(e) => setJBranchPath(e.target.value)}
    //       placeholder="Enter jbranch path"
    //     />
    //     <button type="submit">Update</button>
    //   </form>
    // </div>
  );
};

export default UpdatePathForm;
