import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi, type CreatePaymentIntentRequest, type RefundPaymentRequest } from '@/api/endpoints/payment';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from 'react-hot-toast';

// Create payment intent
export const useCreatePaymentIntent = () => {
    return useMutation({
        mutationFn: (data: CreatePaymentIntentRequest) => paymentApi.createPaymentIntent(data),
        onError: () => {
            toast.error('Failed to create payment intent');
        },
    });
};

// Confirm payment
export const useConfirmPayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (paymentId: string) => paymentApi.confirmPayment(paymentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESERVATIONS] });
            toast.success('Payment confirmed successfully');
        },
        onError: () => {
            toast.error('Failed to confirm payment');
        },
    });
};

// Get payment details
export const usePayment = (paymentId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.PAYMENT, paymentId],
        queryFn: () => paymentApi.getPayment(paymentId),
        enabled: !!paymentId,
    });
};

// Get payment by reservation
export const usePaymentByReservation = (reservationId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.PAYMENT, 'reservation', reservationId],
        queryFn: () => paymentApi.getPaymentByReservation(reservationId),
        enabled: !!reservationId,
    });
};

// Request refund
export const useRefundPayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ paymentId, data }: { paymentId: string; data: RefundPaymentRequest }) =>
            paymentApi.refundPayment(paymentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENT] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESERVATIONS] });
            toast.success('Refund processed successfully');
        },
        onError: () => {
            toast.error('Failed to process refund');
        },
    });
};
