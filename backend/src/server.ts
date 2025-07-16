import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import { getStatusPageHtml } from './utils/statusPageTemplate'

// Routes
import authRoutes from './routes/auth.routes'
import showRoutes from './routes/tmdb/show.routes'

//Middlewares
import authMiddleware from './middleware/auth.middleware'

// Services
import { tmdbService } from './services/tmdb.service'

// Load environment variables from .env file
dotenv.config()

// Safely initializes the TMDb service by loading necessary API keys.
try {
  tmdbService.initialize()
} catch (error: any) {
  console.error('Failed to initialize TMDb Service:', error.message)
  process.exit(1)
}

const app = express()
const server = http.createServer(app)

// Environment variables
const PORT = process.env.BACKEND_URL_PORT || 5000
const MONGO_URI = process.env.MONGO_URI! // Non-null assertion as it's expected to be defined
const FRONTEND_URL = process.env.FRONTEND_URL

// TODO: REMOVE
console.log('FRONTEND_URL:', process.env.FRONTEND_URL)
console.log('TMDB_API_KEY:', process.env.TMDB_API_KEY)

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB Connected Successfully!')
  } catch (err: any) {
    console.error('MongoDB Connection Error:', err.message)
    process.exit(1) // Exit process with failure
  }
}

connectDB()

// Socket.IO configuration
// CORS is essential for frontend (http://localhost:5173) to connect to backend (http://localhost:5000)
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST']
  }
})

// --- EXPRESS MIDDLEWARES ---
app.use(express.json())

app.use(
  cors({
    origin: FRONTEND_URL
  })
)

// -------- ROUTES --------
// All routes in authRoutes.ts will be prefixed with /api/auth
app.use('/api/auth', authRoutes)

// All routes in show.routes.ts will be prefixed with /api/tmdb/shows
app.use('/api/tmdb/shows', showRoutes)

// Status routes
app.get('/', (req, res) => {
  const mainMsg = 'Backend API is <span class="highlight">running</span>!'
  const subMsg = 'And is <span class="highlight">connected to MongoDB</span>.'

  res.send(getStatusPageHtml(mainMsg, subMsg))
})

app.get('/api/status', (req, res) => {
  res.json({ message: 'API is healthy!', dbConnected: mongoose.connection.readyState === 1 })
})

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected via Socket.IO')

  socket.on('disconnect', () => {
    console.log('User disconnected from Socket.IO')
  })

  // Example: send a message to the client every 5 seconds
  setInterval(() => {
    socket.emit('message', `Hello from backend! Time: ${new Date().toLocaleTimeString()}`)
  }, 5000)
})

// Start the server
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
