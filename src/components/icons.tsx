import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function Glyph({ children, className = "h-4 w-4" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export function StarMotif({ className = "h-3 w-3" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 4 20 12 12 20 4 12Z" />
      <path d="M5.5 5.5h13v13h-13z" />
    </svg>
  );
}

export function IconStore({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M3.5 9.5h17" />
      <path d="M5 9.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M4 9.5 5.5 4h13L20 9.5" />
      <path d="M9.5 20v-5.5h5V20" />
    </Glyph>
  );
}

export function IconBook({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5Z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5Z" />
      <path d="M7 8h1.5M15.5 8H17" />
    </Glyph>
  );
}

export function IconBasket({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M4 9h16l-1.4 9.2a1 1 0 0 1-1 .8H6.4a1 1 0 0 1-1-.8Z" />
      <path d="M8.5 9 12 4l3.5 5" />
      <path d="M9.5 13v2.5M14.5 13v2.5" />
    </Glyph>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </Glyph>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </Glyph>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </Glyph>
  );
}

export function IconChart({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M4 19h16" />
      <path d="M6.5 19v-6M11 19V7M15.5 19v-9M20 19v-4" />
    </Glyph>
  );
}

export function IconBox({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2Z" />
      <path d="m4 7.2 8 4.3 8-4.3M12 11.5V21" />
    </Glyph>
  );
}

export function IconTransfer({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M4 8h12l-3-3M20 16H8l3 3" />
    </Glyph>
  );
}

export function IconReport({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M6 3.5h8l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3.5V8H18" />
      <path d="M8.5 12.5h6M8.5 16h4" />
    </Glyph>
  );
}

export function IconDownload({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M12 4v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M5 20h14" />
    </Glyph>
  );
}

export function IconUpload({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M12 20V9" />
      <path d="m7.5 13.5 4.5-4.5 4.5 4.5" />
      <path d="M5 4h14" />
    </Glyph>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M12 5v14M5 12h14" />
    </Glyph>
  );
}

export function IconMinus({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M5 12h14" />
    </Glyph>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Glyph>
  );
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </Glyph>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M4 12h15" />
      <path d="m14 7 5 5-5 5" />
    </Glyph>
  );
}

export function IconTrash({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M5 7h14" />
      <path d="M9 7V4.5h6V7" />
      <path d="M6.5 7l.8 12a1 1 0 0 0 1 1h7.4a1 1 0 0 0 1-1l.8-12" />
    </Glyph>
  );
}

export function IconBuilding({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M4 20V6.5L12 3l8 3.5V20" />
      <path d="M4 20h16" />
      <path d="M9.5 20v-5h5v5" />
      <path d="M8.5 8.5h1.5M14 8.5h1.5M8.5 11.5h1.5M14 11.5h1.5" />
    </Glyph>
  );
}

export function IconClipboard({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M8.5 5H7a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1.5" />
      <rect x="8.5" y="3" width="7" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </Glyph>
  );
}

export function IconVideo({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="3" y="6" width="12.5" height="12" rx="1.5" />
      <path d="m15.5 12 5.5-3.5v7Z" />
    </Glyph>
  );
}

export function IconCalendar({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="1.5" />
      <path d="M4 10h16M8.5 3.5V7M15.5 3.5V7" />
    </Glyph>
  );
}

export function IconInfo({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 11v5M12 8.2v.3" />
    </Glyph>
  );
}

export function IconArrowLeft({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M20 12H5" />
      <path d="m10 7-5 5 5 5" />
    </Glyph>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="m6 9 6 6 6-6" />
    </Glyph>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Glyph>
  );
}

export function IconLanguage({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <path d="M12 4c2.2 2.4 3.3 5.1 3.3 8s-1.1 5.6-3.3 8c-2.2-2.4-3.3-5.1-3.3-8S9.8 6.4 12 4Z" />
    </Glyph>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Glyph>
  );
}
