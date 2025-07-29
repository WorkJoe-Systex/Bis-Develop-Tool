import { Files, UserInfo } from '../types';

const COMPRESS_API_URL = 'http://localhost:3000/api/compress';
const USER_API_URL = 'http://localhost:3000/api/user';

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
  }

  
  // 確保資料格式正確
  if (!data.files || !Array.isArray(data.files)) {
    throw new Error('Invalid data format: expected an object with a "files" array');
  }

  return data; // 返回完整的 Files 物件
};

export const queryUSERINFO = async (url: string): Promise<UserInfo> => {
  const response = await fetch(`${USER_API_URL}${url}`); // API 路徑

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch UserInfo');
  }

  const data = await response.json();
  return data;
}

export const updatePathType = async (compressedDir: string, zipType: string) => {
  // `fetch`發送HTTP請求至後端，並接收response
  // `await`關鍵字，表示等待 fetch 操作完成，然後將結果賦值給 response 變數
  const response = await fetch(USER_API_URL + `/admin`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ compressedDir, zipType }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error: ${errorData.error}`);
  }
};