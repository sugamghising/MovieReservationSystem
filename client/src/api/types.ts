export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        currentPage: number;
        itemsPerPage: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
}

export interface Movie {
    id: string;
    title: string;
    description: string;
    genre: string;
    duration: number;
    releaseDate: string;
    posterUrl: string | null;
    createdAt: string;
}

export interface Theater {
    id: string;
    name: string;
    capacity: number;
    createdAt: string;
}

export interface Seat {
    id: string;
    theaterId: string;
    seatNumber: string;
    rowLabel: string;
    seatType: string;
    createdAt: string;
}

export interface Showtime {
    id: string;
    movieId: string;
    theaterId: string;
    startTime: string;
    endTime: string;
    price: number;
    createdAt: string;
    movie?: Movie;
    theater?: Theater;
}

export interface Reservation {
    id: string;
    userId: string;
    showtimeId: string;
    status: 'HELD' | 'BOOKED' | 'CANCELLED' | 'EXPIRED';
    totalPrice: number;
    createdAt: string;
    showtime?: Showtime;
    reservationSeats?: Array<{
        seat: Seat;
    }>;
    payment?: Payment;
}

export interface Payment {
    id: string;
    reservationId: string;
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    stripePaymentIntentId: string | null;
    createdAt: string;
}