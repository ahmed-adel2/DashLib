import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { StarMotif } from "@/components/icons";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-forest text-paper hover:bg-forest-deep",
  secondary: "border border-moss bg-paper text-ink hover:border-forest hover:bg-cream",
  ghost: "text-forest hover:bg-sage",
  danger: "bg-brick text-paper hover:bg-brick-deep",
};

const sizes: Record<Size, string> = {
  sm: "tap-target h-8 gap-1.5 px-3 text-[12px]",
  md: "h-10 gap-2 px-4 text-[13px]",
  lg: "h-12 gap-2.5 px-6 text-[14px]",
};

export const buttonClass = (variant: Variant = "primary", size: Size = "md", extra = "") =>
  `inline-flex items-center justify-center rounded-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${extra}`;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

type Tone = "neutral" | "forest" | "gold" | "brick" | "sand" | "terracotta" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-sage text-forest",
  forest: "bg-forest text-paper",
  gold: "bg-gold-tint text-gold-ink",
  brick: "bg-brick-tint text-brick-ink",
  sand: "bg-[#f1e8d6] text-[#6b4a10]",
  terracotta: "bg-[#fae8e3] text-[#8f2c22]",
  outline: "border border-line text-stone",
};

export function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm px-2 py-[3px] text-[10px] font-medium uppercase tracking-[0.1em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Panel({
  children,
  className = "",
  ticks = false,
}: {
  children: ReactNode;
  className?: string;
  ticks?: boolean;
}) {
  return <section className={`panel ${ticks ? "ticks" : ""} ${className}`}>{children}</section>;
}

export function PanelHead({
  title,
  hint,
  action,
}: {
  title: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <StarMotif className="h-2.5 w-2.5 shrink-0 text-gold" />
        <h2 className="truncate text-[15px] leading-none text-ink">{title}</h2>
        {hint ? <span className="truncate text-[11.5px] text-stone">{hint}</span> : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function PageHeading({
  title,
  meta,
  actions,
}: {
  title: string;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <h1 className="text-[26px] leading-[1.1] text-ink sm:text-[30px]">{title}</h1>
        {meta ? (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-stone">
            {meta}
          </div>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function StarRule({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <StarMotif className="h-2 w-2 shrink-0 text-gold" />
      <span className="h-px flex-1 bg-line" />
      {label ? <span className="lbl">{label}</span> : null}
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone = "ink",
}: {
  label: string;
  value: string;
  sub?: ReactNode;
  tone?: "ink" | "brick";
}) {
  return (
    <div className="min-w-0">
      <div className="lbl">{label}</div>
      <div
        className={`num mt-2 font-display text-[28px] leading-none sm:text-[30px] ${
          tone === "brick" ? "text-brick" : "text-ink"
        }`}
      >
        {value}
      </div>
      {sub ? <div className="mt-2 text-[11.5px] leading-snug text-stone">{sub}</div> : null}
    </div>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="lbl mb-1.5 block">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={htmlFor ? `${htmlFor}-hint` : undefined} className="mt-1.5 text-[11.5px] leading-snug text-stone">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="px-6 py-14 text-center">
      <StarMotif className="mx-auto h-3.5 w-3.5 text-gold" />
      <h3 className="mt-4 text-[19px] text-ink">{title}</h3>
      {body ? <p className="mx-auto mt-2 max-w-[44ch] text-[13px] leading-relaxed text-stone">{body}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Meter({
  value,
  max,
  tone = "forest",
}: {
  value: number;
  max: number;
  tone?: "forest" | "brick" | "gold";
}) {
  const width = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const fill = tone === "brick" ? "bg-brick" : tone === "gold" ? "bg-gold" : "bg-forest";
  return (
    <div className="h-1.5 w-full overflow-hidden bg-sage" aria-hidden="true">
      <div className={`h-full ${fill}`} style={{ width: `${width}%` }} />
    </div>
  );
}

export function DataNote({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-stone">
      <StarMotif className="mt-[3px] h-2 w-2 shrink-0 text-gold" />
      <span>{children}</span>
    </p>
  );
}
