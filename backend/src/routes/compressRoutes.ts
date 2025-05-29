import express from 'express';
import { compressFiles } from '../controllers/compressController';

const router = express.Router();

router.post('/', compressFiles);

export default router;
