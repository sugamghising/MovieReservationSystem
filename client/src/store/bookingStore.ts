import { create } from 'zustand';
import type { Movie, Showtime } from '@/types/models';

export interface SelectedSeat {
    id: string;
    seatNumber: string;
    row: string;
    number: number;
    price: number;
}

export interface BookingStep {
    id: number;
    name: string;
    description: string;
}

interface BookingState {
    // Current booking data
    movie: Movie | null;
    showtime: Showtime | null;
    selectedSeats: SelectedSeat[];
    totalPrice: number;
    reservationId: string | null;

    // Booking flow
    currentStep: number;
    steps: BookingStep[];

    // Actions
    setMovie: (movie: Movie) => void;
    setShowtime: (showtime: Showtime) => void;
    addSeat: (seat: SelectedSeat) => void;
    removeSeat: (seatId: string) => void;
    clearSeats: () => void;
    setReservationId: (id: string) => void;
    calculateTotalPrice: () => void;
    nextStep: () => void;
    previousStep: () => void;
    goToStep: (step: number) => void;
    resetBooking: () => void;
}

const bookingSteps: BookingStep[] = [
    { id: 1, name: 'Select Movie', description: 'Choose a movie to watch' },
    { id: 2, name: 'Select Showtime', description: 'Pick a date and time' },
    { id: 3, name: 'Select Seats', description: 'Choose your seats' },
    { id: 4, name: 'Payment', description: 'Complete your booking' },
    { id: 5, name: 'Confirmation', description: 'Booking confirmed' },
];

export const useBookingStore = create<BookingState>((set, get) => ({
    // Initial state
    movie: null,
    showtime: null,
    selectedSeats: [],
    totalPrice: 0,
    reservationId: null,
    currentStep: 1,
    steps: bookingSteps,

    // Set movie
    setMovie: (movie) => {
        set({ movie });
    },

    // Set showtime
    setShowtime: (showtime) => {
        set({ showtime });
        get().calculateTotalPrice();
    },

    // Add seat to selection
    addSeat: (seat) => {
        const { selectedSeats } = get();
        const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);

        if (!isAlreadySelected) {
            set({ selectedSeats: [...selectedSeats, seat] });
            get().calculateTotalPrice();
        }
    },

    // Remove seat from selection
    removeSeat: (seatId) => {
        const { selectedSeats } = get();
        set({
            selectedSeats: selectedSeats.filter((seat) => seat.id !== seatId),
        });
        get().calculateTotalPrice();
    },

    // Clear all selected seats
    clearSeats: () => {
        set({ selectedSeats: [], totalPrice: 0 });
    },

    // Set reservation ID
    setReservationId: (id) => {
        set({ reservationId: id });
    },

    // Calculate total price
    calculateTotalPrice: () => {
        const { showtime, selectedSeats } = get();
        if (showtime && selectedSeats.length > 0) {
            const price = showtime.price * selectedSeats.length;
            set({ totalPrice: price });
        } else {
            set({ totalPrice: 0 });
        }
    },

    // Go to next step
    nextStep: () => {
        const { currentStep, steps } = get();
        if (currentStep < steps.length) {
            set({ currentStep: currentStep + 1 });
        }
    },

    // Go to previous step
    previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
            set({ currentStep: currentStep - 1 });
        }
    },

    // Go to specific step
    goToStep: (step) => {
        const { steps } = get();
        if (step >= 1 && step <= steps.length) {
            set({ currentStep: step });
        }
    },

    // Reset entire booking
    resetBooking: () => {
        set({
            movie: null,
            showtime: null,
            selectedSeats: [],
            totalPrice: 0,
            reservationId: null,
            currentStep: 1,
        });
    },
}));