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

router.post('/banks', getAllBanks);
router.post('/singlepayment', getSinglePayment);
router.post('/paymentstatus', paymentStatus);
router.post('/bulkpayment', bulkPayment);
router.post('/paymentstatusbulk', paymentStatusBulk);


export default router;
