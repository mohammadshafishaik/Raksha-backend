// backend/routes/user.js
const express = require('express');
const router = express.Router(); // Create an Express router
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For creating JSON Web Tokens
const User = require('../models/User'); // Import our User model

// Load environment variables (for JWT secret)
require('dotenv').config();

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body; // Get data from the request body

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email }); // Find user by email
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Create a new user instance
    user = new User({
      name,
      email,
      password,
      phone,
    });

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt (random string)
    user.password = await bcrypt.hash(password, salt); // Hash the password with the salt

    // 4. Save the user to the database
    await user.save();

    // 5. Create and return a JSON Web Token (JWT)
    // JWTs are used for authentication. After registration/login, the client
    // receives a token and sends it with subsequent requests to prove their identity.
    const payload = {
      user: {
        id: user.id, // User's ID from MongoDB
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Secret key from .env
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token back to the client
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Return JSON Web Token (JWT)
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; // Export the router