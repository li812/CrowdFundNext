const { chatWithHoppy } = require('../services/aiService');

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

module.exports = { chat };