import { useEffect } from "react";
import { Alcove } from "@/components/alcove";
import { Button } from "@/components/ui/button";
import { formatToman } from "@/lib/format";
import type { MenuCategory, MenuItem } from "@/lib/types";

type ItemDetailProps = {
  item: MenuItem;
  category: MenuCategory;
  onClose: () => void;
};

export function ItemDetail({ item, category, onClose }: ItemDetailProps) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
        aria-label="بستن"
        onClick={onClose}
      />
      <div className="stone-card relative z-10 w-full max-w-lg overflow-hidden rounded-t-[28px] rounded-b-none sm:rounded-[28px]">
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-stone/50 sm:hidden" />
        <div className="p-4 sm:p-6">
          <Alcove
            src={item.imageUrl}
            alt={item.nameFa}
            iconKey={category.iconKey}
            caption={item.nameEn}
            className="aspect-[4/3] w-full"
          />
          <div className="amber-rule mt-5" />
          <div className="mt-5 flex items-start justify-between gap-4">
            <div>
              <p className="engrave text-[0.62rem]">{item.nameEn}</p>
              <h2
                id="item-title"
                className="mt-1 font-display text-2xl tracking-[0.02em] text-ink"
              >
                {item.nameFa}
              </h2>
              <p className="mt-1 text-sm text-mist">{category.nameFa}</p>
            </div>
            <div className="text-left" dir="ltr">
              <p className="font-display text-2xl tabular-nums tracking-wide text-ink">
                {formatToman(item.priceToman)}
              </p>
              <p className="mt-0.5 text-xs text-mist">تومان</p>
            </div>
          </div>
          {item.descriptionFa ? (
            <p className="mt-4 text-[0.95rem] leading-7 text-ink-soft">
              {item.descriptionFa}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {!item.isAvailable ? (
              <span className="rounded-full bg-plaster-deep px-3 py-1 text-xs text-mist">
                تمام شده
              </span>
            ) : null}
            {item.isNew ? (
              <span className="rounded-full bg-amber/20 px-3 py-1 text-xs text-amber-deep">
                جدید
              </span>
            ) : null}
            {item.isFeatured ? (
              <span className="rounded-full bg-amber/20 px-3 py-1 text-xs text-amber-deep">
                انتخاب خانه
              </span>
            ) : null}
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              بستن
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}