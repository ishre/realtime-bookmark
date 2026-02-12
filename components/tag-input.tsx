"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Add tags...",
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const addTag = useCallback(
    (value: string) => {
      const trimmed: string = value.trim();
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
      }
    },
    [tags, onChange],
  );

  const removeTag = useCallback(
    (index: number) => {
      onChange(tags.filter((_, i: number) => i !== index));
    },
    [tags, onChange],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "," || event.key === "Enter") {
      event.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
        setInputValue("");
      }
    } else if (event.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleChange = (value: string): void => {
    if (value.includes(",")) {
      const parts: string[] = value.split(",");
      const lastPart: string = parts.pop() ?? "";
      parts.forEach((part: string) => addTag(part));
      setInputValue(lastPart.trimStart());
    } else {
      setInputValue(value);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2",
        "focus-within:border-stone-400 focus-within:ring-1 focus-within:ring-stone-200",
        "transition",
        className,
      )}
    >
      {tags.map((tag: string, index: number) => (
        <span
          key={`${tag}-${index}`}
          className="inline-flex items-center gap-1 rounded border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-medium text-stone-700"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            aria-label={`Remove ${tag}`}
            className="rounded p-0.5 hover:bg-stone-200"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="min-w-[100px] flex-1 border-0 bg-transparent py-1 text-sm text-stone-800 outline-none placeholder:text-stone-400"
      />
    </div>
  );
}
