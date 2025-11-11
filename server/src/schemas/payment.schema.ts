import { z } from 'zod';

/**
 * Schema for creating payment intent
 */
export const createPaymentSchema = z.object({
    reservationId: z.string().uuid('Invalid reservation ID format'),
});

/**
 * Schema for refund request
 */
export const refundPaymentSchema = z.object({
    reason: z.string().optional(),
});

// Export types
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>;
