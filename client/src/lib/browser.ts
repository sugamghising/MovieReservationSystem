// Browser and environment detection utilities

export const isBrowser = typeof window !== 'undefined';

export const isServer = !isBrowser;

export const isProduction = import.meta.env.PROD;

export const isDevelopment = import.meta.env.DEV;

// Device detection
export const isMobile = (): boolean => {
    if (!isBrowser) return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
};

export const isTablet = (): boolean => {
    if (!isBrowser) return false;
    return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(
        navigator.userAgent
    );
};

export const isDesktop = (): boolean => {
    return !isMobile() && !isTablet();
};

// Browser detection
export const isChrome = (): boolean => {
    if (!isBrowser) return false;
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
};

export const isFirefox = (): boolean => {
    if (!isBrowser) return false;
    return /Firefox/.test(navigator.userAgent);
};

export const isSafari = (): boolean => {
    if (!isBrowser) return false;
    return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
};

export const isEdge = (): boolean => {
    if (!isBrowser) return false;
    return /Edg/.test(navigator.userAgent);
};

// OS detection
export const isWindows = (): boolean => {
    if (!isBrowser) return false;
    return /Win/.test(navigator.platform);
};

export const isMacOS = (): boolean => {
    if (!isBrowser) return false;
    return /Mac/.test(navigator.platform);
};

export const isLinux = (): boolean => {
    if (!isBrowser) return false;
    return /Linux/.test(navigator.platform);
};

export const isIOS = (): boolean => {
    if (!isBrowser) return false;
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
    if (!isBrowser) return false;
    return /Android/.test(navigator.userAgent);
};

// Feature detection
export const supportsLocalStorage = (): boolean => {
    if (!isBrowser) return false;
    try {
        const test = '__localStorage_test__';
        window.localStorage.setItem(test, test);
        window.localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
};

export const supportsSessionStorage = (): boolean => {
    if (!isBrowser) return false;
    try {
        const test = '__sessionStorage_test__';
        window.sessionStorage.setItem(test, test);
        window.sessionStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
};

export const supportsGeolocation = (): boolean => {
    return isBrowser && 'geolocation' in navigator;
};

export const supportsNotifications = (): boolean => {
    return isBrowser && 'Notification' in window;
};

export const supportsServiceWorker = (): boolean => {
    return isBrowser && 'serviceWorker' in navigator;
};

export const supportsTouchEvents = (): boolean => {
    if (!isBrowser) return false;
    return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        ('msMaxTouchPoints' in navigator && (navigator as unknown as { msMaxTouchPoints: number }).msMaxTouchPoints > 0)
    );
};

// Network detection
export const isOnline = (): boolean => {
    return isBrowser && navigator.onLine;
};

export const isOffline = (): boolean => {
    return !isOnline();
};

// Screen size utilities
export const getScreenWidth = (): number => {
    return isBrowser ? window.innerWidth : 0;
};

export const getScreenHeight = (): number => {
    return isBrowser ? window.innerHeight : 0;
};

export const isSmallScreen = (): boolean => {
    return getScreenWidth() < 640;
};

export const isMediumScreen = (): boolean => {
    const width = getScreenWidth();
    return width >= 640 && width < 1024;
};

export const isLargeScreen = (): boolean => {
    return getScreenWidth() >= 1024;
};

// Viewport detection
export const isInViewport = (element: HTMLElement): boolean => {
    if (!isBrowser) return false;
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Orientation detection
export const isPortrait = (): boolean => {
    if (!isBrowser) return true;
    return window.innerHeight > window.innerWidth;
};

export const isLandscape = (): boolean => {
    return !isPortrait();
};

// Dark mode detection
export const prefersDarkMode = (): boolean => {
    if (!isBrowser) return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const prefersLightMode = (): boolean => {
    if (!isBrowser) return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
};

// Reduced motion detection
export const prefersReducedMotion = (): boolean => {
    if (!isBrowser) return false;
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get device info
export const getDeviceInfo = () => {
    return {
        isMobile: isMobile(),
        isTablet: isTablet(),
        isDesktop: isDesktop(),
        isChrome: isChrome(),
        isFirefox: isFirefox(),
        isSafari: isSafari(),
        isEdge: isEdge(),
        isWindows: isWindows(),
        isMacOS: isMacOS(),
        isLinux: isLinux(),
        isIOS: isIOS(),
        isAndroid: isAndroid(),
        isOnline: isOnline(),
        screenWidth: getScreenWidth(),
        screenHeight: getScreenHeight(),
        isPortrait: isPortrait(),
        prefersDarkMode: prefersDarkMode(),
    };
};
