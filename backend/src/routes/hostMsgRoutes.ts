import express from 'express';
import { parseTiTotaXML, updateXML } from '../controllers/parserController';
import { qryAllHostMsg, updateHostMsg } from '../controllers/hostMsgController';

const router = express.Router();

// parser
router.get('/parse-titota-xml', parseTiTotaXML);
router.post('/update-xml', updateXML);

// fake
router.get('/qryHostMsg', qryAllHostMsg);
router.put('/updateHostMsg/:id', updateHostMsg);

export default router;
