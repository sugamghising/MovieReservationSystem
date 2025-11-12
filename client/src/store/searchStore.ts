import { create } from 'zustand';
import type { Movie, Showtime, Reservation } from '@/types';

interface Filter {
    genre?: string[];
    rating?: string;
    priceRange?: [number, number];
    date?: Date;
    theaterId?: string;
}

interface Sort {
    field: string;
    order: 'asc' | 'desc';
}

interface SearchState {
    // Search query
    query: string;

    // Filters
    filters: Filter;

    // Sorting
    sort: Sort;

    // Results
    movieResults: Movie[];
    showtimeResults: Showtime[];
    reservationResults: Reservation[];

    // Pagination
    currentPage: number;
    totalPages: number;
    totalResults: number;

    // Loading state
    isSearching: boolean;

    // Recent searches
    recentSearches: string[];

    // Actions
    setQuery: (query: string) => void;
    setFilters: (filters: Partial<Filter>) => void;
    clearFilters: () => void;
    setSort: (sort: Sort) => void;
    setMovieResults: (results: Movie[], total: number, pages: number) => void;
    setShowtimeResults: (results: Showtime[], total: number, pages: number) => void;
    setReservationResults: (results: Reservation[], total: number, pages: number) => void;
    setCurrentPage: (page: number) => void;
    setIsSearching: (searching: boolean) => void;
    addRecentSearch: (query: string) => void;
    clearRecentSearches: () => void;
    resetSearch: () => void;
}

const initialFilters: Filter = {};

const initialSort: Sort = {
    field: 'createdAt',
    order: 'desc',
};

export const useSearchStore = create<SearchState>((set) => ({
    // Initial state
    query: '',
    filters: initialFilters,
    sort: initialSort,
    movieResults: [],
    showtimeResults: [],
    reservationResults: [],
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
    isSearching: false,
    recentSearches: [],

    // Actions
    setQuery: (query) => {
        set({ query, currentPage: 1 });
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
            currentPage: 1,
        }));
    },

    clearFilters: () => {
        set({ filters: initialFilters, currentPage: 1 });
    },

    setSort: (sort) => {
        set({ sort, currentPage: 1 });
    },

    setMovieResults: (results, total, pages) => {
        set({
            movieResults: results,
            totalResults: total,
            totalPages: pages,
            isSearching: false,
        });
    },

    setShowtimeResults: (results, total, pages) => {
        set({
            showtimeResults: results,
            totalResults: total,
            totalPages: pages,
            isSearching: false,
        });
    },

    setReservationResults: (results, total, pages) => {
        set({
            reservationResults: results,
            totalResults: total,
            totalPages: pages,
            isSearching: false,
        });
    },

    setCurrentPage: (page) => {
        set({ currentPage: page });
    },

    setIsSearching: (searching) => {
        set({ isSearching: searching });
    },

    addRecentSearch: (query) => {
        if (!query.trim()) return;

        set((state) => {
            const searches = [query, ...state.recentSearches.filter((s) => s !== query)];
            return {
                recentSearches: searches.slice(0, 10), // Keep only last 10 searches
            };
        });
    },

    clearRecentSearches: () => {
        set({ recentSearches: [] });
    },

    resetSearch: () => {
        set({
            query: '',
            filters: initialFilters,
            sort: initialSort,
            movieResults: [],
            showtimeResults: [],
            reservationResults: [],
            currentPage: 1,
            totalPages: 0,
            totalResults: 0,
            isSearching: false,
        });
    },
}));
