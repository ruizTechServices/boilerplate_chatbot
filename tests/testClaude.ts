import 'dotenv/config'
import { getAnthropicCompletion } from '@/lib/functions/anthropic/chat'

async function main() {
  console.log('🧪 Testing getAnthropicCompletion (Anthropic Claude)…')
  const prompt = 'Explain how AI works in a few words'

  try {
    const text = await getAnthropicCompletion(prompt, 'claude-3-5-sonnet-latest')
    console.log('✅ Response:', text)
  } catch (err) {
    console.error('❌ Error calling Anthropic Claude:', err)
    process.exit(1)
  }
}

main()
