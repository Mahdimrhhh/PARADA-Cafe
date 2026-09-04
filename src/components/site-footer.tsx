import { ClockIcon, InstagramIcon, PhoneIcon, PinIcon, TelegramIcon, WhatsappIcon } from "@/components/social-icons";

export type CafeContact = {
  address: string;
  phone: string;
  hours: { label: string; value: string }[];
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
};

const DEFAULT_CONTACT: CafeContact = {
  address: "تهران، خیابان انقلاب، کوچهٔ گلستان، پلاک ۲۴",
  phone: "۰۲۱-۸۸۹۰۰۱۲۳",
  hours: [
    { label: "شنبه تا چهارشنبه", value: "۸ تا ۲۲" },
    { label: "پنجشنبه و جمعه", value: "۱۰ تا ۲۴" },
  ],
  instagram: "https://instagram.com/parada.cafe",
  telegram: "https://t.me/parada_cafe",
  whatsapp: "https://wa.me/989120000000",
};

type Props = {
  cafeName: string;
  taglineFa: string;
  contact?: CafeContact;
};

export function SiteFooter({
  cafeName,
  taglineFa,
  contact = DEFAULT_CONTACT,
}: Props) {
  return (
    <footer
      id="contact"
      className="relative mt-20 overflow-hidden border-t border-border bg-[color:color-mix(in_oklab,var(--color-plaster)_92%,var(--color-stone))] text-ink"
    >
      <div className="lamp-glow pointer-events-none absolute inset-x-0 top-0 h-24 opacity-90" />

      <div className="relative mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <div className="mb-10 flex flex-col items-center text-center">
          <p className="engrave text-[0.65rem]">a place to pause</p>
          <h2 className="mt-3 font-display text-4xl tracking-[0.2em] text-ink sm:text-5xl">
            {cafeName}
          </h2>
          <div className="led-line mt-4" />
          <p className="mt-4 max-w-md text-base leading-8 text-ink-soft">
            {taglineFa} — جایی برای مکث، یک فنجان قهوه، و گپ کوتاهی که روز را
            نرم‌تر می‌کند.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          <ContactColumn
            title="آدرس"
            icon={<PinIcon className="size-5" />}
            lines={[contact.address, "مسیرهای مترو: انقلاب / دانشگاه"]}
          />
          <ContactColumn
            title="تماس"
            icon={<PhoneIcon className="size-5" />}
            lines={[contact.phone, "سفارش رزرو صبحانه"]}
            hrefs={[{ label: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, "")}` }]}
          />
          <ContactColumn
            title="ساعات کاری"
            icon={<ClockIcon className="size-5" />}
            lines={contact.hours.flatMap((row) => [`${row.label}: ${row.value}`])}
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <MapIllustration />
          <div className="stone-card rounded-[24px] p-6">
            <p className="engrave mb-3 text-[0.65rem]">از سنگ و نور</p>
            <p className="text-sm leading-7 text-ink-soft">
              کافهٔ پارادا از دل صخره ساخته شده: دیوارهای گچی، طاق‌های سنگی،
              و نور زرد لامپ‌های قدیمی. این منو هم مثل خود کافه، ساده، گرم و
              صمیمی است.
            </p>
            <div className="amber-rule my-5" />
            <div className="flex flex-wrap gap-2">
              {contact.instagram ? (
                <SocialLink href={contact.instagram} label="Instagram">
                  <InstagramIcon className="size-4" />
                </SocialLink>
              ) : null}
              {contact.telegram ? (
                <SocialLink href={contact.telegram} label="Telegram">
                  <TelegramIcon className="size-4" />
                </SocialLink>
              ) : null}
              {contact.whatsapp ? (
                <SocialLink href={contact.whatsapp} label="WhatsApp">
                  <WhatsappIcon className="size-4" />
                </SocialLink>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-border pt-6 text-center">
          <p className="font-display text-[0.7rem] tracking-[0.4em] text-mist uppercase">
            {cafeName}
          </p>
          <p className="text-xs text-mist">
            ساخته شده با گچ، نور زرد، و یک فنجان قهوهٔ تخصصی
          </p>
        </div>
      </div>
    </footer>
  );
}

function ContactColumn({
  title,
  icon,
  lines,
  hrefs,
}: {
  title: string;
  icon: React.ReactNode;
  lines: string[];
  hrefs?: { label: string; href: string }[];
}) {
  return (
    <div className="text-center md:text-right">
      <div className="mb-4 inline-flex items-center gap-2 text-amber-deep">
        {icon}
        <h3 className="font-display text-base tracking-[0.2em] text-ink">
          {title}
        </h3>
      </div>
      <ul className="space-y-1.5 text-sm leading-7 text-ink-soft">
        {lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
        {hrefs?.map((h, i) => (
          <li key={`h${i}`}>
            <a
              href={h.href}
              className="text-amber-deep underline-offset-4 hover:underline"
            >
              {h.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-cream/60 px-3 py-1.5 text-xs text-ink-soft shadow-[var(--shadow-border)] transition-colors hover:bg-cream hover:text-amber-deep"
    >
      {children}
      <span>{label}</span>
    </a>
  );
}

function MapIllustration() {
  return (
    <div className="stone-card relative overflow-hidden rounded-[24px]">
      <svg
        viewBox="0 0 600 280"
        className="h-auto w-full"
        role="img"
        aria-label="نقشهٔ نمادین کافه پارادا"
      >
        <defs>
          <pattern
            id="mapGrid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0H0V40"
              fill="none"
              stroke="#a89d89"
              strokeWidth="0.4"
              opacity="0.5"
            />
          </pattern>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#f0d59a" stopOpacity="0.7" />
            <stop offset="1" stopColor="#f0d59a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="600" height="280" fill="#ebe6dc" />
        <rect width="600" height="280" fill="url(#mapGrid)" />

        {/* Roads */}
        <path
          d="M0 90 L600 110"
          stroke="#cbc1ad"
          strokeWidth="14"
          fill="none"
        />
        <path
          d="M0 90 L600 110"
          stroke="#ebe6dc"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          fill="none"
        />

        <path
          d="M120 0 Q140 140 110 280"
          stroke="#cbc1ad"
          strokeWidth="11"
          fill="none"
        />

        <path
          d="M120 0 Q140 140 110 280"
          stroke="#ebe6dc"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          fill="none"
        />

        <path
          d="M380 0 Q420 120 460 280"
          stroke="#cbc1ad"
          strokeWidth="10"
          fill="none"
        />

        {/* Buildings (stones) */}
        <g fill="#d6cebf" stroke="#9a938a" strokeWidth="0.6">
          <rect x="40" y="40" width="60" height="35" rx="4" />
          <rect x="180" y="50" width="55" height="32" rx="4" />
          <rect x="260" y="40" width="50" height="40" rx="4" />
          <rect x="330" y="55" width="35" height="28" rx="4" />
          <rect x="490" y="40" width="70" height="38" rx="4" />

          <rect x="20" y="160" width="70" height="38" rx="4" />
          <rect x="170" y="170" width="80" height="40" rx="4" />
          <rect x="280" y="170" width="60" height="36" rx="4" />
          <rect x="380" y="165" width="55" height="40" rx="4" />
          <rect x="470" y="170" width="90" height="35" rx="4" />
        </g>

        {/* Trees */}
        <g fill="#6b6a52" opacity="0.85">
          <circle cx="155" cy="40" r="9" />
          <circle cx="365" cy="40" r="7" />
          <circle cx="565" cy="42" r="8" />
          <circle cx="110" cy="200" r="10" />
          <circle cx="350" cy="195" r="8" />
          <circle cx="555" cy="200" r="9" />
        </g>

        {/* Pin marker */}
        <circle cx="300" cy="140" r="55" fill="url(#mapGlow)" />
        <g transform="translate(300 140)">
          <circle r="22" fill="#c4923a" opacity="0.18" />
          <path
            d="M0 -16 C7 -16 11 -10 11 -4 C11 4 0 16 0 16 C0 16 -11 4 -11 -4 C-11 -10 -7 -16 0 -16 Z"
            fill="#a37822"
            stroke="#1f1d1b"
            strokeWidth="1"
          />
          <circle r="4" cy="-4" fill="#f7f3ea" />
        </g>
        <text
          x="300"
          y="200"
          textAnchor="middle"
          fill="#1f1d1b"
          fontFamily="var(--font-display)"
          fontSize="14"
          letterSpacing="3"
        >
          PARADA
        </text>
      </svg>
    </div>
  );
}