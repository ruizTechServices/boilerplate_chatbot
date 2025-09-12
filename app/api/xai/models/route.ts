export const runtime = "nodejs";

import { NextResponse } from "next/server";
import xaiClient from "@/lib/clients/xai/client";
import type { Model } from "openai/resources/models";

export async function GET() {
  try {
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

    // XAI client is OpenAI-compatible, so we can use the same models.list() method
    const list = await xaiClient.models.list();

    // Extract model IDs from the response
    const models: string[] = list.data.map((m: Model) => m.id);

    return NextResponse.json({ models });
  } catch (err) {
    console.error("/api/xai/models error:", err);
    const dev = process.env.NODE_ENV !== "production";
    const msg = err instanceof Error ? err.message : String(err);
    
    if (/invalid\s*api[\s-]*key|unauthorized|\b401\b/i.test(msg)) {
      return NextResponse.json({ error: dev ? "XAI authentication failed: invalid API key." : "Authentication failed" }, { status: 401 });
    }
    
    // Return empty list gracefully so UI can still render
    return NextResponse.json({ models: [] }, { status: 200 });
  }
}