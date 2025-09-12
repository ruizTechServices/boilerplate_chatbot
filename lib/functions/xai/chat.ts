import xaiClient from "@/lib/clients/xai/client";

export interface XaiChatOptions {
  system?: string;
  maxOutputTokens?: number;
}

/**
 * Send a chat request to the XAI API using the OpenAI-compatible client.
 *
 * @param message - The user's message
 * @param model - Model name (e.g. "grok-2-latest", "grok-1")
 * @param options - Optional parameters (system prompt, max tokens)
 * @returns The assistant's response text
 */
export async function getXaiCompletion(
  message: string,
  model = "grok-2-latest",
  options?: XaiChatOptions
): Promise<string> {
  const messages: Array<{ role: "system" | "user"; content: string }> = [];
  
  if (options?.system) {
    messages.push({ role: "system", content: options.system });
  }
  
  messages.push({ role: "user", content: message });

  const chatCompletion = await xaiClient.chat.completions.create({
    model,
    messages,
    ...(options?.maxOutputTokens && { max_tokens: options.maxOutputTokens }),
  });

  return chatCompletion.choices[0]?.message?.content || "";
}
