import { useEffect, useState } from "react";
import type { MenuCategory } from "@/lib/types";
import {
  ChevronDownIcon,
  CloseIcon,
  CompassIcon,
  HomeIcon,
  InfoIcon,
  InstagramIcon,
  LayersIcon,
  MenuIcon,
  TelegramIcon,
  WhatsappIcon,
} from "@/components/social-icons";
import { cn } from "@/lib/utils";

type Props = {
  categories: MenuCategory[];
  cafeName: string;
  onSelectCategory: (slug: string) => void;
  onScrollTo: (id: "top" | "about" | "contact") => void;
};

export function HamburgerNav({
  categories,
  cafeName,
  onSelectCategory,
  onScrollTo,
}: Props) {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function go(id: "top" | "about" | "contact") {
    setOpen(false);
    onScrollTo(id);
  }

  function goCategory(slug: string) {
    setOpen(false);
    setCategoriesOpen(false);
    onSelectCategory(slug);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="باز کردن منو"
        className="fixed right-4 top-4 z-40 inline-flex size-12 items-center justify-center rounded-full bg-cream/85 text-ink shadow-[var(--shadow-border),0_8px_24px_-12px_color-mix(in_oklab,var(--color-ink)_45%,transparent)] backdrop-blur-md transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
      >
        <MenuIcon className="size-6" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="منوی اصلی"
        >
          <button
            type="button"
            aria-label="بستن منو"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
          />

          <aside
            className={cn(
              "absolute right-0 top-0 flex h-dvh w-[min(22rem,92vw)] flex-col bg-plaster shadow-[-20px_0_50px_-12px_color-mix(in_oklab,var(--color-ink)_50%,transparent)]",
              "bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklab,var(--color-led)_28%,transparent),transparent_60%),url(/textures/stone.svg)] bg-[length:auto,320px_320px] bg-no-repeat bg-repeat-y",
            )}
          >
            <header className="flex items-center justify-between border-b border-border px-5 pb-4 pt-5">
              <div>
                <p className="engrave text-[0.6rem]">{cafeName}</p>
                <p className="mt-1 font-display text-lg tracking-[0.2em] text-ink">
                  منوی اصلی
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="بستن"
                className="inline-flex size-10 items-center justify-center rounded-full bg-cream/80 text-ink shadow-[var(--shadow-border)] transition-transform hover:scale-105 active:scale-95"
              >
                <CloseIcon className="size-5" />
              </button>
            </header>

            <nav className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="space-y-1.5">
                <NavRow
                  icon={<HomeIcon className="size-5" />}
                  label="خانه"
                  onClick={() => go("top")}
                />
                <NavRow
                  icon={<InfoIcon className="size-5" />}
                  label="دربارهٔ ما"
                  onClick={() => go("about")}
                />
                <li>
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen((v) => !v)}
                    aria-expanded={categoriesOpen}
                    className="group flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-right text-ink transition-colors hover:bg-cream/70"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-amber-deep">
                        <LayersIcon className="size-5" />
                      </span>
                      <span className="font-medium">دسته‌ها</span>
                      <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[0.65rem] text-amber-deep">
                        {categories.length}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "text-mist transition-transform duration-200",
                        categoriesOpen && "rotate-180",
                      )}
                    >
                      <ChevronDownIcon className="size-4" />
                    </span>
                  </button>
                  {categoriesOpen ? (
                    <ul className="mt-1 mr-4 space-y-1 border-r border-border pr-3">
                      {categories.map((cat) => (
                        <li key={cat.id}>
                          <button
                            type="button"
                            onClick={() => goCategory(cat.slug)}
                            className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-right text-sm text-ink-soft transition-colors hover:bg-cream/70 hover:text-ink"
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-mist">
                                <CompassIcon className="size-5" />
                              </span>
                              <span>{cat.nameFa}</span>
                            </span>
                            <span className="font-display text-[0.65rem] tracking-[0.2em] text-mist uppercase">
                              {cat.nameEn}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
                <NavRow
                  icon={<CompassIcon className="size-5" />}
                  label="تماس و آدرس"
                  onClick={() => go("contact")}
                />
              </ul>

              <div className="amber-rule my-6" />

              <div>
                <p className="engrave mb-3 text-[0.6rem]">ما را دنبال کنید</p>
                <div className="grid grid-cols-3 gap-2">
                  <SocialTile
                    href="https://instagram.com/"
                    label="اینستاگرام"
                    icon={<InstagramIcon className="size-6" />}
                  />
                  <SocialTile
                    href="https://t.me/"
                    label="تلگرام"
                    icon={<TelegramIcon className="size-6" />}
                  />
                  <SocialTile
                    href="https://wa.me/"
                    label="واتساپ"
                    icon={<WhatsappIcon className="size-6" />}
                  />
                </div>
              </div>
            </nav>

            <footer className="border-t border-border px-5 py-4">
              <p className="text-center font-display text-[0.7rem] tracking-[0.32em] text-mist uppercase">
                {cafeName}
              </p>
            </footer>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function NavRow({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-right text-ink transition-colors hover:bg-cream/70"
      >
        <span className="text-amber-deep">{icon}</span>
        <span className="font-medium">{label}</span>
      </button>
    </li>
  );
}

function SocialTile({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex flex-col items-center gap-1 rounded-2xl border border-border bg-cream/55 px-3 py-3 text-ink-soft shadow-[var(--shadow-border)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream hover:text-amber-deep"
    >
      {icon}
      <span className="text-[0.7rem]">{label}</span>
    </a>
  );
}