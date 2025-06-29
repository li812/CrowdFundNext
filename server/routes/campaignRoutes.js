const express = require('express');
const { uploadCampaign } = require('../services/campaignFileService');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const {
  createCampaign, getMyCampaigns, getPendingCampaigns,
  approveCampaign, rejectCampaign, donateToCampaign, deleteCampaign, updateCampaign, getAllCampaigns,
  likeCampaign, addComment, getComments, updateCampaignLifecycle, getCampaignStatistics,
  getCampaignsByStatus, updateCampaignStatus, leaderboardMostDonations, leaderboardMostAmount,
  getPlatformImpactStats, getMyCampaignsWithWithdrawals, withdrawFromCampaign,
} = require('../controllers/campaignController');

const router = express.Router();

// User: create campaign
router.post(
  '/',
  verifyFirebaseToken,
  uploadCampaign.fields([
    { name: 'photos', maxCount: 5 },
    { name: 'supportDoc', maxCount: 1 }
  ]),
  createCampaign
);

// User: list own campaigns
router.get('/my', verifyFirebaseToken, getMyCampaigns);

// Admin: list pending
router.get('/pending', verifyFirebaseToken, getPendingCampaigns);

// Admin: approve/reject
router.patch('/:id/approve', verifyFirebaseToken, approveCampaign);
router.patch('/:id/reject', verifyFirebaseToken, rejectCampaign);

// User: donate
router.post('/:id/donate', verifyFirebaseToken, donateToCampaign);

// User: update campaign
router.patch(
  '/:id',
  verifyFirebaseToken,
  uploadCampaign.fields([
    { name: 'photos', maxCount: 5 },
    { name: 'supportDoc', maxCount: 1 }
  ]),
  updateCampaign
);

// User: delete campaign
router.delete('/:id', verifyFirebaseToken, deleteCampaign);

// List all approved campaigns (discovery) - requires auth to exclude user's own campaigns
router.get('/', verifyFirebaseToken, getAllCampaigns);

// Get available countries and states for filters (requires auth to exclude user's own campaigns)
router.get('/available-countries-states', verifyFirebaseToken, require('../controllers/campaignController').getAvailableCountriesAndStates);

// Like/unlike a campaign
router.post('/:id/like', verifyFirebaseToken, likeCampaign);

// Add a comment
router.post('/:id/comments', verifyFirebaseToken, addComment);

// Get all comments
router.get('/:id/comments', verifyFirebaseToken, getComments);

// Donation route
router.post('/donate', verifyFirebaseToken, donateToCampaign);

// Campaign lifecycle management routes
router.post('/lifecycle/update', verifyFirebaseToken, updateCampaignLifecycle);

// Campaign statistics
router.get('/statistics', verifyFirebaseToken, getCampaignStatistics);

// Get campaigns by status
router.get('/status/:status', verifyFirebaseToken, getCampaignsByStatus);

// Update campaign status (admin only)
router.patch('/:campaignId/status', verifyFirebaseToken, updateCampaignStatus);

// Leaderboard routes
router.get('/leaderboard/most-donations', leaderboardMostDonations);
router.get('/leaderboard/most-amount', leaderboardMostAmount);

// Public platform impact stats (for AboutPage)
router.get('/impact-stats', getPlatformImpactStats);

// User: list own campaigns with withdrawals
router.get('/my-withdrawals', verifyFirebaseToken, getMyCampaignsWithWithdrawals);

// User: withdraw from campaign
router.post('/:id/withdraw', verifyFirebaseToken, withdrawFromCampaign);

module.exports = router;