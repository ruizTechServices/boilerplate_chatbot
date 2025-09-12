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
    // Check for common error patterns
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Check for GGUF/GGML format errors
    if (model.toLowerCase().includes('gguf') || model.toLowerCase().includes('ggml')) {
      throw new Error('GGUF/GGML quantized models are not supported by the Hugging Face Inference API. These formats are meant for local inference only.')
    }
    
    // Check for provider errors
    if (errorMessage.includes('Auto selected provider: undefined')) {
      throw new Error(`Model "${model}" is not available through the Hugging Face Inference API. Please select a different model.`)
    }
    
    if (error instanceof Error) {
      throw error
    }
    throw new Error(errorMessage)
  }
}