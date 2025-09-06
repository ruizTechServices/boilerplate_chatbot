import 'dotenv/config'
import { getGoogleChat } from '@/lib/functions/google/chat'

async function main() {
  console.log('🧪 Testing getGoogleChat…')
  const prompt = 'Explain how AI works in a few words'
  try {
    const text = await getGoogleChat(prompt, 'gemini-2.5-flash')
    console.log('✅ Response:', text)
  } catch (err) {
    console.error('❌ Error calling Google Gemini:', err)
    process.exit(1)
  }
}

main()
