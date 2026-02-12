import * as React from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function InputInner({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border border-stone-200 bg-white px-4 text-sm text-stone-800",
          "placeholder:text-stone-400 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 focus:outline-none",
          "transition",
          className,
        )}
        {...props}
      />
    );
  },
);
