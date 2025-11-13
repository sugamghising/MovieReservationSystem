import apiClient from "../client";
import { type Payment } from "../types";

export interface CreatePaymentIntentRequest {
    reservationId: string;
}

export interface CreatePaymentIntentResponse {
    clientSecret: string;
    paymentId: string;
    amount: number;
    currency: string;
    publishableKey?: string;
}

export interface RefundPaymentRequest {
    reason?: string;
}

export const paymentApi = {
    // Create payment intent for Stripe
    createPaymentIntent: async (data: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> => {
        const response = await apiClient.post('/payments/create-intent', data);
        return response.data.data; // Backend wraps response in { success, message, data }
    },

    // Confirm payment manually
    confirmPayment: async (paymentId: string): Promise<{ payment: Payment }> => {
        const response = await apiClient.post(`/payments/${paymentId}/confirm`);
        return response.data.data; // Backend wraps response in { success, message, data }
    },

    // Get payment details
    getPayment: async (paymentId: string): Promise<{ payment: Payment }> => {
        const response = await apiClient.get(`/payments/${paymentId}`);
        return response.data.data;
    },

    // Get payment by reservation
    getPaymentByReservation: async (reservationId: string): Promise<{ payment: Payment }> => {
        const response = await apiClient.get(`/payments/reservation/${reservationId}`);
        return response.data.data;
    },

    // Request refund
    refundPayment: async (paymentId: string, data: RefundPaymentRequest): Promise<{ payment: Payment }> => {
        const response = await apiClient.post(`/payments/${paymentId}/refund`, data);
        return response.data.data;
    },
};