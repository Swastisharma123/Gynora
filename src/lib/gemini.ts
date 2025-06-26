// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDcnvO51bmfFhn-cKLP61-BVE2wZfEl9Ls"; // Replace with your Gemini Flash API key

const model = new GoogleGenerativeAI(API_KEY).getGenerativeModel({
  model: "models/gemini-1.5-flash",
});

export async function callGeminiFlash(prompt: string) {
  const result = await model.generateContent([prompt]);
  const text = await result.response.text();
  return text;
}
