import { create } from 'zustand';

interface ModalState {
    isOpen: boolean;
    data?: unknown;
}

interface UIState {
    // Sidebar state
    sidebarOpen: boolean;
    mobileSidebarOpen: boolean;

    // Modal states
    loginModal: ModalState;
    registerModal: ModalState;
    confirmModal: ModalState;

    // Loading states
    globalLoading: boolean;
    loadingMessage: string | null;

    // Notification/Toast
    notifications: Notification[];

    // Actions - Sidebar
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleMobileSidebar: () => void;
    setMobileSidebarOpen: (open: boolean) => void;

    // Actions - Modals
    openLoginModal: () => void;
    closeLoginModal: () => void;
    openRegisterModal: () => void;
    closeRegisterModal: () => void;
    openConfirmModal: (data?: unknown) => void;
    closeConfirmModal: () => void;

    // Actions - Loading
    setGlobalLoading: (loading: boolean, message?: string) => void;

    // Actions - Notifications
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
}

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

export const useUIStore = create<UIState>((set) => ({
    // Initial state
    sidebarOpen: true,
    mobileSidebarOpen: false,
    loginModal: { isOpen: false },
    registerModal: { isOpen: false },
    confirmModal: { isOpen: false },
    globalLoading: false,
    loadingMessage: null,
    notifications: [],

    // Sidebar actions
    toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
    },

    setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
    },

    toggleMobileSidebar: () => {
        set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen }));
    },

    setMobileSidebarOpen: (open) => {
        set({ mobileSidebarOpen: open });
    },

    // Modal actions
    openLoginModal: () => {
        set({ loginModal: { isOpen: true } });
    },

    closeLoginModal: () => {
        set({ loginModal: { isOpen: false } });
    },

    openRegisterModal: () => {
        set({ registerModal: { isOpen: true } });
    },

    closeRegisterModal: () => {
        set({ registerModal: { isOpen: false } });
    },

    openConfirmModal: (data) => {
        set({ confirmModal: { isOpen: true, data } });
    },

    closeConfirmModal: () => {
        set({ confirmModal: { isOpen: false, data: undefined } });
    },

    // Loading actions
    setGlobalLoading: (loading, message) => {
        set({ globalLoading: loading, loadingMessage: message || null });
    },

    // Notification actions
    addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random()}`;
        set((state) => ({
            notifications: [...state.notifications, { ...notification, id }],
        }));

        // Auto-remove after duration
        if (notification.duration) {
            setTimeout(() => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                }));
            }, notification.duration);
        }
    },

    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        }));
    },

    clearNotifications: () => {
        set({ notifications: [] });
    },
}));
