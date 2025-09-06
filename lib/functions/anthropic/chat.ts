import client from '@/lib/clients/anthropic/client'

export type AnthropicChatOptions = {
  system?: string
  maxOutputTokens?: number
}

function extractText(content: Array<{ type: string; text?: string }>): string {
  try {
    return content
      .map((c) => (c.type === 'text' ? c.text ?? '' : ''))
      .join('')
      .trim()
  } catch {
    return ''
  }
}

export async function getAnthropicCompletion(
  message: string,
  model = 'claude-3-5-sonnet-latest',
  options?: AnthropicChatOptions
): Promise<string> {
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw new Error("'message' must be a non-empty string")
  }

  const resp = await client.messages.create({
    model,
    max_tokens: typeof options?.maxOutputTokens === 'number' ? options.maxOutputTokens : 1024,
    ...(options?.system ? { system: options.system } : {}),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: message,
          },
        ],
      },
    ],
  })

  return extractText(resp.content as any)
}
