import { Router } from 'express';
import { serveOptimizedImage } from '../controller/image.controller';

const router = Router();

router.get('/', serveOptimizedImage);

export default router;
