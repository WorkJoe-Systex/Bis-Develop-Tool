import * as pathModel from '../models/pathModel';
import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';

/**
 * 長字串
 */
let STR: string;

/**
 * 全形
 */
const isFullWidthChar = (char: string): boolean => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(char);
  return encoded.length > 1; // byte 長度大於 1，視為全形字
};

/**
 * 半形
 */
const isHalfWidthChar = (char: string): boolean => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(char);
  return encoded.length === 1; // byte 長度為 1，視為半形字
};

/**
 * maxLen 小數長度
 */
const decimalLenPlus = (maxLen: string): string => {
  if (maxLen.includes('.')) {
    const integerPart = Math.floor(+maxLen); // 取得整數部分
    const decimalPart = Math.round((+maxLen - integerPart) * 10); // 小數部分取一位（乘以10再取整）
    maxLen = (integerPart + decimalPart).toString();
    return maxLen;
  } else {
    return maxLen;
  }
};

/**
 * 判斷全行字
 */
const getValue = async (type: string, maxLen: string, breakType: string): Promise<{ value: string; countLen: number; breakType: string }> => {
  let value = '';
  let countLen = 0;

  maxLen = decimalLenPlus(maxLen);

  if (STR.length !== 0 && type === '9') {
    value = STR.substring(0, +maxLen);
    STR = STR.slice(+maxLen);
    countLen += Number(maxLen);
    
  } else if (STR.length !== 0 && type === 'X' && isHalfWidthChar(STR.charAt(0)) && isHalfWidthChar(STR.charAt(1))) {
    value = STR.substring(0, +maxLen);
    STR = STR.slice(+maxLen);
    countLen += Number(maxLen);
    
  } else if (STR.length !== 0 && type === 'X' && isHalfWidthChar(STR.charAt(0)) && isFullWidthChar(STR.charAt(1))) {
    let strTemp = STR.substring(0, +maxLen);
    let result = '';
    let len = 0; // 計算字串長度

    for (let i = 0; i < strTemp.length; i++) {
      if (isHalfWidthChar(strTemp.charAt(i)) && len < +maxLen) {
        result += strTemp.charAt(i);
        len += 1;
      } else if (isFullWidthChar(strTemp.charAt(i)) && len < +maxLen) {
        result += strTemp.charAt(i);
        len += 2;
      } else {
        break;
      }
    }
    STR = STR.slice(result.length);
    value = result
    countLen += Number(maxLen);
  } else {
    value = '';
  }

  // 檢查結束記號
  if (STR.length !== 0) {
    breakType = STR.charAt(0).includes('\u0003') ? 'break' : '';
  } else if (STR.length === 0) {
    breakType = 'break';
  } else {
    breakType = '';
  }

  return { value, countLen, breakType };
}

function deepMerge(target: any, source: any): any {
  for (const key in source) {
    if (source[key] instanceof Object && target[key]) {
      // 對該鍵的值進行遞迴合併
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  return { ...target, ...source };
}

export const parseHostMsgXML = async (str: any, parserOptions: object, extend: any, dynamic: any, type: string, onlyTota: string) => {
  const jbranchDIR = (await pathModel.getPath('local', 'jbranch'))[0].path; // 取Jbranch路徑
  const hostMsgPath = (await pathModel.getPath('local', 'hostMsg'))[0].path; // 取hostMsg路徑
  const parser = new XMLParser(parserOptions);
  
  let txcode = '';
  if (type === 'tita') {
    const titaBasicPath = jbranchDIR + hostMsgPath + 'TITA_BASIC.xml';
    const titaBasicContent = await fs.readFileSync(titaBasicPath, 'utf-8');
    const titaBasic = await parser.parse(titaBasicContent);

    let length: number = 0;
    let txcodeLen: number = 0;

    for (const e of titaBasic[1].TransformData[0].Tita[0].Header) {
      if (e[":@"].name !== 'B_TXCODE') {
        length += +e[":@"].maxLen;
      } else if (e[":@"].name === 'B_TXCODE') {
        txcodeLen = +e[":@"].maxLen;
        break;
      }
    }
    txcode = str.substring(length, txcodeLen + length);
  } else if (type === 'tota') {
    txcode = '';
    
    const totaBasicPath = jbranchDIR + hostMsgPath + extend + '.xml';
    const totaBasicContent = await fs.readFileSync(totaBasicPath, 'utf-8');
    const totaBasic = await parser.parse(totaBasicContent);
    
    let MTYPE = "";
    let MSGNO = "";
    let mtypeStartLen: number = 0;
    let msgnoStartLen: number = 0;

    if (onlyTota === 'N') {
      dynamic.split(",").forEach((part: string) => {
        if (/^[A-Za-z]\d+$/.test(part)) { // 開頭為英文字母，後接數字
          txcode = part;
        }
      });

      await (async () => {
        for (const e of totaBasic[1].TransformData[1].Tota[0].Header) {
          if (e[":@"].name !== 'B_MTYPE') {
            mtypeStartLen += +e[":@"].maxLen;
          } else {
            MTYPE = str.substring(mtypeStartLen, +e[":@"].maxLen + mtypeStartLen);
          }
          if (e[":@"].name !== 'B_MSGNO') {
            msgnoStartLen += +e[":@"].maxLen;
          } else {
            MSGNO = str.substring(msgnoStartLen, +e[":@"].maxLen + msgnoStartLen);
          }
        }
      })();
      txcode = txcode + '_' + MTYPE + MSGNO;
    } else if (onlyTota === 'Y') {
      txcode = dynamic;
    }
  }

  const filePath = jbranchDIR + hostMsgPath + txcode + '.xml';
  const xmlContent = fs.readFileSync(filePath, 'utf-8');
  return parser.parse(xmlContent);
};

export const parseTitaData = async (TitaStr: any, titaBody: any, parserOptions: object) => {
  const jbranchDIR = (await pathModel.getPath('local', 'jbranch'))[0].path; // 取Jbranch路徑
  const hostMsgPath = (await pathModel.getPath('local', 'hostMsg'))[0].path; // 取hostMsg路徑
  const parser = new XMLParser(parserOptions);

  // tita header 路徑
  const headerPath = jbranchDIR + hostMsgPath + titaBody[1].TransformData[0].Tita[0][":@"].extends + '.xml';
  const titaHeader = await parser.parse(fs.readFileSync(headerPath, 'utf-8'));

  delete titaBody[1].TransformData[0].Tita[0].Header;
  const xmlContent = deepMerge(titaHeader, titaBody);

  let titaHeaderXmlLength = 0;
  let titaBodyXmlLength = 0;
  let titaHeaderLength = 0;
  let titaBodyLength = 0;
  let parseResultHeader: any[] = [];
  let parseResultBody: any[] = [];
  STR = TitaStr;

  // 確保解析結果存在並且結構正確
  // 取 Header 的 Field 屬性
  if (xmlContent[1]?.TransformData[0]?.Tita[0]?.Header) {
    const headerFields = xmlContent[1].TransformData[0].Tita[0].Header;
    headerFields.forEach(async (field: any) => {
      const {value, countLen} = await getValue(field[":@"].type, field[":@"].maxLen, '');
      parseResultHeader.push({
        section: 'TitaHeader',
        name: field[":@"].name,
        value: value,
        desc: field[":@"].desc,
        type: field[":@"].type,
        maxLen: field[":@"].maxLen,
        defaultValue: field[":@"].defaultValue,
      });
      titaHeaderXmlLength += Number(decimalLenPlus(field[":@"].maxLen)); // 確保 maxLen 為數字
      titaHeaderLength += Number(countLen);
    });
  }

  // 取 Body 的 Field 屬性
  if (xmlContent[1]?.TransformData[0]?.Tita[1]?.Body) {
    const bodyFields = xmlContent[1].TransformData[0].Tita[1].Body;
    bodyFields.forEach(async (field: any) => {
      const {value, countLen} = await getValue(field[":@"].type, field[":@"].maxLen, '');
      parseResultBody.push({
        section: 'TitaBody',
        name: field[":@"].name,
        value: value,
        desc: field[":@"].desc,
        type: field[":@"].type,
        maxLen: field[":@"].maxLen,
        defaultValue: field[":@"].defaultValue,
      });
      titaBodyXmlLength += Number(decimalLenPlus(field[":@"].maxLen)); // 確保 maxLen 為數字
      titaBodyLength += Number(countLen);
    });
  }

  const res = await parseResultHeader.concat(await parseResultBody);
  const titaXmlTotalLength = titaHeaderXmlLength + titaBodyXmlLength;
  const titaTotalLength = titaHeaderLength + titaBodyLength;
  return {
    res,
    titaHeaderXmlLength,
    titaBodyXmlLength,
    titaXmlTotalLength,
    titaHeaderLength,
    titaBodyLength,
    titaTotalLength
  };
};

export const parseTotaData = async (TotaStr: any, totaBody: any, totaExtend: any, parserOptions: object) => {
  const jbranchDIR = (await pathModel.getPath('local', 'jbranch'))[0].path; // 取Jbranch路徑
  const hostMsgPath = (await pathModel.getPath('local', 'hostMsg'))[0].path; // 取hostMsg路徑
  const parser = new XMLParser(parserOptions);

  // tota header 路徑
  const headerPath = jbranchDIR + hostMsgPath + totaExtend + '.xml';
  const totaHeader = await parser.parse(fs.readFileSync(headerPath, 'utf-8'));
  const xmlContent = deepMerge(totaHeader, totaBody);

  let totaHeaderXmlLength: number = 0;
  let totaBodyXmlLength: number = 0;
  let totaHeaderLength: number = 0;
  let totaBodyLength: number = 0;
  let countOcu: number = 0;
  let parseResultHeader: any[] = [];
  let parseResultBody: any[] = [];
  STR = TotaStr;

  // 確保解析結果存在並且結構正確
  // 取 Header 的 Field 屬性
  if (xmlContent[1]?.TransformData[1]?.Tota[0]?.Header) {
    const headerFields = xmlContent[1].TransformData[1].Tota[0].Header;
    for (const field of headerFields) {
      const {value, countLen} = await getValue(field[":@"].type, field[":@"].maxLen, '');
      parseResultHeader.push({
        section: 'TotaHeader',
        name: field[":@"].name,
        value: value,
        desc: field[":@"].desc,
        type: field[":@"].type,
        maxLen: field[":@"].maxLen,
        defaultValue: field[":@"].defaultValue,
      });
      totaHeaderXmlLength += Number(decimalLenPlus(field[":@"].maxLen)); // 確保 maxLen 為數字
      totaHeaderLength += Number(countLen);
    }
  }

  // 取 Body 的 Field 屬性
  if (xmlContent[1]?.TransformData[1]?.Tota[1]?.Body) {
    const bodyFields = xmlContent[1].TransformData[1].Tota[1].Body;
    let tbLen;
    let tbxLen;
    let status;
    
    for (const field of bodyFields) {
      if (field.Field) {
        const {value, countLen, breakType} = await getValue(field[":@"].type, field[":@"].maxLen, '');
        tbLen = countLen;
        tbxLen = decimalLenPlus(field[":@"].maxLen);
        parseResultBody.push({
          section: 'TotaBody',
          name: field[":@"].name,
          value: value,
          desc: field[":@"].desc,
          type: field[":@"].type,
          maxLen: field[":@"].maxLen,
          defaultValue: field[":@"].defaultValue,
        });
        if (status === 'break') {
          break;
        }
      } else if (field.Iterator) {
        if (field[":@"].count === '$MAX') {
          countOcu = 1;
          while (true) {
            for(let data of field.Iterator) {
              const {value, countLen, breakType} = await getValue(data[":@"].type, data[":@"].maxLen, '$MAX');
              status = breakType;
              tbLen = countLen;
              tbxLen = decimalLenPlus(data[":@"].maxLen);
              parseResultBody.push({
                section: 'TotaBody_' + field[":@"].name,
                name: data[":@"].name,
                value: value,
                desc: data[":@"].desc,
                type: data[":@"].type,
                maxLen: data[":@"].maxLen,
                defaultValue: data[":@"].defaultValue,
                occTimes: field.Iterator.length
              });
            }
            if (status === 'break') {
              break;
            } else {
              countOcu++;
            }
          }
        } else {
          // 讀取 occurs 的執行次數
          for(let i = 0; i < +field[":@"].count; i++) {
            countOcu = 1;
            for(let data of field.Iterator) {
              const {value, countLen, breakType} = await getValue(data[":@"].type, data[":@"].maxLen, '');
              tbLen = countLen;
              tbxLen = decimalLenPlus(data[":@"].maxLen);
              parseResultBody.push({
                section: 'TotaBody_' + field[":@"].name,
                name: data[":@"].name,
                value: value,
                desc: data[":@"].desc,
                type: data[":@"].type,
                maxLen: data[":@"].maxLen,
                defaultValue: data[":@"].defaultValue,
                occTimes: field.Iterator.length
              });
            }
            if (status === 'break') {
              break;
            } else {
              countOcu++;
            }
          }
        }
      }
      totaBodyXmlLength += Number(tbxLen); // 確保 maxLen 為數字
      totaBodyLength += Number(tbLen);
    }
  }

  const res = await parseResultHeader.concat(await parseResultBody);
  const totaXmlTotalLength = totaHeaderXmlLength + totaBodyXmlLength;
  const totaTotalLength = totaHeaderLength + totaBodyLength;
  return {
    res,
    totaHeaderXmlLength,
    totaBodyXmlLength,
    totaXmlTotalLength,
    totaHeaderLength,
    totaBodyLength,
    totaTotalLength,
    countOcu
  };
};