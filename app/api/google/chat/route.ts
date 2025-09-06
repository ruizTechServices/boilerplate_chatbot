import client from "@/lib/clients/google/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { message, model = "gemini-2.5-flash", system, maxOutputTokens } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "'message' must be a non-empty string" }, { status: 400 });
    }   

    if (!process.env.GEMINI_API_KEY) {
      const dev = process.env.NODE_ENV !== "production";
      const detail = "Missing GEMINI_API_KEY environment variable";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }

    const key = process.env.GEMINI_API_KEY.trim();
    if (!/^AIza[0-9A-Za-z-_]{10,}$/.test(key)) {
      const dev = process.env.NODE_ENV !== "production";
      const detail = "GEMINI_API_KEY doesn't look like a Google AI Studio key (should start with 'AIza'). Re-copy from https://aistudio.google.com/app/apikey without quotes or extra spaces.";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }

    const attemptGenerate = async (targetModel: string) => {
      const genModel = client.getGenerativeModel({
        model: targetModel,
        ...(system ? { systemInstruction: system } : {}),
      });
      const result = await genModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        ...(typeof maxOutputTokens === "number" ? { generationConfig: { maxOutputTokens } } : {}),
      });
      return result.response.text();
    };

    try {
      const text = await attemptGenerate(model);
      return NextResponse.json({ text });
    } catch (primaryErr) {
      const dev = process.env.NODE_ENV !== "production";
      const msg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
      const shouldFallback = /not\s*found|404|unavailable|Unknown model/i.test(msg);
      if (shouldFallback && model !== "gemini-1.5-flash") {
        try {
          const text = await attemptGenerate("gemini-1.5-flash");
          return NextResponse.json({ text, modelUsed: "gemini-1.5-flash" });
        } catch (fallbackErr) {
          const fmsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
          return NextResponse.json({ error: dev ? `Fallback failed: ${fmsg}` : "Internal Server Error" }, { status: 500 });
        }
      }
      return NextResponse.json({ error: dev ? msg : "Internal Server Error" }, { status: 500 });
    }
  } catch (err) {
    console.error("/api/google/chat error:", err);
    const dev = process.env.NODE_ENV !== "production";
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: dev ? msg : "Internal Server Error" }, { status: 500 });
  }
}