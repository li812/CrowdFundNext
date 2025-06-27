const User = require('../models/Users');
const { deleteFirebaseUser } = require('../services/firebaseService');
const Campaign = require('../models/Campaign');
const Transaction = require('../models/Transaction');

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

// Admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, activeCampaigns, pendingCampaigns, fundsAgg] = await Promise.all([
      User.countDocuments(),
      Campaign.countDocuments({ status: 'approved' }),
      Campaign.countDocuments({ status: 'pending' }),
      Campaign.aggregate([
        { $group: { _id: null, total: { $sum: '$amountReceived' } } }
      ])
    ]);
    const totalFundsRaised = fundsAgg[0]?.total || 0;
    res.json({
      success: true,
      totalUsers,
      activeCampaigns,
      pendingCampaigns,
      totalFundsRaised
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch dashboard stats.' });
  }
};

// Get all transactions (admin)
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('campaignId', 'title')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}; 