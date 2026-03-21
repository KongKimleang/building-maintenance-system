// Import packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// SECURITY MIDDLEWARE
// 1. Helmet — secure HTTP headers
app.use(helmet());

// 2. CORS — only allow your frontend
app.use(cors({
  origin: [
    'http://localhost:3000',          // local development
    'https://your-app.vercel.app'     // update when deployed
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 3. Body parser - MUST BE BEFORE ROUTES
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Serve uploaded photos
app.use('/uploads', express.static('uploads'));

// ROUTES
// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Building Maintenance API is running! 🏢' });
});

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/requests',      require('./routes/requests'));
app.use('/api/notifications', require('./routes/notifications'));

// ERROR HANDLING
// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Server error'
  });
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔒 Security enabled`);
});
