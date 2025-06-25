const Campaign = require('../models/Campaign');
const User = require('../models/Users');

// List campaigns with filters, search, pagination, and creator info
exports.listCampaigns = async (req, res) => {
  try {
    const { status, type, country, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (type && type !== 'all') query.type = type;
    if (country && country !== 'all') query.country = country;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Campaign.countDocuments(query);
    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    // Populate creator info
    const userIds = [...new Set(campaigns.map(c => c.createdBy))];
    const users = await User.find({ _id: { $in: userIds } }, 'firstName lastName email country state').lean();
    const userMap = Object.fromEntries(users.map(u => [u._id, u]));
    const result = campaigns.map(c => ({
      ...c,
      creator: userMap[c.createdBy] || null
    }));
    res.json({ success: true, campaigns: result, total });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch campaigns.' });
  }
};

// Update campaign status (approve/reject/finish)
exports.updateCampaignStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['approved', 'rejected', 'finished', 'pending', 'active'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status.' });
    }
    const campaign = await Campaign.findByIdAndUpdate(id, { status }, { new: true });
    if (!campaign) return res.status(404).json({ success: false, error: 'Campaign not found.' });
    res.json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to update campaign status.' });
  }
};

// Delete campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findByIdAndDelete(id);
    if (!campaign) return res.status(404).json({ success: false, error: 'Campaign not found.' });
    res.json({ success: true, message: 'Campaign deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to delete campaign.' });
  }
};

// Get campaign details
exports.getCampaignDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id).lean();
    if (!campaign) return res.status(404).json({ success: false, error: 'Campaign not found.' });
    const creator = await User.findById(campaign.createdBy, 'firstName lastName email country state').lean();
    res.json({ success: true, campaign: { ...campaign, creator } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch campaign details.' });
  }
}; 