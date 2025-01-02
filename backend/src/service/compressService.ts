import * as pathModel from '../models/pathModel';
import * as typeModel from '../models/typeModel';
import { Files } from '.././types';
import archiver from 'archiver';
import iconv from 'iconv-lite';
import Papa from 'papaparse';
import path from "path";
import fs from 'fs';

/**
 * 壓縮檔案的輸出目錄
 */
let OUTPUT_DIR: any;

/**
 * CSV 目標目錄
 */
let TARGET_DIR: any;

/**
 * Jbranch 目錄
 */
let JBRANCH_DIR: any;

/**
 * 重複檔案
 */
let REPEAT_FILE: string[] = [];
let ADD_FILE: string[] = [];
let UPD_FILE: string[] = [];
let DEL_FILE: string[] = [];

// 母版路徑
let AP_APP: string = '';
let AP_WEB: string = '';
let AP_JAVA: string = '';
let BH_WEB: string = '';
let BH_JAVA: string = '';

// 檔案類型
const appCheck: Array<String> = [];
const javaCheck: Array<String> = [];
const webAppCheck: Array<String> = [];
const platformCheck: Array<String> = [];

// 程式路徑
const pathApp: string = "/client/bis-app";
const pathJava: string = "/transaction";
const pathWebApp: string = "/systex-app-bis-web";

/**
 * 檢查目錄是否存在
 */
const ensureDir = (type: string, directory: string) => {
  // 檢查 OUTPUT_DIR 資料夾是否存在
  if (type === 'outPut' && !fs.existsSync(directory)) {
    fs.mkdirSync(directory); // 若資料夾不存在，同步建立該目錄
  }
};

/**
 * @param csvContent 
 * 解析CSV
 */
const parseCSV = (csvContent: string): Promise<{ txcode: string; fileType: string; actionType: string; server: string; source: string; }[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true, // 將 CSV 第一行作為標頭
      skipEmptyLines: true, // 忽略空行
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
          return;
        } else {
          // 將每一行轉換為目標格式
          const filePaths = results.data.map((row: any) => {
            return {
              txcode: row['相關交易代號'],
              fileType: row['類型'],
              actionType: row['屬性'],
              server: row['系統'],
              source: row.source,
            };
          });

          resolve(filePaths);
        }
      },
    });
  });
};

/**
 * 取DB路徑
 */
const getAllPath = async (): Promise<void> => {
  const allAPPath = await pathModel.getPathByServerType('ap');
  const allBHPath = await pathModel.getPathByServerType('bh');

  for (const data of allAPPath) {
    if (data.serverType === 'ap') {
      if (data.name === 'app') {
        AP_APP = data.path;
      } else if (data.name === 'web') {
        AP_WEB = data.path;
      } else if (data.name === 'java') {
        AP_JAVA = data.path;
      }
    }
  }

  for (const data of allBHPath) {
    if (data.serverType === 'bh') {
      if (data.name === 'web') {
        BH_WEB = data.path;
      } else if (data.name === 'java') {
        BH_JAVA = data.path;
      }
    }
  }
}

/**
 * 取檔案類型
 */
const getFileType = async (): Promise<void> => {
  const fileType = await typeModel.getFileType();
  for (const x of fileType) {
    if (x.name === 'app') {
      appCheck.push(x.fileType);
    } else if (x.name === 'java') {
      javaCheck.push(x.fileType);
    } else if (x.name === 'webapp') {
      webAppCheck.push(x.fileType);
    } else if (x.name === 'platform') {
      platformCheck.push(x.fileType);
    }
  }
}

/**
 * 取platform路徑
 */
const getPlatform = async (txcode: string): Promise<string> => {
  const localPF = await pathModel.getPath('local', txcode);
  return localPF[0].path;
}

/**
 * 確認source是否重複
 * @param actionType  // 新增;刪除;更新
 * @param server 
 * @param fileType 
 * @param compressPath 
 * @returns 
 */
const checkRepeatSource = async (actionType: string, server: string, fileType: string, compressPath: string): Promise<boolean> => {
  let source = '';

  switch(actionType) {
    case'A' :
      source = server.toLowerCase() + ',' + compressPath;
      
      if (ADD_FILE.length === 0 || !ADD_FILE.includes(source)) {
        ADD_FILE.push(source);
      } else if (UPD_FILE.includes(source)) {
        REPEAT_FILE.push(source);
        return false;
      } else {
        return false;
      }
      break;
    case'U' :
      source = server.toLowerCase() + ',' + compressPath;

      if (UPD_FILE.length === 0 || !UPD_FILE.includes(source)) {
        UPD_FILE.push(source);
      } else if (ADD_FILE.includes(source)) {
        REPEAT_FILE.push(source);
        return false;
      } else {
        return false;
      }
      break;
    case'D' :
      source = server.toLowerCase() + ',' + actionType.toUpperCase() + ',' + fileType.toUpperCase() + ',' + compressPath;

      if (DEL_FILE.length === 0 || 
          !DEL_FILE.includes(server.toLowerCase() + ',' + actionType.toUpperCase() + ',' + fileType.toUpperCase() + ',' + compressPath)) {
        DEL_FILE.push(server.toLowerCase() + ',' + actionType.toUpperCase() + ',' + fileType.toUpperCase() + ',' + compressPath);
      } else {
        REPEAT_FILE.push(source);
        return false;
      }
      break;
  }
  return true;
}

/**
 * 生成唯一檔案名稱
 * @param dir 目標目錄
 * @param filename 初始檔案名稱
 * @returns 唯一的檔案名稱
 */
async function getUniqueFileName(dir: string, filename: string): Promise<string> {
  const ext = path.extname(filename); // 檔案副檔名
  const baseName = path.basename(filename, ext); // 檔案名稱（不含副檔名）
  let uniqueName = filename; // 預設為原始檔名
  let counter = 1;

  // 檢查目標名稱是否已存在
  while (true) {
    const filePath = path.join(dir, uniqueName);
    try {
      await fs.promises.access(filePath); // 如果檔案存在，不會拋出例外
      uniqueName = `${baseName} (${counter})${ext}`; // 生成新的名稱
      counter++;
    } catch {
      // 檔案不存在，跳出迴圈
      break;
    }
  }
  return uniqueName;
}

export const compressFilesService = async (files: string[], csvName: string): Promise<Files> => {
  JBRANCH_DIR = (await pathModel.getPath('local', 'jbranch'))[0].path; // 取Jbranch路徑
  TARGET_DIR = (await pathModel.getPath('local', 'target'))[0].path; // 取CSV目標路徑
  OUTPUT_DIR = path.join(TARGET_DIR, 'archive'); // 壓縮檔案的輸出目錄
  const ZIP_FILENAME = await getUniqueFileName(OUTPUT_DIR, path.basename(csvName, path.extname(csvName)) + '.zip');
  console.log(`OUTPUT_DIR:${OUTPUT_DIR}`);

  ensureDir('outPut', OUTPUT_DIR);
  await getAllPath();
  await getFileType();

  // zipFilePath：表示即將建立的 ZIP 壓縮檔案的路徑。
  const zipFilePath = path.join(OUTPUT_DIR, ZIP_FILENAME);
  const output = fs.createWriteStream(zipFilePath); // 建立寫入流，將 ZIP 檔案的資料寫入 zipFilePath

  // 使用 archiver 套件建立一個 ZIP 壓縮器。
  // 'zip'：指定壓縮格式為 ZIP。
  // { zlib: { level: 9 } }：設定壓縮等級為最高 (0 是最快但壓縮最少，9 是最慢但壓縮最多)。
  const archive = archiver('zip', { zlib: { level: 9 } });

  // 監聽壓縮檔案寫入流關閉事件。 當寫入完成時，會觸發這個事件。
  output.on('close', () => {
    console.log(`ZIP file created: ${zipFilePath}`);
  });

  // 監聽壓縮過程中的錯誤事件。
  archive.on('error', (err: any) => {
    console.error('Error in archiver:', err);
  });

  // 將 archiver 的輸出資料流連接到 output 寫入流，實現壓縮後的資料直接寫入 ZIP 檔案。
  archive.pipe(output);

  // ------------------------------  處理 CSV 檔案 ------------------------------ 
  for (const file of files) {
    const csvFilePath = path.join(TARGET_DIR + file); // csv路徑

    // fs.existsSync(absolutePath)：檢查檔案是否存在。
    // absolutePath.endsWith('.csv')：檢查檔案是否為 .csv 格式。
    if (fs.existsSync(csvFilePath) && csvFilePath.endsWith('.csv')) {
      try {
        const contentBuffer = fs.readFileSync(csvFilePath); // 讀取 CSV 檔案內容並解碼
        const content = iconv.decode(contentBuffer, 'big5'); // 轉碼
        const filePaths = await parseCSV(content); // 解析 CSV 檔案
        
        // **新增：打印每個 CSV 檔案的完整內容**
        // console.log(`\n========== Parsed CSV Data (${file}): ==========\n`);
        // console.log(JSON.stringify(filePaths, null, 2)); // 以 JSON 格式打印解析結果

        for (const data of filePaths) {
          const txcode = data.txcode.trim(); // 交易代號
          const fileType = data.fileType.trim(); // 檔案類型
          const actionType = data.actionType.trim(); // 新增;刪除;更新
          const server = data.server.trim();
          const source = data.source.trim();
            
            let dataPath = '';
            let compressPath = ''; // 設定壓縮包內的目錄結構

            if (server === 'AP') {
              if (fileType === 'A' && appCheck.includes(path.extname(source))) {
                dataPath = path.join(JBRANCH_DIR, pathApp, source);
                compressPath = path.join(AP_APP, source);
              } else if (fileType === 'J' && javaCheck.includes(path.extname(source))) {
                dataPath = path.join(JBRANCH_DIR, pathJava, source);
                compressPath = path.join(AP_JAVA, path.basename(source));
              } else if ((fileType === 'R' || fileType === 'H' || fileType === 'O') && webAppCheck.includes(path.extname(source))) {
                dataPath = path.join(JBRANCH_DIR, pathWebApp, source);
                compressPath = path.join(AP_WEB, source);
              }
            }
  
            if (server === 'BH') {
              if (fileType === 'J' && javaCheck.includes(path.extname(source))) {
                dataPath = path.join(JBRANCH_DIR, pathJava, source);
                compressPath = path.join(BH_JAVA, path.basename(source));
              } else if ((fileType === 'R' || fileType === 'H' || fileType === 'O') && webAppCheck.includes(path.extname(source))) {
                dataPath = path.join(JBRANCH_DIR, pathWebApp, source);
                compressPath = path.join(BH_WEB, source);
              }
            }
  
            if (server === 'PF' && fileType === 'P' && javaCheck.includes(path.extname(source))) {
              dataPath = path.join(JBRANCH_DIR, await getPlatform(txcode), source);
              compressPath = path.join('platform/', txcode, source);
            }

          if (await checkRepeatSource(actionType, server, fileType, compressPath)) {
            if (fs.existsSync(dataPath)) {
              // 添加檔案到壓縮檔中
              // dataPath 是檔案的來源路徑
              // { name: path.basename(file) } 指定壓縮檔內的檔名（使用原檔案名）
              archive.file(dataPath, { name: compressPath });
            } else {
              // 若檔案不存在或不是 .csv 格式，則輸出警告訊息。
              console.warn(`File not found: ${source}`);
            }
          }
        };
      } catch (err) {
        console.error(`Failed to process CSV: ${csvFilePath}`, err);
      }
    } else {
      // 若檔案不存在或不是 .csv 格式，則輸出警告訊息。
      console.warn(`File not found or not a .csv: ${csvFilePath}`);
    }
  }

  // 結束壓縮流程，將所有檔案添加到壓縮包，並開始寫入輸出流。
  archive.finalize();
  return {
    files: [''],
    zipPath: zipFilePath,
    zipName: ZIP_FILENAME,
    delList: DEL_FILE
  };
};
