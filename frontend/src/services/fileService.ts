import type { Files } from '../types/types.ts';

const FILE_API_URL = 'http://localhost:3000/api/files';

export const searchFiles = async (targetPath: string, fileType: string): Promise<Files> => {
  const response = await fetch(`${FILE_API_URL}/getFiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetPath: targetPath, fileType: fileType }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch files');
  }

  const data = await response.json();
  
  // 確保資料格式正確
  if (!data.files || !Array.isArray(data.files)) {
    throw new Error('Invalid data format: expected an object with a "files" array');
  }

  return data; // 返回完整的 Files 物件
};

export const mergeCSV = async (files: string[], fileName: string, csvName: string): Promise<any> => {
  const response = await fetch(`${FILE_API_URL}/mergeCSV`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: files, fileName: fileName, csvName: csvName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to merge CSV');
  }
  const data = await response.json();
  
  return data;
};

export const moveFiles = async (startDir: string, endDir: string): Promise<any> => {
  const response = await fetch(`${FILE_API_URL}/moveFiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDir: startDir, endDir: endDir }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to move files');
  }
  const data = await response.json();

  return data; // 返回完整的 Files 物件
};

export const genFile = async (fileName: string, fileDir: string): Promise<any> => {
  const response = await fetch(`${FILE_API_URL}/genFile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: fileName, fileDir: fileDir }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to generate file');
  }
  const data = await response.json();

  return data; // 返回完整的 Files 物件
};