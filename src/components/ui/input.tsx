import type { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[12px] bg-cream px-3 text-base text-ink shadow-[var(--shadow-border)] placeholder:text-mist",
        "transition-[box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-amber/70",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-[14px] bg-cream px-3 py-2.5 text-base text-ink shadow-[var(--shadow-border)] placeholder:text-mist",
        "transition-[box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-amber/70",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-sm font-medium text-ink-soft", className)}
      {...props}
    />
  );
}
