export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';

export const ROUTES = {
    HOME: '/',
    MOVIES: '/movies',
    MOVIE_DETAIL: '/movies/:id',
    SHOWTIMES: '/showtimes',
    LOGIN: '/login',
    REGISTER: '/register',
    BOOKING: '/booking/:showtimeId',
    CHECKOUT: '/checkout/:reservationId',
    MY_RESERVATIONS: '/my-reservations',
    PAYMENT_SUCCESS: '/payment/success',
    PAYMENT_FAILED: '/payment/failed',
    PROFILE: '/profile',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_MOVIES: '/admin/movies',
    ADMIN_SHOWTIMES: '/admin/showtimes',
    ADMIN_THEATERS: '/admin/theaters',
    ADMIN_ANALYTICS: '/admin/analytics',
} as const;

export const QUERY_KEYS = {
    MOVIES: 'movies',
    MOVIE_DETAIL: 'movie-detail',
    SHOWTIMES: 'showtimes',
    SHOWTIME_DETAIL: 'showtime-detail',
    AVAILABLE_SEATS: 'available-seats',
    SEATS: 'seats',
    RESERVATIONS: 'reservations',
    RESERVATION_DETAIL: 'reservation-detail',
    THEATERS: 'theaters',
    PAYMENT: 'payment',
    ANALYTICS: 'analytics',
} as const;

export const SEAT_STATUS = {
    AVAILABLE: 'available',
    SELECTED: 'selected',
    BOOKED: 'booked',
    HELD: 'held',
} as const;

export const RESERVATION_STATUS = {
    HELD: 'HELD',
    BOOKED: 'BOOKED',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED',
} as const;

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    ITEMS_PER_PAGE_OPTIONS: [10, 20, 50, 100],
} as const;