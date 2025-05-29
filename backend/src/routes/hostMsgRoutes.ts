import express from 'express';
import { parseTiTotaXML, updateXML } from '../controllers/parserController';

const router = express.Router();

router.get('/parse-titota-xml', parseTiTotaXML);
router.post('/update-xml', updateXML);

export default router;
