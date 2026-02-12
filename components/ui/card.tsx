import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stone-200 bg-white shadow-sm",
        "transition-colors duration-150 hover:bg-stone-50",
        className,
      )}
      {...props}
    />
  );
}

