import express from 'express';
import { getUserInfo, updateCompressedType } from '../controllers/userController';

const router = express.Router();

router.get('/', getUserInfo);
router.put('/:name', updateCompressedType);

export default router;
