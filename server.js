// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define Routes
app.use('/api/users', require('./routes/user'));
app.use('/api/safety', require('./routes/safety'));
app.use('/api/dangerzones', require('./routes/dangerZones'));
app.use('/api/notifications', require('./routes/notifications')); // NEW: Notifications routes

// Basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});