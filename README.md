# Movie Reservation System - Backend API

A robust backend API for a movie reservation system built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ Role-based Access Control (Admin/User)
- ✅ Movie Management (CRUD operations)
- ✅ Theater Management (Create theaters, add seats)
- ✅ Showtime Management (Create and list showtimes)
- ✅ Seat Reservation System (Book seats, view reservations)
- ✅ Admin Analytics Dashboard (Revenue, Occupancy, Popular Movies, Cancellations)
- 🚧 Payment Processing (Coming soon)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Zod

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/movie_reservation_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

### 5. Run the Application

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

## API Endpoints

### Health Check

- `GET /` - API health check

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Movies

- `GET /api/movies` - Get all movies (public)
- `GET /api/movies/:movieId` - Get single movie (public)
- `POST /api/movies` - Create movie (Admin only)
- `PUT /api/movies/:id` - Update movie (Admin only)
- `DELETE /api/movies/:movieId` - Delete movie (Admin only)

### Theaters

- `GET /api/theatres` - Get all theaters (public)
- `POST /api/theatres` - Create theater (Admin only)
- `POST /api/theatres/:theatreId/seat` - Add seat to theater (Admin only)

### Showtimes

- `GET /api/showtimes` - Get all showtimes with optional filters (public)
- `POST /api/showtimes` - Create showtime (Admin only)

### Reservations

- `POST /api/reservations` - Create reservation (Authenticated users)
- `GET /api/reservations` - Get user's reservations (Authenticated users)
- `DELETE /api/reservations/:id` - Cancel reservation (Authenticated users)

### Analytics (Admin Only)

- `GET /api/analytics/dashboard` - Get dashboard overview
- `GET /api/analytics/revenue` - Get revenue report
- `GET /api/analytics/occupancy` - Get occupancy report
- `GET /api/analytics/popular-movies` - Get popular movies report
- `GET /api/analytics/cancellations` - Get cancellation report

## API Usage Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Movie (Admin only)

```bash
POST /api/movies
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Inception",
  "description": "A mind-bending thriller",
  "posterUrl": "https://example.com/poster.jpg",
  "genre": "Sci-Fi",
  "durationMinute": 148
}
```

### Get All Movies

```bash
GET /api/movies
```

### Create Theater (Admin only)

```bash
POST /api/theatres
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Theater 1",
  "capacity": 100
}
```

### Add Seat to Theater (Admin only)

```bash
POST /api/theatres/{theaterId}/seat
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "label": "A1",
  "row": "A",
  "number": 1,
  "type": "regular",
  "extraPrice": 0
}
```

### Create Showtime (Admin only)

```bash
POST /api/showtimes
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "movieId": "movie-uuid-here",
  "theaterId": "theater-uuid-here",
  "startTime": "2025-11-09T14:00:00Z",
  "endTime": "2025-11-09T16:30:00Z",
  "price": 12.50
}
```

### Get Showtimes with Filters

```bash
# Get all showtimes
GET /api/showtimes

# Filter by movie
GET /api/showtimes?movieId=movie-uuid-here

# Filter by date
GET /api/showtimes?date=2025-11-09

# Filter by both
GET /api/showtimes?movieId=movie-uuid-here&date=2025-11-09
```

### Create Reservation

```bash
POST /api/reservations
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "showtimeId": "showtime-uuid-here",
  "seatIds": ["seat-uuid-1", "seat-uuid-2"]
}
```

### Get User Reservations

```bash
GET /api/reservations
Authorization: Bearer <your-jwt-token>
```

### Cancel Reservation

```bash
DELETE /api/reservations/{reservationId}
Authorization: Bearer <your-jwt-token>
```

### Analytics - Dashboard Overview (Admin only)

```bash
GET /api/analytics/dashboard
Authorization: Bearer <admin-jwt-token>
```

**Response:**

```json
{
  "today": {
    "reservations": 15,
    "revenue": 450.00
  },
  "totals": {
    "users": 250,
    "movies": 12,
    "theaters": 5,
    "reservations": 1500,
    "upcomingShowtimes": 45
  },
  "recentReservations": [...]
}
```

### Analytics - Revenue Report (Admin only)

```bash
# All time revenue
GET /api/analytics/revenue
Authorization: Bearer <admin-jwt-token>

# Revenue for date range
GET /api/analytics/revenue?startDate=2025-11-01&endDate=2025-11-30
Authorization: Bearer <admin-jwt-token>
```

**Response:**

```json
{
  "summary": {
    "totalRevenue": 15000.00,
    "totalBookings": 500,
    "averageBookingValue": 30.00,
    "period": {...}
  },
  "revenueByMovie": [...],
  "revenueByTheater": [...],
  "revenueByDate": [...]
}
```

### Analytics - Occupancy Report (Admin only)

```bash
# All time occupancy
GET /api/analytics/occupancy
Authorization: Bearer <admin-jwt-token>

# Occupancy for date range
GET /api/analytics/occupancy?startDate=2025-11-01&endDate=2025-11-30
Authorization: Bearer <admin-jwt-token>
```

**Response:**

```json
{
  "summary": {
    "totalShowtimes": 200,
    "averageOccupancy": 75.5,
    "period": {...}
  },
  "showtimes": [...],
  "occupancyByMovie": [...],
  "occupancyByTheater": [...]
}
```

### Analytics - Popular Movies (Admin only)

```bash
# Top 10 popular movies
GET /api/analytics/popular-movies
Authorization: Bearer <admin-jwt-token>

# Top 5 popular movies for date range
GET /api/analytics/popular-movies?limit=5&startDate=2025-11-01&endDate=2025-11-30
Authorization: Bearer <admin-jwt-token>
```

**Response:**

```json
{
  "summary": {
    "totalUniqueMovies": 12,
    "topMoviesCount": 10,
    "period": {...}
  },
  "popularMovies": [
    {
      "movieId": "...",
      "title": "Inception",
      "totalBookings": 150,
      "totalSeatsBooked": 300,
      "totalRevenue": 4500.00
    },
    ...
  ]
}
```

### Analytics - Cancellation Report (Admin only)

```bash
# All time cancellations
GET /api/analytics/cancellations
Authorization: Bearer <admin-jwt-token>

# Cancellations for date range
GET /api/analytics/cancellations?startDate=2025-11-01&endDate=2025-11-30
Authorization: Bearer <admin-jwt-token>
```

**Response:**

```json
{
  "summary": {
    "totalReservations": 500,
    "totalCancellations": 50,
    "cancellationRate": 10.00,
    "lostRevenue": 1500.00,
    "period": {...}
  },
  "cancellationsByMovie": [...],
  "cancellationsByDate": [...]
}
```

## Database Schema

The system includes the following models:

- **User** - User accounts with authentication
- **Movie** - Movie information
- **Theater** - Theater/screen information
- **Seat** - Individual seats in theaters
- **Showtime** - Movie screening times
- **Reservation** - User bookings
- **ReservationSeat** - Seat assignments for reservations
- **Payment** - Payment transactions

## Scripts

- `npm run dev` - Run development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server
- `npx prisma studio` - Open Prisma Studio (Database GUI)
- `npx prisma migrate dev` - Run database migrations

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── config/
│   │   └── db.ts             # Prisma client configuration
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── movie.controller.ts
│   │   ├── theatres.controller.ts
│   │   ├── showtimes.controller.ts
│   │   ├── reservations.controller.ts
│   │   └── analytics.controller.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   └── role.middleware.ts
│   ├── routes/               # API routes
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── movie.routes.ts
│   │   ├── theatres.routes.ts
│   │   ├── showtimes.routes.ts
│   │   ├── reservations.routes.ts
│   │   └── analytics.routes.ts
│   ├── schemas/              # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   ├── movie.schema.ts
│   │   ├── theater.schema.ts
│   │   ├── showtime.schema.ts
│   │   └── reservation.schema.ts
│   ├── services/             # Business logic
│   │   ├── auth.service.ts
│   │   ├── movie.service.ts
│   │   ├── theaters.service.ts
│   │   ├── showtimes.service.ts
│   │   ├── reservations.service.ts
│   │   └── analytics.service.ts
│   ├── types/                # TypeScript type definitions
│   │   └── express.d.ts
│   ├── utils/                # Utility functions
│   │   ├── hash.ts
│   │   └── jwt.ts
│   └── index.ts              # Application entry point
├── .env                      # Environment variables (gitignored)
├── .env.example              # Environment variables template
├── package.json
└── tsconfig.json
```

## Security

- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens are used for authentication
- Role-based access control for protected routes
- Input validation using Zod schemas
- SQL injection protection via Prisma ORM
- Parameterized queries for raw SQL operations
- Transaction-based seat booking to prevent race conditions
- Row-level locking (FOR UPDATE) to prevent double-booking

## Analytics Dashboard Features

### 📊 **Dashboard Overview**

- Today's reservations and revenue
- Total users, movies, theaters count
- Total confirmed reservations
- Upcoming showtimes count
- Recent reservations list

### 💰 **Revenue Analytics**

- Total revenue and booking statistics
- Average booking value
- Revenue breakdown by movie
- Revenue breakdown by theater
- Daily revenue trends
- Date range filtering

### 📈 **Occupancy Analytics**

- Average occupancy rates
- Per-showtime occupancy details
- Occupancy by movie
- Occupancy by theater
- Status indicators (full/filling/available)
- Date range filtering

### 🎬 **Popular Movies**

- Top performing movies
- Total bookings per movie
- Total seats booked
- Total revenue per movie
- Customizable top N movies
- Date range filtering

### ❌ **Cancellation Analytics**

- Total cancellation count and rate
- Lost revenue from cancellations
- Cancellations by movie
- Daily cancellation trends
- Date range filtering

## Development

### Database Management

View your database in Prisma Studio:

```bash
npx prisma studio
```

Reset database (development only):

```bash
npx prisma migrate reset
```

## Known Issues / TODO

- [x] Implement theater management endpoints
- [x] Implement showtime management endpoints
- [x] Implement seat reservation logic
- [x] Add admin analytics dashboard
- [ ] Add payment processing integration
- [ ] Add email verification
- [ ] Add refresh token mechanism
- [ ] Add rate limiting
- [ ] Add comprehensive error handling
- [ ] Add API documentation (Swagger)
- [ ] Add unit and integration tests
- [ ] Add logging system (Winston/Pino)
- [ ] Add reservation expiry handling (cron job)
- [ ] Add seat availability endpoint
- [ ] Add pagination for list endpoints
- [ ] Add search and filtering for movies
- [ ] Add booking history and analytics export (CSV/PDF)
- [ ] Add email notifications for bookings
- [ ] Add QR code generation for tickets

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

---

**Status**: 🚀 **Core Features Complete!**

### Implementation Progress: ~85%

**Completed:**

- ✅ Authentication & Authorization
- ✅ Movie Management
- ✅ Theater & Seat Management
- ✅ Showtime Scheduling
- ✅ Reservation System with Concurrency Control
- ✅ Input Validation & Error Handling
- ✅ **Admin Analytics Dashboard** 🆕

**In Progress:**

- 🚧 Payment Integration
- 🚧 Email Notifications
- 🚧 Advanced Features (QR Codes, Export Reports, etc.)
