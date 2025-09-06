export const runtime = "nodejs";

import { NextResponse } from "next/server";

type GoogleModelsResponse = { models?: unknown };
type GoogleModelCandidate = { name?: unknown };

function isModelWithName(v: unknown): v is { name: string } {
  return !!v && typeof (v as GoogleModelCandidate).name === "string";
}

export async function GET() {
  try {
    const dev = process.env.NODE_ENV !== "production";
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key) {
      const detail = "Missing GEMINI_API_KEY environment variable";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }
    if (!/^AIza[0-9A-Za-z-_]{10,}$/.test(key)) {
      const detail = "GEMINI_API_KEY doesn't look like a Google AI Studio key (should start with 'AIza'). Re-copy from https://aistudio.google.com/app/apikey";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }

    const url = new URL("https://generativelanguage.googleapis.com/v1beta/models");
    url.searchParams.set("key", key);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const text = await res.text();
      const msg = `Google models list failed: ${res.status} ${res.statusText} - ${text.slice(0, 300)}`;
      return NextResponse.json({ error: dev ? msg : "Failed to list models" }, { status: 502 });
    }

    const data: GoogleModelsResponse = await res.json();
    const models: string[] = Array.isArray(data.models)
      ? (data.models
          .map((m: unknown) => (isModelWithName(m) ? m.name : null))
          .filter(Boolean) as string[])
      : [];

    return NextResponse.json({ models });
  } catch (err) {
    console.error("/api/google/models error:", err);
    return NextResponse.json({ models: [] }, { status: 200 });
  }
}

