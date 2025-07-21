// backend/routes/dangerZones.js
const express = require('express');
const router = express.Router();
const DangerZone = require('../models/DangerZone'); // Import DangerZone model
const auth = require('../middleware/auth'); // Import auth middleware

// @route   GET api/dangerzones
// @desc    Get all active danger zones
// @access  Private (requires authentication)
router.get('/', auth, async (req, res) => {
  try {
    const dangerZones = await DangerZone.find({ isActive: true }); // Fetch only active zones
    res.json(dangerZones);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- FOR TESTING/MANUAL ADDITION (Optional - you can use MongoDB Compass to add directly too) ---
// @route   POST api/dangerzones/add-test-zone
// @desc    Add a test danger zone (for development only)
// @access  Private (requires authentication)
router.post('/add-test-zone', auth, async (req, res) => {
  // Example coordinates for a small square zone (replace with real-world coordinates near your location)
  // These coordinates define a small square. For a real zone, use actual map coordinates.
  // You can find coordinates using Google Maps (right-click on map -> "What's here?")
  const testCoordinates = [
    [16.3420, 80.4430], // Example: Near your location
    [16.3420, 80.4440],
    [16.3430, 80.4440],
    [16.3430, 80.4430],
    [16.3420, 80.4430] // Close the polygon by repeating the first coordinate
  ];

  // You can send name, description, severity in the request body, or use defaults
  const { name = 'Test Danger Zone', description = 'A simulated unsafe area for testing.', severity = 'high' } = req.body;

  try {
    let dangerZone = await DangerZone.findOne({ name });
    if (dangerZone) {
      return res.status(400).json({ msg: 'Danger zone with this name already exists.' });
    }

    dangerZone = new DangerZone({
      name,
      description,
      severity,
      coordinates: testCoordinates, // Use the predefined test coordinates
      isActive: true,
    });

    await dangerZone.save();
    res.json({ msg: 'Test Danger Zone added successfully!', dangerZone });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
