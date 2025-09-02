// lib/functions/xai/chat.ts
import type { RequestInit } from "next/dist/server/web/spec-extension/request";

export type XaiChatOptions = {
  model?: string;
  systemPrompt?: string;
  userPrompt: string;
};

export async function getXaiChatResponse(
  options: XaiChatOptions,
  fetchOptions?: RequestInit
): Promise<string> {
  const endpoint = "https://api.x.ai/v1/chat/completions";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.XAI_API_KEY}`, // 👈 must be set in .env
      },
      body: JSON.stringify({
        model: options.model ?? "grok-4",
        messages: [
          {
            role: "system",
            content: options.systemPrompt ?? "You are a PhD-level mathematician.",
          },
          {
            role: "user",
            content: options.userPrompt,
          },
        ],
      }),
      ...fetchOptions,
    });

    if (!res.ok) {
      throw new Error(`XAI Chat API error: ${res.status} ${await res.text()}`);
    }

    const data = (await res.json()) as {
      choices: { message: { role: string; content: string } }[];
    };

    return data.choices?.[0]?.message?.content ?? "";
  } catch (err) {
    console.error("getXaiChatResponse error:", err);
    return "";
  }
}
