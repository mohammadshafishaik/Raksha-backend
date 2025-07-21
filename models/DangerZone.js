// backend/models/DangerZone.js
const mongoose = require('mongoose');

const DangerZoneSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Each zone should have a unique name
  },
  // Coordinates defining the polygon boundary of the danger zone
  // Format: [[latitude1, longitude1], [latitude2, longitude2], ...]
  // The polygon should be closed (first and last coordinate pair are the same)
  coordinates: {
    type: [[Number]], // Array of arrays of numbers (latitude, longitude pairs)
    required: true,
  },
  description: {
    type: String,
    default: 'Area identified as potentially unsafe.',
  },
  severity: { // e.g., 'low', 'medium', 'high'
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DangerZone', DangerZoneSchema);