export const runtime = "nodejs";

import { NextResponse } from "next/server";

// Predefined list of popular Huggingface models that work well with the InferenceClient
// NOTE: GGUF, GGML, and other quantized formats are NOT supported by the HF Inference API
// These formats are meant for local inference only (e.g., with llama.cpp)
const AVAILABLE_MODELS = [
  "meta-llama/Llama-3.1-70B-Instruct",
  "meta-llama/Llama-3.1-8B-Instruct",
  "meta-llama/Meta-Llama-3-70B-Instruct",
  "meta-llama/Meta-Llama-3-8B-Instruct",
  "mistralai/Mistral-7B-Instruct-v0.3",
  "mistralai/Mixtral-8x7B-Instruct-v0.1",
  "microsoft/Phi-3-mini-4k-instruct",
  "google/gemma-2-9b-it",
  "google/gemma-2-2b-it",
  "HuggingFaceH4/zephyr-7b-beta",
  "codellama/CodeLlama-34b-Instruct-hf",
  "codellama/CodeLlama-13b-Instruct-hf",
  "codellama/CodeLlama-7b-Instruct-hf",
  "tiiuae/falcon-7b-instruct",
  "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
  "bigcode/starcoder2-15b-instruct-v0.1",
  "Qwen/Qwen2.5-72B-Instruct",
  "Qwen/Qwen2.5-7B-Instruct",
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
  "deepseek-ai/DeepSeek-Prover-V2-671B"
];

export async function GET() {
  try {
    const dev = process.env.NODE_ENV !== "production";
    const key = process.env.HF_API_KEY?.trim();
    
    if (!key) {
      const detail = "Missing HF_API_KEY environment variable";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }
    
    if (!/^hf_/.test(key)) {
      const detail = "HF_API_KEY doesn't look valid (expected to start with 'hf_'). Get your API key from https://huggingface.co/settings/tokens";
      return NextResponse.json({ error: dev ? detail : "Internal Server Error" }, { status: 500 });
    }

    // Return the predefined list of models
    // In a production environment, you might want to fetch this dynamically from Huggingface API
    // But for reliability and performance, we use a curated list of models known to work well
    return NextResponse.json({ models: AVAILABLE_MODELS });
    
  } catch (err) {
    console.error("/api/huggingface/models error:", err);
    const dev = process.env.NODE_ENV !== "production";
    const msg = err instanceof Error ? err.message : String(err);
    
    // Return empty array on error to maintain consistency with other model endpoints
    return NextResponse.json({ models: [] }, { status: 200 });
  }
}