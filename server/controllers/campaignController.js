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
    await Campaign.findByIdAndUpdate(
      campaignId,
      { $inc: { amountReceived: amount } }
    );
    // Fetch the updated campaign
    const campaign = await Campaign.findById(campaignId);
    // Check if fully funded and update status if needed
    if (campaign.amountReceived >= campaign.amountNeeded && campaign.status === 'approved') {
      campaign.status = 'funded';
      campaign.fundedAt = new Date();
    }
    await campaign.save(); // This will trigger pre-save logic
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

// List all homepage-relevant campaigns (for discovery)
async function getAllCampaigns(req, res) {
  try {
    const { sort = 'new', limit = 6, type, country, state, city, page = 1 } = req.query;
    // Allow homepage to show all relevant statuses
    const allowedStatuses = ['approved', 'funded', 'completed', 'expired', 'failed'];
    const query = { status: { $in: allowedStatuses } };
    
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
        campaign.completedAt = now;
      } else {
        campaign.status = 'failed';
        campaign.expiredAt = now;
        campaign.isSuccessful = false;
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

// Enhanced campaign lifecycle management
async function updateCampaignLifecycle() {
  try {
    console.log('Starting campaign lifecycle update...');
    
    // Use the static method from the model
    const updatedCampaigns = await Campaign.updateAllCampaignStatuses();
    
    // Process each updated campaign for notifications
    for (const campaign of updatedCampaigns) {
      await processCampaignStatusChange(campaign);
    }
    
    console.log(`Campaign lifecycle update completed. Updated ${updatedCampaigns.length} campaigns.`);
    return updatedCampaigns;
  } catch (error) {
    console.error('Error in campaign lifecycle update:', error);
    throw error;
  }
}

// Process campaign status changes and send notifications
async function processCampaignStatusChange(campaign) {
  try {
    const campaignSummary = campaign.getCampaignSummary();
    
    switch (campaign.status) {
      case 'funded':
        await handleCampaignFunded(campaign);
        break;
      case 'completed':
        await handleCampaignCompleted(campaign);
        break;
      case 'failed':
        await handleCampaignFailed(campaign);
        break;
      default:
        console.log(`Campaign ${campaign._id} status changed to: ${campaign.status}`);
    }
    
    return campaignSummary;
  } catch (error) {
    console.error(`Error processing status change for campaign ${campaign._id}:`, error);
    throw error;
  }
}

// Handle campaign reaching funding goal
async function handleCampaignFunded(campaign) {
  try {
    console.log(`Campaign ${campaign._id} has been funded! Progress: ${campaign.progressPercentage}%`);
    
    // Add a system comment about funding success
    const fundingComment = {
      userId: 'system',
      userName: 'CrowdFundNext',
      text: `🎉 Congratulations! This campaign has reached its funding goal of $${campaign.amountNeeded}! The campaign is now funded and will be completed.`,
      createdAt: new Date()
    };
    
    campaign.comments.push(fundingComment);
    await campaign.save();
    
    // TODO: Send notification to campaign creator
    // TODO: Send notification to all donors
    // TODO: Send email notifications
    
    return campaign;
  } catch (error) {
    console.error('Error handling funded campaign:', error);
    throw error;
  }
}

// Handle campaign completion
async function handleCampaignCompleted(campaign) {
  try {
    console.log(`Campaign ${campaign._id} has been completed!`);
    
    // Add a system comment about completion
    const completionComment = {
      userId: 'system',
      userName: 'CrowdFundNext',
      text: `✅ Campaign completed successfully! Total raised: $${campaign.amountReceived} (${campaign.progressPercentage}% of goal). Thank you to all supporters!`,
      createdAt: new Date()
    };
    
    campaign.comments.push(completionComment);
    await campaign.save();
    
    // TODO: Send completion notification to campaign creator
    // TODO: Send completion notification to all donors
    // TODO: Process fund distribution (if applicable)
    // TODO: Send email notifications
    
    return campaign;
  } catch (error) {
    console.error('Error handling completed campaign:', error);
    throw error;
  }
}

// Handle campaign failure
async function handleCampaignFailed(campaign) {
  try {
    console.log(`Campaign ${campaign._id} has failed. Progress: ${campaign.progressPercentage}%`);
    
    // Add a system comment about failure
    const failureComment = {
      userId: 'system',
      userName: 'CrowdFundNext',
      text: `❌ Campaign has ended without reaching the funding goal. Progress: ${campaign.progressPercentage}% ($${campaign.amountReceived}/${campaign.amountNeeded}).`,
      createdAt: new Date()
    };
    
    campaign.comments.push(failureComment);
    await campaign.save();
    
    // TODO: Send failure notification to campaign creator
    // TODO: Send failure notification to all donors
    // TODO: Process refunds (if applicable)
    // TODO: Send email notifications
    
    return campaign;
  } catch (error) {
    console.error('Error handling failed campaign:', error);
    throw error;
  }
}

// Get campaign statistics
async function getCampaignStatistics(req, res) {
  try {
    const stats = await Campaign.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amountReceived' },
          avgProgress: { $avg: '$progressPercentage' }
        }
      }
    ]);
    
    // Get additional statistics
    const totalCampaigns = await Campaign.countDocuments();
    const activeCampaigns = await Campaign.countDocuments({ isActive: true, status: 'approved' });
    const successfulCampaigns = await Campaign.countDocuments({ isSuccessful: true });
    const totalRaised = await Campaign.aggregate([
      { $group: { _id: null, total: { $sum: '$amountReceived' } } }
    ]);
    
    const statistics = {
      totalCampaigns,
      activeCampaigns,
      successfulCampaigns,
      totalRaised: totalRaised[0]?.total || 0,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = {
          count: stat.count,
          totalAmount: stat.totalAmount,
          avgProgress: Math.round(stat.avgProgress * 100) / 100
        };
        return acc;
      }, {})
    };
    
    res.json({ success: true, statistics });
  } catch (error) {
    console.error('Error getting campaign statistics:', error);
    res.status(500).json({ error: error.message });
  }
}

// Get campaigns by status
async function getCampaignsByStatus(req, res) {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const campaigns = await Campaign.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'firstName lastName email');
    
    const total = await Campaign.countDocuments(query);
    
    res.json({
      success: true,
      campaigns,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        hasNext: skip + campaigns.length < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Error getting campaigns by status:', error);
    res.status(500).json({ error: error.message });
  }
}

// Manual campaign status update (admin only)
async function updateCampaignStatus(req, res) {
  try {
    const { campaignId } = req.params;
    const { status, adminComment } = req.body;
    
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    const oldStatus = campaign.status;
    campaign.status = status;
    
    if (adminComment) {
      campaign.adminComment = adminComment;
    }
    
    // Update timestamps based on new status
    const now = new Date();
    switch (status) {
      case 'completed':
        campaign.completedAt = now;
        campaign.isActive = false;
        break;
      case 'failed':
        campaign.expiredAt = now;
        campaign.isActive = false;
        break;
      case 'funded':
        campaign.fundedAt = now;
        break;
    }
    
    await campaign.save();
    
    // Process status change if it's a lifecycle change
    if (['funded', 'completed', 'failed'].includes(status)) {
      await processCampaignStatusChange(campaign);
    }
    
    res.json({
      success: true,
      campaign: campaign.getCampaignSummary(),
      statusChanged: oldStatus !== status
    });
  } catch (error) {
    console.error('Error updating campaign status:', error);
    res.status(500).json({ error: error.message });
  }
}

// Leaderboard: Most Donations (by count)
async function leaderboardMostDonations(req, res) {
  try {
    const top = Number(req.query.top) || 10;
    const pipeline = [
      { $group: { _id: "$userId", donationCount: { $sum: 1 } } },
      { $sort: { donationCount: -1 } },
      { $limit: top },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$_id",
          donationCount: 1,
          firstName: "$user.firstName",
          lastName: "$user.lastName",
          profilePicture: "$user.profilePicture",
          country: "$user.country"
        }
      }
    ];
    const results = await require('../models/Transaction').aggregate(pipeline);
    res.json({ success: true, leaderboard: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Leaderboard: Most Donated (by amount)
async function leaderboardMostAmount(req, res) {
  try {
    const top = Number(req.query.top) || 10;
    const pipeline = [
      { $group: { _id: "$userId", totalDonated: { $sum: "$amount" } } },
      { $sort: { totalDonated: -1 } },
      { $limit: top },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$_id",
          totalDonated: 1,
          firstName: "$user.firstName",
          lastName: "$user.lastName",
          profilePicture: "$user.profilePicture",
          country: "$user.country"
        }
      }
    ];
    const results = await require('../models/Transaction').aggregate(pipeline);
    res.json({ success: true, leaderboard: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Platform Impact Stats (for AboutPage)
async function getPlatformImpactStats(req, res) {
  try {
    // Total campaigns
    const totalCampaigns = await Campaign.countDocuments();
    // Total funds raised
    const fundsAgg = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalFundsRaised = fundsAgg[0]?.total || 0;
    // Active supporters (unique donors)
    const supportersAgg = await Transaction.aggregate([
      { $group: { _id: '$userId' } },
      { $count: 'count' }
    ]);
    const activeSupporters = supportersAgg[0]?.count || 0;
    // Success rate (percentage of campaigns with isSuccessful true)
    const [successful, total] = await Promise.all([
      Campaign.countDocuments({ isSuccessful: true }),
      Campaign.countDocuments()
    ]);
    const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;
    res.json({
      success: true,
      stats: {
        totalCampaigns,
        totalFundsRaised,
        activeSupporters,
        successRate
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/campaigns/my-withdrawals
async function getMyCampaignsWithWithdrawals(req, res) {
  try {
    const userId = req.user.uid;
    const campaigns = await Campaign.find({ createdBy: userId }).lean();
    const campaignIds = campaigns.map(c => c._id);
    // Get all withdrawal transactions for these campaigns
    const withdrawals = await Transaction.find({
      campaignId: { $in: campaignIds },
      type: 'withdrawal',
      status: 'completed'
    }).lean();
    // Group withdrawals by campaignId
    const withdrawalsByCampaign = {};
    withdrawals.forEach(w => {
      if (!withdrawalsByCampaign[w.campaignId]) withdrawalsByCampaign[w.campaignId] = [];
      withdrawalsByCampaign[w.campaignId].push(w);
    });
    // Attach withdrawal info to each campaign
    const result = campaigns.map(c => {
      const wds = withdrawalsByCampaign[c._id] || [];
      const totalWithdrawn = wds.reduce((sum, w) => sum + (w.amount || 0), 0);
      const withdrawableAmount = (c.amountReceived || 0) - totalWithdrawn;
      return {
        ...c,
        withdrawals: wds.map(w => ({ amount: w.amount, createdAt: w.createdAt, bankDetails: w.bankDetails, status: w.status })),
        totalWithdrawn,
        withdrawableAmount
      };
    });
    res.json({ success: true, campaigns: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch campaigns with withdrawals.' });
  }
}

// POST /api/campaigns/:id/withdraw
async function withdrawFromCampaign(req, res) {
  try {
    const userId = req.user.uid;
    const { id } = req.params;
    const { amount, accountNumber, ifsc, name } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, error: 'Invalid amount.' });
    if (!accountNumber || !ifsc || !name) return res.status(400).json({ success: false, error: 'All bank details are required.' });
    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ success: false, error: 'Campaign not found.' });
    if (campaign.createdBy !== userId) return res.status(403).json({ success: false, error: 'Forbidden.' });
    const withdrawable = (campaign.amountReceived || 0) - (campaign.totalWithdrawn || 0);
    if (amount > withdrawable) return res.status(400).json({ success: false, error: 'Amount exceeds withdrawable balance.' });
    // Create withdrawal transaction
    await Transaction.create({
      userId,
      campaignId: id,
      amount,
      type: 'withdrawal',
      status: 'completed',
      bankDetails: { accountNumber, ifsc, name }
    });
    // Update campaign's totalWithdrawn
    campaign.totalWithdrawn = (campaign.totalWithdrawn || 0) + amount;
    await campaign.save();
    // Return updated campaign with withdrawal info
    // (reuse getMyCampaignsWithWithdrawals logic for this campaign)
    const withdrawals = await Transaction.find({
      campaignId: id,
      type: 'withdrawal',
      status: 'completed'
    }).lean();
    const totalWithdrawn = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    const withdrawableAmount = (campaign.amountReceived || 0) - totalWithdrawn;
    res.json({
      success: true,
      campaign: {
        ...campaign.toObject(),
        withdrawals: withdrawals.map(w => ({ amount: w.amount, createdAt: w.createdAt, bankDetails: w.bankDetails, status: w.status })),
        totalWithdrawn,
        withdrawableAmount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Withdrawal failed.' });
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
  updateCampaignLifecycle,
  getCampaignStatistics,
  getCampaignsByStatus,
  updateCampaignStatus,
  leaderboardMostDonations,
  leaderboardMostAmount,
  getPlatformImpactStats,
  getMyCampaignsWithWithdrawals,
  withdrawFromCampaign,
};