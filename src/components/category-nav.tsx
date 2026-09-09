import { CategoryIcon } from "@/components/category-icons";
import type { MenuCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type Props = {
  categories: MenuCategory[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
};

export function CategoryNav({ categories, activeSlug, onSelect }: Props) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // When the active category changes (via click or scroll), make sure
  // the corresponding button is visible inside the horizontal slider.
  useEffect(() => {
    if (!activeSlug) return;
    const btn = buttonRefs.current[activeSlug];
    if (!btn) return;
    btn.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeSlug]);

  return (
    <nav aria-label="دسته‌بندی منو" className="sticky-lintel sticky top-0 z-30">
      <div className="mx-auto flex max-w-3xl gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const active = category.slug === activeSlug;
          return (
            <button
              key={category.id}
              ref={(el) => {
                buttonRefs.current[category.slug] = el;
              }}
              type="button"
              onClick={() => onSelect(category.slug)}
              className={cn(
                "flex h-14 shrink-0 items-center gap-3 rounded-full px-5 text-sm transition-all duration-200 ease-out active:scale-[0.96]",
                active
                  ? "bg-ink text-cream shadow-[var(--shadow-border),0_4px_18px_-8px_color-mix(in_oklab,var(--color-amber)_55%,transparent)]"
                  : "bg-cream/55 text-ink-soft shadow-[var(--shadow-border)] hover:bg-cream hover:text-ink",
              )}
            >
              <CategoryIcon
                name={category.iconKey}
                className={cn(
                  "size-8 transition-all duration-200",
                  active ? "text-amber-glow drop-shadow-[0_0_8px_color-mix(in_oklab,var(--color-amber)_65%,transparent)]" : "text-amber-deep",
                )}
              />
              <span className="font-medium">{category.nameFa}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}