import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Showtime, Seat } from '@/api/types';

export interface CartItem {
    id: string;
    showtime: Showtime;
    seats: Seat[];
    totalPrice: number;
    addedAt: Date;
}

interface CartState {
    items: CartItem[];

    // Actions
    addToCart: (showtime: Showtime, seats: Seat[]) => void;
    removeFromCart: (itemId: string) => void;
    updateCartItem: (itemId: string, seats: Seat[]) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            // Add item to cart
            addToCart: (showtime, seats) => {
                const totalPrice = showtime.price * seats.length;
                const newItem: CartItem = {
                    id: `${showtime.id}-${Date.now()}`,
                    showtime,
                    seats,
                    totalPrice,
                    addedAt: new Date(),
                };

                set((state) => ({
                    items: [...state.items, newItem],
                }));
            },

            // Remove item from cart
            removeFromCart: (itemId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== itemId),
                }));
            },

            // Update cart item seats
            updateCartItem: (itemId, seats) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === itemId
                            ? {
                                ...item,
                                seats,
                                totalPrice: item.showtime.price * seats.length,
                            }
                            : item
                    ),
                }));
            },

            // Clear entire cart
            clearCart: () => {
                set({ items: [] });
            },

            // Get total price of all items
            getCartTotal: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.totalPrice, 0);
            },

            // Get total number of items
            getCartItemCount: () => {
                const { items } = get();
                return items.length;
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);