import * as React from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "default" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-stone-800 text-white hover:bg-stone-700 border border-stone-200",
  outline:
    "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50",
  ghost: "bg-transparent text-stone-700 hover:bg-stone-100",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 border-red-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-11 px-5 text-sm rounded-lg",
  icon: "h-9 w-9 rounded-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function ButtonInner(
    { className, variant = "default", size = "md", type = "button", ...props },
    ref,
  ) {
    const variantClassName: string = variantClasses[variant];
    const sizeClassName: string = sizeClasses[size];

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed",
          variantClassName,
          sizeClassName,
          className,
        )}
        {...props}
      />
    );
  },
);
