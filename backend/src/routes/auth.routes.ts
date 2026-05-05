import { Router } from 'express';
import { googleAuth, getMe } from '../controllers/auth.controller';

const router = Router();

router.post('/google', googleAuth);
router.get('/me', getMe);

export default router;
