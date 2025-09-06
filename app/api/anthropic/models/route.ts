export const runtime = "nodejs";

import { NextResponse } from "next/server";
import client from "@/lib/clients/anthropic/client";

type AnthropicModelsList = { data?: unknown };
type ModelCandidate = { id?: unknown };

function isModelWithId(v: unknown): v is { id: string } {
  return !!v && typeof (v as ModelCandidate).id === "string";
}

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

    const list = await client.models.list({ limit: 20 });
    const data = (list as AnthropicModelsList).data;
    const models: string[] = Array.isArray(data)
      ? (data
          .map((m: unknown) => (isModelWithId(m) ? m.id : null))
          .filter(Boolean) as string[])
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

