import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { confirmPayment, createPaymentIntent, getPayment, getPaymentByReservation, handleWebhook, refundPayment } from "../controllers/payment.controller";
import { createPaymentSchema, refundPaymentSchema } from "../schemas/payment.schema";

const router = express.Router();

// ==========================================
// PROTECTED ROUTES (Require Authentication)
// ==========================================

/**
 * POST /api/payments/create-intent
 * Create payment intent for a reservation
 */
router.post('/create-intent', requireAuth, validateRequest(createPaymentSchema), createPaymentIntent);

/**
 * POST /api/payments/:paymentId/confirm
 * Manually confirm payment status
 */
router.post('/:paymentId/confirm', requireAuth, confirmPayment);

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
 */
router.post('/:paymentId/refund', requireAuth, validateRequest(refundPaymentSchema), refundPayment);

// ==========================================
// PUBLIC ROUTES (No Authentication)
// ==========================================

/**
 * POST /api/payments/webhook
 * Stripe webhook endpoint
 * Note: This route needs raw body, handled separately in index.ts
 */
router.post('/webhook', handleWebhook);

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