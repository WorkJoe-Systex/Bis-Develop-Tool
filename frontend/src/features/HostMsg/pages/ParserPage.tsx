import React, { useEffect, useState } from 'react';
import { parseTiTotaData } from '../services/parserService';
import type { TiTota } from '../types';

const ParserPage: React.FC = () => {
  const [titaStr, setTitaStr] = useState('');
  const [totaStr, setTotaStr] = useState('');
  const [totaName, setTotaName] = useState('');
  const [totaHeader, setTotaHeader] = useState('');

  // 用 default 空陣列與物件初始化，避免 null 問題
  const [result, setResult] = useState<TiTota>({
    Tita: { res: [] },
    Tota: { res: [] },
    success: false
  });

  const sendTiTotaParse = async (e: React.FormEvent) => {
    e.preventDefault();

    let methodCode = ''

    // submit 檢核
    if (titaStr.trim() !== '' && totaStr.trim() !== '' ) {
      methodCode = 'TiTota';
    } else if (titaStr.trim() === '' && totaStr.trim() !== '' && totaName.trim() !== '' && totaHeader.trim() !== '') {
      methodCode = 'Tota';
    } else {
      alert('資料有誤請確認後重新輸入');
      return;
    }

    // 構建 PUT 請求
    try {
      const data = await parseTiTotaData(titaStr, totaStr, totaName, '', methodCode);
      setResult(data);
      console.log(`Parsed:${result}`);
    } catch (error) {
      alert('Failed to parse.');
      console.error('Parse Error:', error);
    }
  };

  // 在畫面載入時執行資料查詢
  useEffect(() => {
  }, []); // 當組件載入時調用

  return (
    <form onSubmit={sendTiTotaParse}>
      <div>
       <label>Tita Str:</label>
       <input
          type="text"
          id="TitaStr"
          name="TitaStr"
          style={{ width: '700px' }}
          value={titaStr}
          onChange={(e) => setTitaStr(e.target.value)}
          placeholder="Enter Tita Str"
       />
      </div>
      <div>
        <label>Tota Str:</label>
        <input
          type="text"
          id="TotaStr"
          name="TotaStr"
          style={{ width: '700px' }}
          value={totaStr}
          onChange={(e) => setTotaStr(e.target.value)}
          placeholder="Enter Tota Str"
        />
      </div>
      <div>
        <label>Tota Name:</label>
        <input
          type="text"
          id="TotaName"
          name="TotaName"
          style={{ width: '200px' }}
          value={totaName}
          onChange={(e) => setTotaName(e.target.value)}
          placeholder="Enter Tota Name"
        />
      </div>
      {/* 顯示 API 回傳結果 */}
      <div>
        {/* <h2>JSON Response</h2>
        <pre>{result ? JSON.stringify(result, null, 2) : 'No data yet'}</pre> */}
        <h2>解析結果 - Tita</h2>
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr>
              <th>欄位名稱</th>
              <th>說明</th>
              <th>型別</th>
              <th>長度</th>
              <th>值</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(result?.Tita?.res) && result.Tita.res.length > 0 ? (
              result.Tita.res.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.desc}</td>
                  <td>{item.type}</td>
                  <td>{item.maxLen}</td>
                  <td>
                    <input
                      type="text"
                      value={item.value}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>無資料</td>
              </tr>
            )}
          </tbody>
        </table>

        <h2>解析結果 - Tota</h2>
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr>
              <th>欄位名稱</th>
              <th>說明</th>
              <th>型別</th>
              <th>長度</th>
              <th>值</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(result?.Tota?.res) && result.Tota.res.length > 0 ? (
              result.Tota.res.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.desc}</td>
                  <td>{item.type}</td>
                  <td>{item.maxLen}</td>
                  <td>
                    <input
                      type="text"
                      value={item.value}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>無資料</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 送出按鈕 */}
      <div>
        <button type="submit">XMT</button>
      </div>
    </form>
  );
};

export default ParserPage;
