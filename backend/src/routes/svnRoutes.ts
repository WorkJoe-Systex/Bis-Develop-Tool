import express from 'express';
import { svnUpdateHandler, svnAddHandler, svnCommitHandler } from '../controllers/svnController';

const router = express.Router();

router.post('/svnUpdate', svnUpdateHandler);
router.post('/svnAdd', svnAddHandler);
router.post('/svnCommit', svnCommitHandler);

export default router;
