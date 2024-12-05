import { User } from '../types';

const API_URL = 'http://localhost:3000/api/users';

// 異步函數：可以讓你在等待異步操作完成的同時不會阻塞程式的其他部分，通過 async 和 await 來實現
// Promise：是 JavaScript 用來處理異步操作的標準，代表一個尚未完成的操作，會返回一個結果或錯誤
// then()：處理 Promise 成功的情況。
// catch()：處理 Promise 失敗的情況。
// finally()：無論 Promise 成功或失敗，最終都會執行的回呼函數。

// `async`表示該參數為"異步函數"
export const fetchUsers = async (): Promise<User[]> => {
  // `fetch`發送HTTP請求至後端，並接收response
  // `await`關鍵字，表示等待 fetch 操作完成，然後將結果賦值給 response 變數
  const response = await fetch(API_URL); // API 路徑

  // `response.json()` 方法將 response 物件中的 JSON 內容解析為 JavaScript 對象。該操作為異步的，因此需要 await 來等待結果。
  const data = await response.json();

  // 確認返回的數據是否為陣列
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format: expected an array');
  }
  return data;
};  

// `async`:異步函數、接收 name 字串參數
export async function addUser(name: string) {

  // `fetch`函數發送一個 POST 請求到後端
  await fetch(API_URL, {
    method: 'POST',

    // 設置請求標頭，告訴伺服器我們發送的是 JSON 格式的數據
    headers: { 'Content-Type': 'application/json' },

    // `JSON.stringify`用來將 JavaScript 對象轉換為 JSON 字串
    body: JSON.stringify({ name }),
  });
}

// `async`:異步函數、接收 id 參數，表示要刪除的用戶 ID
export async function deleteUser(id: number) {
   // `fetch`函數發送一個 DELETE 請求到後端
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}
