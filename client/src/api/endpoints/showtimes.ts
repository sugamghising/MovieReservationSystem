import apiClient from "../client";
import { type Showtime, type PaginatedResponse, type Seat } from "../types";

export interface GetShowtimesParams {
    page?: number;
    limit?: number;
    movieId?: string;
    theaterId?: string;
    date?: string;
}

export interface CreateShowtimeRequest {
    movieId: string;
    theaterId: string;
    startTime: string;
    endTime: string;
    price: number;
}

export interface UpdateShowtimeRequest {
    startTime?: string;
    endTime?: string;
    price?: number;
}

export const showtimesApi = {
    // Public endpoints
    getShowtimes: async (params: GetShowtimesParams): Promise<PaginatedResponse<Showtime>> => {
        const response = await apiClient.get('/showtimes', { params });
        return response.data;
    },

    getShowtimesByMovie: async (movieId: string): Promise<{ showtimes: Showtime[] }> => {
        const response = await apiClient.get(`/showtimes/movie/${movieId}`);
        return response.data;
    },

    getAvailableSeats: async (showtimeId: string): Promise<{ seats: Seat[] }> => {
        const response = await apiClient.get(`/showtimes/${showtimeId}/available-seats`);
        return response.data;
    },

    // Admin endpoints
    createShowtime: async (data: CreateShowtimeRequest): Promise<{ showtime: Showtime }> => {
        const response = await apiClient.post('/showtimes', data);
        return response.data;
    },

    updateShowtime: async (id: string, data: UpdateShowtimeRequest): Promise<{ showtime: Showtime }> => {
        const response = await apiClient.put(`/showtimes/${id}`, data);
        return response.data;
    },

    deleteShowtime: async (id: string): Promise<{ message: string }> => {
        const response = await apiClient.delete(`/showtimes/${id}`);
        return response.data;
    },
};