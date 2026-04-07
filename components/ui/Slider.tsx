"use client";

import { cn } from "@/lib/cn";

type Props = {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  className?: string;
  disabled?: boolean;
};

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  className,
  disabled,
}: Props) {
  const display = format ? format(value) : String(value);
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-1.5 flex items-baseline justify-between text-sm">
          <span className="text-ink-dim">{label}</span>
          <span className="font-mono text-ink">{display}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 appearance-none rounded-full bg-bg-border accent-accent"
      />
    </div>
  );
}
