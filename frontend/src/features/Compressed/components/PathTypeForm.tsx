import React, { useEffect, useState } from 'react';
import { queryUSERINFO } from '../services/compressedService';

interface PathTypeFormProps {
  pathType: 'SVN' | 'DEV';
  onChange: (value: 'SVN' | 'DEV') => void;
}

const PathTypeForm: React.FC<PathTypeFormProps> = ({ pathType, onChange }) => {

  // 在畫面載入時執行資料查詢
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await queryUSERINFO('?name=admin');
        // 使用返回的檔案列表
        if (data.compressedDir === 'SVN' || data.compressedDir === 'DEV') {
          onChange(data.compressedDir);
        }
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchFiles();
  }, []); // 當組件載入時調用


  return (
    <form>
      <h3>Directory type</h3>
      <label>
        <input
          type="radio"
          value="SVN"
          name="pathType"
          checked={pathType === 'SVN'}
          onChange={() => onChange('SVN')}
        />
        SVN source
      </label>
      <label style={{ marginLeft: '1rem' }}>
        <input
          type="radio"
          value="DEV"
          name="pathType"
          checked={pathType === 'DEV'}
          onChange={() => onChange('DEV')}
        />
        DEV source
      </label>
    </form>
  );
};

export default PathTypeForm;
