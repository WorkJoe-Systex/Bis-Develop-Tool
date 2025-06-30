import express from 'express';
import { genQRCodes, qryQRCodes, delQRCodes } from '../controllers/qrcodeController';

const router = express.Router();

router.post('/genQRcode', genQRCodes);
router.get('/qryQRcode/:txncode', qryQRCodes);
router.delete('/delQRcode/:id', delQRCodes);

export default router;