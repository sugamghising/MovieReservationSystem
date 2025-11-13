# API Endpoints & Hooks - Complete Implementation

## Overview

All API endpoints have been implemented with TypeScript type safety and React Query hooks for easy data fetching and mutations.

---

## 📁 API Endpoints (`src/api/endpoints/`)

### 1. **Authentication** (`auth.ts`)

- ✅ `authApi.login(data)` - User login
- ✅ `authApi.register(data)` - User registration
- ✅ `authApi.getCurrentUser()` - Get current user profile

### 2. **Movies** (`movies.ts`)

**Public:**

- ✅ `moviesApi.getMovies(params)` - Get paginated movies list
- ✅ `moviesApi.getMovieById(id)` - Get single movie details

**Admin:**

- ✅ `moviesApi.createMovie(data)` - Create new movie
- ✅ `moviesApi.updateMovie(id, data)` - Update movie
- ✅ `moviesApi.deleteMovie(id)` - Delete movie

### 3. **Showtimes** (`showtimes.ts`)

**Public:**

- ✅ `showtimesApi.getShowtimes(params)` - Get paginated showtimes
- ✅ `showtimesApi.getShowtimesByMovie(movieId)` - Get showtimes for a movie
- ✅ `showtimesApi.getAvailableSeats(showtimeId)` - Get available seats

**Admin:**

- ✅ `showtimesApi.createShowtime(data)` - Create showtime
- ✅ `showtimesApi.updateShowtime(id, data)` - Update showtime
- ✅ `showtimesApi.deleteShowtime(id)` - Delete showtime

### 4. **Theaters** (`theaters.ts`)

**Public:**

- ✅ `theatersApi.getTheaters(params)` - Get paginated theaters

**Admin:**

- ✅ `theatersApi.createTheater(data)` - Create theater
- ✅ `theatersApi.addSeat(theaterId, data)` - Add seat to theater
- ✅ `theatersApi.getTheaterSeats(theaterId)` - Get theater seats

### 5. **Reservations** (`reservations.ts`)

**User:**

- ✅ `reservationsApi.createReservation(data)` - Create reservation
- ✅ `reservationsApi.getUserReservations(params)` - Get user's reservations
- ✅ `reservationsApi.getReservationById(id)` - Get reservation details
- ✅ `reservationsApi.cancelReservation(id)` - Cancel reservation

### 6. **Payments** (`payment.ts`)

- ✅ `paymentApi.createPaymentIntent(data)` - Create Stripe payment intent
- ✅ `paymentApi.confirmPayment(paymentId)` - Confirm payment
- ✅ `paymentApi.getPayment(paymentId)` - Get payment details
- ✅ `paymentApi.getPaymentByReservation(reservationId)` - Get payment by reservation
- ✅ `paymentApi.refundPayment(paymentId, data)` - Request refund

### 7. **Analytics** (`analytics.ts`) - Admin Only

- ✅ `analyticsApi.getDashboardOverview()` - Get dashboard stats
- ✅ `analyticsApi.getRevenueReport(params)` - Get revenue analytics
- ✅ `analyticsApi.getOccupancyReport(params)` - Get occupancy data
- ✅ `analyticsApi.getPopularMovies(params)` - Get popular movies
- ✅ `analyticsApi.getCancellationReport(params)` - Get cancellation stats

---

## 🪝 React Query Hooks (`src/hooks/`)

### **Movies Hooks** (`useMovies.ts`)

```typescript
// Queries
useMovies(params); // Get movies list
useMovieDetail(id); // Get movie details

// Mutations (Admin)
useCreateMovie(); // Create movie
useUpdateMovie(); // Update movie
useDeleteMovie(); // Delete movie
```

### **Showtimes Hooks** (`useShowtimes.ts`)

```typescript
// Queries
useShowtimes(params); // Get showtimes list
useShowtimesByMovie(movieId); // Get showtimes by movie
useAvailableSeats(showtimeId); // Get available seats

// Mutations (Admin)
useCreateShowtime(); // Create showtime
useUpdateShowtime(); // Update showtime
useDeleteShowtime(); // Delete showtime
```

### **Theaters Hooks** (`useTheaters.ts`)

```typescript
// Queries
useTheaters(params); // Get theaters list
useTheaterSeats(theaterId); // Get theater seats (Admin)

// Mutations (Admin)
useCreateTheater(); // Create theater
useAddSeat(); // Add seat to theater
```

### **Reservations Hooks** (`useReservations.ts`)

```typescript
// Queries
useReservations(params); // Get user reservations
useReservation(id); // Get reservation details

// Mutations
useCreateReservation(); // Create reservation
useCancelReservation(); // Cancel reservation
```

### **Payment Hooks** (`usePayment.ts`)

```typescript
// Queries
usePayment(paymentId); // Get payment details
usePaymentByReservation(reservationId); // Get payment by reservation

// Mutations
useCreatePaymentIntent(); // Create payment intent
useConfirmPayment(); // Confirm payment
useRefundPayment(); // Request refund
```

### **Analytics Hooks** (`useAnalytics.ts`) - Admin Only

```typescript
useDashboardOverview(); // Dashboard stats
useRevenueReport(params); // Revenue analytics
useOccupancyReport(params); // Occupancy data
usePopularMovies(params); // Popular movies
useCancellationReport(params); // Cancellation stats
```

---

## 🎯 Usage Examples

### **Fetching Movies**

```typescript
import { useMovies } from "@/hooks";

function MoviesList() {
  const { data, isLoading, error } = useMovies({
    page: 1,
    limit: 20,
    genre: "Action",
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading movies</div>;

  return (
    <div>
      {data?.data.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
```

### **Creating a Reservation**

```typescript
import { useCreateReservation } from "@/hooks";

function BookingPage() {
  const createReservation = useCreateReservation();

  const handleBooking = async () => {
    await createReservation.mutateAsync({
      showtimeId: "123",
      seatIds: [1, 2, 3],
    });
  };

  return (
    <button onClick={handleBooking} disabled={createReservation.isPending}>
      Confirm Booking
    </button>
  );
}
```

### **Admin - Creating Movie**

```typescript
import { useCreateMovie } from "@/hooks";

function CreateMovieForm() {
  const createMovie = useCreateMovie();

  const onSubmit = async (data) => {
    await createMovie.mutateAsync({
      title: data.title,
      description: data.description,
      genre: data.genre,
      duration: data.duration,
      releaseDate: data.releaseDate,
      posterUrl: data.posterUrl,
      rating: data.rating,
    });
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### **Payment Flow**

```typescript
import { useCreatePaymentIntent, useConfirmPayment } from "@/hooks";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

function CheckoutForm({ reservationId }) {
  const stripe = useStripe();
  const elements = useElements();
  const createIntent = useCreatePaymentIntent();
  const confirmPayment = useConfirmPayment();

  const handlePayment = async () => {
    // 1. Create payment intent
    const { clientSecret, paymentId } = await createIntent.mutateAsync({
      reservationId,
    });

    // 2. Confirm with Stripe
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (!error) {
      // 3. Confirm payment in backend
      await confirmPayment.mutateAsync(paymentId);
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
}
```

---

## ✨ Features

### **Type Safety**

- All endpoints have TypeScript interfaces
- Request/response types defined
- Auto-completion in IDE

### **Error Handling**

- Toast notifications for success/error
- Automatic error messages
- Easy to customize

### **Cache Management**

- Automatic query invalidation
- Optimistic updates supported
- Background refetching

### **Loading States**

- `isLoading` - Initial load
- `isPending` - Mutation in progress
- `isFetching` - Background refresh

---

## 📦 Files Created

```
src/
├── api/
│   └── endpoints/
│       ├── index.ts           ✅ Export all endpoints
│       ├── auth.ts            ✅ Authentication
│       ├── movies.ts          ✅ Movies (complete)
│       ├── showtimes.ts       ✅ Showtimes (complete)
│       ├── theaters.ts        ✅ Theaters (complete)
│       ├── reservations.ts    ✅ Reservations (complete)
│       ├── payment.ts         ✅ Payments (complete)
│       └── analytics.ts       ✅ Analytics (complete)
└── hooks/
    ├── index.ts               ✅ Export all hooks
    ├── useMovies.ts           ✅ Movies hooks
    ├── useShowtimes.ts        ✅ Showtimes hooks
    ├── useTheaters.ts         ✅ Theaters hooks
    ├── useReservations.ts     ✅ Reservations hooks
    ├── usePayment.ts          ✅ Payment hooks
    └── useAnalytics.ts        ✅ Analytics hooks
```

---

## 🚀 Next Steps

1. **Create Pages** - Use hooks in actual page components
2. **Form Components** - Admin forms for CRUD operations
3. **Stripe Integration** - Complete payment UI with Stripe Elements
4. **Analytics Dashboard** - Admin dashboard with charts
5. **Error Boundaries** - Global error handling
6. **Testing** - Unit tests for hooks and endpoints

---

All endpoints are now ready to use! 🎉
