import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsApi, type GetReservationsParams, type CreateReservationRequest } from '@/api/endpoints/reservations';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from 'react-hot-toast';

// Get user reservations
export const useReservations = (params: GetReservationsParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.RESERVATIONS, params],
        queryFn: () => reservationsApi.getUserReservations(params),
    });
};

// Get reservation by ID
export const useReservation = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.RESERVATION_DETAIL, id],
        queryFn: () => reservationsApi.getReservationById(id),
        enabled: !!id,
    });
};

// Create reservation
export const useCreateReservation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateReservationRequest) => reservationsApi.createReservation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESERVATIONS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVAILABLE_SEATS] });
            toast.success('Reservation created successfully');
        },
        onError: () => {
            toast.error('Failed to create reservation');
        },
    });
};

// Cancel reservation
export const useCancelReservation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => reservationsApi.cancelReservation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESERVATIONS] });
            toast.success('Reservation cancelled successfully');
        },
        onError: () => {
            toast.error('Failed to cancel reservation');
        },
    });
};
