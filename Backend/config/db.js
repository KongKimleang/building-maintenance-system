const mongoose = require('mongoose');

let listenersRegistered = false;

const registerConnectionListeners = () => {
  if (listenersRegistered) {
    return;
  }

  mongoose.connection.on('connected', () => {
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  });

  mongoose.connection.on('reconnected', () => {
    console.log('♻️ MongoDB reconnected');
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
  });

  mongoose.connection.on('error', (error) => {
    console.error(`❌ MongoDB error: ${error.message}`);
  });

  listenersRegistered = true;
};

const connectDB = async (maxRetries = 5, retryDelayMs = 3000) => {
  registerConnectionListeners();

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in environment variables');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      return;
    } catch (error) {
      console.error(
        `❌ MongoDB connect attempt ${attempt}/${maxRetries} failed: ${error.message}`
      );

      if (attempt === maxRetries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
};

module.exports = connectDB;
