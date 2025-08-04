// backend/server.js
const express = require('express');
const dotenv = require('dotenv');

console.log('1: Starting server.js...'); // DEBUG
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

console.log('2: Connecting to the database...'); // DEBUG
// Connect to the database
connectDB();
console.log('3: Database connection initiated.'); // DEBUG

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

console.log('4: Defining routes...'); // DEBUG
// Define Routes
app.use('/api/users', require('./routes/user'));
app.use('/api/safety', require('./routes/safety'));
app.use('/api/dangerzones', require('./routes/dangerZones'));
app.use('/api/notifications', require('./routes/notifications')); // NEW: Notifications routes

// Basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

console.log('5: Starting server listening...'); // DEBUG
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});