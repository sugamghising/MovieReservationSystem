import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import routes from './routes'

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
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

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})
