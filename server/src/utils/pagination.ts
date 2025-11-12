/**
 * Pagination utility functions
 */

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginationMeta {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

/**
 * Calculate pagination parameters
 */
export function getPaginationParams(page?: number, limit?: number) {
    const DEFAULT_PAGE = 1;
    const DEFAULT_LIMIT = 20;
    const MAX_LIMIT = 100;

    const currentPage = Math.max(1, page || DEFAULT_PAGE);
    const itemsPerPage = Math.min(
        Math.max(1, limit || DEFAULT_LIMIT),
        MAX_LIMIT
    );
    const skip = (currentPage - 1) * itemsPerPage;

    return {
        skip,
        take: itemsPerPage,
        page: currentPage,
        limit: itemsPerPage,
    };
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
    totalItems: number,
    currentPage: number,
    itemsPerPage: number
): PaginationMeta {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
    };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
    data: T[],
    totalItems: number,
    currentPage: number,
    itemsPerPage: number
): PaginatedResponse<T> {
    return {
        data,
        meta: createPaginationMeta(totalItems, currentPage, itemsPerPage),
    };
}
