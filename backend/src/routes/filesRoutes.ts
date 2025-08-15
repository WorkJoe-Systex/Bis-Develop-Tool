import express from 'express';
import { getFiles, genFile, moveFiles, mergeCSV } from '../controllers/filesController';

const router = express.Router();

router.post('/getFiles', getFiles);
router.post('/genFile', genFile);
router.post('/moveFiles', moveFiles);
router.post('/mergeCSV', mergeCSV);

export default router;
