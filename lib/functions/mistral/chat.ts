import { Mistral } from "@mistralai/mistralai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  throw new Error("Missing MISTRAL_API_KEY in environment variables.");
}

const client = new Mistral({ apiKey });

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
}

/**
 * Send a chat request to the Mistral API.
 *
 * @param model - Model name (e.g. "mistral-large-latest")
 * @param messages - Conversation history with roles and contents
 * @param options - Optional parameters (temperature, maxTokens, etc.)
 * @returns The assistant's response text
 *
 * @example
 * const reply = await chatWithMistral("mistral-large-latest", [
 *   { role: "user", content: "Tell me a fun fact about New York." }
 * ]);
 * console.log("Mistral says:", reply);
 */
export async function chatWithMistral(
  model: string,
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<string> {
  try {
    const response = await client.chat.complete({
      model,
      messages,
      ...options,
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) return "";

    if (typeof content === "string") {
      return content;
    } else if (Array.isArray(content)) {
      return content
        .map((chunk) => {
          if (chunk.type === "text") {
            return chunk.text;
          } else if (chunk.type === "image_url") {
            return `[Image: ${chunk.imageUrl}]`;
          }
          return "";
        })
        .join(" ");
    }

    return "";
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error calling Mistral API:", error.message);
      throw error;
    } else {
      console.error("Unknown error calling Mistral API:", error);
      throw new Error("Unknown error occurred");
    }
  }
}
