import { useQuery } from '@tanstack/react-query';
import { analyticsApi, type AnalyticsParams } from '@/api/endpoints/analytics';
import { QUERY_KEYS } from '@/lib/constants';

// Dashboard overview
export const useDashboardOverview = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.ANALYTICS, 'dashboard'],
        queryFn: () => analyticsApi.getDashboardOverview(),
    });
};

// Revenue report
export const useRevenueReport = (params: AnalyticsParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.ANALYTICS, 'revenue', params],
        queryFn: () => analyticsApi.getRevenueReport(params),
    });
};

// Occupancy report
export const useOccupancyReport = (params?: AnalyticsParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.ANALYTICS, 'occupancy', params],
        queryFn: () => analyticsApi.getOccupancyReport(params),
    });
};

// Popular movies
export const usePopularMovies = (params?: AnalyticsParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.ANALYTICS, 'popular-movies', params],
        queryFn: () => analyticsApi.getPopularMovies(params),
    });
};

// Cancellations report
export const useCancellationReport = (params: AnalyticsParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.ANALYTICS, 'cancellations', params],
        queryFn: () => analyticsApi.getCancellationReport(params),
    });
};
