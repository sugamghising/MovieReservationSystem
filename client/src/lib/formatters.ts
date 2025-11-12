import { format, formatDistance, formatRelative, parseISO } from 'date-fns';

// Date and time formatters
export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
};

export const formatTime = (date: string | Date, formatStr: string = 'h:mm a'): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
};

export const formatDateTime = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy h:mm a');
};

export const formatRelativeTime = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
};

export const formatRelativeDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatRelative(dateObj, new Date());
};

// Currency formatters
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

export const formatPrice = (price: number): string => {
    return formatCurrency(price);
};

// Number formatters
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

export const formatCompactNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(num);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
};

// Duration formatters
export const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
};

export const formatMovieDuration = (minutes: number): string => {
    return formatDuration(minutes);
};

// Seat formatters
export const formatSeatNumber = (row: string, number: number): string => {
    return `${row}${number}`;
};

export const formatSeatList = (seats: Array<{ row: string; number: number }>): string => {
    return seats.map(seat => formatSeatNumber(seat.row, seat.number)).join(', ');
};

// Status formatters
export const formatStatus = (status: string): string => {
    return status
        .split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
};

export const formatReservationStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        HELD: 'Held',
        BOOKED: 'Confirmed',
        CANCELLED: 'Cancelled',
        EXPIRED: 'Expired',
    };
    return statusMap[status] || formatStatus(status);
};

export const formatPaymentStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        PENDING: 'Pending',
        COMPLETED: 'Completed',
        FAILED: 'Failed',
        REFUNDED: 'Refunded',
    };
    return statusMap[status] || formatStatus(status);
};

// Text formatters
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

export const formatGenres = (genres: string): string[] => {
    return genres.split(',').map(g => g.trim());
};

export const formatGenreString = (genres: string): string => {
    return formatGenres(genres).join(' • ');
};

// File size formatter
export const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Phone number formatter
export const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
};

// Card number formatter
export const formatCardNumber = (cardNumber: string): string => {
    return cardNumber.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
};

export const maskCardNumber = (cardNumber: string): string => {
    const last4 = cardNumber.slice(-4);
    return `**** **** **** ${last4}`;
};

// Rating formatter
export const formatRating = (rating: number, maxRating: number = 10): string => {
    return `${rating.toFixed(1)}/${maxRating}`;
};

// Occupancy formatter
export const formatOccupancy = (occupied: number, total: number): string => {
    const percentage = total > 0 ? (occupied / total) * 100 : 0;
    return `${occupied}/${total} (${formatPercentage(percentage)})`;
};
