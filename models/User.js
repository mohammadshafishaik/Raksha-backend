// backend/models/User.js
const mongoose = require('mongoose'); // Import mongoose

// Define the schema for a User
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is required
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email must be unique
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  trustedContacts: [ // Array of trusted contacts
    {
      name: { type: String, required: true },
      phone: { type: String },
      email: { type: String },
    }
  ],
  currentLocation: { // Store the last known location
    latitude: { type: Number },
    longitude: { type: Number },
    timestamp: { type: Date, default: Date.now }
  },
  expoPushToken: { // NEW: Field to store the Expo Push Token
    type: String,
    unique: true, // A device should ideally have one token
    sparse: true // Allows multiple documents to have null/undefined values for this field
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the current date when a user is created
  },
});

// Create and export the User model based on the schema
module.exports = mongoose.model('User', UserSchema);