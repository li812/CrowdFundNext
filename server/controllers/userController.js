const User = require('../models/Users');
const admin = require('../config/firebase');
const fs = require('fs');
const path = require('path');
const { setUserTypeClaim } = require('../services/firebaseService');
const Campaign = require('../models/Campaign');

async function registerUser(req, res) {
  try {
    const { uid, email } = req.user;
    const {
      firstName, lastName, gender, dateOfBirth, phoneNumber,
      country, state, city, pincode, password // <-- add password
    } = req.body;

    // Check if user exists
    if (await User.findById(uid)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Handle profile picture
    let profilePicture = '';
    if (req.file) {
      profilePicture = `/uploads/profile_pics/${req.file.filename}`;
    }

    // Save user in MongoDB
    const user = new User({
      _id: uid,
      email,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phoneNumber,
      country,
      state,
      city,
      pincode,
      profilePicture,
      userType: 'user'
    });
    await user.save();

    // Set Firebase custom claim
    await setUserTypeClaim(uid, 'user');

    // If password provided, set it in Firebase Auth (for Google users)
    if (password) {
      await admin.auth().updateUser(uid, { password });
    }

    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
}

async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.uid);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Fetch user error:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}

async function deleteCurrentUser(req, res) {
  try {
    const { uid } = req.user;

    // 1. Find user in MongoDB
    const user = await User.findById(uid);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 1.5. Check for active campaigns
    const activeCampaigns = await Campaign.find({ createdBy: uid, status: { $in: ['pending', 'approved', 'funded', 'active'] } });
    if (activeCampaigns.length > 0) {
      return res.status(400).json({ error: 'Cannot delete account: you have active campaigns. Please finish or delete your campaigns first.' });
    }

    // 2. Delete profile picture file if exists
    if (user.profilePicture) {
      const picPath = path.join(__dirname, '..', user.profilePicture);
      fs.unlink(picPath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Failed to delete profile picture:', err.message);
        }
      });
    }

    // 3. Delete user from MongoDB
    await User.findByIdAndDelete(uid);

    // 4. Delete user from Firebase Auth
    await admin.auth().deleteUser(uid);

    res.json({ success: true, message: 'Account deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete account.' });
  }
}

async function updateCurrentUser(req, res) {
  try {
    const { uid } = req.user;
    const user = await User.findById(uid);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Only allow updating certain fields
    const updatableFields = [
      'firstName', 'lastName', 'phoneNumber', 'country', 'state', 'city', 'pincode'
    ];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    // Handle profile picture upload
    if (req.file) {
      // Delete old profile picture if exists
      if (user.profilePicture) {
        const oldPicPath = path.join(__dirname, '..', user.profilePicture);
        fs.unlink(oldPicPath, err => {
          if (err && err.code !== 'ENOENT') {
            console.error('Failed to delete old profile picture:', err.message);
          }
        });
      }
      user.profilePicture = `/uploads/profile_pics/${req.file.filename}`;
    }

    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
}

module.exports = {
  registerUser,
  getCurrentUser,
  deleteCurrentUser,
  updateCurrentUser,
};