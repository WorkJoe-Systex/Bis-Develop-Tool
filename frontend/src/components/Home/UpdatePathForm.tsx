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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 在畫面載入時執行資料查詢
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 假設從後端取得的初始數據格式為：
        // [{ name: 'target', path: '/some/path1' }, { name: 'jbranch', path: '/some/path2' }]
        const targetData = await fetchPath('local', 'target');
        const jbranchData = await fetchPath('local', 'jbranch');

        console.log(targetData);
        console.log(jbranchData);
        
        const target = targetData.find((item) => item.path);
        const jbranch = jbranchData.find((item) => item.path);

        console.log(target);
        console.log(jbranch);

        setTargetPath(target?.path || ''); // 初始化 tragetPath
        setJBranchPath(jbranch?.path || ''); // 初始化 jbranchPath
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
      const result = await updateTargetPath('local', 'target', targetPath);
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
      const result = await updateTargetPath('local', 'jbranch', jbranchPath);
      console.log(`JBranchPath updated successfully:${result}`);
    } catch (error) {
      alert('Failed to update jbranchPath.');
      console.error('Form Error updating jbranchPath:', error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <PathForm
        label="Target Path"
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
