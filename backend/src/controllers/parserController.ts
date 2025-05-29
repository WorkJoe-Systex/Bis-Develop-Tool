import * as hostMsgService from '../services/parserService';
import { XMLParser } from 'fast-xml-parser';
import { Request, Response } from 'express';
import fs from 'fs';
const { validateHostMsgRequest } = require('../models/hostMsgModel');

export const parseTiTotaXML = async (req: Request, res: Response) => {
  const parserOptions = {
    ignoreAttributes: false, // 保留屬性
    attributeNamePrefix: "", // 直接使用屬性名稱，移除屬性鍵的前綴
    preserveOrder: true, // 保留原始順序
  };

  try {
    const { TitaStr, TotaStr, TotaName, TotaHeader, MCode } = req.query;

    let titaXML;
    let titaData;

    // Parse XML to JSON
    if (MCode === 'TiTota') {
      titaXML = await hostMsgService.parseHostMsgXML(TitaStr, parserOptions, '', '', 'tita', 'N'); // tita body xml
      titaData = await hostMsgService.parseTitaData(TitaStr, titaXML, parserOptions); // tita data
    }
    
    let totaExtend;
    let totaXML;
    let totaData;

    if (TotaStr?.toString().length !== 0 && TotaStr !== undefined) {
      if (MCode === 'Tota') {
        totaExtend = TotaHeader;
        totaXML = await hostMsgService.parseHostMsgXML(TotaStr, parserOptions, totaExtend, TotaName, 'tota', 'Y'); // tota body xml
      } else if (MCode === 'TiTota') {
        totaExtend = titaXML[1].TransformData[1].Tota[0][":@"].extends;
        const totadynamicBodyName = titaXML[1].TransformData[1].Tota[0][":@"].dynamicBodyName;
        totaXML = await hostMsgService.parseHostMsgXML(TotaStr, parserOptions, totaExtend, totadynamicBodyName, 'tota', 'N'); // tota body xml
      }

      totaData = await hostMsgService.parseTotaData(TotaStr, totaXML, totaExtend, parserOptions); // tota data
    }

    res.json({ success: true, Tita:titaData, Tota: totaData });
  } catch (error) {
    console.error('Error reading XML file:', error);
    res.status(500).json({ success: false, message: 'Failed to read XML file.' });
  }
};

export const updateXML = async (req: Request, res: Response) => {
  try {
    // const { updatedData } = req.body; // 從前端獲取更新的資料
    // const builder = new Builder();
    // const updatedXml = builder.buildObject(updatedData);

    // const xmlFilePath = './data/sample.xml'; // 替換成實際的檔案路徑
    // fs.writeFileSync(xmlFilePath, updatedXml, 'utf-8');

    // res.json({ success: true, message: 'XML file updated successfully.' });
  } catch (error) {
    console.error('Error updating XML file:', error);
    res.status(500).json({ success: false, message: 'Failed to update XML file.' });
  }
};
