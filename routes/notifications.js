// backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model
const auth = require('../middleware/auth'); // Import auth middleware

// @route   POST api/notifications/token
// @desc    Register or update a user's Expo Push Token
// @access  Private (requires authentication)
router.post('/token', auth, async (req, res) => {
  const { token } = req.body; // The push token sent from the frontend

  if (!token) {
    return res.status(400).json({ msg: 'Push token is required.' });
  }

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // Update the user's push token
    user.expoPushToken = token;
    await user.save();

    console.log(`Push token updated for user ${user.email}: ${token}`);
    res.json({ msg: 'Push token registered successfully.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;