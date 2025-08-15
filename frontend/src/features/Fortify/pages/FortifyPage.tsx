import React, { useState } from 'react';
import PathTypeForm from '../components/PathTypeForm';
import BackToHomeButton from '../../../components/ui/BackToHomeButton';
import Button from '../../../components/ui/Button';
import FlowModal from '../components/FlowModal';
import SetInfoForm from '../components/SetInfoForm';

const FortifyPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scanFileName, setScanFileName] = React.useState<string>("");
  const [pathType, setPathType] = useState<'SVN' | 'DEV'>('SVN');
  const [triggerStart, setTriggerStart] = useState(false); // 控制流程開始的狀態

  const handleOpenAndRun = () => {
    setIsModalOpen(true);
    setTriggerStart(true); // 打開即開始流程
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTriggerStart(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-10 space-y-6 bg-gray-50 rounded shadow">
      <h1 className="text-2xl font-bold text-gray-800">📦 弱掃程式打包頁面</h1>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <PathTypeForm
          pathType={pathType}
          pathOnChange={setPathType}
        />
        <SetInfoForm onFileNameChange={setScanFileName}/>
        <Button 
          variant="success"
          onClick={handleOpenAndRun}
          className="w-full bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          開始
        </Button>
      </div>
      
      <FlowModal
        pathType={pathType}
        fileName={scanFileName}
        isOpen={isModalOpen}
        onClose={handleCancel}
        triggerStart={triggerStart}
      />

      <BackToHomeButton />
    </div>
  );
};

export default FortifyPage;
