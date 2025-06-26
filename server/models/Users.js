const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  gender: String,
  dateOfBirth: String,
  phoneNumber: String,
  country: String,
  state: String,
  city: String,
  pincode: String,
  profilePicture: String, 
  userType: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);