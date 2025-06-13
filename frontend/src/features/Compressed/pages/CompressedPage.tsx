import React, { useState } from 'react';
import useNavigateToHome from '../../../hooks/useNavigateToHome';
import FileListForm from '../components/FileListForm';
import PathTypeForm from '../components/PathTypeForm';

const CompressedPage: React.FC = () => {
  const { goToHomePage } = useNavigateToHome();
  const [pathType, setPathType] = useState<'SVN' | 'DEV'>('SVN');
  const [zipType, setZipType] = useState<'DEV' | 'NOFILE'>('DEV');

  return (
    <div>
      <h1>Compressed Page</h1>
      <PathTypeForm pathType={pathType} zipType={zipType} pathOnChange={setPathType} zipOnChange={setZipType} />
      <FileListForm pathType={pathType} zipType={zipType} />
      <p><button onClick={goToHomePage}>Back</button></p>
    </div>
  );
};

export default CompressedPage;
