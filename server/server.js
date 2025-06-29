require('dotenv').config();
require('./scripts/initFirebaseAdmin');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const adminRoutes = require('./routes/adminRoutes');
const multer = require('multer');
const path = require('path');

// Import campaign lifecycle service
const campaignLifecycleService = require('./services/campaignLifecycleService');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use('/uploads', express.static('uploads')); // <-- Add this line
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    campaignService: campaignLifecycleService.getStatus()
  });
});

// Basic API route
app.get('/api/status', (req, res) => {
  res.json({ message: 'CrowdFundNext API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/admin', adminRoutes);

// Start campaign lifecycle service
campaignLifecycleService.start();

// Cleanup on server shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  campaignLifecycleService.stop();
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  campaignLifecycleService.stop();
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 4800;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('CrowdFundNext is running!');
console.log('Frontend: http://localhost:3000');
console.log(`Backend API: http://localhost:${PORT}`);
console.log(`Health Check: http://localhost:${PORT}/health`);
console.log(`API Status: http://localhost:${PORT}/api/status`);
console.log('Campaign Lifecycle Service: Active');