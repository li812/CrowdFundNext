const Campaign = require('../models/Campaign');
const User = require('../models/Users');

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

// Donate to campaign (user)
async function donateToCampaign(req, res) {
  const { amount } = req.body;
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Not found' });
  if (campaign.status !== 'approved') return res.status(400).json({ error: 'Campaign not approved' });
  if (campaign.amountReceived + Number(amount) > campaign.amountNeeded)
    return res.status(400).json({ error: 'Donation exceeds goal' });

  campaign.amountReceived += Number(amount);
  await campaign.save();
  res.json({ success: true, campaign });
}

module.exports = {
  createCampaign,
  getMyCampaigns,
  getPendingCampaigns,
  approveCampaign,
  rejectCampaign,
  donateToCampaign,
};