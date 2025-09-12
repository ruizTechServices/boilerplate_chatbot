export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getHuggingfaceChat } from "@/lib/functions/huggingface/chat";

export async function POST(req: Request) {
  try {
    const { message, model = "meta-llama/Llama-3.1-70B-Instruct", system, maxOutputTokens } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "'message' must be a non-empty string" }, { status: 400 });
    }

    const key = process.env.HF_API_KEY?.trim();
    if (!key) {
      const dev = process.env.NODE_ENV !== "production";
      const detail = "Missing HF_API_KEY environment variable";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }
    if (!/^hf_/.test(key)) {
      const dev = process.env.NODE_ENV !== "production";
      const detail = "HF_API_KEY doesn't look valid (expected to start with 'hf_'). Get your API key from https://huggingface.co/settings/tokens";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }

    const attemptGenerate = async (targetModel: string) => {
      return await getHuggingfaceChat(message, targetModel, {
        system,
        maxOutputTokens,
      });
    };

    try {
      const text = await attemptGenerate(model);
      return NextResponse.json({ text });
    } catch (primaryErr) {
      const dev = process.env.NODE_ENV !== "production";
      const msg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
      
      // Check for authentication errors
      if (/invalid\s*token|unauthorized|401|403/i.test(msg)) {
        const detail = "Huggingface authentication failed: invalid API key. Check HF_API_KEY in your environment.";
        return NextResponse.json({ error: dev ? detail : "Authentication failed" }, { status: 401 });
      }
      
      // Check if we should fallback to a smaller model
      const shouldFallback = /not\s*found|404|unavailable|rate\s*limit|model .* does not exist|too many requests/i.test(msg);
      const fallbackModel = "microsoft/Phi-3-mini-4k-instruct";
      
      if (shouldFallback && model !== fallbackModel) {
        try {
          const text = await attemptGenerate(fallbackModel);
          return NextResponse.json({ text, modelUsed: fallbackModel });
        } catch (fallbackErr) {
          const fmsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
          return NextResponse.json({ error: dev ? `Fallback failed: ${fmsg}` : "Internal Server Error" }, { status: 500 });
        }
      }
      
      return NextResponse.json({ error: dev ? msg : "Internal Server Error" }, { status: 500 });
    }
  } catch (err) {
    console.error("/api/huggingface/chat error:", err);
    const dev = process.env.NODE_ENV !== "production";
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: dev ? msg : "Internal Server Error" }, { status: 500 });
  }
}