import hf from '@/lib/clients/huggingface/client'

export type HuggingfaceChatOptions = {
  system?: string
  maxOutputTokens?: number
}

export async function getHuggingfaceChat(
  message: string,
  model = 'meta-llama/Llama-3.1-70B-Instruct',
  options?: HuggingfaceChatOptions
): Promise<string> {
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw new Error("'message' must be a non-empty string")
  }

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = []
  
  if (options?.system) {
    messages.push({
      role: 'system',
      content: options.system
    })
  }
  
  messages.push({
    role: 'user',
    content: message
  })

  try {
    const response = await hf.chatCompletion({
      model,
      messages,
      max_tokens: typeof options?.maxOutputTokens === 'number' ? options.maxOutputTokens : 1024,
      temperature: 0.7
    })

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message?.content || ''
    }
    
    throw new Error('No response content from Huggingface')
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(String(error))
  }
}