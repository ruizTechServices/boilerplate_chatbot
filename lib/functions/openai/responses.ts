import openai from '@/lib/clients/openai/client'
import type { ResponseCreateParams } from 'openai/resources/responses/responses'

export async function getOpenAICompletion(
  message: string,
  model = 'gpt-4o',
  options?: { system?: string; maxOutputTokens?: number }
): Promise<string> {
  const payload: ResponseCreateParams = {
    model,
    input: message,
  }

  if (options?.system) {
    payload.instructions = options.system
  }
  if (typeof options?.maxOutputTokens === 'number') {
    payload.max_output_tokens = options.maxOutputTokens
  }

  const { output_text } = await openai.responses.create(payload)
  return output_text
}
