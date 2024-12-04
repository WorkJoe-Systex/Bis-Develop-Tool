import express from 'express';
import { getUsers, createUser, removeUser } from '../controllers/userController';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', removeUser);

export default router;
