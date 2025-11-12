// Domain model types extending the API types
import type {
    Movie as ApiMovie,
    Theater as ApiTheater,
    Seat as ApiSeat,
    Showtime as ApiShowtime,
    Reservation as ApiReservation,
    Payment as ApiPayment,
    User as ApiUser
} from '@/api/types';

// Extended Movie type with computed properties
export interface Movie extends ApiMovie {
    rating?: number;
    formattedDuration?: string;
    genreList?: string[];
    isReleased?: boolean;
}

// Extended Theater type
export interface Theater extends ApiTheater {
    location?: string;
    seatsAvailable?: number;
    occupancyRate?: number;
}

// Extended Seat type with display properties
export interface Seat extends ApiSeat {
    row: string; // Computed from rowLabel
    number: number; // Computed from seatNumber
    status: 'AVAILABLE' | 'OCCUPIED' | 'BLOCKED' | 'HELD';
    isSelected?: boolean;
    price?: number;
}

// Extended Showtime type
export interface Showtime extends ApiShowtime {
    availableSeats?: number;
    totalSeats?: number;
    occupancyRate?: number;
    isExpired?: boolean;
    formattedDate?: string;
    formattedTime?: string;
}

// Extended Reservation type
export interface Reservation extends ApiReservation {
    seats?: Seat[];
    canCancel?: boolean;
    formattedStatus?: string;
}

// Extended Payment type
export interface Payment extends ApiPayment {
    formattedAmount?: string;
    canRefund?: boolean;
}

// Extended User type
export interface User extends ApiUser {
    isAdmin?: boolean;
    fullName?: string;
}

// Booking flow types
export interface BookingStep {
    id: number;
    name: string;
    description: string;
    isComplete: boolean;
    isCurrent: boolean;
}

export interface BookingData {
    movie?: Movie;
    showtime?: Showtime;
    seats?: Seat[];
    totalPrice?: number;
    reservationId?: string;
}

// Cart/Selection types
export interface SelectedSeat {
    seatId: number;
    seatNumber: string;
    row: string;
    price: number;
}

export interface CartItem {
    showtime: Showtime;
    seats: SelectedSeat[];
    totalPrice: number;
}

// Analytics types
export interface DashboardStats {
    totalRevenue: number;
    totalReservations: number;
    totalMovies: number;
    totalTheaters: number;
    revenueChange?: number;
    reservationsChange?: number;
}

export interface RevenueData {
    date: string;
    revenue: number;
    reservations: number;
}

export interface PopularMovieData {
    movieId: string;
    title: string;
    reservations: number;
    revenue: number;
    posterUrl?: string;
}

export interface OccupancyData {
    theaterId: string;
    theaterName: string;
    totalSeats: number;
    occupiedSeats: number;
    occupancyRate: number;
}

export interface CancellationData {
    date: string;
    cancellations: number;
    cancellationRate: number;
}
