import express from 'express';
import { getPath, updatePath } from '../controllers/pathController';

const router = express.Router();

router.get('/:serverType/:name', getPath);
router.put('/:serverType/:name', updatePath);

export default router;
