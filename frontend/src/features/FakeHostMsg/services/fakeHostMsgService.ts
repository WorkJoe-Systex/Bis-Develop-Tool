import { HostMsg } from '../types';

const API_URL = 'http://localhost:3000/api/hostMsg';

export const qryAllHostMsg = async (): Promise<HostMsg[]> => {
  const response = await fetch(`${API_URL}/qryHostMsg`); // API 路徑

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch HostMsg');
  }
  const data = await response.json();

  return data.hostMsg;
}

export const updateHostMsgStatus = async (hostMsg: HostMsg) => {
  const response = await fetch(`${API_URL}/updateHostMsg/${hostMsg.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hostMsg }),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === 409) {
      alert('檔案已存在，請確認是否要覆蓋');
    } else if (response.status === 404) {
      alert('檔案不存在，無法刪除');
    } else {
      alert(result.error || '操作失敗');
    }
    // 拋出錯誤以便上層處理（例如重新整理等）
    throw new Error(result.error || 'Failed to update HostMsg');
  }

  return result;
}
