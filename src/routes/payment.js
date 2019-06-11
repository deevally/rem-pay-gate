import { Router } from 'express';
import remitaPaymentController from '../controllers/remitaPaymentController';

const router = Router();


const {
  getAllBanks,
  getSinglePayment,
  paymentStatus,
  bulkPayment,
  paymentStatusBulk
} = remitaPaymentController;

router.post('/getAllBanks', getAllBanks);
router.post('/getSinglePayment', getSinglePayment);
router.post('/paymentStatus', paymentStatus);
router.post('/bulkPayment', bulkPayment);
router.post('/paymentStatusBulk', paymentStatusBulk);


export default router;
