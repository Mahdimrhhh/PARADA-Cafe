import { Alcove } from "@/components/alcove";
import { formatToman } from "@/lib/format";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  category: MenuCategory;
  onSelect: (item: MenuItem) => void;
};

export function MenuList({ category, onSelect }: Props) {
  const featured = category.items.filter((item) => item.isFeatured);
  const rest = category.items.filter((item) => !item.isFeatured);

  return (
    <section id={`cat-${category.slug}`} className="scroll-mt-28">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="engrave text-[0.62rem]">{category.nameEn}</p>
          <h2 className="mt-1 font-display text-2xl tracking-[0.05em] text-ink sm:text-3xl">
            {category.nameFa}
          </h2>
        </div>
        <span className="amber-rule mb-2 flex-1" />
      </header>

      {featured.length > 0 ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {featured.map((item) => (
            <FeaturedCard
              key={item.id}
              item={item}
              iconKey={category.iconKey}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}

      <ul className="space-y-2">
        {rest.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className={cn(
                "group flex w-full items-start gap-3 rounded-[18px] border border-transparent bg-cream/40 px-3 py-3 text-right shadow-[var(--shadow-border)] transition-all duration-200 ease-out hover:border-amber/40 hover:shadow-[var(--shadow-led)] active:scale-[0.99]",
                !item.isAvailable && "opacity-50",
              )}
            >
              <Alcove
                src={item.imageUrl}
                alt={item.nameFa}
                iconKey={category.iconKey}
                className="size-16 shrink-0 rounded-[14px]"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="text-[1.05rem] font-medium text-ink">
                    {item.nameFa}
                  </span>
                  {item.isNew ? (
                    <span className="rounded-full bg-amber/20 px-2 py-0.5 text-[0.6rem] tracking-wide text-amber-deep">
                      جدید
                    </span>
                  ) : null}
                  <span className="menu-leader" />
                  <span className="font-display text-[1.05rem] tabular-nums text-ink" dir="ltr">
                    {formatToman(item.priceToman)}
                  </span>
                </span>
                <span className="mt-1 block font-display text-[0.7rem] tracking-[0.18em] text-mist uppercase">
                  {item.nameEn}
                </span>
                {item.descriptionFa ? (
                  <span className="mt-1 block text-sm leading-6 text-ink-soft">
                    {item.descriptionFa}
                  </span>
                ) : null}
                {!item.isAvailable ? (
                  <span className="mt-1 block text-xs text-mist">تمام شده</span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FeaturedCard({
  item,
  iconKey,
  onSelect,
}: {
  item: MenuItem;
  iconKey: string;
  onSelect: (item: MenuItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={cn(
        "group stone-card overflow-hidden rounded-[28px] p-2 text-right transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-led),var(--shadow-border)] active:scale-[0.98]",
        !item.isAvailable && "opacity-55",
      )}
    >
      <Alcove
        src={item.imageUrl}
        alt={item.nameFa}
        iconKey={iconKey}
        caption={item.nameEn}
        className="aspect-[4/3] w-full rounded-[20px]"
      />
      <span className="flex items-end justify-between gap-3 px-2 pb-2 pt-3">
        <span>
          <span className="block font-display text-[0.65rem] tracking-[0.24em] text-mist uppercase">
            {item.nameEn}
          </span>
          <span className="mt-1 block font-display text-lg tracking-[0.02em] text-ink">
            {item.nameFa}
          </span>
          {item.descriptionFa ? (
            <span className="mt-1 block text-sm leading-6 text-ink-soft">
              {item.descriptionFa}
            </span>
          ) : null}
        </span>
        <span className="shrink-0 pb-0.5 text-left" dir="ltr">
          <span className="block font-display text-xl tabular-nums text-ink">
            {formatToman(item.priceToman)}
          </span>
          <span className="block text-[0.65rem] text-mist">تومان</span>
        </span>
      </span>
    </button>
  );
}