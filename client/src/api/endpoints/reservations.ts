import apiClient from "../client";
import { type Reservation, type PaginatedResponse } from "../types";

export interface GetReservationsParams {
    page?: number;
    limit?: number;
    status?: string;
}

export interface CreateReservationRequest {
    showtimeId: string;
    seatIds: number[];
}

export const reservationsApi = {
    // User endpoints
    createReservation: async (data: CreateReservationRequest): Promise<{ reservation: Reservation }> => {
        const response = await apiClient.post('/reservations', data);
        return response.data;
    },

    getUserReservations: async (params: GetReservationsParams): Promise<PaginatedResponse<Reservation>> => {
        const response = await apiClient.get('/reservations', { params });
        return response.data;
    },

    getReservationById: async (id: string): Promise<{ reservation: Reservation }> => {
        const response = await apiClient.get(`/reservations/${id}`);
        return response.data;
    },

    cancelReservation: async (id: string): Promise<{ reservation: Reservation }> => {
        const response = await apiClient.put(`/reservations/${id}`);
        return response.data;
    },
};