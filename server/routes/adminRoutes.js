const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUserCompletely, getDashboardStats } = require('../controllers/adminController');
const adminCampaignController = require('../controllers/adminCampaignController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const adminController = require('../controllers/adminController');


// Only allow admins
function requireAdmin(req, res, next) {
  if (req.user && req.user.userType === 'admin') return next();
  return res.status(403).json({ success: false, error: 'Admin access required.' });
}

// Get all users
router.get('/users', verifyFirebaseToken, requireAdmin, getAllUsers);
// Delete user completely
router.delete('/users/:id', verifyFirebaseToken, requireAdmin, deleteUserCompletely);
// Dashboard stats
router.get('/dashboard-stats', verifyFirebaseToken, requireAdmin, getDashboardStats);
// Campaign management
router.get('/campaigns', verifyFirebaseToken, requireAdmin, adminCampaignController.listCampaigns);
router.patch('/campaigns/:id/status', verifyFirebaseToken, requireAdmin, adminCampaignController.updateCampaignStatus);
router.delete('/campaigns/:id', verifyFirebaseToken, requireAdmin, adminCampaignController.deleteCampaign);
router.get('/campaigns/:id', verifyFirebaseToken, requireAdmin, adminCampaignController.getCampaignDetails);
router.get('/transactions', verifyFirebaseToken, requireAdmin, adminController.getAllTransactions);


module.exports = router; 