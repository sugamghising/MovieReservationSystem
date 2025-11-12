// Common types used across the application

export type Role = 'USER' | 'ADMIN';

export type SeatStatus = 'AVAILABLE' | 'OCCUPIED' | 'BLOCKED' | 'HELD';

export type ReservationStatus = 'HELD' | 'BOOKED' | 'CANCELLED' | 'EXPIRED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type SortOrder = 'asc' | 'desc';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface SelectOption {
    value: string;
    label: string;
}

export interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}

export interface PaginationState {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}

export interface FilterState {
    search?: string;
    genre?: string;
    sortBy?: string;
    sortOrder?: SortOrder;
}

export interface FormState<T> {
    data: T;
    errors: Partial<Record<keyof T, string>>;
    isSubmitting: boolean;
    isDirty: boolean;
}

export interface ModalState {
    isOpen: boolean;
    data?: unknown;
}

export interface ToastOptions {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncState<T> = {
    data: Nullable<T>;
    isLoading: boolean;
    error: Nullable<Error>;
};
