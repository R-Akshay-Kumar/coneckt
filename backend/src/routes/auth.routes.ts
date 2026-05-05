import { Router } from 'express';
import { googleAuth, getMe } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/google', googleAuth);
router.get('/me', requireAuth, getMe);

export default router;
