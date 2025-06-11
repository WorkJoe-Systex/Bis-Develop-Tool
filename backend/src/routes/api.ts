import express from 'express'
import userRoutes from './userRoutes'
import pathRoutes from './pathRoutes'
import filesRoutes from './filesRoutes'
import compressRoutes from './compressRoutes'
import hostMsgRoutes from './hostMsgRoutes'
import testRoutes from './testRoutes'

const router = express.Router()

router.use('/user', userRoutes);
router.use('/path', pathRoutes);
router.use('/files', filesRoutes);
router.use('/compress', compressRoutes);
router.use('/hostMsg', hostMsgRoutes);

router.use('/api/test', testRoutes);

export default router
