import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function svgBase(props: IconProps) {
  const { className, ...rest } = props;
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
    ...rest,
  };
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <path d="M3.5 11.2 20.5 5.2c.6-.2 1.1.3.9.9l-2.8 12.4c-.2.7-.9.9-1.4.5l-3.7-2.8-2 2.5c-.2.3-.5.4-.8.1l.4-4 8.6-8c.4-.3 0-.6-.6-.2L6.5 12.4 2.6 11c-.7-.2-.7-.6.1-.9Z" />
    </svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <path d="M4 20l1.2-3.6A8 8 0 1 1 8 19.4L4 20Z" />
      <path d="M9 9.5c.2-.4.5-.7.9-.7h.6c.2 0 .4 0 .5.3l.7 1.7c.1.3 0 .6-.2.8l-.5.5c.6 1.2 1.7 2.2 2.9 2.8l.5-.6c.2-.2.5-.3.8-.2l1.7.8c.2.1.3.3.3.5v.7c0 .4-.3.8-.7.9-1 .3-3.7-.2-6-2.5C9 13.2 8.3 11.4 8.6 10.4c.1-.4.2-.6.4-.9Z" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <path d="M5 4.5h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 3 6.5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <path d="M12 21s-7-6.4-7-12a7 7 0 1 1 14 0c0 5.6-7 12-7 12Z" />
      <circle cx="12" cy="9.2" r="2.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5l3.2 2" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <path d="M14 6 8 12l6 6" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.5 9.5 13 13l-3.5 1.5L11 11Z" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <path d="M4 11 12 4l8 7v8a1.5 1.5 0 0 1-1.5 1.5h-3v-5h-7v5h-3A1.5 1.5 0 0 1 4 19Z" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8.2v.1" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...svgBase(props)}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 13 9 5 9-5M3 18l9 5 9-5" />
    </svg>
  );
}