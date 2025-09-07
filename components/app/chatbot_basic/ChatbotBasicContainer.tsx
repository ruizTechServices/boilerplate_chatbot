"use client";

import EmbedInput from "@/components/app/chatbot_basic/EmbedInput";
import ChatContext, {
  ChatMessage,
} from "@/components/app/chatbot_basic/ChatContext";
import generateUUID from "@/lib/functions/generateUUID";
import { useEffect, useState } from "react";
import { useModels } from "@/hooks/useModels";
import ModelSelect from "@/components/app/chatbot_basic/ModelSelect";

export default function ChatbotBasicContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o");
  const { models, loading, error } = useModels();

  // Keep selectedModel synced if it's not in the list
  useEffect(() => {
    if (models.length && !models.includes(selectedModel)) {
      setSelectedModel(models[0]);
    }
  }, [models, selectedModel]);

  const handleSubmitText = async (text: string) => {
    // 1) Show user message
    const userMessage: ChatMessage = { id: generateUUID(), role: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    // 2) EmbedInput already logs user embeddings

    // 3) Get assistant, append, and embed assistant text
    try {
      const isAnthropic = (selectedModel || "").toLowerCase().startsWith("claude");
      const endpoint = isAnthropic ? "/api/anthropic/chat" : "/api/openai/responses";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, model: selectedModel }),
      });
      if (!res.ok) throw new Error(`Responses API error: ${res.status}`);
      const data = await res.json();
      const assistantText: string = data?.text ?? "";

      const assistantMessage: ChatMessage = {
        id: generateUUID(),
        role: "assistant",
        text: assistantText,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Log assistant embeddings
      try {
        const embRes = await fetch("/api/openai/embeddings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: assistantText }),
        });
        if (!embRes.ok)
          throw new Error(`Embeddings API error: ${embRes.status}`);
        const embData = await embRes.json();
        console.log(
          "Assistant embedding vector length:",
          embData?.embedding?.length
        );
        console.log("Assistant embedding:", embData?.embedding);
      } catch (embedErr) {
        console.error("Assistant embedding error:", embedErr);
      }
    } catch (err) {
      console.error("Assistant response error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-1/2 h-screen gap-4 m-10">
        <ChatContext messages={messages} />
        <div className="w-full flex justify-center">
          <div className="w-1/2">
            <ModelSelect
              models={models}
              value={selectedModel}
              onChange={setSelectedModel}
              disabled={loading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>
        </div>
        <EmbedInput onSubmitText={handleSubmitText} />
      </div>
    </div>
  );
}

