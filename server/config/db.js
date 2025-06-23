const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://aliahammad0812:Li081200@cluster0.fhkymyn.mongodb.net/CrowdFundNextDB?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connect to CrowdFundNextDB');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;