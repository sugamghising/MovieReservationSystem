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
        const data = response.data;

        // Transform server response to match expected interface
        return {
            totalRevenue: data.today?.revenue || 0,
            totalReservations: data.totals?.reservations || 0,
            totalMovies: data.totals?.movies || 0,
            totalTheaters: data.totals?.theaters || 0,
            recentReservations: data.recentReservations || []
        };
    },

    // Revenue report
    getRevenueReport: async (params: AnalyticsParams): Promise<RevenueReport> => {
        const response = await apiClient.get('/analytics/revenue', { params });
        return response.data;
    },

    // Occupancy report
    getOccupancyReport: async (params?: AnalyticsParams): Promise<OccupancyReport> => {
        const response = await apiClient.get('/analytics/occupancy', { params });
        const data = response.data as {
            summary?: { averageOccupancy?: number };
            occupancyByTheater?: Array<{ theater: string; occupancyRate: number }>;
        };

        // Transform server response to match expected interface
        // Use occupancyByTheater data to construct theater-level stats
        const theaters = data.occupancyByTheater?.map((t) => ({
            theaterId: t.theater || '',
            theaterName: t.theater || '',
            totalSeats: 0, // Not available in this endpoint
            occupiedSeats: 0, // Not available in this endpoint
            occupancyRate: t.occupancyRate || 0
        })) || [];

        return {
            theaters,
            overall: {
                totalSeats: 0,
                occupiedSeats: 0,
                occupancyRate: data.summary?.averageOccupancy || 0
            }
        };
    },

    // Popular movies
    getPopularMovies: async (params?: AnalyticsParams): Promise<{ movies: PopularMovie[] }> => {
        const response = await apiClient.get('/analytics/popular-movies', { params });
        const data = response.data as {
            popularMovies?: Array<{
                movieId: string;
                title: string;
                totalBookings: number;
                totalRevenue: number;
            }>;
        };

        // Transform server response to match expected interface
        const movies = data.popularMovies?.map((m) => ({
            movieId: m.movieId,
            movieTitle: m.title,
            totalReservations: m.totalBookings,
            totalRevenue: m.totalRevenue
        })) || [];

        return { movies };
    },

    // Cancellations report
    getCancellationReport: async (params: AnalyticsParams): Promise<CancellationReport> => {
        const response = await apiClient.get('/analytics/cancellations', { params });
        return response.data;
    },
};