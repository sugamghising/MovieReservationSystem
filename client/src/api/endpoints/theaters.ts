import apiClient from "../client";
import { type Theater, type PaginatedResponse, type Seat } from "../types";

export interface GetTheatersParams {
    page?: number;
    limit?: number;
}

export interface CreateTheaterRequest {
    name: string;
    capacity: number;
}

export interface AddSeatRequest {
    label: string;
    row?: string;
    number?: number;
    type?: string;
    extraPrice?: number;
}

export const theatersApi = {
    // Public endpoints
    getTheaters: async (params: GetTheatersParams): Promise<PaginatedResponse<Theater>> => {
        const response = await apiClient.get('/theatres', { params });
        return response.data;
    },

    // Admin endpoints
    createTheater: async (data: CreateTheaterRequest): Promise<{ theatre: Theater }> => {
        const response = await apiClient.post('/theatres', data);
        return response.data;
    },

    addSeat: async (theaterId: string, data: AddSeatRequest): Promise<Seat> => {
        const response = await apiClient.post(`/theatres/${theaterId}/seat`, data);
        return response.data;
    },

    getTheaterSeats: async (theaterId: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Seat>> => {
        const response = await apiClient.get(`/theatres/${theaterId}/seat`, { params });
        return response.data;
    },
};