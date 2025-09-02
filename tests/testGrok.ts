// tests/testGrok.ts
import "dotenv/config";
import { getXaiChatResponse } from "@/lib/functions/xai/chat";

async function main() {
  console.log("🧪 Testing xAI Grok API…");

  try {
    const response = await getXaiChatResponse({
      userPrompt: "Tell me a joke about integrals.",
    });

    console.log("✅ Response:", response);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();
