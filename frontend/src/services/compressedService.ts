import { Files } from '../types';

const API_URL = 'http://localhost:3000/api/compress';
const FILE_API_URL = 'http://localhost:3000/api/files';

export const searchFiles = async (url: string): Promise<Files> => {
  const response = await fetch(`${FILE_API_URL}${url}`); // API 路徑

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

export const compressToZip = async (Files: string[], csvName: string): Promise<Files> => {
  // API 路徑
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ files: Files, csvName: csvName }), // 將 path 作為 JSON 傳遞
  });

  const data = await response.json();

  if (response.ok) {
    alert(`ZIP file created: ${data.zipName}`);
  } else {
    alert('Failed to compress files.');
  }

  
  // 確保資料格式正確
  if (!data.files || !Array.isArray(data.files)) {
    throw new Error('Invalid data format: expected an object with a "files" array');
  }

  return data; // 返回完整的 Files 物件
};
