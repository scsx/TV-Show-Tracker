import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { getStatusPageHtml } from './utils/statusPageTemplate'

// Routes
import authRoutes from './routes/authRoutes'

//Middlewares
import authMiddleware from './middleware/authMiddleware'

// Load environment variables from .env file
dotenv.config()

const app = express()
const server = http.createServer(app)

// Environment variables
const PORT = process.env.BACKEND_URL_PORT || 5000
const MONGO_URI = process.env.MONGO_URI! // Non-null assertion as it's expected to be defined

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
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
})

// Express middleware
app.use(express.json())

// All routes in authRoutes.ts will be prefixed with /api/auth
app.use('/api/auth', authRoutes)

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
