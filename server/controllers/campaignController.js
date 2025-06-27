const Campaign = require('../models/Campaign');
const User = require('../models/Users');
const Transaction = require('../models/Transaction');

// Create campaign (user)
async function createCampaign(req, res) {
  try {
    const { type, title, description, amountNeeded, links } = req.body;
    const photos = req.files['photos']?.map(f => `/uploads/campaign_photos/${f.filename}`) || [];
    const supportDocument = req.files['supportDoc']?.[0]?.filename
      ? `/uploads/campaign_docs/${req.files['supportDoc'][0].filename}`
      : undefined;

    const campaign = new Campaign({
      type,
      title,
      description,
      amountNeeded,
      links: links ? Array.isArray(links) ? links : [links] : [],
      photos,
      supportDocument,
      createdBy: req.user.uid,
      status: 'pending',
      amountReceived: 0,
    });
    await campaign.save();
    res.status(201).json({ success: true, campaign });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// List user's campaigns
async function getMyCampaigns(req, res) {
  const campaigns = await Campaign.find({ createdBy: req.user.uid }).sort({ createdAt: -1 });
  res.json({ success: true, campaigns });
}

// List pending campaigns (admin)
async function getPendingCampaigns(req, res) {
  const campaigns = await Campaign.find({ status: 'pending' }).populate('createdBy', 'firstName lastName email');
  res.json({ success: true, campaigns });
}

// Approve campaign (admin)
async function approveCampaign(req, res) {
  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    { status: 'approved', adminComment: '' },
    { new: true }
  );
  if (!campaign) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, campaign });
}

// Reject campaign (admin)
async function rejectCampaign(req, res) {
  const { adminComment } = req.body;
  const campaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected', adminComment },
    { new: true }
  );
  if (!campaign) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, campaign });
}

// Handle donation: create transaction and update campaign
async function donateToCampaign(req, res) {
  try {
    const { campaignId, amount } = req.body;
    const userId = req.user.uid;
    if (!campaignId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid donation data.' });
    }
    // Create transaction
    const transaction = await Transaction.create({
      userId,
      campaignId,
      amount
    });
    // Update campaign amountReceived
    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { $inc: { amountReceived: amount } },
      { new: true }
    );
    res.json({ success: true, transaction, campaign });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Delete campaign (user)
async function deleteCampaign(req, res) {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    if (campaign.createdBy !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });
    if (campaign.status === 'approved') return res.status(400).json({ error: 'Cannot delete approved campaign' });
    // Optionally: remove files (photos/supportDoc)
    // ...
    await campaign.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Update campaign (user)
async function updateCampaign(req, res) {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    if (campaign.createdBy !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });
    if (campaign.status === 'approved') return res.status(400).json({ error: 'Cannot edit approved campaign' });
    // Update fields
    const { type, title, description, amountNeeded, links } = req.body;
    if (type) campaign.type = type;
    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (amountNeeded) campaign.amountNeeded = amountNeeded;
    if (links) campaign.links = Array.isArray(links) ? links : [links];
    // Handle files (photos/supportDoc)
    // Clear all photos if requested
    if (req.body.clearPhotos === 'true') {
      campaign.photos = [];
    } else {
      let newPhotos = [];
      if (req.body.existingPhotos) {
        if (Array.isArray(req.body.existingPhotos)) {
          newPhotos = req.body.existingPhotos;
        } else {
          newPhotos = [req.body.existingPhotos];
        }
      }
      if (req.files && req.files['photos']) {
        newPhotos = newPhotos.concat(req.files['photos'].map(f => `/uploads/campaign_photos/${f.filename}`));
      }
      if (newPhotos.length > 0) {
        campaign.photos = newPhotos;
      }
    }
    // Support Document: remove if requested
    if (req.body.removeSupportDoc === 'true') {
      campaign.supportDocument = '';
      // Optionally: delete the file from disk here
    } else if (req.files && req.files['supportDoc'] && req.files['supportDoc'][0]) {
      campaign.supportDocument = `/uploads/campaign_docs/${req.files['supportDoc'][0].filename}`;
    }
    campaign.updatedAt = Date.now();
    await campaign.save();
    res.json({ success: true, campaign });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// List all approved campaigns (for discovery)
async function getAllCampaigns(req, res) {
  try {
    const { sort = 'new', limit = 6, type } = req.query;
    const query = { status: 'approved' };
    if (type) query.type = type;
    let campaignsQuery = Campaign.find(query);
    // Sorting
    if (sort === 'new') {
      campaignsQuery = campaignsQuery.sort({ createdAt: -1 });
    } else if (sort === 'popular') {
      campaignsQuery = campaignsQuery.sort({ amountReceived: -1 });
    } else if (sort === 'ending') {
      campaignsQuery = campaignsQuery.sort({ updatedAt: -1 });
    }
    // Limit
    campaignsQuery = campaignsQuery.limit(Number(limit));
    const campaigns = await campaignsQuery.exec();
    res.json({ success: true, campaigns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get user's recent activity (last 3 supported or posted campaigns)
async function getRecentUserActivity(req, res) {
  try {
    // Campaigns created by user
    const posted = await Campaign.find({ createdBy: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(3)
      .exec();
    // TODO: Add supported campaigns if you track user donations
    res.json({ success: true, posted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get available countries, states, and cities from users who created approved campaigns
async function getAvailableCountriesAndStates(req, res) {
  try {
    // Find all approved campaigns and their creators
    const campaigns = await Campaign.find({ status: 'approved' }, 'createdBy');
    const userIds = campaigns.map(c => c.createdBy);
    const users = await User.find({ _id: { $in: userIds } }, 'country state city');
    const countrySet = new Set();
    const stateMap = {};
    const cityMap = {};
    users.forEach(u => {
      if (u.country) {
        countrySet.add(u.country);
        if (u.state) {
          if (!stateMap[u.country]) stateMap[u.country] = new Set();
          stateMap[u.country].add(u.state);
          if (u.city) {
            if (!cityMap[u.country]) cityMap[u.country] = {};
            if (!cityMap[u.country][u.state]) cityMap[u.country][u.state] = new Set();
            cityMap[u.country][u.state].add(u.city);
          }
        }
      }
    });
    const countries = Array.from(countrySet);
    const states = {};
    const cities = {};
    for (const country of countries) {
      states[country] = Array.from(stateMap[country] || []);
      cities[country] = {};
      for (const state of states[country]) {
        cities[country][state] = Array.from((cityMap[country] && cityMap[country][state]) || []);
      }
    }
    res.json({ success: true, countries, states, cities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Like/unlike a campaign
async function likeCampaign(req, res) {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    const userId = req.user.uid;
    const idx = campaign.likes.indexOf(userId);
    if (idx === -1) {
      campaign.likes.push(userId);
    } else {
      campaign.likes.splice(idx, 1);
    }
    await campaign.save();
    res.json({ success: true, liked: idx === -1, likeCount: campaign.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Add a comment
async function addComment(req, res) {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text required' });
    const userId = req.user.uid;
    const userName = req.user.name || req.user.email || 'User';
    campaign.comments.push({ userId, userName, text });
    await campaign.save();
    res.json({ success: true, comment: campaign.comments[campaign.comments.length - 1] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all comments for a campaign
async function getComments(req, res) {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, comments: campaign.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createCampaign,
  getMyCampaigns,
  getPendingCampaigns,
  approveCampaign,
  rejectCampaign,
  donateToCampaign,
  deleteCampaign,
  updateCampaign,
  getAllCampaigns,
  getRecentUserActivity,
  getAvailableCountriesAndStates,
  likeCampaign,
  addComment,
  getComments,
};