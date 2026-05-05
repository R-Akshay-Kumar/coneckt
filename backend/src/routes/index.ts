import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import conversationRoutes from './conversation.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/conversations', conversationRoutes);

export default router;
