import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email('Invalid email address');

export const isValidEmail = (email: string): boolean => {
    return emailSchema.safeParse(email).success;
};

// Password validation
export const passwordSchema = z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters');

export const strongPasswordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const isValidPassword = (password: string): boolean => {
    return passwordSchema.safeParse(password).success;
};

export const isStrongPassword = (password: string): boolean => {
    return strongPasswordSchema.safeParse(password).success;
};

// Name validation
export const nameSchema = z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const isValidName = (name: string): boolean => {
    return nameSchema.safeParse(name).success;
};

// Phone number validation
export const phoneSchema = z
    .string()
    .regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Invalid phone number format');

export const isValidPhone = (phone: string): boolean => {
    return phoneSchema.safeParse(phone).success;
};

// URL validation
export const urlSchema = z.string().url('Invalid URL format');

export const isValidUrl = (url: string): boolean => {
    return urlSchema.safeParse(url).success;
};

// Date validation
export const dateSchema = z.string().datetime({ message: 'Invalid date format' });

export const futureDateSchema = z.string().refine(
    (date) => new Date(date) > new Date(),
    { message: 'Date must be in the future' }
);

export const isValidDate = (date: string): boolean => {
    return dateSchema.safeParse(date).success;
};

export const isFutureDate = (date: string): boolean => {
    return futureDateSchema.safeParse(date).success;
};

// Number validation
export const positiveNumberSchema = z.number().positive('Must be a positive number');

export const priceSchema = z
    .number()
    .positive('Price must be positive')
    .max(10000, 'Price must be less than $10,000');

export const durationSchema = z
    .number()
    .int('Duration must be a whole number')
    .positive('Duration must be positive')
    .min(1, 'Duration must be at least 1 minute')
    .max(600, 'Duration must be less than 10 hours');

export const isValidPrice = (price: number): boolean => {
    return priceSchema.safeParse(price).success;
};

export const isValidDuration = (duration: number): boolean => {
    return durationSchema.safeParse(duration).success;
};

// Credit card validation
export const creditCardSchema = z
    .string()
    .regex(/^[0-9]{13,19}$/, 'Invalid credit card number');

export const cvvSchema = z
    .string()
    .regex(/^[0-9]{3,4}$/, 'Invalid CVV');

export const isValidCreditCard = (cardNumber: string): boolean => {
    // Remove spaces and hyphens
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    return creditCardSchema.safeParse(cleaned).success;
};

export const isValidCVV = (cvv: string): boolean => {
    return cvvSchema.safeParse(cvv).success;
};

// Luhn algorithm for credit card validation
export const luhnCheck = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

// Seat validation
export const seatRowSchema = z
    .string()
    .length(1, 'Row must be a single letter')
    .regex(/^[A-Z]$/, 'Row must be an uppercase letter');

export const seatNumberSchema = z
    .number()
    .int('Seat number must be a whole number')
    .positive('Seat number must be positive')
    .max(99, 'Seat number must be less than 100');

export const isValidSeatRow = (row: string): boolean => {
    return seatRowSchema.safeParse(row).success;
};

export const isValidSeatNumber = (number: number): boolean => {
    return seatNumberSchema.safeParse(number).success;
};

// Movie validation schemas
export const movieTitleSchema = z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters');

export const movieDescriptionSchema = z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters');

export const genreSchema = z
    .string()
    .min(1, 'Genre is required')
    .max(200, 'Genre must be less than 200 characters');

export const ratingSchema = z
    .number()
    .min(0, 'Rating must be at least 0')
    .max(10, 'Rating must be at most 10');

// Theater validation
export const theaterNameSchema = z
    .string()
    .min(1, 'Theater name is required')
    .max(100, 'Theater name must be less than 100 characters');

export const capacitySchema = z
    .number()
    .int('Capacity must be a whole number')
    .positive('Capacity must be positive')
    .max(1000, 'Capacity must be less than 1000');

// Reservation validation
export const reservationSeatsSchema = z
    .array(z.number())
    .min(1, 'At least one seat must be selected')
    .max(10, 'Maximum 10 seats per reservation');

export const isValidReservationSeats = (seatIds: number[]): boolean => {
    return reservationSeatsSchema.safeParse(seatIds).success;
};

// General validation helpers
export const isEmpty = (value: unknown): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

export const isNotEmpty = (value: unknown): boolean => {
    return !isEmpty(value);
};

export const isBetween = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
};

export const isLengthBetween = (str: string, min: number, max: number): boolean => {
    return str.length >= min && str.length <= max;
};

export const containsOnlyNumbers = (str: string): boolean => {
    return /^\d+$/.test(str);
};

export const containsOnlyLetters = (str: string): boolean => {
    return /^[a-zA-Z]+$/.test(str);
};

export const containsOnlyAlphanumeric = (str: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(str);
};
