"use client";

import { IconLanguage } from "@/components/icons";
import { useLanguage } from "@/components/language-provider";

/**
 * One press flips the whole page between English and Arabic. The label stays in
 * a fixed script (`notranslate`) so it always names the language it switches to.
 */
export function LanguageToggle({
  iconOnly = false,
  className = "",
}: {
  iconOnly?: boolean;
  className?: string;
}) {
  const { language, unavailable, toggleLanguage } = useLanguage();
  const toArabic = language !== "ar";
  const label = toArabic ? "العربية" : "English";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      translate="no"
      lang={toArabic ? "ar" : "en"}
      aria-pressed={language === "ar"}
      aria-label={
        unavailable
          ? "Translation is unavailable right now — try again"
          : toArabic
            ? "Translate this page to Arabic"
            : "Switch this page back to English"
      }
      title={
        unavailable
          ? "Translation is unavailable right now"
          : toArabic
            ? "Translate to Arabic"
            : "Switch back to English"
      }
      className={`notranslate tap-target inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border bg-paper font-medium transition-colors ${
        iconOnly ? "h-10 w-10" : "h-10 px-3 text-[13px]"
      } ${
        unavailable
          ? "border-brick text-brick"
          : "border-moss text-ink hover:border-forest"
      } ${className}`}
    >
      <IconLanguage className="h-4 w-4" />
      {iconOnly ? <span className="sr-only">{label}</span> : <span>{label}</span>}
    </button>
  );
}
