# 🎬 Movie Reservation System

A full-stack movie ticket reservation platform with real-time seat booking, payment processing, and comprehensive admin analytics. Built with modern web technologies for a seamless cinema booking experience.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Screenshots](#screenshots)
- [Development](#development)
- [Contributing](#contributing)

---

## 🎯 Overview

The Movie Reservation System is a comprehensive solution for cinema operations, offering:

- **User Portal**: Browse movies, book seats, manage reservations, and process payments
- **Admin Dashboard**: Complete theater management, analytics, and business insights
- **Real-time Booking**: Concurrency-safe seat reservation with row-level locking
- **Payment Integration**: Stripe payment processing with webhook support
- **Analytics**: Revenue tracking, occupancy rates, popular movies, and cancellation metrics

---

## ✨ Features

### 🎭 User Features

- ✅ **User Authentication** - Register, login, and secure JWT-based sessions
- ✅ **Movie Browsing** - Search and filter movies by genre
- ✅ **Showtime Selection** - View available showtimes with theater information
- ✅ **Interactive Seat Selection** - Visual seat map with real-time availability
- ✅ **Booking Management** - View, manage, and cancel reservations
- ✅ **Secure Payments** - Stripe integration for card payments
- ✅ **Payment Confirmation** - Instant booking confirmation and receipt
- ✅ **Responsive Design** - Mobile-first UI with Tailwind CSS v4

### 👨‍💼 Admin Features

- ✅ **Movie Management** - Full CRUD operations for movie catalog
- ✅ **Theater Management** - Create theaters and configure seat layouts
- ✅ **Showtime Scheduling** - Schedule movies with automatic conflict detection
- ✅ **User Management** - View and manage user accounts
- ✅ **Analytics Dashboard** - Comprehensive business metrics:
  - 💰 Revenue reports with date range filtering
  - 📈 Occupancy rates by movie and theater
  - 🎬 Popular movies ranking by bookings and revenue
  - ❌ Cancellation analytics and lost revenue tracking
  - 📊 Daily trends and performance indicators

### 🔒 Security & Performance

- ✅ **Role-based Access Control** - Admin and User roles with protected routes
- ✅ **API Rate Limiting** - Tiered rate limits for different endpoint categories
- ✅ **Input Validation** - Zod schemas for all API requests
- ✅ **Transaction Safety** - Row-level locking to prevent double-booking
- ✅ **Password Security** - bcrypt hashing with 10 salt rounds
- ✅ **SQL Injection Protection** - Prisma ORM with parameterized queries
- ✅ **Pagination** - Efficient data loading with configurable limits

---

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js v18+
- **Framework**: Express.js v5
- **Language**: TypeScript v5.9
- **Database**: PostgreSQL v14+
- **ORM**: Prisma v6.19
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Rate Limiting**: express-rate-limit
- **Payment Processing**: Stripe
- **Logging**: Morgan

### Frontend

- **Framework**: React v19.2
- **Language**: TypeScript v5.9
- **Build Tool**: Vite v7.2
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: Zustand + TanStack React Query v5
- **Routing**: React Router v7
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Payment UI**: Stripe React Elements
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Utilities**: date-fns

---

## 📁 Project Structure

```
MovieReservationSystem/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── api/                # API client and types
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── layout/        # Layout components
│   │   │   └── features/      # Feature-specific components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility libraries
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── MoviesManagementPage.tsx
│   │   │   │   ├── TheatersManagementPage.tsx
│   │   │   │   ├── ShowtimesManagementPage.tsx
│   │   │   │   ├── UsersManagementPage.tsx
│   │   │   │   └── AnalyticsPage.tsx
│   │   │   ├── public/        # Public pages
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── MoviesPage.tsx
│   │   │   │   ├── MovieDetailPage.tsx
│   │   │   │   ├── ShowtimesPage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   └── user/          # User portal pages
│   │   │       ├── BookingPage.tsx
│   │   │       ├── CheckoutPage.tsx
│   │   │       ├── PaymentSuccessPage.tsx
│   │   │       ├── MyReservationsPage.tsx
│   │   │       ├── ReservationDetailPage.tsx
│   │   │       └── ProfilePage.tsx
│   │   ├── store/             # Zustand state management
│   │   ├── types/             # TypeScript type definitions
│   │   └── App.tsx            # Root component
│   ├── public/                # Static assets
│   └── package.json
│
├── server/                     # Backend API application
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   └── db.ts         # Prisma client setup
│   │   ├── controllers/       # Route handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── movie.controller.ts
│   │   │   ├── theatres.controller.ts
│   │   │   ├── showtimes.controller.ts
│   │   │   ├── reservations.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   └── analytic.controller.ts
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── role.middleware.ts
│   │   │   └── rate-limit.middleware.ts
│   │   ├── routes/            # API route definitions
│   │   ├── schemas/           # Zod validation schemas
│   │   ├── services/          # Business logic layer
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Helper functions
│   │   │   ├── hash.ts       # Password hashing
│   │   │   └── jwt.ts        # JWT utilities
│   │   └── index.ts          # Application entry point
│   └── package.json
│
└── README.md                  # This file
```

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** v14 or higher
- **npm** or **yarn**
- **Stripe Account** (for payment processing)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sugamghising/MovieReservationSystem.git
cd MovieReservationSystem
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd server
npm install
```

#### Environment Configuration

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/movie_reservation_db?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Database Setup

Run Prisma migrations to set up the database:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

#### Run the Backend

**Development mode:**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
npm start
```

The API will be available at `http://localhost:5000`

---

### 3. Frontend Setup

#### Install Dependencies

```bash
cd client
npm install
```

#### Environment Configuration

Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

#### Run the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints Overview

#### 🔐 Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

#### 🎬 Movies

- `GET /movies` - Get all movies (public, paginated)
- `GET /movies/:movieId` - Get single movie (public)
- `POST /movies` - Create movie (Admin only)
- `PUT /movies/:id` - Update movie (Admin only)
- `DELETE /movies/:movieId` - Delete movie (Admin only)

#### 🏛️ Theaters

- `GET /theatres` - Get all theaters (public, paginated)
- `POST /theatres` - Create theater (Admin only)
- `POST /theatres/:theatreId/seat` - Add seat to theater (Admin only)
- `GET /theatres/:theatreId/seat` - List seats in theater (Admin only, paginated)

#### 📅 Showtimes

- `GET /showtimes` - Get all showtimes with filters (public, paginated)
- `POST /showtimes` - Create showtime (Admin only)
- `GET /showtimes/movie/:movieId` - Get showtimes for a movie
- `GET /showtimes/:showtimeId/available-seats` - Get available seats
- `PUT /showtimes/:showtimeId` - Update showtime (Admin only)
- `DELETE /showtimes/:showtimeId` - Delete showtime (Admin only)

#### 🎫 Reservations

- `POST /reservations` - Create reservation (Authenticated users)
- `GET /reservations` - Get user's reservations (Authenticated users, paginated)
- `GET /reservations/:id` - Get single reservation (Authenticated users)
- `PUT /reservations/:id` - Cancel reservation (Authenticated users)

#### 💳 Payments

- `POST /payments/create-intent` - Create payment intent (Authenticated users)
- `POST /payments/:paymentId/confirm` - Confirm payment (Authenticated users)
- `GET /payments/:paymentId` - Get payment details (Authenticated users)
- `GET /payments/reservation/:reservationId` - Get payment by reservation (Authenticated users)
- `POST /payments/:paymentId/refund` - Refund payment (Authenticated users)
- `POST /payments/webhook` - Stripe webhook endpoint

#### 📊 Analytics (Admin Only)

- `GET /analytics/dashboard` - Get dashboard overview
- `GET /analytics/revenue` - Get revenue report
- `GET /analytics/occupancy` - Get occupancy report
- `GET /analytics/popular-movies` - Get popular movies report
- `GET /analytics/cancellations` - Get cancellation report

### Query Parameters

#### Pagination (All List Endpoints)

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

#### Movies Filters

- `genre` - Filter by genre
- `search` - Search in title and description

#### Showtimes Filters

- `movieId` - Filter by movie ID
- `date` - Filter by date (YYYY-MM-DD)

#### Reservations Filters

- `status` - Filter by status (HELD, BOOKED, CANCELLED, EXPIRED)

#### Analytics Filters

- `startDate` - Start date for date range (YYYY-MM-DD)
- `endDate` - End date for date range (YYYY-MM-DD)
- `limit` - Number of items (for popular movies)

### Rate Limits

The API implements tiered rate limiting:

- **Authentication endpoints**: 5 requests per 15 minutes
- **Reservation endpoints**: 20 requests per 15 minutes
- **Payment endpoints**: 10 requests per 15 minutes
- **Admin endpoints**: 50 requests per 15 minutes
- **Public read endpoints**: 200 requests per 15 minutes
- **General API**: 100 requests per 15 minutes

### Example API Calls

#### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Movies with Pagination

```bash
# Get page 2 with 10 items per page
GET /api/movies?page=2&limit=10

# Filter by genre
GET /api/movies?genre=Action&page=1&limit=20

# Search movies
GET /api/movies?search=spider&page=1
```

#### Create Reservation

```bash
POST /api/reservations
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "showtimeId": "showtime-uuid-here",
  "seatIds": ["seat-uuid-1", "seat-uuid-2"]
}
```

#### Create Payment Intent

```bash
POST /api/payments/create-intent
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "reservationId": "reservation-uuid-here"
}
```

---

## 🗄️ Database Schema

### Models

#### User

- Stores user account information
- Fields: id, name, email, passwordHash, role, createdAt
- Relations: reservations

#### Movie

- Stores movie information
- Fields: id, title, description, posterUrl, genre, durationMin, createdAt
- Relations: showtimes

#### Theater

- Stores theater/screen information
- Fields: id, name, capacity, createdAt
- Relations: seats, showtimes

#### Seat

- Stores individual seat information
- Fields: id, theaterId, row, number, label, type, extraPrice
- Relations: theater, reservationSeats
- Unique constraint: (theaterId, label)

#### Showtime

- Stores movie screening times
- Fields: id, movieId, theaterId, startTime, endTime, price, status, createdAt
- Relations: movie, theater, reservations, reservationSeats
- Unique constraint: (theaterId, startTime)

#### Reservation

- Stores user bookings
- Fields: id, userId, showtimeId, status, totalPrice, createdAt, expiresAt
- Enum Status: HELD, BOOKED, CANCELLED, EXPIRED
- Relations: user, showtime, seats, payment

#### ReservationSeat

- Junction table for reservation-seat relationships
- Fields: id, reservationId, seatId, showtimeId, priceAtBooking
- Relations: reservation, seat, showtime
- Unique constraint: (showtimeId, seatId)

#### Payment

- Stores payment transactions
- Fields: id, reservationId, amount, providerTxnId, status, createdAt
- Relations: reservation

---

## 🔒 Security Features

### Authentication & Authorization

- **JWT Tokens**: Secure, stateless authentication
- **Role-based Access Control**: Separate admin and user permissions
- **Password Security**: bcrypt hashing with 10 salt rounds
- **Protected Routes**: Middleware-enforced authentication checks

### API Security

- **Rate Limiting**: Prevents brute force and abuse attacks
- **Input Validation**: Zod schemas validate all request data
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **CORS Configuration**: Cross-origin request handling

### Data Integrity

- **Transaction Safety**: Database transactions for atomic operations
- **Row-level Locking**: FOR UPDATE locking prevents race conditions
- **Unique Constraints**: Prevents duplicate bookings and data conflicts
- **Cascade Deletion**: Maintains referential integrity

---

## 🎨 Frontend Features

### User Interface

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: shadcn/ui for consistent, accessible components
- **Interactive Seat Map**: Visual seat selection with availability status
- **Real-time Validation**: Form validation with React Hook Form + Zod
- **Toast Notifications**: User feedback for actions and errors
- **Loading States**: Skeleton loaders and progress indicators

### State Management

- **Zustand**: Lightweight state management for booking flow
- **TanStack Query**: Server state caching and synchronization
- **Local Storage**: Persist booking state across sessions

### Payment Integration

- **Stripe Elements**: Secure payment input components
- **Payment Intent Flow**: PCI-compliant payment processing
- **Webhook Handling**: Backend confirmation of payments
- **Error Handling**: User-friendly payment error messages

---

## 🧪 Development

### Backend Scripts

```bash
# Development server with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production server
npm start

# Open Prisma Studio (Database GUI)
npx prisma studio

# Run database migrations
npx prisma migrate dev

# Reset database (development only)
npx prisma migrate reset
```

### Frontend Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Database Management

View and edit your database in Prisma Studio:

```bash
cd server
npx prisma studio
```

Create a new migration:

```bash
cd server
npx prisma migrate dev --name your_migration_name
```

---

## 📊 Analytics Dashboard

The admin analytics dashboard provides comprehensive business insights:

### 📈 Dashboard Overview

- Today's reservations and revenue
- Total users, movies, theaters count
- Total confirmed reservations
- Upcoming showtimes count
- Recent reservations list

### 💰 Revenue Analytics

- Total revenue and booking statistics
- Average booking value
- Revenue breakdown by movie
- Revenue breakdown by theater
- Daily revenue trends
- Date range filtering

### 📊 Occupancy Analytics

- Average occupancy rates
- Per-showtime occupancy details
- Occupancy by movie
- Occupancy by theater
- Status indicators (full/filling/available)
- Date range filtering

### 🎬 Popular Movies

- Top performing movies
- Total bookings per movie
- Total seats booked
- Total revenue per movie
- Customizable top N movies
- Date range filtering

### ❌ Cancellation Analytics

- Total cancellation count and rate
- Lost revenue from cancellations
- Cancellations by movie
- Daily cancellation trends
- Date range filtering

---

## 🐛 Known Issues & Roadmap

### ✅ Completed Features

- [x] User authentication and authorization
- [x] Movie management (CRUD)
- [x] Theater and seat management
- [x] Showtime scheduling
- [x] Seat reservation system
- [x] Payment processing (Stripe integration)
- [x] Admin analytics dashboard
- [x] API rate limiting
- [x] Pagination for list endpoints
- [x] Responsive frontend design

### 🚧 In Progress

- [ ] Email notifications for bookings
- [ ] Reservation expiry handling (cron job)
- [ ] QR code generation for tickets

### 📝 Planned Features

- [ ] Email verification
- [ ] Refresh token mechanism
- [ ] Comprehensive error handling improvements
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit and integration tests
- [ ] Logging system (Winston/Pino)
- [ ] Advanced search and filtering
- [ ] Booking history export (CSV/PDF)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Sugam Ghising**

- GitHub: [@sugamghising](https://github.com/sugamghising)
- Repository: [MovieReservationSystem](https://github.com/sugamghising/MovieReservationSystem)

---

## 🙏 Acknowledgments

- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Stripe](https://stripe.com/) - Payment processing
- [TanStack Query](https://tanstack.com/query) - Data synchronization
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

---

**Status**: 🚀 **Production Ready!**

### Implementation Progress: ~95%

**Core Features Complete** ✅

- Full user authentication and authorization
- Complete booking flow with payment processing
- Comprehensive admin dashboard with analytics
- Real-time seat availability
- Secure payment integration
- Rate limiting and security measures
- Responsive design across all devices

Inspired from - [Roadmap.sh](https://roadmap.sh/projects/movie-reservation-system)
