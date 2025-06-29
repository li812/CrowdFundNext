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
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'expired', 'completed'], default: 'pending' },
  adminComment: { type: String },
  
  // Time Period Configuration
  hasTimeLimit: { type: Boolean, default: false },
  timeLimitType: { 
    type: String, 
    enum: ['fixed', 'flexible'], 
    default: 'fixed' 
  },
  endDate: { type: Date },
  maxDuration: { type: Number, default: 90 }, // Maximum days for flexible campaigns
  
  // Campaign Status Tracking
  isActive: { type: Boolean, default: true },
  daysRemaining: { type: Number },
  progressPercentage: { type: Number, default: 0 },
  
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

// Pre-save middleware to update campaign status
CampaignSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Update progress percentage
  if (this.amountNeeded > 0) {
    this.progressPercentage = Math.min(100, (this.amountReceived / this.amountNeeded) * 100);
  }
  
  // Update days remaining
  if (this.hasTimeLimit && this.endDate) {
    const now = new Date();
    const end = new Date(this.endDate);
    const diff = end - now;
    this.daysRemaining = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }
  
  // Auto-update status based on time and progress
  if (this.status === 'approved' && this.hasTimeLimit && this.endDate) {
    const now = new Date();
    const end = new Date(this.endDate);
    
    if (now > end) {
      // Campaign has ended
      if (this.progressPercentage >= 100) {
        this.status = 'completed';
      } else {
        this.status = 'expired';
      }
      this.isActive = false;
    }
  }
  
  next();
});

module.exports = mongoose.model('Campaign', CampaignSchema);