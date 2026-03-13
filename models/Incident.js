// backend/models/Incident.js
const mongoose = require('mongoose');

const IncidentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  incidentType: {
    type: String,
    required: true,
    enum: ['Harassment', 'Theft', 'Assault', 'Suspicious Activity', 'Road Accident', 'Fire', 'Medical Emergency', 'Other'],
  },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Incident', IncidentSchema);
