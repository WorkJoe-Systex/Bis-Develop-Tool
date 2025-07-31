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

  return (
    <form onSubmit={sendTiTotaParse} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Tita Str</label>
          <input
              type="text"
              id="TitaStr"
              name="TitaStr"
              className="w-full border rounded px-3 py-2"
              value={titaStr}
              onChange={(e) => setTitaStr(e.target.value)}
              placeholder="Enter Tita Str"
          />
        </div>
        <div>
          <label className="block font-medium">Tota Str</label>
          <input
            type="text"
            id="TotaStr"
            name="TotaStr"
            className="w-full border rounded px-3 py-2"
            value={totaStr}
            onChange={(e) => setTotaStr(e.target.value)}
            placeholder="Enter Tota Str"
          />
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block font-medium">Tota Name:</label>
            <input
              type="text"
              id="TotaName"
              name="TotaName"
              className="border rounded px-3 py-2"
              value={totaName}
              onChange={(e) => setTotaName(e.target.value)}
              placeholder="Enter Tota Name"
            />
          </div>
          {/* 保留 future 擴充用 */}
        </div>
        {/* 送出按鈕 */}
        <div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            XMT
          </button>
        </div>
      </div>

      {/* 顯示 API 回傳結果 */}
      <div className="space-y-8">
        {/* <h2>JSON Response</h2>
        <pre>{result ? JSON.stringify(result, null, 2) : 'No data yet'}</pre> */}
        <div>
          <h3 className="text-md font-semibold mb-2">解析結果 - Tita</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">欄位名稱</th>
                  <th className="px-4 py-2 border">說明</th>
                  <th className="px-4 py-2 border">型別</th>
                  <th className="px-4 py-2 border">長度</th>
                  <th className="px-4 py-2 border">值</th>
                </tr>
              </thead>
              <tbody>
                {result.Tita?.res?.length > 0 ? (
                  result.Tita.res.map((item, index) => (
                    <tr key={index} className="even:bg-gray-50">
                      <td className="px-4 py-2 border">{item.name}</td>
                      <td className="px-4 py-2 border">{item.desc}</td>
                      <td className="px-4 py-2 border">{item.type}</td>
                      <td className="px-4 py-2 border">{item.maxLen}</td>
                      <td className="px-4 py-2 border">
                        <input
                          type="text"
                          value={item.value}
                          className="w-full border px-2 py-1"
                          readOnly
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-2 border">
                      無資料
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-2">解析結果 - Tota</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">欄位名稱</th>
                  <th className="px-4 py-2 border">說明</th>
                  <th className="px-4 py-2 border">型別</th>
                  <th className="px-4 py-2 border">長度</th>
                  <th className="px-4 py-2 border">值</th>
                </tr>
              </thead>
              <tbody>
                {result.Tota?.res?.length > 0 ? (
                  result.Tota.res.map((item, index) => (
                    <tr key={index} className="even:bg-gray-50">
                      <td className="px-4 py-2 border">{item.name}</td>
                      <td className="px-4 py-2 border">{item.desc}</td>
                      <td className="px-4 py-2 border">{item.type}</td>
                      <td className="px-4 py-2 border">{item.maxLen}</td>
                      <td className="px-4 py-2 border">
                        <input
                          type="text"
                          value={item.value}
                          className="w-full border px-2 py-1"
                          readOnly
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-2 border">
                      無資料
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ParserPage;
