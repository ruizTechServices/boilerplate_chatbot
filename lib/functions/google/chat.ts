import client from "@/lib/clients/google/client";

/**
 * Generate a Gemini completion using the Google client wrapper.
 * Mirrors the OpenAI helper shape in lib/functions/openai/responses.ts
 *
 * @param message - The user prompt text
 * @param model - Gemini model ID (defaults to "gemini-2.5-flash")
 * @param options - Optional config: system instruction and max output tokens
 * @returns The generated text response
 */
export async function getGoogleChat(
  message: string,
  model = "gemini-2.5-flash",
  options?: { system?: string; maxOutputTokens?: number }
): Promise<string> {
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    throw new Error("'message' must be a non-empty string");
  }

  const genModel = client.getGenerativeModel({
    model,
    ...(options?.system ? { systemInstruction: options.system } : {}),
  });

  const result = await genModel.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ],
    ...(typeof options?.maxOutputTokens === "number"
      ? { generationConfig: { maxOutputTokens: options.maxOutputTokens } }
      : {}),
  });

  return result.response.text();
}
