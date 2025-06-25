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
    uptime: process.uptime()
  });
});

// Basic API route
app.get('/api/status', (req, res) => {
  res.json({ message: 'CrowdFundNext API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 4800;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


console.log('CrowdFundNext is running!');
console.log('Frontend: http://localhost:3000');
console.log(`Backend API: http://localhost:${PORT}`);
console.log(`Health Check: http://localhost:${PORT}/health`);
console.log(`API Status: http://localhost:${PORT}/api/status`);