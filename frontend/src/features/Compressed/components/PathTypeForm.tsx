import React, { useEffect } from 'react';
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
    <div className="bg-white p-4 rounded shadow">
      <div className="grid grid-cols-2 gap-8">
        {/* 來源選擇 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">來源選擇</h2>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="pathType"
                value="SVN"
                checked={pathType === 'SVN'}
                onChange={() => pathOnChange('SVN')}
                className="form-radio"
              />
              <span className="ml-2">SVN source</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="pathType"
                value="DEV"
                checked={pathType === 'DEV'}
                onChange={() => pathOnChange('DEV')}
                className="form-radio"
              />
              <span className="ml-2">DEV source</span>
            </label>
          </div>
        </div>

        {/* 壓縮類型 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">壓縮類型</h2>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="zipType"
                value="DEV"
                checked={zipType === 'DEV'}
                onChange={() => zipOnChange('DEV')}
                className="form-radio"
              />
              <span className="ml-2">DEV</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="zipType"
                value="NOFILE"
                checked={zipType === 'NOFILE'}
                onChange={() => zipOnChange('NOFILE')}
                className="form-radio"
              />
              <span className="ml-2">No File</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathTypeForm;
