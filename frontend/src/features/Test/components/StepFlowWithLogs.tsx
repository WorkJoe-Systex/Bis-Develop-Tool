import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Step {
  id: number;
  title: string;
  status: 'pending' | 'in-progress' | 'success' | 'error';
  log: string;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const ProcessContent: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, title: 'SVN 更新專案目錄', status: 'pending', log: '' },
    { id: 2, title: '檢查檔案並建立資料夾', status: 'pending', log: '' },
    { id: 3, title: '合併 CSV 檔案', status: 'pending', log: '' },
    { id: 4, title: '產生 ZIP 檔案', status: 'pending', log: '' },
    { id: 5, title: 'SVN Commit 變更', status: 'pending', log: '' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const updateStep = (id: number, changes: Partial<Step>) => {
    setSteps(prev =>
      prev.map(step => (step.id === id ? { ...step, ...changes } : step))
    );
  };

  const runStep = async (id: number, action: () => Promise<void>) => {
    updateStep(id, { status: 'in-progress' });
    try {
      await action();
      updateStep(id, { status: 'success', log: `✅ ${steps[id - 1].title} 完成` });
    } catch (err) {
      updateStep(id, { status: 'error', log: `❌ ${steps[id - 1].title} 失敗: ${err instanceof Error ? err.message : String(err)}` });
      throw err;
    }
  };

  const runProcess = async () => {
    setIsRunning(true);
    setCompleted(false);
    let failed = false;

    for (const step of steps) {
      if (failed) break;
      try {
        await runStep(step.id, async () => {
          await delay(1200);
          if (step.id === 2) {
            const noData = false;
            if (noData) throw new Error('目錄中沒有檔案');
          }
        });
      } catch {
        failed = true;
      }
    }

    setIsRunning(false);
    if (!failed) setCompleted(true);
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
        <div className="mt-auto">
          {!completed ? (
            <button
              onClick={runProcess}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 w-full"
            >
              {isRunning ? '執行中...' : '開始'}
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
            >
              重新整理
            </button>
          )}
        </div>
      </div>

      {/* 右側 Log */}
      <div className="w-1/2 overflow-y-auto bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
        {steps
          .filter(s => s.log)
          .map(s => (
            <div key={s.id} className="mb-2">
              {s.log}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProcessContent;
