import { GoogleGenerativeAI } from "@google/generative-ai";

const rawKey = process.env.GEMINI_API_KEY ?? "";
const sanitizedKey = rawKey.trim();
const client = new GoogleGenerativeAI(sanitizedKey);

export default client;