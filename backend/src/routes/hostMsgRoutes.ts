import express from 'express';
import { readTiTotaXML, updateXML } from '../controllers/hostMsgController';

const router = express.Router();

router.get('/read-titota-xml', readTiTotaXML);
router.post('/update-xml', updateXML);

export default router;
