// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Load environment variables from .env file
dotenv.config();

const connectDB = require('./config/db');

// Connect to the database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// CORS — allow requests from Expo/React Native clients and your frontend URL
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:8081', 'exp://'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
}));

// Rate limiting — protect against brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { msg: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Define Routes
app.use('/api/users', authLimiter, require('./routes/user'));
app.use('/api/safety', require('./routes/safety'));
app.use('/api/dangerzones', require('./routes/dangerZones'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/incidents', require('./routes/incidents'));

// Health check route
app.get('/', (req, res) => {
  res.json({ msg: 'Raksha API is running...', version: '2.0.0' });
});

// Start the server
app.listen(port, () => {
  console.log(`Raksha backend server running on port ${port}`);
});
