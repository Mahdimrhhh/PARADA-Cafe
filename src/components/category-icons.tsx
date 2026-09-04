import type { JSX, SVGProps } from "react";
import { cn } from "@/lib/utils";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function svgProps({ className, ...props }: IconProps) {
  return {
    viewBox: "0 0 32 32",
    fill: "none",
    className: cn("size-8", className),
    "aria-hidden": true as const,
    ...props,
  };
}

function EspressoIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M7 14h14c0 5-3.2 9-7 9s-7-4-7-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M21 16.5h3.2c1.4 0 2.3 1.4 1.7 2.7-.5 1.1-1.7 1.8-2.9 1.8H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 7.5c.6 1.2.6 2.4 0 3.6M14.5 6.5c.8 1.5.8 3.2 0 4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M8 25.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="14" cy="22" rx="3" ry="1.5" opacity="0.35" />
    </svg>
  );
}

function MilkIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M12 6h8l1.5 4.2V24a3 3 0 0 1-3 3h-5a3 3 0 0 1-3-3V10.2L12 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M11.2 10.5h9.6" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M14 16c.8 1.4 3.2 1.4 4 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="17" cy="11" r="1.8" opacity="0.4" />
    </svg>
  );
}

function ColdIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M9 8h14l-1.6 16.2A3 3 0 0 1 18.4 27h-4.8a3 3 0 0 1-3-2.8L9 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 13h2.2M16.5 15.5h3M13 19h2.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M18.5 10.5h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      <path d="M21 13h2.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function TeaIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M7 13h14c0 6-3.4 10.5-7 10.5S7 19 7 13Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M21 15.5h3a2.6 2.6 0 1 1 0 5.2h-2.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 8c1.4.4 2.1 1.6 1.6 3M14.5 7c1.6.5 2.3 1.8 1.7 3.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M8 26h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 11h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function PastryIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M8 22.5 16 6.5l8 16H8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M11.2 16.2h9.6M12.8 19.8h6.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M8 24.8h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
      <path d="M13 15h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function BreakfastIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <ellipse cx="16" cy="22" rx="10" ry="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M7 22c0-5.4 4-12.5 9-12.5S25 16.6 25 22"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="16" cy="18.5" r="3.1" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="18.5" r="1.4" opacity="0.4" />
    </svg>
  );
}

function CupIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M8 11h13v8.5A4.5 4.5 0 0 1 16.5 24h-4A4.5 4.5 0 0 1 8 19.5V11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M21 13.5h3.4A2.4 2.4 0 0 1 24.4 18H21" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 27h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 14h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
      <path d="M13 17h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

const ICONS: Record<string, (props: IconProps) => JSX.Element> = {
  espresso: EspressoIcon,
  milk: MilkIcon,
  cold: ColdIcon,
  tea: TeaIcon,
  pastry: PastryIcon,
  breakfast: BreakfastIcon,
  cup: CupIcon,
};

export const ICON_KEYS = Object.keys(ICONS);

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? CupIcon;
  return <Icon className={className} />;
}