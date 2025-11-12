import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { confirmPayment, createPaymentIntent, getPayment, getPaymentByReservation, handleWebhook, refundPayment } from "../controllers/payment.controller";
import { createPaymentSchema, refundPaymentSchema } from "../schemas/payment.schema";
import { paymentLimiter, webhookLimiter } from '../middleware/rate-limit.middleware';

const router = express.Router();

// ==========================================
// PROTECTED ROUTES (Require Authentication)
// ==========================================

/**
 * POST /api/payments/create-intent
 * Create payment intent for a reservation
 * Rate limited: 10 requests per 15 minutes
 */
router.post('/create-intent', paymentLimiter, requireAuth, validateRequest(createPaymentSchema), createPaymentIntent);

/**
 * POST /api/payments/:paymentId/confirm
 * Manually confirm payment status
 * Rate limited: 10 requests per 15 minutes
 */
router.post('/:paymentId/confirm', paymentLimiter, requireAuth, confirmPayment);

/**
 * GET /api/payments/:paymentId
 * Get payment details by payment ID
 */
router.get('/:paymentId', requireAuth, getPayment);

/**
 * GET /api/payments/reservation/:reservationId
 * Get payment by reservation ID
 */
router.get('/reservation/:reservationId', requireAuth, getPaymentByReservation);

/**
 * POST /api/payments/:paymentId/refund
 * Request refund for a payment
 * Rate limited: 10 requests per 15 minutes
 */
router.post('/:paymentId/refund', paymentLimiter, requireAuth, validateRequest(refundPaymentSchema), refundPayment);

// ==========================================
// PUBLIC ROUTES (No Authentication)
// ==========================================

/**
 * POST /api/payments/webhook
 * Stripe webhook endpoint
 * Rate limited: 100 requests per hour
 * Note: This route needs raw body, handled separately in index.ts
 */
router.post('/webhook', webhookLimiter, handleWebhook);

export default router;

/**
 * Validation middleware wrapper
 */
function validateRequest(schema: any) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors
            });
        }
    };
}