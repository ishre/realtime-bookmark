"use client";

import type { ChangeEvent } from "react";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SearchBar({
  placeholder,
  value,
  onChange,
  onClear,
}: SearchBarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <div className="relative flex w-full max-w-2xl items-center">
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder ?? "Search by title, URL, tags..."}
        className={cn(
          "h-9 w-full bg-muted/50 pl-9 pr-9 text-sm shadow-none",
          "border-transparent focus-visible:border-border focus-visible:bg-background"
        )}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
