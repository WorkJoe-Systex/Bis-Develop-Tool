import React, { useState } from 'react';
import FileListForm from '../components/FileListForm';
import PathTypeForm from '../components/PathTypeForm';
import BackToHomeButton from '../../../components/ui/BackToHomeButton';

const CompressedPage: React.FC = () => {
  const [pathType, setPathType] = useState<'SVN' | 'DEV'>('SVN');
  const [zipType, setZipType] = useState<'DEV' | 'NOFILE'>('DEV');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50 rounded shadow">
      <h1 className="text-2xl font-bold text-gray-800">📦 壓縮頁面</h1>
      <PathTypeForm
        pathType={pathType}
        zipType={zipType}
        pathOnChange={setPathType}
        zipOnChange={setZipType}
      />
      <FileListForm pathType={pathType} zipType={zipType} />

      <BackToHomeButton />
    </div>
  );
};

export default CompressedPage;
