const { chatWithHoppy, generateCampaignContent: generateCampaignContentAI } = require('../services/aiService');

async function chat(req, res) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required.' });
    const text = await chatWithHoppy(message);
    res.json({ text });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'AI service failed.' });
  }
}

async function generateCampaignContent(req, res) {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }
    const result = await generateCampaignContentAI(prompt);
    res.json(result);
  } catch (err) {
    console.error('AI generateCampaignContent error:', err);
    res.status(500).json({ error: err.message || 'AI service failed.' });
  }
}

module.exports = { chat, generateCampaignContent };