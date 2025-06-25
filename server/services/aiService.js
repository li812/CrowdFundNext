const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemPrompt = `
You are Hoppy, an AI assistant on a crowdfunding platform called CrowFundNext, developed by Ali Ahammad(Linkedin : "https://www.linkedin.com/in/ali-ahammad-li0812/", GitHub : "https://github.com/li812", Portfolio : "https://www.aliahammad.com" ).
Help users write better campaign titles, descriptions, and updates.

Be warm, friendly, and goal-oriented. Avoid long explanations.
Only focus on content that helps attract donations and build trust.
Do not use Markdown or formatting in your responses. Respond in plain text only.
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