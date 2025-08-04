// testClients.ts
// Unified test to validate initialization of all AI SDK clients.
// Run with: npx tsx tests/testClients.ts

import 'dotenv/config'

import googleClient from '../lib/clients/google/client'
import openaiClient from '../lib/clients/openai/client'
import mistralClient from '../lib/clients/mistral/client'
import anthropicClient from '../lib/clients/anthropic/client'
import huggingfaceClient from '../lib/clients/huggingface/client'
import xaiClient from '../lib/clients/xai/client'
import pineconeClient from '../lib/clients/pinecone/client'
import { createClient as supabaseClient } from '../lib/clients/supabase/client'

const tests: Array<{ name: string; client: any; keyEnv: string }> = [
    { name: 'Google (Gemini)', client: googleClient, keyEnv: 'GEMINI_API_KEY' },
    { name: 'OpenAI', client: openaiClient, keyEnv: 'OPENAI_API_KEY' },
    { name: 'Mistral', client: mistralClient, keyEnv: 'MISTRAL_API_KEY' },
    { name: 'Anthropic', client: anthropicClient, keyEnv: 'ANTHROPIC_API_KEY' },
    { name: 'HuggingFace', client: huggingfaceClient, keyEnv: 'HF_API_KEY' },
    { name: 'xAI', client: xaiClient, keyEnv: 'XAI_API_KEY' },
    { name: 'Pinecone', client: pineconeClient, keyEnv: 'PINECONE_API_KEY' },
    { name: 'Supabase', client: supabaseClient, keyEnv: 'SUPABASE_API_KEY' },
]

console.log('🧠 Unified client initialization test')
for (const { name, client, keyEnv } of tests) {
    const envPresent = !!process.env[keyEnv]
    console.log(`\n=== ${name} ===`)
    console.log('• Client initialized:', !!client)
    console.log(`• API key (${keyEnv}) configured:`, envPresent)
    try {
        console.log('• Client type:', typeof client)
        console.log('• Constructor:', client.constructor?.name)
    } catch (err) {
        console.error('❌ Error inspecting client:', err)
    }
}

console.log('\n✅ All client checks complete')
