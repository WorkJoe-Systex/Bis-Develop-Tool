import { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { fetchPath } from '../../../services/pathService';
import { svnAdd, svnCommit, svnUpdate } from '../services/fortifyService';
import { genFile, mergeCSV, moveFiles, searchFiles } from '../../../services/fileService';
import { compressToZip } from '../../Compressed/services/compressedService';

interface FlowModalProps {
  pathType: string;
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
  triggerStart: boolean;
}

interface Step {
  id: number;
  title: string;
  status: 'pending' | 'in-progress' | 'success' | 'error';
  log: string;
}

// const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export default function FlowModal({ isOpen, onClose, fileName, pathType, triggerStart }: FlowModalProps) {
  const [defaultSteps] = useState<Step[]>([
    { id: 1, title: 'SVN 更新專案目錄', status: 'pending', log: '' },
    { id: 2, title: '檢查檔案並建立資料夾', status: 'pending', log: '' },
    { id: 3, title: '合併 CSV 檔案', status: 'pending', log: '' },
    { id: 4, title: '產生 ZIP 檔案', status: 'pending', log: '' },
    { id: 5, title: 'SVN Commit 已掃', status: 'pending', log: '' },
    { id: 6, title: 'SVN Commit 待掃', status: 'pending', log: '' },
  ]);

  const [steps, setSteps] = useState<Step[]>(defaultSteps);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const resetState = () => {
    setSteps(defaultSteps);
    setIsRunning(false);
    setCompleted(false);
    setFailed(false);
    setSelectedFiles([]);
  };

  useEffect(() => {
    if (triggerStart && isOpen) {
      runProcess();
    }
  }, [triggerStart, isOpen]);

  const updateStep = (id: number, changes: Partial<Step>) => {
    setSteps(prev =>
      prev.map(step => (step.id === id ? { ...step, ...changes } : step))
    );
  };

  const runStep = async (id: number, action: () => Promise<string | void>) => {
    updateStep(id, { status: 'in-progress' });
    try {
      const extraMsg = await action(); // 直接拿回 action 回傳的訊息
      updateStep(id, { status: 'success', log: `✅ ${steps[id - 1].title} 完成 ${extraMsg ? extraMsg : ''}` });
    } catch (err) {
      updateStep(id, { status: 'error', log: `❌ ${steps[id - 1].title} 失敗: \n    ${err instanceof Error ? err.message : String(err)}` });
      throw err;
    }
  };

  const runProcess = async () => {
    setIsRunning(true);
    setCompleted(false);
    setFailed(false);

    try {
      for (const step of steps) {
        await runStep(step.id, async () => {
          // await delay(1200); // 測試用延遲
          setSelectedFiles([]);
          const bisProjectPath = await fetchPath('local', 'bis-project-dir');
          const notScanPath = await fetchPath('local', 'notScan');
          const scannedPath = await fetchPath('local', 'scanned');

          switch(step.id) {
            case 1 :
              await svnUpdate(bisProjectPath.toString() + notScanPath.toString());
              break;
            case 2 :
              const repGenFile = await genFile(fileName, bisProjectPath.toString() + scannedPath.toString());
              return `: ${repGenFile.message}`;
            case 3 :
              const repMoveFile = await moveFiles(bisProjectPath.toString() + notScanPath.toString(), bisProjectPath.toString() + scannedPath.toString() + '/' + fileName);
              const files = await searchFiles(bisProjectPath.toString() + scannedPath.toString() + '/' + fileName, '.csv');
              // setSelectedFiles(files.files.map(f => f.name));
              for (let file of files.files) {
                if (!file.name.includes(fileName)) {
                  selectedFiles.push(file.name);
                }
              }
              const repMergeCSV = await mergeCSV(selectedFiles, fileName, 'DEV_' + fileName);
              return `\n    ${repMoveFile.message}\n    CSV：${repMergeCSV.message}`;
            case 4 :
              const repCompressToZip = await compressToZip(fileName, 'VS', bisProjectPath.toString() + scannedPath.toString() + '\\' + fileName, selectedFiles, pathType, 'NOFILE', false);
              return `: ${repCompressToZip.zipName}`;
            case 5 :
              await svnAdd(scannedPath.toString(), scannedPath.toString() + '\\' + fileName);
              await svnCommit(bisProjectPath.toString() + scannedPath.toString(), fileName);
              break;
            case 6 :
              // 先用反斜線或斜線切割
              const segments = notScanPath.split(/[/\\]/).filter(Boolean);
              // 去掉最後一個
              const parentPath = "\\" + segments.slice(0, -1).join("\\");
              const lastFolder = segments[segments.length - 1];
              await svnCommit(bisProjectPath.toString() + parentPath, lastFolder);
              break;
          }
        });
      }
      setCompleted(true);
    } catch {
      setFailed(true);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClose = () => {
    onClose();
    resetState();
  };

  const getStatusIcon = (status: Step['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'in-progress':
        return <ArrowPathIcon className="h-6 w-6 text-blue-500 animate-spin" />;
      default:
        return <div className="h-6 w-6 rounded-full border border-gray-300" />;
    }
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="800px"
      height="90vh"
    >
      <div className="space-y-4">
        <h2 className="text-xl font-bold">🚀 開始執行流程</h2>
        <div className="flex gap-4 h-[70vh]">
          {/* 左側流程 */}
          <div className="w-1/2 flex flex-col space-y-4 overflow-y-auto bg-white rounded border border-gray-200 p-4">
            {steps.map(step => (
              <div
                key={step.id}
                className={`flex items-center p-3 rounded-lg shadow-sm border 
                  ${step.status === 'success' ? 'border-green-300 bg-green-50' : ''}
                  ${step.status === 'error' ? 'border-red-300 bg-red-50' : ''}
                  ${step.status === 'in-progress' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}
              >
                {getStatusIcon(step.status)}
                <div className="ml-3 flex-1">
                  <p className="font-medium text-gray-800">{step.title}</p>
                  {step.status === 'in-progress' && (
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2 overflow-hidden">
                      <div className="bg-blue-500 h-1 animate-pulse w-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 按鈕 */}
            <div className="mt-auto space-y-2">
              {isRunning && (
                <button disabled className="px-4 py-2 bg-blue-600 text-white rounded w-full">
                  執行中...
                </button>
              )}
              {!isRunning && completed && (
                <button onClick={handleClose} className="px-4 py-2 bg-green-600 text-white rounded w-full">
                  關閉
                </button>
              )}
              {!isRunning && failed && (
                <>
                  <button onClick={runProcess} className="px-4 py-2 bg-yellow-500 text-white rounded w-full">
                    重試
                  </button>
                  <button onClick={handleClose} className="px-4 py-2 bg-gray-500 text-white rounded w-full">
                    關閉
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 右側 Log */}
          <div className="w-1/2 overflow-y-auto bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
            {steps
              .filter(s => s.log)
              .map(s => (
                <div key={s.id} className="mb-2">
                  {s.log}
                </div>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
