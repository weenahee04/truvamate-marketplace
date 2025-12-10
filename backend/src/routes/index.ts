import { Router } from 'express';
import authRoutes from './auth.routes';
import lottoRoutes from './lotto.routes';
import paymentRoutes from './payment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/lotto', lottoRoutes);
router.use('/payments', paymentRoutes);

export default router;
