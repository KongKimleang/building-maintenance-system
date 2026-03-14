// Import packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
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

// 3. Rate limiting — prevent brute force
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per 15 min
  message: { message: 'Too many requests, please try again later' }
});

// Stricter limit for login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 attempts per 15 min
  message: { message: 'Too many login attempts, try again in 15 minutes' }
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);

// 4. MongoDB sanitize — prevent NoSQL injection
app.use(mongoSanitize());

// 5. XSS clean — prevent script injection
app.use(xss());

// 6. Body size limit — prevent overflow attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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
app.use('/api/buildings',     require('./routes/buildings'));
app.use('/api/feedback',      require('./routes/feedback'));


// ERROR HANDLING
// Handle unknown routes
app.use('*', (req, res) => {
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