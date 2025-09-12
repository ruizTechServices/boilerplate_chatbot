export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getXaiCompletion } from "@/lib/functions/xai/chat";

export async function POST(req: Request) {
  try {
    const { message, model = "grok-2-latest", system, maxOutputTokens } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "'message' must be a non-empty string" }, { status: 400 });
    }

    const key = process.env.XAI_API_KEY?.trim();
    if (!key) {
      const dev = process.env.NODE_ENV !== "production";
      const detail = "Missing XAI_API_KEY environment variable";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }
    if (!/^xai-/.test(key)) {
      const dev = process.env.NODE_ENV !== "production";
      const detail = "XAI_API_KEY doesn't look valid (expected to start with 'xai-'). Re-copy from https://console.x.ai without quotes or extra spaces.";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }

    const attemptGenerate = async (targetModel: string) => {
      return await getXaiCompletion(message, targetModel, {
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
      
      if (/invalid\s*api[\s-]*key|unauthorized|\b401\b/i.test(msg)) {
        const detail = "XAI authentication failed: invalid API key. Check XAI_API_KEY in your environment.";
        return NextResponse.json({ error: dev ? detail : "Authentication failed" }, { status: 401 });
      }
      
      const shouldFallback = /not\s*found|404|unavailable|Unknown model|model .* does not exist/i.test(msg);
      if (shouldFallback && model !== "grok-1") {
        try {
          const text = await attemptGenerate("grok-1");
          return NextResponse.json({ text, modelUsed: "grok-1" });
        } catch (fallbackErr) {
          const fmsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
          return NextResponse.json({ error: dev ? `Fallback failed: ${fmsg}` : "Internal Server Error" }, { status: 500 });
        }
      }
      
      return NextResponse.json({ error: dev ? msg : "Internal Server Error" }, { status: 500 });
    }
  } catch (err) {
    console.error("/api/xai/chat error:", err);
    const dev = process.env.NODE_ENV !== "production";
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: dev ? msg : "Internal Server Error" }, { status: 500 });
  }
}