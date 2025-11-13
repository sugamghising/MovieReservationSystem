# Types & Utilities Documentation

Complete reference for all types and utility functions in the Movie Reservation System frontend.

---

## 📁 Types Directory (`src/types/`)

### **common.ts** - Common Types

```typescript
// Role Types
type Role = 'USER' | 'ADMIN';

// Status Types
type SeatStatus = 'AVAILABLE' | 'OCCUPIED' | 'BLOCKED' | 'HELD';
type ReservationStatus = 'HELD' | 'BOOKED' | 'CANCELLED' | 'EXPIRED';
type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// Utility Types
type SortOrder = 'asc' | 'desc';
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
type Nullable<T> = T | null;
type Optional<T> = T | undefined;

// State Interfaces
interface PaginationState
interface FilterState
interface FormState<T>
interface ModalState
interface AsyncState<T>
```

### **models.ts** - Domain Models

Extended types with computed properties:

- `Movie` - With rating, formatted duration, genre list
- `Theater` - With seats available, occupancy rate
- `Seat` - With row, number, status, selection state
- `Showtime` - With availability, formatted date/time
- `Reservation` - With seats, cancel ability
- `Payment` - With formatted amount, refund ability
- `User` - With admin flag, full name

### **api.ts** - API Types

Request/response types:

- `ApiResponse<T>` - Standard API response wrapper
- `ApiErrorResponse` - Error response structure
- `PaginationParams` - Pagination parameters
- `SearchParams` - Search and sort parameters
- `StripePaymentIntent` - Stripe integration types
- `ValidationError` - Form validation errors

---

## 🛠️ Lib Directory (`src/lib/`)

### **utils.ts** - General Utilities

#### String Utilities

```typescript
capitalize(str: string): string
capitalizeWords(str: string): string
slugify(str: string): string
randomString(length: number): string
```

#### Array Utilities

```typescript
chunk<T>(array: T[], size: number): T[][]
unique<T>(array: T[]): T[]
groupBy<T>(array: T[], key: keyof T): Record<string, T[]>
sortBy<T>(array: T[], key: keyof T, order?: 'asc' | 'desc'): T[]
```

#### Object Utilities

```typescript
pick<T>(obj: T, keys: K[]): Pick<T, K>
omit<T>(obj: T, keys: K[]): Omit<T, K>
isEmpty(obj: object): boolean
deepClone<T>(obj: T): T
```

#### Number Utilities

```typescript
clamp(value: number, min: number, max: number): number
randomInt(min: number, max: number): number
round(value: number, decimals?: number): number
```

#### Function Utilities

```typescript
debounce<T>(func: T, wait: number): Function
throttle<T>(func: T, limit: number): Function
sleep(ms: number): Promise<void>
```

#### Storage Utilities

```typescript
storage.get<T>(key: string, defaultValue?: T): T | null
storage.set<T>(key: string, value: T): void
storage.remove(key: string): void
storage.clear(): void
```

#### URL Utilities

```typescript
getQueryParams(url: string): Record<string, string>
buildQueryString(params: Record<string, unknown>): string
```

#### Clipboard & Download

```typescript
copyToClipboard(text: string): Promise<boolean>
downloadFile(url: string, filename: string): void
```

#### Date Utilities

```typescript
isToday(date: Date): boolean
isSameDay(date1: Date, date2: Date): boolean
addDays(date: Date, days: number): Date
```

---

### **formatters.ts** - Data Formatting

#### Date & Time

```typescript
formatDate(date: string | Date, format?: string): string
formatTime(date: string | Date, format?: string): string
formatDateTime(date: string | Date): string
formatRelativeTime(date: string | Date): string
formatRelativeDate(date: string | Date): string
```

#### Currency

```typescript
formatCurrency(amount: number, currency?: string): string
formatPrice(price: number): string
```

#### Numbers

```typescript
formatNumber(num: number): string
formatCompactNumber(num: number): string  // 1000 → 1K
formatPercentage(value: number, decimals?: number): string
```

#### Duration

```typescript
formatDuration(minutes: number): string  // 125 → 2h 5m
formatMovieDuration(minutes: number): string
```

#### Seats

```typescript
formatSeatNumber(row: string, number: number): string  // A, 5 → A5
formatSeatList(seats: Array<{row, number}>): string  // A5, A6, B1
```

#### Status

```typescript
formatStatus(status: string): string
formatReservationStatus(status: string): string
formatPaymentStatus(status: string): string
```

#### Text

```typescript
truncateText(text: string, maxLength: number): string
formatGenres(genres: string): string[]
formatGenreString(genres: string): string  // Action, Drama → Action • Drama
```

#### Other

```typescript
formatFileSize(bytes: number): string
formatPhoneNumber(phone: string): string
formatCardNumber(cardNumber: string): string
maskCardNumber(cardNumber: string): string  // **** **** **** 1234
formatRating(rating: number, maxRating?: number): string
formatOccupancy(occupied: number, total: number): string
```

---

### **validators.ts** - Input Validation

#### Email & Password

```typescript
isValidEmail(email: string): boolean
isValidPassword(password: string): boolean
isStrongPassword(password: string): boolean
```

#### Personal Info

```typescript
isValidName(name: string): boolean
isValidPhone(phone: string): boolean
```

#### URLs & Dates

```typescript
isValidUrl(url: string): boolean
isValidDate(date: string): boolean
isFutureDate(date: string): boolean
```

#### Numbers

```typescript
isValidPrice(price: number): boolean
isValidDuration(duration: number): boolean
```

#### Credit Cards

```typescript
isValidCreditCard(cardNumber: string): boolean
isValidCVV(cvv: string): boolean
luhnCheck(cardNumber: string): boolean  // Validate card with Luhn algorithm
```

#### Seats

```typescript
isValidSeatRow(row: string): boolean
isValidSeatNumber(number: number): boolean
```

#### Reservations

```typescript
isValidReservationSeats(seatIds: number[]): boolean
```

#### General Validators

```typescript
isEmpty(value: unknown): boolean
isNotEmpty(value: unknown): boolean
isBetween(value: number, min: number, max: number): boolean
isLengthBetween(str: string, min: number, max: number): boolean
containsOnlyNumbers(str: string): boolean
containsOnlyLetters(str: string): boolean
containsOnlyAlphanumeric(str: string): boolean
```

#### Zod Schemas

All validators have corresponding Zod schemas for form validation:

```typescript
emailSchema, passwordSchema, strongPasswordSchema;
nameSchema, phoneSchema, urlSchema;
dateSchema, futureDateSchema;
priceSchema, durationSchema;
creditCardSchema, cvvSchema;
seatRowSchema, seatNumberSchema;
movieTitleSchema, movieDescriptionSchema, genreSchema;
theaterNameSchema, capacitySchema;
reservationSeatsSchema;
```

---

### **browser.ts** - Environment Detection

#### Device Detection

```typescript
isMobile(): boolean
isTablet(): boolean
isDesktop(): boolean
```

#### Browser Detection

```typescript
isChrome(): boolean
isFirefox(): boolean
isSafari(): boolean
isEdge(): boolean
```

#### OS Detection

```typescript
isWindows(): boolean
isMacOS(): boolean
isLinux(): boolean
isIOS(): boolean
isAndroid(): boolean
```

#### Feature Detection

```typescript
supportsLocalStorage(): boolean
supportsSessionStorage(): boolean
supportsGeolocation(): boolean
supportsNotifications(): boolean
supportsServiceWorker(): boolean
supportsTouchEvents(): boolean
```

#### Network & Screen

```typescript
isOnline(): boolean
isOffline(): boolean
getScreenWidth(): number
getScreenHeight(): number
isSmallScreen(): boolean
isMediumScreen(): boolean
isLargeScreen(): boolean
```

#### Viewport & Orientation

```typescript
isInViewport(element: HTMLElement): boolean
isPortrait(): boolean
isLandscape(): boolean
```

#### Preferences

```typescript
prefersDarkMode(): boolean
prefersLightMode(): boolean
prefersReducedMotion(): boolean
```

#### Get All Info

```typescript
getDeviceInfo(): DeviceInfo  // Returns all device/browser info
```

---

### **hooks.ts** - Custom React Hooks

#### State Hooks

```typescript
usePrevious<T>(value: T): T | undefined
useMounted(): boolean
useToggle(initialValue?: boolean): [boolean, () => void, (v: boolean) => void]
```

#### Window & Media

```typescript
useWindowSize(): { width: number; height: number }
useMediaQuery(query: string): boolean
useOnlineStatus(): boolean
```

#### Storage

```typescript
useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]
```

#### Performance

```typescript
useDebounce<T>(value: T, delay: number): T
useInterval(callback: () => void, delay: number | null): void
```

#### DOM

```typescript
useIntersectionObserver(ref: RefObject<Element>, options?: IntersectionObserverInit): IntersectionObserverEntry | null
useClickOutside(ref: RefObject<HTMLElement>, handler: (event) => void): void
```

#### Utilities

```typescript
useCopyToClipboard(): { copiedText: string | null; copy: (text: string) => Promise<boolean> }
```

---

## 📦 Usage Examples

### Date Formatting

```typescript
import { formatDate, formatTime, formatRelativeTime } from "@/lib";

formatDate("2025-11-12"); // "Nov 12, 2025"
formatTime("2025-11-12T19:30:00"); // "7:30 PM"
formatRelativeTime("2025-11-10"); // "2 days ago"
```

### Validation

```typescript
import { isValidEmail, isStrongPassword, emailSchema } from "@/lib";

// Simple validation
isValidEmail("user@example.com"); // true

// Form validation with Zod
const schema = z.object({
  email: emailSchema,
  password: strongPasswordSchema,
});
```

### Array Operations

```typescript
import { groupBy, sortBy, chunk } from '@/lib';

const movies = [...];
const byGenre = groupBy(movies, 'genre');
const sorted = sortBy(movies, 'rating', 'desc');
const pages = chunk(movies, 20);
```

### Custom Hooks

```typescript
import { useDebounce, useMediaQuery, useLocalStorage } from "@/lib";

// Debounced search
const debouncedSearch = useDebounce(searchTerm, 500);

// Responsive design
const isMobile = useMediaQuery("(max-width: 768px)");

// Persistent state
const [theme, setTheme] = useLocalStorage("theme", "light");
```

### Device Detection

```typescript
import { isMobile, prefersDarkMode, getDeviceInfo } from "@/lib";

if (isMobile()) {
  // Show mobile menu
}

if (prefersDarkMode()) {
  // Enable dark theme
}

const info = getDeviceInfo();
console.log(info); // Full device/browser info
```

---

## 🎯 Best Practices

1. **Import from index**: Always import from `@/lib` or `@/types` for cleaner imports
2. **Type Safety**: Use TypeScript types throughout your application
3. **Validation**: Use Zod schemas for form validation with React Hook Form
4. **Formatting**: Use formatters for consistent display across the app
5. **Custom Hooks**: Use custom hooks to encapsulate reusable logic
6. **Browser Detection**: Check features before using (e.g., localStorage)

---

All utilities are fully typed and production-ready! 🚀
