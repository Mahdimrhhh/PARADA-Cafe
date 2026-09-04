import { useEffect, useMemo, useState } from "react";
import { CategoryNav } from "@/components/category-nav";
import { HamburgerNav } from "@/components/hamburger-nav";
import { Hero } from "@/components/hero";
import { ItemDetail } from "@/components/item-detail";
import { MenuList } from "@/components/menu-list";
import { PebbleRow } from "@/components/pebbles";
import { SiteFooter } from "@/components/site-footer";
import type { MenuCategory, MenuItem, MenuPayload } from "@/lib/types";

export function MenuPage({ payload }: { payload: MenuPayload }) {
  const { categories, settings } = payload;
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? null);
  const [selected, setSelected] = useState<{
    item: MenuItem;
    category: MenuCategory;
  } | null>(null);

  const bySlug = useMemo(
    () => new Map(categories.map((category) => [category.slug, category])),
    [categories],
  );

  useEffect(() => {
    const nodes = categories
      .map((category) => document.getElementById(`cat-${category.slug}`))
      .filter((node): node is HTMLElement => Boolean(node));
    if (nodes.length === 0) return;

    const update = () => {
      const marker = 96;
      let current = categories[0]?.slug ?? null;
      for (const category of categories) {
        const node = document.getElementById(`cat-${category.slug}`);
        if (!node) continue;
        if (node.getBoundingClientRect().top - marker <= 12) {
          current = category.slug;
        }
      }
      setActiveSlug(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [categories]);

  function scrollToCategory(slug: string) {
    setActiveSlug(slug);
    document.getElementById(`cat-${slug}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function scrollToSection(id: "top" | "about" | "contact") {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="plaster-page">
      <HamburgerNav
        categories={categories}
        cafeName={settings.cafeName}
        onSelectCategory={scrollToCategory}
        onScrollTo={scrollToSection}
      />

      <div id="top">
        <Hero settings={settings} />
      </div>

      <CategoryNav
        categories={categories}
        activeSlug={activeSlug}
        onSelect={scrollToCategory}
      />

      <main className="mx-auto max-w-3xl space-y-14 px-4 py-10 sm:px-6">
        {categories.map((category) =>
          category.items.length === 0 ? null : (
            <MenuList
              key={category.id}
              category={category}
              onSelect={(item) =>
                setSelected({ item, category: bySlug.get(category.slug) ?? category })
              }
            />
          ),
        )}

        <AboutSection />
      </main>

      <SiteFooter cafeName={settings.cafeName} taglineFa={settings.taglineFa} />

      {selected ? (
        <ItemDetail
          item={selected.item}
          category={selected.category}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </div>
  );
}

function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 pt-6">
      <div className="amber-rule mb-8" />
      <header className="mb-6 text-center">
        <p className="engrave text-[0.65rem]">our story</p>
        <h2 className="mt-2 font-display text-3xl tracking-[0.16em] text-ink sm:text-4xl">
          دربارهٔ پارادا
        </h2>
      </header>

      <div className="stone-card rounded-[28px] p-6 sm:p-8">
        <p className="text-base leading-8 text-ink-soft">
          پارادا یک توقفگاه است؛ جایی میان روز که می‌توانید در آن از مسیر
          مکث کنید. دیوارهای گچی، طاق‌های سنگی و نور زرد لامپ‌ها، فضایی
          ساخته‌اند که هر فنجان قهوه در آن قصه‌ای دارد. دانه‌ها را از
          رُست‌های کوچک می‌گیریم و هر هفته تازه آسیاب می‌کنیم.
        </p>

        <div className="amber-rule my-6" />

        <div className="grid gap-4 sm:grid-cols-3">
          <FactCard
            title="قهوهٔ تخصصی"
            desc="اسپرسو و فیلتر از رُستری‌های هنری ایران و اروپا"
          />
          <FactCard
            title="صبحانه تا نیمه‌شب"
            desc="از کراسان داغ تا کیک‌های خانگی، هر ساعتِ روز"
          />
          <FactCard
            title="فضای صخره‌ای"
            desc="میزهای سنگی، طاق‌های گچی، و نور گرم لامپ‌های قدیمی"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <PebbleRow className="h-6 w-48 text-stone/70" />
        </div>
      </div>
    </section>
  );
}

function FactCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[18px] border border-border bg-plaster/60 p-4 text-center">
      <p className="font-display text-base tracking-wide text-ink">{title}</p>
      <p className="mt-1.5 text-xs leading-6 text-mist">{desc}</p>
    </div>
  );
}