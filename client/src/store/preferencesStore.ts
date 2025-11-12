import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type Language = 'en' | 'es' | 'fr' | 'de';
type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD';

interface PreferencesState {
    // Theme
    theme: Theme;

    // Locale
    language: Language;
    currency: Currency;

    // Display preferences
    compactView: boolean;
    showPosterImages: boolean;
    autoPlayTrailers: boolean;

    // Notifications
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;

    // Booking preferences
    preferredPaymentMethod: 'card' | 'paypal' | null;
    rememberSeatingPreference: boolean;
    preferredSeatRow: string | null;

    // Privacy
    allowAnalytics: boolean;
    allowMarketing: boolean;

    // Actions
    setTheme: (theme: Theme) => void;
    setLanguage: (language: Language) => void;
    setCurrency: (currency: Currency) => void;
    setCompactView: (compact: boolean) => void;
    setShowPosterImages: (show: boolean) => void;
    setAutoPlayTrailers: (autoPlay: boolean) => void;
    setEmailNotifications: (enabled: boolean) => void;
    setPushNotifications: (enabled: boolean) => void;
    setSmsNotifications: (enabled: boolean) => void;
    setPreferredPaymentMethod: (method: 'card' | 'paypal' | null) => void;
    setRememberSeatingPreference: (remember: boolean) => void;
    setPreferredSeatRow: (row: string | null) => void;
    setAllowAnalytics: (allow: boolean) => void;
    setAllowMarketing: (allow: boolean) => void;
    resetPreferences: () => void;
}

const defaultPreferences = {
    theme: 'system' as Theme,
    language: 'en' as Language,
    currency: 'USD' as Currency,
    compactView: false,
    showPosterImages: true,
    autoPlayTrailers: false,
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    preferredPaymentMethod: null,
    rememberSeatingPreference: false,
    preferredSeatRow: null,
    allowAnalytics: true,
    allowMarketing: false,
};

export const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            ...defaultPreferences,

            setTheme: (theme) => set({ theme }),

            setLanguage: (language) => set({ language }),

            setCurrency: (currency) => set({ currency }),

            setCompactView: (compact) => set({ compactView: compact }),

            setShowPosterImages: (show) => set({ showPosterImages: show }),

            setAutoPlayTrailers: (autoPlay) => set({ autoPlayTrailers: autoPlay }),

            setEmailNotifications: (enabled) => set({ emailNotifications: enabled }),

            setPushNotifications: (enabled) => set({ pushNotifications: enabled }),

            setSmsNotifications: (enabled) => set({ smsNotifications: enabled }),

            setPreferredPaymentMethod: (method) => set({ preferredPaymentMethod: method }),

            setRememberSeatingPreference: (remember) => set({ rememberSeatingPreference: remember }),

            setPreferredSeatRow: (row) => set({ preferredSeatRow: row }),

            setAllowAnalytics: (allow) => set({ allowAnalytics: allow }),

            setAllowMarketing: (allow) => set({ allowMarketing: allow }),

            resetPreferences: () => set(defaultPreferences),
        }),
        {
            name: 'user-preferences',
        }
    )
);
