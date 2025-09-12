export const runtime = "nodejs";

import { NextResponse } from "next/server";
import client from "@/lib/clients/mistral/client";

export async function GET() {
  try {
    const dev = process.env.NODE_ENV !== "production";
    const key = process.env.MISTRAL_API_KEY?.trim();
    
    if (!key) {
      const detail = "Missing MISTRAL_API_KEY environment variable";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }

    const list = await client.models.list();
    
    const models: string[] = Array.isArray(list.data)
      ? list.data
          .map((m: any) => m.id)
          .filter((id: any): id is string => typeof id === "string")
      : [];

    return NextResponse.json({ models });
  } catch (err) {
    console.error("/api/mistral/models error:", err);
    const dev = process.env.NODE_ENV !== "production";
    const msg = err instanceof Error ? err.message : String(err);
    
    if (/invalid\s*api[\s-]*key|unauthorized|\b401\b/i.test(msg)) {
      return NextResponse.json({ error: dev ? "Mistral authentication failed: invalid API key." : "Authentication failed" }, { status: 401 });
    }
    
    return NextResponse.json({ models: [] }, { status: 200 });
  }
}