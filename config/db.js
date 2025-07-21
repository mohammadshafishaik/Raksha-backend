// backend/config/db.js
const mongoose = require('mongoose'); // Import mongoose

// Function to connect to the database
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from .env
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,       // Use the new URL parser
      useUnifiedTopology: true,    // Use the new server discovery and monitoring engine
      // useCreateIndex: true,     // Deprecated in newer Mongoose versions
      // useFindAndModify: false   // Deprecated in newer Mongoose versions
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`); // Log success message
  } catch (error) {
    console.error(`Error: ${error.message}`); // Log any connection errors
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = connectDB; // Export the connectDB function so we can use it in server.js
