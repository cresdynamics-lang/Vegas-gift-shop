import { Router } from 'express';
import { login, getMe, changePassword, updateProfile } from '../controller/auth.controller';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.put('/password', verifyToken, requireAdmin, changePassword);
router.put('/profile', verifyToken, requireAdmin, updateProfile);

export default router;
