export const DEFAULT_MODEL_BLACKLIST = [
  "embedding",
  "whisper",
  "tts",
  "realtime",
  "moderation",
  "audio",
  "clip",
  "vision",
  "image",
  "computer-use",
  "codex",
  "dall-e",
  "o1",
  "o3",
  "search-preview",
  "transcribe",
  "pro",
];

export function allowModel(id: string, blacklist: string[] = DEFAULT_MODEL_BLACKLIST): boolean {
  const lower = (id ?? "").toLowerCase();
  return !blacklist.some((b) => lower.includes(b));
}
