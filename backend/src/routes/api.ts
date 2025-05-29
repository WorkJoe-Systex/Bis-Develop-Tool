import express from 'express';
import { getUsers, createUser, removeUser } from '../controllers/testController';
import { parseTiTotaXML, updateXML } from '../controllers/parserController';
import { getPath, updatePath } from '../controllers/pathController';
import { compressFiles } from '../controllers/compressController';
import { getFiles } from '../controllers/filesController';

const router = express.Router();

// hostMsg
router.get('/parse-titota-xml', parseTiTotaXML);
router.post('/update-xml', updateXML);

// use
router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', removeUser);

// path
router.get('/:serverType/:name', getPath);
router.put('/:serverType/:name', updatePath);

// compress
router.post('/', compressFiles);

// getFiles
router.get('/', getFiles);

export default router;
