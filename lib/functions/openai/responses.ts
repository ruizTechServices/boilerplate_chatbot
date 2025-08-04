// lib/functions/openai/responses.ts
import openai from '@/lib/clients/openai/client'

export async function getOpenAICompletion(
  message: string,
  model = 'gpt-4o'
): Promise<string> {
  const { output_text } = await openai.responses.create({
    model,
    input: message,
  })
  return output_text
}