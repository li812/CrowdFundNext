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
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminComment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', CampaignSchema);