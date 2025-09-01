export const runtime = "nodejs";

import { NextResponse } from "next/server";
import openai from "@/lib/clients/openai/client";
import type { Model } from "openai/resources/models";

export async function GET() {
  try {
    // `list()` returns a proper typed response
    const list = await openai.models.list();

    // Explicitly type as Model[]
    const models: string[] = list.data.map((m: Model) => m.id);

    return NextResponse.json({ models });
  } catch (err) {
    console.error("/api/openai/models error:", err);
    // Return empty list gracefully so UI can still render
    return NextResponse.json({ models: [] }, { status: 200 });
  }
}
