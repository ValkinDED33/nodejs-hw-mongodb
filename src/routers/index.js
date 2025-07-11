import express from 'express';

import { auth } from '../middlewares/auth.js';

import authRoutes from './auth.js';
import contactRoutes from './contacts.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/contacts', auth, contactRoutes);

export default router;
