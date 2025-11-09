# Movie Reservation System - Backend API

A robust backend API for a movie reservation system built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ Role-based Access Control (Admin/User)
- ✅ Movie Management (CRUD operations)
- 🚧 Theater Management (Coming soon)
- 🚧 Showtime Management (Coming soon)
- 🚧 Seat Reservation System (Coming soon)
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
│   │   └── movie.controller.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   └── role.middleware.ts
│   ├── routes/               # API routes
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   └── movie.routes.ts
│   ├── schemas/              # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   └── movie.schema.ts
│   ├── services/             # Business logic
│   │   ├── auth.service.ts
│   │   └── movie.service.ts
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

- [ ] Implement theater management endpoints
- [ ] Implement showtime management endpoints
- [ ] Implement seat reservation logic
- [ ] Add payment processing integration
- [ ] Add email verification
- [ ] Add refresh token mechanism
- [ ] Add rate limiting
- [ ] Add comprehensive error handling
- [ ] Add API documentation (Swagger)
- [ ] Add unit and integration tests
- [ ] Add logging system
- [ ] Add seat availability checking
- [ ] Add reservation expiry handling

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Author

Your Name

---

**Status**: 🚧 In Development
