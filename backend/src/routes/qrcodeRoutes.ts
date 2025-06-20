import express from 'express';
import { genQRCodes } from '../controllers/qrcodeController';

const router = express.Router();

router.get('/genQRcode', genQRCodes);

export default router;