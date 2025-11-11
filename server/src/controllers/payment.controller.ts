import { Request, Response } from "express";
import * as paymentService from "../services/payment.service";

/**
 * POST /api/payments/create-intent
 * Create payment intent for a reservation
 */
export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { reservationId } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
        }

        const result = await paymentService.createPaymentIntent(
            reservationId,
            userId
        );

        return res.status(201).json({
            success: true,
            message: "Payment intent created successfully",
            data: result,
        });
    } catch (error) {
        console.error("❌ Payment creation error:", error);
        return res.status(400).json({
            success: false,
            message: "Failed to create payment",
            error: (error as Error).message,
        });
    }
};

/**
 * POST /api/payments/:paymentId/confirm
 * Manually confirm payment status
 */
export const confirmPayment = async (req: Request, res: Response) => {
    try {
        const { paymentId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
        }

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: "Payment ID is required",
            });
        }

        const result = await paymentService.confirmPayment(paymentId, userId);

        return res.status(200).json({
            success: result.success,
            message: result.message,
            data: result,
        });
    } catch (error) {
        console.error("❌ Payment confirmation error:", error);
        return res.status(400).json({
            success: false,
            message: "Failed to confirm payment",
            error: (error as Error).message,
        });
    }
};

/**
 * GET /api/payments/:paymentId
 * Get payment details
 */
export const getPayment = async (req: Request, res: Response) => {
    try {
        const { paymentId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
        }

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: "Payment ID is required",
            });
        }

        const payment = await paymentService.getPaymentById(paymentId, userId);

        return res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        console.error("❌ Get payment error:", error);
        return res.status(400).json({
            success: false,
            message: "Failed to get payment",
            error: (error as Error).message,
        });
    }
};

/**
 * GET /api/payments/reservation/:reservationId
 * Get payment by reservation ID
 */
export const getPaymentByReservation = async (req: Request, res: Response) => {
    try {
        const { reservationId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
        }

        if (!reservationId) {
            return res.status(400).json({
                success: false,
                message: "Reservation ID is required",
            });
        }

        const payment = await paymentService.getPaymentByReservationId(
            reservationId,
            userId
        );

        return res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        console.error("❌ Get payment error:", error);
        return res.status(400).json({
            success: false,
            message: "Failed to get payment",
            error: (error as Error).message,
        });
    }
};

/**
 * POST /api/payments/:paymentId/refund
 * Refund a payment
 */
export const refundPayment = async (req: Request, res: Response) => {
    try {
        const { paymentId } = req.params;
        const userId = req.user?.userId;
        const { reason } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated",
            });
        }

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: "Payment ID is required",
            });
        }

        const result = await paymentService.refundPayment(
            paymentId,
            userId,
            reason
        );

        return res.status(200).json({
            success: true,
            message: "Payment refunded successfully",
            data: result,
        });
    } catch (error) {
        console.error("❌ Refund error:", error);
        return res.status(400).json({
            success: false,
            message: "Failed to process refund",
            error: (error as Error).message,
        });
    }
};

/**
 * POST /api/payments/webhook
 * Handle Stripe webhook events
 * IMPORTANT: This endpoint receives raw body, not JSON
 */
export const handleWebhook = async (req: Request, res: Response) => {
    try {
        const signature = req.headers["stripe-signature"] as string;

        if (!signature) {
            console.error("❌ Missing stripe-signature header");
            return res.status(400).json({
                success: false,
                error: "Missing stripe-signature header",
            });
        }

        // req.body must be raw buffer for webhook signature verification
        await paymentService.handleStripeWebhook(req.body, signature);

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error("❌ Webhook error:", error);
        return res.status(400).json({
            success: false,
            error: (error as Error).message,
        });
    }
};