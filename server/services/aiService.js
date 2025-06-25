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

module.exports = { chatWithHoppy };