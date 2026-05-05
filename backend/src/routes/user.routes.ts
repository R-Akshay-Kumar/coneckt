import { Router } from 'express';
import { searchUsers } from '../controllers/user.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', searchUsers);

export default router;
