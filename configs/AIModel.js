import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});

// ✅ Exported function so it can be used anywhere (like EditorExtension.js)
export async function askGemini(question) {
  try {
    const result = await chatSession.sendMessage(question);
    const response = await result.response.text();
    console.log("Gemini Response:", response);
    return response;
  } catch (err) {
    console.error(err);
    return "<p>⚠️ Gemini API is currently overloaded. Please try again in a moment.</p>";
  }
}
