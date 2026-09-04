import { useState } from "react";
import { CategoryIcon } from "@/components/category-icons";
import { cn } from "@/lib/utils";

type AlcoveProps = {
  src: string | null;
  alt: string;
  iconKey: string;
  caption?: string;
  className?: string;
  sizes?: string;
};

export function Alcove({ src, alt, iconKey, caption, className }: AlcoveProps) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(src) && !failed;

  return (
    <div className={cn("alcove relative", !showPhoto && "alcove-empty", className)}>
      {showPhoto ? (
        <>
          <img
            src={src ?? undefined}
            alt={alt}
            className="size-full object-cover"
            loading="lazy"
            onError={() => setFailed(true)}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--color-ink)_22%,transparent),transparent_38%)]" />
        </>
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-2 px-3 text-stone-deep">
          <CategoryIcon name={iconKey} className="size-10" />
          {caption ? (
            <span className="font-display text-[0.65rem] tracking-[0.22em] uppercase text-mist">
              {caption}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}