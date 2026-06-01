import { Router } from 'express';
import { getProducts, getProductById, syncStorefrontProduct, getCategories, createProduct, updateProduct, deleteProduct, createCategory, updateCategory, deleteCategory } from '../controller/product.controller';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';
import reviewRoutes from './review.routes';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.post('/:id/sync', syncStorefrontProduct);
router.use('/:productId/reviews', reviewRoutes);
router.get('/:id', getProductById);

router.post('/', verifyToken, requireAdmin, createProduct);
router.put('/:id', verifyToken, requireAdmin, updateProduct);
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);

router.post('/categories', verifyToken, requireAdmin, createCategory);
router.put('/categories/:id', verifyToken, requireAdmin, updateCategory);
router.delete('/categories/:id', verifyToken, requireAdmin, deleteCategory);

export default router;
