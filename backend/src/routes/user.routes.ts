import { Router } from 'express';
import { searchUsers } from '../controllers/user.controller';

const router = Router();

router.get('/', searchUsers);

export default router;
