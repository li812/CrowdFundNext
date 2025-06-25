const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUserCompletely } = require('../controllers/adminController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');

// Only allow admins
function requireAdmin(req, res, next) {
  if (req.user && req.user.userType === 'admin') return next();
  return res.status(403).json({ success: false, error: 'Admin access required.' });
}

// Get all users
router.get('/users', verifyFirebaseToken, requireAdmin, getAllUsers);
// Delete user completely
router.delete('/users/:id', verifyFirebaseToken, requireAdmin, deleteUserCompletely);

module.exports = router; 