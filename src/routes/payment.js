import { Router } from 'express';
import remitaPaymentController from '../controllers/remitaPaymentController';

const router = Router();


const {
  getAllBanks,
  getSinglePayment,
  paymentStatus
} = remitaPaymentController;

router.post('/getAllBanks', getAllBanks);
router.post('/getSinglePayment', getSinglePayment);
router.post('/paymentStatus', paymentStatus);


export default router;
