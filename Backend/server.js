// Import packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');

// Import Swagger configuration
require('./swagger-config');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// SECURITY MIDDLEWARE
// 1. Helmet — secure HTTP headers
app.use(helmet());

// 2. Rate Limiting — protect against brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // disable the `X-RateLimit-*` headers
});
app.use(limiter);

// 3. CORS — only allow your frontend
app.use(
  cors({
    origin: [
      'http://localhost:3000', // local development
      'https://your-app.vercel.app', // update when deployed
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// 4. Compression — reduce response size for better performance
app.use(compression());

// 5. Body parser - MUST BE BEFORE ROUTES
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Serve uploaded photos
app.use('/uploads', express.static('uploads'));

// SWAGGER DOCUMENTATION
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Building Maintenance System API',
      version: '1.0.0',
      description: 'API for building maintenance system with request tracking and management',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://your-api-url.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./swagger-config.js', './routes/*.js', './controllers/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROUTES
// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Building Maintenance API is running! 🏢' });
});

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({ message: 'API documentation available at /api-docs' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/requests', require('./routes/requests'));
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
    message: err.message || 'Server error',
  });
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔒 Security enabled`);
});
