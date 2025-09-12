export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { chatWithMistral } from "@/lib/functions/mistral/chat";

export async function POST(req: Request) {
  try {
    const { message, model = "mistral-large-latest", system, maxOutputTokens } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "'message' must be a non-empty string" }, { status: 400 });
    }

    const key = process.env.MISTRAL_API_KEY?.trim();
    if (!key) {
      const dev = process.env.NODE_ENV !== "production";
      const detail = "Missing MISTRAL_API_KEY environment variable";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }

    const attemptGenerate = async (targetModel: string) => {
      const messages = system 
        ? [
            { role: "system" as const, content: system },
            { role: "user" as const, content: message }
          ]
        : [{ role: "user" as const, content: message }];

      return await chatWithMistral(targetModel, messages, {
        maxTokens: maxOutputTokens,
      });
    };

    try {
      const text = await attemptGenerate(model);
      return NextResponse.json({ text });
    } catch (primaryErr) {
      const dev = process.env.NODE_ENV !== "production";
      const msg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
      
      if (/invalid\s*api[\s-]*key|unauthorized|\b401\b/i.test(msg)) {
        const detail = "Mistral authentication failed: invalid API key. Check MISTRAL_API_KEY in your environment.";
        return NextResponse.json({ error: dev ? detail : "Authentication failed" }, { status: 401 });
      }
      
      const shouldFallback = /not\s*found|404|unavailable|Unknown model|model .* does not exist/i.test(msg);
      if (shouldFallback && model !== "mistral-small-latest") {
        try {
          const text = await attemptGenerate("mistral-small-latest");
          return NextResponse.json({ text, modelUsed: "mistral-small-latest" });
        } catch (fallbackErr) {
          const fmsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
          return NextResponse.json({ error: dev ? `Fallback failed: ${fmsg}` : "Internal Server Error" }, { status: 500 });
        }
      }
      
      return NextResponse.json({ error: dev ? msg : "Internal Server Error" }, { status: 500 });
    }
  } catch (err) {
    console.error("/api/mistral/chat error:", err);
    const dev = process.env.NODE_ENV !== "production";
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: dev ? msg : "Internal Server Error" }, { status: 500 });
  }
}