"use client";

import { cn } from "@/lib/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "subtle";
type Size = "sm" | "md" | "lg";

const styles: Record<Variant, string> = {
  primary:
    "bg-accent text-bg hover:bg-accent/90 focus-visible:ring-accent border border-accent/40",
  secondary:
    "bg-bg-card text-ink border border-bg-border hover:border-accent/60 hover:text-accent",
  ghost:
    "bg-transparent text-ink-dim hover:text-ink border border-transparent hover:border-bg-border",
  subtle:
    "bg-bg-soft text-ink border border-bg-border hover:bg-bg-card",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-9 px-4 text-sm rounded-xl",
  lg: "h-11 px-5 text-base rounded-xl",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", size = "md", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none",
        styles[variant],
        sizes[size],
        className,
      )}
      {...rest}
    />
  );
});
