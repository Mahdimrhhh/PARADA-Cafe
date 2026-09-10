import { useEffect, useMemo, useRef, useState } from "react";
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

  // When non-null, the scroll listener must not overwrite activeSlug
  // until the programmatic scroll has completed.  Cleared by:
  //   - the position check inside the scroll listener (primary)
  //   - the scrollend event (secondary — handles interrupted scrolls)
  //   - a safety timeout (fallback for browsers without scrollend)
  const targetSlugRef = useRef<string | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detection window accounts for scroll-mt-28 (112px) on category sections.
  // The MARKER (96px) is the reference point; elements whose top edge falls
  // within TOLERANCE of it are considered active.  The lower bound
  // (-window.innerHeight) prevents elements scrolled far above the viewport
  // from being falsely detected as active.
  const MARKER = 96;
  const TOLERANCE = 60;

  useEffect(() => {
    const nodes = categories
      .map((category) => document.getElementById(`cat-${category.slug}`))
      .filter((node): node is HTMLElement => Boolean(node));
    if (nodes.length === 0) return;

    const update = () => {
      // While a programmatic scroll is in flight, only hand over
      // control once the target element has actually reached its
      // final position.  This is more reliable than a fixed timeout
      // because it adapts to the real scroll distance.
      if (targetSlugRef.current) {
        const targetNode = document.getElementById(
          `cat-${targetSlugRef.current}`,
        );
        if (targetNode) {
          const rect = targetNode.getBoundingClientRect();
          // Use a symmetric window around MARKER so the guard clears
          // when the target settles into its scroll-mt-28 offset
          // position, not when a neighbouring element happens to
          // cross the threshold.
          if (Math.abs(rect.top - MARKER) <= TOLERANCE) {
            // Target reached — clear the guard and fall through to
            // the normal detection so activeSlug stays in sync.
            targetSlugRef.current = null;
          } else {
            // Still animating — do not overwrite the user's choice.
            return;
          }
        } else {
          targetSlugRef.current = null;
        }
      }

      let current = categories[0]?.slug ?? null;
      for (const category of categories) {
        const node = document.getElementById(`cat-${category.slug}`);
        if (!node) continue;
        const rect = node.getBoundingClientRect();
        // Only consider elements actually near the marker — elements
        // scrolled far above the viewport (rect.top very negative)
        // must not match, otherwise the previous category is
        // incorrectly detected as active after scrolling to the next.
        if (
          rect.top - MARKER <= TOLERANCE &&
          rect.top > -window.innerHeight
        ) {
          current = category.slug;
        }
      }
      setActiveSlug(current);
    };

    const onScrollEnd = () => {
      if (targetSlugRef.current) {
        // Scrolling has stopped (either the programmatic scroll finished
        // or the user interrupted it).  Clear the guard and run normal
        // detection so activeSlug reflects the actual viewport.
        targetSlugRef.current = null;
        update();
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, [categories]);

  function scrollToCategory(slug: string) {
    setActiveSlug(slug);
    targetSlugRef.current = slug;

    // Safety net for browsers without scrollend support.
    if (safetyTimerRef.current) window.clearTimeout(safetyTimerRef.current);
    safetyTimerRef.current = window.setTimeout(() => {
      if (targetSlugRef.current) {
        targetSlugRef.current = null;
        safetyTimerRef.current = null;
        // Run detection so activeSlug stays in sync after the guard
        // is cleared by the timeout rather than the position check.
        let current = categories[0]?.slug ?? null;
        for (const category of categories) {
          const node = document.getElementById(`cat-${category.slug}`);
          if (!node) continue;
          const rect = node.getBoundingClientRect();
          if (
            rect.top - MARKER <= TOLERANCE &&
            rect.top > -window.innerHeight
          ) {
            current = category.slug;
          }
        }
        setActiveSlug(current);
      }
    }, 1000);

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
          پارادا یک توقفگاه است؛ جایی میان روز که می‌توانید لحظه ای
          مکث کنید. ما تلاش کردیم فضایی
          بسازیم وقفه ای در روزمره شما بنا کنیم 
        و شمارا برای لحظاتی از روزمره ها دور کنیم به ارامش وکمی طعم زندگی دعوت کنیم
        </p>

        <div className="amber-rule my-6" />

        <div className="grid gap-4 sm:grid-cols-2">
          <FactCard
            title="فضای دنج و صمیمی"
            desc="فضایی دنج و آرام برای لحظه‌هایی که دوست دارید کمی از شلوغی روز فاصله بگیرید."
          />
          <FactCard
            title="طعم‌های خاص"
            desc="آیتم‌ها را با دقت انتخاب و به شکلی متفاوت و تخصصی آماده می‌کنیم تا هر تجربه، طعم خودش را داشته باشد."
          />
          <FactCard
            title="برای همشهری‌ها"
            desc="پارادا را برای شهر و آدم‌هایش ساخته‌ایم؛ جایی برای قرارهای دوستانه، گفت‌وگوهای طولانی و لحظه‌های خوب."
          />
          <FactCard
            title="تجربه‌ای متفاوت"
            desc="برای ما کافه فقط قهوه و غذا نیست؛ ترکیبی از طعم، فضا و جزئیات است که تجربه‌ای متفاوت می‌سازد."
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