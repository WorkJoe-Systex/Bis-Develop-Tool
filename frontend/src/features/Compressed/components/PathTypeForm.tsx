import React, { useEffect, useState } from 'react';
import { queryUSERINFO } from '../services/compressedService';

interface PathTypeFormProps {
  pathType: 'SVN' | 'DEV';
  zipType: 'DEV' | 'NOFILE';
  pathOnChange: (value: 'SVN' | 'DEV') => void;
  zipOnChange: (value: 'DEV' | 'NOFILE') => void;
}

const PathTypeForm: React.FC<PathTypeFormProps> = ({ pathType, zipType, pathOnChange, zipOnChange }) => {

  // 在畫面載入時執行資料查詢
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await queryUSERINFO('?name=admin');
        // 使用返回的檔案列表
        if (data.compressedDir === 'SVN' || data.compressedDir === 'DEV') {
          pathOnChange(data.compressedDir);
        }
        if (data.zipType === 'DEV' || data.zipType === 'NOFILE') {
          zipOnChange(data.zipType);
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
          onChange={() => pathOnChange('SVN')}
        />
        SVN source
      </label>
      <label style={{ marginLeft: '1rem' }}>
        <input
          type="radio"
          value="DEV"
          name="pathType"
          checked={pathType === 'DEV'}
          onChange={() => pathOnChange('DEV')}
        />
        DEV source
      </label>

      <h3>Zip type</h3>
      <label>
        <input
          type="radio"
          value="DEV"
          name="zipType"
          checked={zipType === 'DEV'}
          onChange={() => zipOnChange('DEV')}
        />
        DEV
      </label>
      <label style={{ marginLeft: '1rem' }}>
        <input
          type="radio"
          value="NOFILE"
          name="zipType"
          checked={zipType === 'NOFILE'}
          onChange={() => zipOnChange('NOFILE')}
        />
        NoFile
      </label>
    </form>
  );
};

export default PathTypeForm;
