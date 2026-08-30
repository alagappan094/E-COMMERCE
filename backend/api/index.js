const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const { notFound, errorHandler } = require('../middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser
app.use(express.json());

// CORS — allow frontend + local dev
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://ecommerce-app.vercel.app', // Update with your actual Vercel domain
  ],
  credentials: true,
}));

// API Routes
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/products', require('../routes/productRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'E-Commerce API running' }));

// Error handling
app.use(notFound);
app.use(errorHandler);

// Export for Vercel
module.exports = app;
