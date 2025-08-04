'use client';

import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EmbedInputProps {
  handleEmbedding: (text: string) => void;
}

export default function EmbedInput({ handleEmbedding }: EmbedInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const submitEmbedding = () => {
    if (inputRef.current && inputRef.current.value.trim()) {
      handleEmbedding(inputRef.current.value.trim());
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-row items-center w-1/2">
      <Input
        ref={inputRef}
        placeholder="Input Query..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            submitEmbedding();
          }
        }}
      />
      <Button onClick={submitEmbedding}>Submit</Button>
    </div>
  );
}
