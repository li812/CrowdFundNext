const User = require('../models/Users');
const { deleteFirebaseUser } = require('../services/firebaseService');

// Get all users (for admin dashboard)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-__v').lean();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch users.' });
  }
};

// Delete user from both MongoDB and Firebase
exports.deleteUserCompletely = async (req, res) => {
  const { id } = req.params; // id = Firebase UID
  try {
    // Remove from Firebase Auth
    await deleteFirebaseUser(id);
    // Remove from MongoDB
    await User.deleteOne({ _id: id });
    res.json({ success: true, message: 'User deleted from Firebase and MongoDB.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to delete user.' });
  }
}; 