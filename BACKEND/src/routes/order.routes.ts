import { Router } from 'express';
import { createGuestOrder } from '../controller/order.controller';

const router = Router();

router.post('/', createGuestOrder);

export default router;
