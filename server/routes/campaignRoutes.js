const express = require('express');
const { uploadCampaign } = require('../services/campaignFileService');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const {
  createCampaign, getMyCampaigns, getPendingCampaigns,
  approveCampaign, rejectCampaign, donateToCampaign, deleteCampaign, updateCampaign
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

module.exports = router;