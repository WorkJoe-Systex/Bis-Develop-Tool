import express from 'express';
import { getFiles } from '../controllers/filesController';

const router = express.Router();

router.get('/', getFiles);

export default router;
