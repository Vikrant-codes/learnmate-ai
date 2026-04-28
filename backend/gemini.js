const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

function getGenAI() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in your .env file.");
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Call Gemini — tries gemini-1.5-flash first (most reliable free tier model)
 * Falls back to gemini-1.5-flash-8b if needed
 */
async function callGemini({ system, user }) {
  const model = getGenAI().getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: system,
  });

  const result = await model.generateContent(user);
  return result.response.text();
}

module.exports = { callGemini };
