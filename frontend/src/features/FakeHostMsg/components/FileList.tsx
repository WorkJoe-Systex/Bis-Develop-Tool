import React from 'react';

interface FileListProps {
  files: string[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
  return (
    <div style={{ width: '20%', border: '1px solid #ccc', padding: '12px', borderRadius: '8px', boxShadow: '2px 2px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>📁 本機檔案</h2>
      <ul style={{ maxHeight: '80vh', overflowY: 'auto', listStyle: 'none', padding: 0 }}>
        {files.map((file) => (
          <li key={file} style={{ background: '#f1f1f1', padding: '8px', borderRadius: '4px', marginBottom: '4px' }}>
            <label>{file}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
