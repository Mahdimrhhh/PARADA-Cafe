import type { CafeSettings } from "@/lib/types";
import { PebbleRow } from "@/components/pebbles";

type Props = {
  settings: CafeSettings;
};

export function Hero({ settings }: Props) {
  return (
    <header className="relative overflow-hidden px-5 pb-8 pt-20 sm:pt-24">
      {/* overhead lamp glow */}
      <div className="lamp-halo" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-cream/70 px-4 py-1.5 text-[0.65rem] tracking-[0.32em] text-mist shadow-[var(--shadow-border)]">
          <span className="size-1.5 rounded-full bg-amber shadow-[0_0_10px_2px_color-mix(in_oklab,var(--color-amber)_60%,transparent)]" />
          <span className="font-display uppercase">specialty coffee · est. 2021</span>
        </div>

        <h1 className="mt-2 font-display text-[clamp(3rem,13vw,5.6rem)] font-medium leading-[0.95] tracking-[0.18em] text-ink sm:tracking-[0.24em]">
          {settings.cafeName}
        </h1>

        <div className="led-line mt-5" />

        <p className="mt-5 font-serif text-2xl font-light tracking-[0.18em] text-ink-soft">
          {settings.taglineFa}
        </p>
        <p className="mt-1 font-display text-[0.72rem] tracking-[0.4em] text-mist uppercase">
          {settings.taglineEn}
        </p>
      </div>

      <div className="relative mx-auto mt-8">
        <img src="/cafe/Coffeehero.png" alt="کنج کافه پارادا" className="mx-auto block h-auto w-80 sm:w-96" />
      </div>

      <PebbleRow className="relative mx-auto mt-8 h-9 w-full max-w-2xl text-stone" />
    </header>
  );
}