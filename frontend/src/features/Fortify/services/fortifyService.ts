import type { Files } from '../types.ts';

const COMPRESS_API_URL = 'http://localhost:3000/api/compress';
const SVN_API_URL = 'http://localhost:3000/api/svn';

export const compressToZip = async (Files: string[], CompressedDir: string, ZipType: string): Promise<Files> => {
  // API 路徑
  const response = await fetch(COMPRESS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ files: Files, compressedDir: CompressedDir, zipType: ZipType }), // 將 path 作為 JSON 傳遞
  });

  const data = await response.json();

  if (response.ok) {
    alert(`ZIP file created: ${data.zipName}`);
  } else {
    alert('Failed to compress files.');
    throw new Error('Failed to compress files.');
  }
  
  // 確保資料格式正確
  if (!data.files || !Array.isArray(data.files)) {
    throw new Error('Invalid data format: expected an object with a "files" array');
  }

  return data; // 返回完整的 Files 物件
};

export const svnUpdate = async (targetDir: string): Promise<any> => {
  // API 路徑
  const response = await fetch(`${SVN_API_URL}/svnUpdate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetDir: targetDir }),
  });

  if (!response.ok) {
    throw new Error(`${targetDir}`);
  }
  const data = await response.json();
  
  return data;
};

export const svnAdd = async (targetDir: string, addFilePath: string): Promise<any> => {
  // API 路徑
  const response = await fetch(`${SVN_API_URL}/svnAdd`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetDir: targetDir, addFilePath: addFilePath }),
  });

  if (!response.ok) {
    throw new Error(`${addFilePath}`);
  }
  const data = await response.json();
  
  return data;
};

export const svnCommit = async (targetDir: string, folderName: string): Promise<any> => {
  // API 路徑
  const response = await fetch(`${SVN_API_URL}/svnCommit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetDir: targetDir, folderName: folderName }),
  });

  if (!response.ok) {
    throw new Error(`${targetDir}/${folderName}`);
  }
  const data = await response.json();
  
  return data;
};