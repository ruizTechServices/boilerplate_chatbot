export const runtime = "nodejs";

import { NextResponse } from "next/server";
import client from "@/lib/clients/anthropic/client";

export async function GET() {
  try {
    const dev = process.env.NODE_ENV !== "production";
    const key = process.env.ANTHROPIC_API_KEY?.trim();
    if (!key) {
      const detail = "Missing ANTHROPIC_API_KEY environment variable";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }
    if (!/^sk-/.test(key)) {
      const detail = "ANTHROPIC_API_KEY doesn't look valid (expected to start with 'sk-'). Re-copy from https://console.anthropic.com/settings/keys";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }

    const list: any = await client.models.list({ limit: 20 } as any);
    const models: string[] = Array.isArray(list?.data)
      ? list.data
          .map((m: any) => (typeof m?.id === "string" ? m.id : null))
          .filter(Boolean)
      : [];

    return NextResponse.json({ models });
  } catch (err) {
    console.error("/api/anthropic/models error:", err);
    const dev = process.env.NODE_ENV !== "production";
    const msg = err instanceof Error ? err.message : String(err);
    if (/invalid\s*x-api-key|\b401\b/i.test(msg)) {
      return NextResponse.json({ error: dev ? "Anthropic authentication failed: invalid API key." : "Authentication failed" }, { status: 401 });
    }
    return NextResponse.json({ models: [] }, { status: 200 });
  }
}
