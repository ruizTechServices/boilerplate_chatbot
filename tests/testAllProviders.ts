// Test all AI provider integrations
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000';

async function testProvider(provider: string, chatPath: string, modelsPath: string) {
  console.log(`\n🔄 Testing ${provider}...`);
  
  // Test models endpoint
  try {
    const modelsRes = await fetch(`${BASE_URL}/api/${modelsPath}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const modelsData = await modelsRes.json();
    console.log(`✅ ${provider} Models:`, modelsData.models?.slice(0, 3) || modelsData.error || 'No models');
  } catch (err) {
    console.log(`❌ ${provider} Models error:`, err);
  }
  
  // Test chat endpoint
  try {
    const chatRes = await fetch(`${BASE_URL}/api/${chatPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Say "Hello from ' + provider + '" in 5 words or less'
      })
    });
    const chatData = await chatRes.json();
    console.log(`✅ ${provider} Chat:`, chatData.text?.slice(0, 100) || chatData.error || 'No response');
  } catch (err) {
    console.log(`❌ ${provider} Chat error:`, err);
  }
}

async function runTests() {
  console.log('🚀 Testing all AI provider integrations...\n');
  
  // Test all providers
  await testProvider('OpenAI', 'openai/responses', 'openai/models');
  await testProvider('Anthropic', 'anthropic/chat', 'anthropic/models');
  await testProvider('Google Gemini', 'google/chat', 'google/models');
  await testProvider('Mistral', 'mistral/chat', 'mistral/models');
  await testProvider('Huggingface', 'huggingface/chat', 'huggingface/models');
  await testProvider('XAI (Grok)', 'xai/chat', 'xai/models');
  
  console.log('\n✨ All tests completed!');
}

// Wait for server to be ready
setTimeout(() => {
  runTests().catch(console.error);
}, 3000);