const User = require('../models/Users');
const { setUserTypeClaim } = require('../services/firebaseService');

async function registerUser(req, res) {
  try {
    const { uid, email } = req.user;
    const {
      firstName, lastName, gender, dateOfBirth, phoneNumber,
      country, state, city, pincode
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
    console.log('Registering user:', user);
    await user.save();

    // Set Firebase custom claim
    await setUserTypeClaim(uid, 'user');

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

module.exports = {
  registerUser,
  getCurrentUser,
};