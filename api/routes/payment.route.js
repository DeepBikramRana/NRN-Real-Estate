import express from 'express';
import { 
  verifyQRPayment, 
  getPaymentDetails, 
  getPendingPayments, 
  getPaymentStats,
  updatePaymentAmount 
} from '../controllers/payment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Verify QR payment (for agents/admins)
router.put('/verify/:appointmentId', verifyToken, verifyQRPayment);

// Get payment details for specific appointment
router.get('/details/:appointmentId', verifyToken, getPaymentDetails);

// Get all pending payments (for agents/admins)
router.get('/pending', verifyToken, getPendingPayments);

// Get payment statistics (admin only)
router.get('/stats', verifyToken, getPaymentStats);

// Update payment amount (admin only)
router.put('/amount/:appointmentId', verifyToken, updatePaymentAmount);

export default router;