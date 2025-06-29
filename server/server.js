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
app.use('/api/campaigns', campaignRoutes);
app.use('/api/admin', adminRoutes);

// Cron job to update expired campaigns
const { updateExpiredCampaigns } = require('./controllers/campaignController');

// Run every hour
const updateExpiredCampaignsJob = setInterval(async () => {
  try {
    console.log('Running expired campaigns update job...');
    const updatedCount = await updateExpiredCampaigns();
    if (updatedCount > 0) {
      console.log(`Updated ${updatedCount} expired campaigns`);
    }
  } catch (error) {
    console.error('Error in expired campaigns update job:', error);
  }
}, 60 * 60 * 1000); // Every hour

// Also run once on server start
updateExpiredCampaigns().then(count => {
  if (count > 0) {
    console.log(`Updated ${count} expired campaigns on server start`);
  }
}).catch(error => {
  console.error('Error updating expired campaigns on server start:', error);
});

// Cleanup on server shutdown
process.on('SIGINT', () => {
  clearInterval(updateExpiredCampaignsJob);
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