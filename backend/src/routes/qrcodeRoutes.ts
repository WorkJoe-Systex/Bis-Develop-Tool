import express from 'express';
import { genQRCodes } from '../controllers/qrcodeController';

const router = express.Router();

router.post('/genQRcode', genQRCodes);

export default router;