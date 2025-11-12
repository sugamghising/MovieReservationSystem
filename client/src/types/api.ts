// API request and response types that don't fit in other categories

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
    statusCode?: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface SearchParams extends PaginationParams {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface DateRangeParams {
    startDate?: string;
    endDate?: string;
}

// Stripe types
export interface StripePaymentIntent {
    clientSecret: string;
    paymentIntentId: string;
}

export interface StripeCardDetails {
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
}

// File upload types
export interface FileUploadResponse {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
}

// Validation types
export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResponse {
    isValid: boolean;
    errors?: ValidationError[];
}

// Webhook types
export interface WebhookPayload {
    event: string;
    data: unknown;
    timestamp: string;
}

// Auth token types
export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

export interface RefreshTokenResponse {
    token: string;
    expiresIn: number;
}
