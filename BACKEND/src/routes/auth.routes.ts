import { Router } from 'express';
import { login, register, getMe, changePassword, updateProfile } from '../controller/auth.controller';
import { getMyOrders, createOrder } from '../controller/customer.controller';
import { verifyToken, requireCustomer } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);
router.put('/password', verifyToken, changePassword);
router.get('/orders', verifyToken, requireCustomer, getMyOrders);
router.post('/orders', verifyToken, requireCustomer, createOrder);

export default router;
