import { Router } from 'express';
import { getDashboardStats, getOrders, getCustomers } from '../controller/admin.controller';
import { getSettings, updateSettings } from '../controller/settings.controller';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(verifyToken, requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/orders', getOrders);
router.get('/customers', getCustomers);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
