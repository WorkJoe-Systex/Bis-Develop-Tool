import { cpHelper } from './utils/compressHelper';
import { ZipFiles } from '../types';
import archiver from 'archiver';
import iconv from 'iconv-lite';
import path from "path";
import fs from 'fs';
import { getUniqueFileName } from './fileService';

/**
 * 重複檔案
 */
let REPEAT_FILE: string[] = [];
let ADD_FILE: string[] = [];
let UPD_FILE: string[] = [];
let DEL_FILE: string[] = [];

/**
 * 解析.csv壓縮成.zip
 * @param zipName
 * @param funType 功能類型 VCS or VS
 * @param csvPath .csv檔的目錄
 * @param files .csv檔案名稱
 * @param pathType 路徑類型 SVN or DEV
 * @param zipType 壓縮類型 有結構 or 無結構
 * @returns 
 */
export const compressFilesService = async (zipName: string, funType: string, csvPath: string, files: string[], pathType: string, zipType: string): Promise<ZipFiles> => {
  /**
   * CSV 目標目錄
   */
  const TARGET_DIR = csvPath + '\\'; // 取CSV目標路徑

  /**
   * 壓縮檔案的輸出目錄
   */
  const OUTPUT_DIR = path.join(TARGET_DIR, 'archive'); // 壓縮檔案的輸出目錄
  let ZIP_FILENAME = '';
  if (funType === 'VCS') {
    ZIP_FILENAME = await getUniqueFileName(OUTPUT_DIR, path.basename(files[0], path.extname(files[0])) + '.zip');
  } else if (funType === 'VS') {
    ZIP_FILENAME = await getUniqueFileName(OUTPUT_DIR, path.basename(zipName) + '.zip');
  }
  
  console.log(`OUTPUT_DIR:${OUTPUT_DIR}`);
  cpHelper.ensureDir('outPut', OUTPUT_DIR);
  
  // 母版路徑
  const {AP_APP, AP_WEB, AP_JAVA, BH_WEB, BH_JAVA} = await cpHelper.getAllPath();
  // 檔案類型
  const {appCheck, javaCheck,  webAppCheck,  platformCheck} = await cpHelper.getFileType();

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
        const filePaths = await cpHelper.parseCSV(content); // 解析 CSV 檔案
        
        // **新增：打印每個 CSV 檔案的完整內容**
        // console.log(`\n========== Parsed CSV Data (${file}): ==========\n`);
        // console.log(JSON.stringify(filePaths, null, 2)); // 以 JSON 格式打印解析結果

        for (const data of filePaths) {
          const txcode = data.txcode.trim(); // 交易代號
          const fileType = data.fileType.trim(); // 檔案類型
          const actionType = data.actionType.trim(); // 新增;刪除;更新
          const server = data.server.trim();
          const source = data.source.trim();
            
          let dataPath = ''; // 檔案的來源路徑
          let compressPath = ''; // 設定壓縮包內的目錄結構

          if (server === 'AP') {
            if (fileType === 'A' && appCheck.includes(path.extname(source))) {
              dataPath = await cpHelper.genDataPath(pathType, 'app', source);
              compressPath = await cpHelper.genCompressPath(zipType, AP_APP, source);
            } else if (fileType === 'J' && javaCheck.includes(path.extname(source))) {
              dataPath = await cpHelper.genDataPath(pathType, 'java', source);
              compressPath = await cpHelper.genCompressPath(zipType, AP_JAVA, path.basename(source));
            } else if ((fileType === 'R' || fileType === 'H' || fileType === 'O') && webAppCheck.includes(path.extname(source))) {
              dataPath = await cpHelper.genDataPath(pathType, 'web', source);
              compressPath = await cpHelper.genCompressPath(zipType, AP_WEB, source);
            }
          }
  
          if (server === 'BH') {
            if (fileType === 'J' && javaCheck.includes(path.extname(source))) {
              dataPath = await cpHelper.genDataPath(pathType, 'java', source);
              compressPath = await cpHelper.genCompressPath(zipType, BH_JAVA, path.basename(source));
            } else if ((fileType === 'R' || fileType === 'H' || fileType === 'O') && webAppCheck.includes(path.extname(source))) {
              dataPath = await cpHelper.genDataPath(pathType, 'web', source);
              compressPath = await cpHelper.genCompressPath(zipType, BH_WEB, source);
            }
          }
  
          if (server === 'PF' && fileType === 'P' && javaCheck.includes(path.extname(source))) {
            dataPath = await cpHelper.genDataPath(pathType, txcode, source);
            compressPath = await cpHelper.genCompressPath(zipType, 'platform/' + txcode, source);
          }

          if (!await checkRepeatSource(actionType, server, fileType, compressPath)) {
            if (fs.existsSync(dataPath)) {
              // 添加檔案到壓縮檔中
              // dataPath 是檔案的來源路徑
              // { name: path.basename(file) } 指定壓縮檔內的檔名（使用原檔案名）
              // name 傳入名稱則無結構目錄，若傳入字串還結構目錄，則壓縮檔內涵資料夾結構
              archive.file(dataPath, { name: compressPath });
            } else {
              // 若檔案不存在或不是 .csv 格式，則輸出警告訊息。
              console.warn(`File not found: ${source}`);
            }
          } else {
            // 若檔案重複，則輸出警告訊息。
            console.warn(`File is repeat: ${source}`);
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
  }
}

/**
 * 確認source是否重複
 * @param actionType  // 新增;刪除;更新
 * @param server 
 * @param fileType 
 * @param compressPath 
 * @returns 
 */
const checkRepeatSource = async (actionType: string, server: string, fileType: string, compressPath: string) => {
  let repeatFlag: boolean = false;
  let source = '';

  switch(actionType) {
    case'A' :
      source = server.toLowerCase() + ',' + compressPath;
      
      if (ADD_FILE.length === 0 || !ADD_FILE.includes(source)) {
        ADD_FILE.push(source);
        repeatFlag = false;
      }
      if (UPD_FILE.includes(source)) {
        REPEAT_FILE.push(source);
        repeatFlag = true;
      } else {
        repeatFlag = false;
      }
      break;
    case'U' :
      source = server.toLowerCase() + ',' + compressPath;

      if (UPD_FILE.length === 0 || !UPD_FILE.includes(source)) {
        UPD_FILE.push(source);
        repeatFlag = false;
      }
      if (ADD_FILE.includes(source)) {
        REPEAT_FILE.push(source);
        repeatFlag = true;
      } else {
        repeatFlag = false;
      }
      break;
    case'D' :
      source = server.toLowerCase() + ',' + actionType.toUpperCase() + ',' + fileType.toUpperCase() + ',' + compressPath;

      if (DEL_FILE.length === 0 || 
          !DEL_FILE.includes(server.toLowerCase() + ',' + actionType.toUpperCase() + ',' + fileType.toUpperCase() + ',' + compressPath)) {
        DEL_FILE.push(server.toLowerCase() + ',' + actionType.toUpperCase() + ',' + fileType.toUpperCase() + ',' + compressPath);
        repeatFlag =  false;
      } else {
        REPEAT_FILE.push(source);
        repeatFlag = true;
      }
      break;
  }
  return repeatFlag
}
