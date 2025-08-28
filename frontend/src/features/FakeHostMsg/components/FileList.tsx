import React from 'react';
import type { FileItem } from '../../../types/types';

interface FileListProps {
  files?: FileItem[];
}

const FileList: React.FC<FileListProps> = ({ files = [] }) => {
  return (
    <>
      {files.length > 0 ? (
        files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="bg-gray-100 hover:bg-gray-200 transition px-3 py-2 rounded-md text-sm text-gray-700 break-words shadow-sm"
          >
            {file.name}
          </div>
        ))
      ) : (
        <div className="text-gray-400 italic text-sm">目前無檔案</div>
      )}
    </>
  );
};

export default FileList;
