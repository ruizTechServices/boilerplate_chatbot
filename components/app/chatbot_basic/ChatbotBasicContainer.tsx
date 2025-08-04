'use client';
import EmbedInput from "@/components/app/special_components/embedInput";



export default function ChatbotBasicContainer() {
  // Handles embedding submission coming from the EmbedInput client component
  const handleEmbedding = (text: string) => {
    console.log("Embedding:", text);
    // TODO: Replace console.log with actual embedding logic
  };

  return <EmbedInput handleEmbedding={handleEmbedding} />;
}
