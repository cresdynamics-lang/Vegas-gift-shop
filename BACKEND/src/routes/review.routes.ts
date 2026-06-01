import { Router } from 'express';
import { createProductReview, getProductReviews } from '../controller/review.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/', getProductReviews);
router.post('/', optionalAuth, createProductReview);

export default router;
