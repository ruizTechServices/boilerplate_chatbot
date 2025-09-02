import { chatWithMistral } from "../lib/functions/mistral/chat";

async function testMistral() {
  try {
    console.log("🔄 Testing Mistral API utility...");

    const reply = await chatWithMistral("mistral-large-latest", [
      { role: "user", content: "Don't lean on my preference, but which one is better for you, english or french?" },
    ], {
      temperature: 0.7,
      maxTokens: 200,
    });

    console.log("✅ Mistral responded with:");
    console.log(reply);
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testMistral();
