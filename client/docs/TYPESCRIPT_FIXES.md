# TypeScript Error Fixes

## Summary

Fixed all TypeScript compilation errors in the client application. The issues were primarily related to type mismatches between API types and component usage.

## Fixes Applied

### 1. Type Definitions (`src/types/models.ts`)

- Made `Seat.row` and `Seat.number` required (non-optional) since they're computed from API data
- Added `Theater.location` as optional property
- These changes ensure extended models have the correct shape expected by components

### 2. MovieCard Component

**File**: `src/components/movies/MovieCard.tsx`

- Changed import from `@/api/types` to `@/types/models` to use extended Movie type with `rating` property
- Added fallback for null `posterUrl`: `movie.posterUrl || '/placeholder-movie.jpg'`
- Fixed type error: "Type 'string | null' is not assignable to type 'string | undefined'"

### 3. MovieFilters Component

**File**: `src/components/movies/MovieFilters.tsx`

- Fixed 4 occurrences of type casting issues in Select components
- Changed from `value as MovieFilters["sortBy"]` to `value || "title"` (with fallback)
- Changed from `value as MovieFilters["sortOrder"]` to `value || "asc"` (with fallback)
- Fixed error: "Argument of type 'string | undefined' is not assignable to parameter of type 'string'"

### 4. ShowtimeCard Component

**File**: `src/components/showtimes/ShowtimeCard.tsx`

- Changed import from `@/api/types` to `@/types/models` to use extended Showtime type
- Changed `||` to `??` for null coalescing: `showtime.availableSeats ?? 0`
- Fixed missing properties: `availableSeats` and `totalSeats` now available in extended type

### 5. SeatMap Component

**File**: `src/components/booking/SeatMap.tsx`

- Changed import from `@/api/types` to `@/types/models` to use extended Seat type
- Updated interface: `selectedSeats: string[]` (was `number[]`)
- Updated interface: `onSeatSelect: (seatId: string) => void` (was `number`)
- Removed fallback `|| "A"` since `seat.row` is now required
- Fixed all Seat property access errors (row, number, status)

### 6. BookingSummary Component

**File**: `src/components/booking/BookingSummary.tsx`

- Changed import from `@/api/types` to `@/types/models` to use extended types
- Removed location display since it's not in the base API Theater type
- Component now uses proper typed imports

### 7. ReservationCard Component

**File**: `src/components/reservations/ReservationCard.tsx`

- Changed import from `@/api/types` to `@/types/models` to use extended Reservation type
- Updated interface: `onCancel?: (reservationId: string) => void` (was `number`)
- Updated interface: `onViewDetails?: (reservationId: string) => void` (was `number`)
- Fixed status comparison: Changed `"PENDING"` and `"CONFIRMED"` to `"HELD"` and `"BOOKED"` to match API enum
- Updated status badge variants to include all API statuses: `HELD`, `BOOKED`, `CANCELLED`, `EXPIRED`
- Fixed seats display: Changed from `reservation.seats` to `reservation.reservationSeats` to match API structure
- Updated seat mapping: `reservation.reservationSeats.map((rs) => rs.seat.seatNumber)`

### 8. Browser Utility

**File**: `src/lib/browser.ts`

- Fixed "Unexpected any" error in touch detection
- Changed `(navigator as any).msMaxTouchPoints` to proper type assertion:
  ```typescript
  "msMaxTouchPoints" in navigator &&
    (navigator as unknown as { msMaxTouchPoints: number }).msMaxTouchPoints > 0;
  ```

## Type System Strategy

### API Types vs Extended Types

- **API Types** (`src/api/types.ts`): Match backend response structure exactly
- **Extended Types** (`src/types/models.ts`): Add computed properties and UI-specific fields
- Components use **Extended Types** for richer functionality

### Key Type Extensions

```typescript
// Extended Seat with computed fields
export interface Seat extends ApiSeat {
  row: string; // Computed from rowLabel
  number: number; // Computed from seatNumber
  status: "AVAILABLE" | "OCCUPIED" | "BLOCKED" | "HELD";
  isSelected?: boolean;
  price?: number;
}

// Extended Movie with ratings and computed fields
export interface Movie extends ApiMovie {
  rating?: number;
  formattedDuration?: string;
  genreList?: string[];
  isReleased?: boolean;
}

// Extended Showtime with availability
export interface Showtime extends ApiShowtime {
  availableSeats?: number;
  totalSeats?: number;
  occupancyRate?: number;
  isExpired?: boolean;
}
```

## Verification

All TypeScript errors resolved. Project now compiles without errors:

```bash
✓ No TypeScript errors found
```

## Best Practices Applied

1. ✅ Consistent type imports across components
2. ✅ Proper null/undefined handling with nullish coalescing (`??`)
3. ✅ Type-safe Select component value handling with fallbacks
4. ✅ Correct API type matching (reservation statuses, ID types)
5. ✅ Avoiding `any` types with proper type assertions
6. ✅ Using extended types for UI components
7. ✅ Maintaining API type accuracy
