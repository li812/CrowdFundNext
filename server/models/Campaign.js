const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['Tech', 'Education', 'Health', 'Art', 'Social Good', 'Environment', 'Startups', 'Student Life', 'Others'] },
  title: { type: String, required: true, maxlength: 25 },
  description: { type: String, required: true, maxlength: 250 },
  amountNeeded: { type: Number, required: true, min: 1 },
  amountReceived: { type: Number, default: 0 },
  photos: [{ type: String }],
  supportDocument: { type: String },
  links: [{ type: String }],
  createdBy: { type: String, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'expired', 'completed', 'funded', 'failed'], 
    default: 'pending' 
  },
  adminComment: { type: String },
  hasTimeLimit: { type: Boolean, default: false },
  timeLimitType: { 
    type: String, 
    enum: ['fixed', 'flexible'], 
    default: 'fixed' 
  },
  endDate: { type: Date },
  maxDuration: { type: Number, default: 90 },
  
  // Campaign Status Tracking
  isActive: { type: Boolean, default: true },
  daysRemaining: { type: Number },
  progressPercentage: { type: Number, default: 0 },
  
  // Campaign Lifecycle Tracking
  fundedAt: { type: Date }, // When campaign reached 100%
  completedAt: { type: Date }, // When campaign was marked as completed
  expiredAt: { type: Date }, // When campaign expired
  lastStatusUpdate: { type: Date, default: Date.now },
  
  // Campaign Results
  isSuccessful: { type: Boolean, default: false }, // Reached funding goal
  isFullyFunded: { type: Boolean, default: false }, // Reached 100% exactly
  isOverFunded: { type: Boolean, default: false }, // Exceeded funding goal
  
  // Notification flags
  fundingGoalReached: { type: Boolean, default: false },
  expirationWarningSent: { type: Boolean, default: false },
  completionNotificationSent: { type: Boolean, default: false },
  
  likes: [{ type: String, ref: 'User' }],
  comments: [{
    userId: { type: String, ref: 'User', required: true },
    userName: { type: String },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Virtual for time remaining
CampaignSchema.virtual('timeRemaining').get(function() {
  if (!this.hasTimeLimit || !this.endDate) return null;
  const now = new Date();
  const end = new Date(this.endDate);
  const diff = end - now;
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
});

// Virtual for time progress
CampaignSchema.virtual('timeProgress').get(function() {
  if (!this.hasTimeLimit || !this.endDate) return null;
  const now = new Date();
  const start = new Date(this.createdAt);
  const end = new Date(this.endDate);
  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
});

// Virtual for campaign state
CampaignSchema.virtual('campaignState').get(function() {
  if (this.status === 'pending') return 'pending_approval';
  if (this.status === 'rejected') return 'rejected';
  if (this.status === 'completed') return 'completed';
  if (this.status === 'expired') return 'expired';
  if (this.status === 'funded') return 'funded';
  if (this.status === 'failed') return 'failed';
  
  // For approved campaigns, determine current state
  if (this.status === 'approved') {
    if (this.progressPercentage >= 100) return 'funded';
    if (this.hasTimeLimit && this.daysRemaining <= 0) return 'expired';
    if (this.daysRemaining <= 7) return 'ending_soon';
    return 'active';
  }
  
  return 'unknown';
});

// Pre-save middleware to update campaign status and lifecycle
CampaignSchema.pre('save', function(next) {
  const now = new Date();
  this.updatedAt = now;
  
  // Update progress percentage
  if (this.amountNeeded > 0) {
    this.progressPercentage = Math.min(100, (this.amountReceived / this.amountNeeded) * 100);
  }
  
  // Update days remaining
  if (this.hasTimeLimit && this.endDate) {
    const end = new Date(this.endDate);
    const diff = end - now;
    this.daysRemaining = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }
  
  // Handle funding goal reached
  if (this.progressPercentage >= 100 && !this.fundingGoalReached) {
    this.fundingGoalReached = true;
    this.fundedAt = now;
    this.isSuccessful = true;
    this.isFullyFunded = this.progressPercentage === 100;
    this.isOverFunded = this.progressPercentage > 100;
    
    // Update status based on funding success
    if (this.status === 'approved') {
      this.status = 'funded';
    }
  }
  
  // Auto-update status based on time and progress for approved campaigns
  if (this.status === 'approved' && this.hasTimeLimit && this.endDate) {
    const end = new Date(this.endDate);
    
    if (now > end) {
      // Campaign has ended
      if (this.progressPercentage >= 100) {
        this.status = 'completed';
        this.completedAt = now;
        this.isActive = false;
      } else {
        this.status = 'failed';
        this.expiredAt = now;
        this.isActive = false;
        this.isSuccessful = false;
      }
      this.daysRemaining = 0;
    }
  }
  
  // Handle flexible time limit campaigns
  if (this.status === 'approved' && this.hasTimeLimit && this.timeLimitType === 'flexible') {
    const campaignDuration = Math.ceil((now - this.createdAt) / (1000 * 60 * 60 * 24));
    
    if (campaignDuration >= this.maxDuration) {
      // Campaign has reached max duration
      if (this.progressPercentage >= 100) {
        this.status = 'completed';
        this.completedAt = now;
        this.isActive = false;
      } else {
        this.status = 'failed';
        this.expiredAt = now;
        this.isActive = false;
        this.isSuccessful = false;
      }
      this.daysRemaining = 0;
    }
  }
  
  // Update last status update timestamp
  this.lastStatusUpdate = now;
  
  next();
});

// Static method to update all campaign statuses
CampaignSchema.statics.updateAllCampaignStatuses = async function() {
  const now = new Date();
  const updatedCampaigns = [];
  
  try {
    // Find all approved campaigns that need status updates
    const campaigns = await this.find({
      status: { $in: ['approved', 'funded'] },
      isActive: true
    });
    
    for (const campaign of campaigns) {
      let statusChanged = false;
      
      // Check if campaign has reached funding goal
      if (campaign.progressPercentage >= 100 && campaign.status === 'approved') {
        campaign.status = 'funded';
        campaign.fundedAt = now;
        campaign.isSuccessful = true;
        campaign.isFullyFunded = campaign.progressPercentage === 100;
        campaign.isOverFunded = campaign.progressPercentage > 100;
        statusChanged = true;
      }
      
      // Check if campaign has expired
      if (campaign.hasTimeLimit && campaign.endDate) {
        const end = new Date(campaign.endDate);
        
        if (now > end) {
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
          statusChanged = true;
        }
      }
      
      // Check flexible time limit campaigns
      if (campaign.hasTimeLimit && campaign.timeLimitType === 'flexible') {
        const campaignDuration = Math.ceil((now - campaign.createdAt) / (1000 * 60 * 60 * 24));
        
        if (campaignDuration >= campaign.maxDuration) {
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
          statusChanged = true;
        }
      }
      
      if (statusChanged) {
        campaign.lastStatusUpdate = now;
        await campaign.save();
        updatedCampaigns.push(campaign);
      }
    }
    
    console.log(`Updated ${updatedCampaigns.length} campaign statuses`);
    return updatedCampaigns;
  } catch (error) {
    console.error('Error updating campaign statuses:', error);
    throw error;
  }
};

// Instance method to get campaign summary
CampaignSchema.methods.getCampaignSummary = function() {
  return {
    id: this._id,
    title: this.title,
    status: this.status,
    progressPercentage: this.progressPercentage,
    amountReceived: this.amountReceived,
    amountNeeded: this.amountNeeded,
    daysRemaining: this.daysRemaining,
    isSuccessful: this.isSuccessful,
    isActive: this.isActive,
    campaignState: this.campaignState,
    fundedAt: this.fundedAt,
    completedAt: this.completedAt,
    expiredAt: this.expiredAt
  };
};

module.exports = mongoose.model('Campaign', CampaignSchema);