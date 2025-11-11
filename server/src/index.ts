import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import routes from './routes'

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000

app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    routes
);
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

// Health check endpoint
app.get('/', async (_req, res) => {
    res.json({
        message: 'Movie Reservation System API',
        status: 'running',
        version: '1.0.0'
    })
})

// API routes
app.use('/api', routes)

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error('❌ Unhandled error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})
