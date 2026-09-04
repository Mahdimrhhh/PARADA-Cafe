import { cn } from "@/lib/utils";

export function PebbleRow({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 360 36"
      className={cn(className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <ellipse cx="18" cy="22" rx="16" ry="10" opacity="0.92" />
      <ellipse cx="48" cy="20" rx="12" ry="8" opacity="0.78" />
      <ellipse cx="74" cy="23" rx="10" ry="7" opacity="0.88" />
      <ellipse cx="102" cy="19" rx="15" ry="9" opacity="0.7" />
      <ellipse cx="132" cy="24" rx="11" ry="7" opacity="0.9" />
      <ellipse cx="158" cy="21" rx="13" ry="8" opacity="0.75" />
      <ellipse cx="186" cy="23" rx="9" ry="6" opacity="0.86" />
      <ellipse cx="214" cy="20" rx="16" ry="9" opacity="0.8" />
      <ellipse cx="246" cy="23" rx="11" ry="7" opacity="0.92" />
      <ellipse cx="274" cy="19" rx="13" ry="8" opacity="0.72" />
      <ellipse cx="304" cy="22" rx="10" ry="7" opacity="0.88" />
      <ellipse cx="332" cy="21" rx="14" ry="8" opacity="0.78" />
    </svg>
  );
}