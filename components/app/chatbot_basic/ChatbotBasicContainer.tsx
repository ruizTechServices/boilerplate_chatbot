'use client';

import { useState } from "react";
import EmbedInput from "@/components/app/chatbot_basic/EmbedInput";
import ChatContext, { ChatMessage } from "@/components/app/chatbot_basic/ChatContext";
import generateUUID from "@/lib/functions/generateUUID";


export default function ChatbotBasicContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSubmitText = async (text: string) => {
    // 1) Show user message
    const userMessage: ChatMessage = { id: generateUUID(), role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
  
    // 2) EmbedInput already logs user embeddings
  
    // 3) Get assistant, append, and embed assistant text
    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error(`Responses API error: ${res.status}`);
      const data = await res.json();
      const assistantText: string = data?.text ?? '';
  
      const assistantMessage: ChatMessage = { id: generateUUID(), role: 'assistant', text: assistantText };
      setMessages((prev) => [...prev, assistantMessage]);
  
      // Log assistant embeddings
      try {
        const embRes = await fetch('/api/embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: assistantText }),
        });
        if (!embRes.ok) throw new Error(`Embeddings API error: ${embRes.status}`);
        const embData = await embRes.json();
        console.log('Assistant embedding vector length:', embData?.embedding?.length);
        console.log('Assistant embedding:', embData?.embedding);
      } catch (embedErr) {
        console.error('Assistant embedding error:', embedErr);
      }
    } catch (err) {
      console.error('Assistant response error:', err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-1/2 gap-4 m-10">
        <ChatContext messages={messages} />
        <EmbedInput onSubmitText={handleSubmitText} />
      </div>
    </div>
  );
}
