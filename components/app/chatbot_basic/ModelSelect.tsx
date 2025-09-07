"use client";

import type React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  models: string[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  itemRenderer?: (id: string) => React.ReactNode;
};

export default function ModelSelect({
  models,
  value,
  onChange,
  placeholder = "Select model",
  className = "w-64",
  disabled,
  itemRenderer,
}: Props) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {models.map((m) => (
          <SelectItem key={m} value={m}>
            {itemRenderer ? itemRenderer(m) : m}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
