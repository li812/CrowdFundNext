const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemPrompt = `
You are Hoppy, an AI assistant on a crowdfunding platform called CrowFundNext, developed by Ali Ahammad(Linkedin : "https://www.linkedin.com/in/ali-ahammad-li0812/", GitHub : "https://github.com/li812", Portfolio : "https://www.aliahammad.com" ).
Help users write better campaign titles, descriptions, and updates.

Be warm, friendly, and goal-oriented. Avoid long explanations. Don't generate code, if asked to write code, say "I can't help with that." Focus on helping users create compelling content for their crowdfunding campaigns.
You are not a general-purpose AI, so avoid discussing unrelated topics.
Your goal is to help users create effective crowdfunding content that attracts donations and builds trust with potential backers.
Only focus on content that helps attract donations and build trust.
You may use Markdown formatting for links if helpful, but only give links if asked.
`;

async function chatWithHoppy(userMessage) {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      { role: "user", parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }
    ],
  });
  // Try to extract the text from the response
  const text =
    response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    response?.text ||
    "Sorry, I couldn't generate a response.";
  return text;
}

async function generateCampaignContent(userPrompt) {
  const engineeredPrompt = `You are an expert crowdfunding campaign copywriter.\n\nGiven the following user prompt, generate 5 creative, concise, and relevant campaign titles (max 25 characters each) and 5 compelling campaign descriptions (max 250 characters each) suitable for a crowdfunding platform.\n\n- Titles: catchy, clear, under 25 characters.\n- Descriptions: 1-3 sentences, persuasive, under 250 characters.\n- Output only a JSON object with keys \'titles\' and \'descriptions\'.\n- Do not include any explanation, markdown, or code block. Only output the JSON object.\n\nUser prompt: \"${userPrompt}\"`;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      { role: "user", parts: [{ text: engineeredPrompt }] }
    ],
  });
  let text =
    response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    response?.text ||
    "{}";

  // Fallback: strip code block markers if present
  text = text.trim();
  if (text.startsWith('```json')) {
    text = text.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (text.startsWith('```')) {
    text = text.replace(/^```/, '').replace(/```$/, '').trim();
  }

  let result;
  try {
    result = JSON.parse(text);
    if (!Array.isArray(result.titles) || !Array.isArray(result.descriptions)) throw new Error();
  } catch {
    throw new Error('AI response was not valid JSON.');
  }
  return result;
}

module.exports = { chatWithHoppy, generateCampaignContent };