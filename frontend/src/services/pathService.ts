const API_URL = 'http://localhost:3000/api/path';

// 異步函數：可以讓你在等待異步操作完成的同時不會阻塞程式的其他部分，通過 async 和 await 來實現
// Promise：是 JavaScript 用來處理異步操作的標準，代表一個尚未完成的操作，會返回一個結果或錯誤
// then()：處理 Promise 成功的情況。
// catch()：處理 Promise 失敗的情況。
// finally()：無論 Promise 成功或失敗，最終都會執行的回呼函數。

// `async`表示該參數為"異步函數"
<<<<<<< HEAD
export const fetchPath = async (serverType: string, name: string): Promise<Path[]> => {
=======
export const fetchPath = async (serverType: string, name: string): Promise<String> => {
>>>>>>> main
  // `fetch`發送HTTP請求至後端，並接收response
  // `await`關鍵字，表示等待 fetch 操作完成，然後將結果賦值給 response 變數
  const response = await fetch(API_URL + `/${serverType}/${name}`); // API 路徑

  // `response.json()` 方法將 response 物件中的 JSON 內容解析為 JavaScript 對象。該操作為異步的，因此需要 await 來等待結果。
  const data = await response.json();

  // 確認返回的數據是否為陣列
  // if (!Array.isArray(data)) {
  //   throw new Error('Invalid data format: expected an array');
  // }
  return data;
};

export const updateTargetPath = async (serverType: string, name: string, path: string) => {
  // `fetch`發送HTTP請求至後端，並接收response
  // `await`關鍵字，表示等待 fetch 操作完成，然後將結果賦值給 response 變數
   // API 路徑
  const response = await fetch(API_URL + `/${serverType}/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path }), // 將 path 作為 JSON 傳遞
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error: ${errorData.error}`);
  }

  return await response.json();
};  

