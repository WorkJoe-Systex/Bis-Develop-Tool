import * as pathModel from '../../models/pathModel';
import * as typeModel from '../../models/typeModel';
import Papa from 'papaparse';
import path from "path";
import fs from 'fs';

/**
 * 檢查目錄是否存在
 */
const ensureDir = (type: string, directory: string) => {
  // 檢查 OUTPUT_DIR 資料夾是否存在
  if (type === 'outPut' && !fs.existsSync(directory)) {
    fs.mkdirSync(directory); // 若資料夾不存在，同步建立該目錄
  }
}

/**
 * 產生取檔目標路徑
 * @param compressedDir 取檔類型 DEV | SVN
 * @param fileType 
 * @param source .csv source路徑
 */
const genDataPath = async (compressedDir: string, fileType: string, source: string): Promise<string> => {
  let dataPath = '';
  if (compressedDir === 'SVN') {
    const JBRANCH_DIR = await getSourcePath(compressedDir, 'jbranch'); // 取Jbranch路徑
    const FILETYPE_DIR = await getSourcePath(compressedDir, fileType); // 取檔案類型路徑
    dataPath = path.join(JBRANCH_DIR, FILETYPE_DIR, source);
  } else if (compressedDir === 'DEV') {
    const DEV_DIR = await getSourcePath(compressedDir, 'dev-dir'); // 取DEV路徑
    const FILETYPE_DIR = await getSourcePath(compressedDir, fileType); // 取檔案類型路徑

    if (fileType === 'java' || fileType === 'batch') {
      const match = source.match(/(\\src\\.*)/); // 正則 for java source path
      const slicePath = match ? match[1] : null;
      if (slicePath) {
        dataPath = path.join(DEV_DIR, FILETYPE_DIR, slicePath);
      } else {
        // 無法解析路徑時，拋錯或設定預設值
        throw new Error(`無法從 ${source} 擷取 /src 路徑`);
      }
    } else {
      dataPath = path.join(DEV_DIR, FILETYPE_DIR, source);
    }
  }
  return dataPath;
}

/**
 * 產生壓縮檔中的目錄結構
 * @param zipType 
 * @param fileType 
 * @param source 
 */
const genCompressPath = async (zipType: string, dirPath: string, source: string): Promise<string> => {
  let CompressPath = '';
  if (zipType === 'DEV') {
    CompressPath = path.join(dirPath, source);
  } else if (zipType === 'NOFILE') {
    CompressPath = path.basename(source);
  }
  return CompressPath;
}

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
            }
          });

          resolve(filePaths);
        }
      },
    });
  });
}

// -------------------------------------------- DataBase star --------------------------------------------
/**
 * 取得取檔路徑
 */
const getSourcePath = async (serverType: string, name: string): Promise<string> => {
  const res = await pathModel.getPath(serverType, name);
  return res[0].path;
}

/**
 * 取DB路徑
 */
const getAllPath = async () => {
  const allAPPath = await pathModel.getPathByServerType('ap');
  const allBHPath = await pathModel.getPathByServerType('bh');
  // 母版路徑
  let AP_APP: string = '';
  let AP_WEB: string = '';
  let AP_JAVA: string = '';
  let BH_WEB: string = '';
  let BH_JAVA: string = '';

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
  return {
    AP_APP,
    AP_WEB,
    AP_JAVA,
    BH_WEB,
    BH_JAVA
  }
}

/**
 * 取檔案類型
 */
const getFileType = async () => {
  const fileType = await typeModel.getFileType();
  // 檔案類型
  let appCheck: Array<String> = [];
  let javaCheck: Array<String> = [];
  let webAppCheck: Array<String> = [];
  let platformCheck: Array<String> = [];

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
  return {
    appCheck,
    javaCheck,
    webAppCheck,
    platformCheck
  }
}
// -------------------------------------------- DataBase end --------------------------------------------

export const cpHelper = {
  parseCSV,
  ensureDir,
  getAllPath,
  getFileType,
  genDataPath,
  genCompressPath,
}