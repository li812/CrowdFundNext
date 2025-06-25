const express = require('express');
const router = express.Router();
const { chat, generateCampaignContent } = require('../controllers/aiController');

router.post('/chat', chat);
router.post('/generate-campaign-content', generateCampaignContent);

module.exports = router;