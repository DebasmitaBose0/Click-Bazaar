
import { GoogleGenAI } from "@google/genai";

export const getGeminiRecommendation = async (userHistory: string, query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a shopping assistant for ClickBazaar. 
      The user is interested in: ${userHistory}. 
      They are asking: ${query}. 
      Suggest what categories (Grocery, Fashion, Mobile, Electronics) they should look into and why. 
      Keep it brief and encouraging.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini error:", error);
    return "I'm having trouble connecting to my AI core, but I recommend checking our Electronics section for great deals!";
  }
};
