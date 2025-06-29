const Campaign = require('../models/Campaign');
const User = require('../models/Users');
const Transaction = require('../models/Transaction');

// Create campaign (user)
async function createCampaign(req, res) {
  try {
    const { type, title, description, amountNeeded, links, hasTimeLimit, timeLimitType, endDate, maxDuration } = req.body;
    let photos = req.files['photos']?.map(f => `/uploads/campaign_photos/${f.filename}`) || [];

    const supportDocument = req.files['supportDoc']?.[0]?.filename
      ? `/uploads/campaign_docs/${req.files['supportDoc'][0].filename}`
      : undefined;

    // Validate time period configuration
    let validatedEndDate = null;
    let validatedMaxDuration = 90;

    if (hasTimeLimit === 'true' || hasTimeLimit === true) {
      if (!timeLimitType || !['fixed', 'flexible'].includes(timeLimitType)) {
        return res.status(400).json({ error: 'Time limit type must be either "fixed" or "flexible"' });
      }

      if (timeLimitType === 'fixed') {
        if (!endDate) {
          return res.status(400).json({ error: 'End date is required for fixed time limit campaigns' });
        }
        validatedEndDate = new Date(endDate);
        
        // Validate end date is in the future
        const now = new Date();
        if (validatedEndDate <= now) {
          return res.status(400).json({ error: 'End date must be in the future' });
        }
        
        // Validate campaign duration (max 365 days)
        const daysDiff = Math.ceil((validatedEndDate - now) / (1000 * 60 * 60 * 24));
        if (daysDiff > 365) {
          return res.status(400).json({ error: 'Campaign duration cannot exceed 365 days' });
        }
        if (daysDiff < 1) {
          return res.status(400).json({ error: 'Campaign must run for at least 1 day' });
        }
      } else if (timeLimitType === 'flexible') {
        if (maxDuration) {
          validatedMaxDuration = parseInt(maxDuration);
          if (validatedMaxDuration < 1 || validatedMaxDuration > 365) {
            return res.status(400).json({ error: 'Maximum duration must be between 1 and 365 days' });
          }
        }
        // For flexible campaigns, set end date to max duration from now
        validatedEndDate = new Date();
        validatedEndDate.setDate(validatedEndDate.getDate() + validatedMaxDuration);
      }
    }

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
      hasTimeLimit: hasTimeLimit === 'true' || hasTimeLimit === true,
      timeLimitType: timeLimitType || 'fixed',
      endDate: validatedEndDate,
      maxDuration: validatedMaxDuration,
      isActive: true,
      daysRemaining: validatedEndDate ? Math.ceil((validatedEndDate - new Date()) / (1000 * 60 * 60 * 24)) : null,
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
    const { sort = 'new', limit = 6, type, country, state, city, page = 1 } = req.query;
    const query = { status: 'approved' };
    
    // Handle isActive field - include both active campaigns and old campaigns without isActive field
    query.$or = [
      { isActive: true },
      { isActive: { $exists: false } } // Old campaigns without isActive field
    ];
    
    if (type) query.type = type;
    
    // Exclude campaigns created by the current user (if authenticated)
    if (req.user && req.user.uid) {
      query.createdBy = { $ne: req.user.uid };
    }
    
    // Build the aggregation pipeline
    const pipeline = [
      // Match campaigns based on basic criteria
      { $match: query },
      
      // Lookup user data to get location information
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator'
        }
      },
      
      // Unwind the creator array
      { $unwind: '$creator' },
      
      // Add location filters if provided
      ...(country || state || city ? [{
        $match: {
          $and: [
            ...(country ? [{ 'creator.country': country }] : []),
            ...(state ? [{ 'creator.state': state }] : []),
            ...(city ? [{ 'creator.city': city }] : [])
          ]
        }
      }] : []),
      
      // Project the fields we need
      {
        $project: {
          _id: 1,
          type: 1,
          title: 1,
          description: 1,
          amountNeeded: 1,
          amountReceived: 1,
          photos: 1,
          links: 1,
          status: 1,
          isActive: 1,
          hasTimeLimit: 1,
          endDate: 1,
          daysRemaining: 1,
          createdAt: 1,
          updatedAt: 1,
          likes: 1,
          comments: 1,
          progressPercentage: 1,
          createdBy: 1,
          'creator.firstName': 1,
          'creator.lastName': 1,
          'creator.email': 1,
          'creator.country': 1,
          'creator.state': 1,
          'creator.city': 1
        }
      }
    ];
    
    // Add sorting
    let sortStage = {};
    if (sort === 'new') {
      sortStage = { createdAt: -1 };
    } else if (sort === 'popular') {
      sortStage = { amountReceived: -1 };
    } else if (sort === 'ending') {
      sortStage = { endDate: 1 }; // Sort by end date ascending (ending soon first)
    } else if (sort === 'urgent') {
      // Sort by campaigns ending soon and not fully funded
      sortStage = { 
        daysRemaining: 1, 
        progressPercentage: -1 
      };
    }
    
    if (Object.keys(sortStage).length > 0) {
      pipeline.push({ $sort: sortStage });
    }
    
    // Add pagination
    const skip = (Number(page) - 1) * Number(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: Number(limit) });
    
    const campaigns = await Campaign.aggregate(pipeline);
    
    // Transform the data to match the expected format
    const transformedCampaigns = campaigns.map(campaign => ({
      ...campaign,
      creator: {
        firstName: campaign.creator?.firstName,
        lastName: campaign.creator?.lastName,
        email: campaign.creator?.email,
        country: campaign.creator?.country,
        state: campaign.creator?.state,
        city: campaign.creator?.city
      }
    }));
    
    res.json({ success: true, campaigns: transformedCampaigns });
  } catch (err) {
    console.error('getAllCampaigns error:', err);
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
    // Find all approved campaigns and their creators, excluding current user
    const query = { status: 'approved' };
    if (req.user && req.user.uid) {
      query.createdBy = { $ne: req.user.uid };
    }
    
    const campaigns = await Campaign.find(query, 'createdBy');
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

// Update expired campaigns (can be called by a cron job)
async function updateExpiredCampaigns() {
  try {
    const now = new Date();
    
    // Find campaigns that have expired but still show as active
    const expiredCampaigns = await Campaign.find({
      status: 'approved',
      isActive: true,
      hasTimeLimit: true,
      endDate: { $lt: now }
    });

    for (const campaign of expiredCampaigns) {
      if (campaign.progressPercentage >= 100) {
        campaign.status = 'completed';
      } else {
        campaign.status = 'expired';
      }
      campaign.isActive = false;
      campaign.daysRemaining = 0;
      await campaign.save();
    }

    console.log(`Updated ${expiredCampaigns.length} expired campaigns`);
    return expiredCampaigns.length;
  } catch (err) {
    console.error('Error updating expired campaigns:', err);
    throw err;
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
  updateExpiredCampaigns,
};