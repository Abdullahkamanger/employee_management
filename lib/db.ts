import mongoose from 'mongoose';

// Define a connection object to track the state
const connection: { isConnected?: number } = {};

export const connectDB = async () => {
  // Check if we already have an active connection
  if (connection.isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    // Attempt to connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URI!);

    // Update the connection state
    connection.isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    // Gracefully exit or handle the error based on your needs
    throw new Error("Failed to connect to database");
  }
};