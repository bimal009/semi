'use server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function Gemini(prompt: string) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export default Gemini;
