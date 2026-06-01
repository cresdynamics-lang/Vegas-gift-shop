import { Router } from 'express';
import { getDashboardStats, getOrders, getCustomers } from '../controller/admin.controller';
import { getSettings, updateSettings } from '../controller/settings.controller';
import { uploadImage } from '../controller/upload.controller';
import {
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
  createAdminReview,
} from '../controller/review.controller';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';
import { uploadProductImage } from '../middleware/upload.middleware';

const router = Router();

router.use(verifyToken, requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/orders', getOrders);
router.get('/customers', getCustomers);
router.get('/reviews', getAdminReviews);
router.post('/reviews', createAdminReview);
router.patch('/reviews/:id', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.post('/upload', uploadProductImage.single('image'), uploadImage);

export default router;
