import apiClient from "../client";
import type { Reservation } from "../types";

export interface DashboardOverview {
    totalRevenue: number;
    totalReservations: number;
    totalMovies: number;
    totalTheaters: number;
    recentReservations?: Reservation[];
}

export interface RevenueReport {
    daily?: Array<{ date: string; revenue: number; reservations: number }>;
    monthly?: Array<{ month: string; revenue: number; reservations: number }>;
    yearly?: Array<{ year: number; revenue: number; reservations: number }>;
}

export interface OccupancyReport {
    theaters: Array<{
        theaterId: string;
        theaterName: string;
        totalSeats: number;
        occupiedSeats: number;
        occupancyRate: number;
    }>;
    overall: {
        totalSeats: number;
        occupiedSeats: number;
        occupancyRate: number;
    };
}

export interface PopularMovie {
    movieId: string;
    movieTitle: string;
    totalReservations: number;
    totalRevenue: number;
}

export interface CancellationReport {
    totalCancellations: number;
    cancellationRate: number;
    cancellationsByDate: Array<{
        date: string;
        count: number;
    }>;
}

export interface AnalyticsParams {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'monthly' | 'yearly';
}

export const analyticsApi = {
    // Dashboard overview
    getDashboardOverview: async (): Promise<DashboardOverview> => {
        const response = await apiClient.get('/analytics/dashboard');
        return response.data;
    },

    // Revenue report
    getRevenueReport: async (params: AnalyticsParams): Promise<RevenueReport> => {
        const response = await apiClient.get('/analytics/revenue', { params });
        return response.data;
    },

    // Occupancy report
    getOccupancyReport: async (params?: AnalyticsParams): Promise<OccupancyReport> => {
        const response = await apiClient.get('/analytics/occupancy', { params });
        return response.data;
    },

    // Popular movies
    getPopularMovies: async (params?: AnalyticsParams): Promise<{ movies: PopularMovie[] }> => {
        const response = await apiClient.get('/analytics/popular-movies', { params });
        return response.data;
    },

    // Cancellations report
    getCancellationReport: async (params: AnalyticsParams): Promise<CancellationReport> => {
        const response = await apiClient.get('/analytics/cancellations', { params });
        return response.data;
    },
};