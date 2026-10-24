"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

export type Language = "en" | "ar";

type LanguageContextValue = {
  language: Language;
  /** True when the translation engine could not be reached, so the toggle can say so. */
  unavailable: boolean;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const PAGE_LANGUAGE = "en";
const STORAGE_KEY = "dashlib.language";
const COOKIE_NAME = "googtrans";
const WIDGET_ID = "dashlib-translate-widget";
const SCRIPT_ID = "dashlib-translate-script";
const SCRIPT_SRC = "https://translate.google.com/translate_a/element.js";

type TranslateWindow = Window & {
  google?: {
    translate?: {
      TranslateElement?: new (options: Record<string, unknown>, id: string) => unknown;
    };
  };
  __dashlibTranslateReady?: () => void;
  __dashlibTranslateLoad?: Promise<void>;
};

/**
 * The Google Translate widget renders its own language `<select>`. Picking a
 * language through it translates the live DOM in place — no dictionary, no
 * second copy of the site — so that select is the only thing we drive.
 */
const widgetSelect = () => document.querySelector<HTMLSelectElement>("select.goog-te-combo");

const applyLanguage = (language: Language, force = false) => {
  const select = widgetSelect();
  if (!select) return false;

  // The widget restores the original markup when the page language is chosen.
  const target = language === "ar" ? "ar" : PAGE_LANGUAGE;
  if (!force && select.value === target) return true;

  select.value = target;
  if (select.value !== target) select.value = "";
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
};

const waitForSelect = async (timeoutMs = 8000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const select = widgetSelect();
    if (select) return select;
    await new Promise((resolve) => window.setTimeout(resolve, 100));
  }
  return null;
};

const readStoredLanguage = (): Language | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "ar" || stored === "en" ? stored : null;
  } catch {
    return null;
  }
};

const rememberLanguage = (language: Language) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Storage can be blocked; the cookie below still remembers the choice.
  }

  // Google's script reads this cookie on load, which is what keeps a reload (or
  // a shared link) in the language the reader chose.
  const value = `/${PAGE_LANGUAGE}/${language}`;
  const attributes = `; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  document.cookie = `${COOKIE_NAME}=${value}${attributes}`;
  document.cookie = `${COOKIE_NAME}=${value}${attributes}; domain=${window.location.hostname}`;
};

const reflectOnDocument = (language: Language) => {
  const root = document.documentElement;
  root.lang = language;
  root.dir = language === "ar" ? "rtl" : "ltr";
};

const loadWidget = () => {
  const target = window as TranslateWindow;
  if (target.__dashlibTranslateLoad) return target.__dashlibTranslateLoad;

  target.__dashlibTranslateLoad = new Promise<void>((resolve, reject) => {
    let timeout = 0;

    const fail = (reason: string) => {
      window.clearTimeout(timeout);
      delete target.__dashlibTranslateLoad;
      reject(new Error(reason));
    };

    timeout = window.setTimeout(
      () => fail("The translation service took too long to load."),
      20000
    );

    // The script calls this global once its own translator is ready.
    target.__dashlibTranslateReady = () => {
      window.clearTimeout(timeout);
      resolve();
    };

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `${SCRIPT_SRC}?cb=__dashlibTranslateReady`;
    script.onerror = () => fail("The translation service could not be reached.");
    document.head.appendChild(script);
  });

  return target.__dashlibTranslateLoad;
};

const mountWidget = () => {
  const target = window as TranslateWindow;
  const TranslateElement = target.google?.translate?.TranslateElement;
  const host = document.getElementById(WIDGET_ID);
  if (!TranslateElement || !host) return false;
  if (host.dataset.mounted === "true") return true;

  new TranslateElement(
    {
      pageLanguage: PAGE_LANGUAGE,
      includedLanguages: `${PAGE_LANGUAGE},ar`,
      autoDisplay: false,
    },
    WIDGET_ID
  );

  host.dataset.mounted = "true";
  return true;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [language, setLanguage] = useState<Language>("en");
  const [unavailable, setUnavailable] = useState(false);
  const [ready, setReady] = useState(false);
  const current = useRef<Language>("en");

  const translate = useCallback(async (next: Language) => {
    await loadWidget();
    if (!mountWidget()) throw new Error("The translation widget did not start.");
    if (!(await waitForSelect())) throw new Error("The translation widget did not start.");
    // A second press may have landed while the script was loading.
    if (current.current === next) applyLanguage(next, true);
  }, []);

  const commit = useCallback((next: Language) => {
    current.current = next;
    setLanguage(next);
    reflectOnDocument(next);
    rememberLanguage(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    const next: Language = current.current === "ar" ? "en" : "ar";

    if (next === "en") {
      commit("en");
      setUnavailable(false);
      // The widget restores the original markup itself, with no round trip.
      applyLanguage("en", true);
      return;
    }

    setUnavailable(false);
    commit("ar");
    void translate("ar").catch(() => {
      if (current.current !== "ar") return;
      commit("en");
      setUnavailable(true);
    });
  }, [commit, translate]);

  // A returning Arabic reader should not have to press the toggle again.
  useEffect(() => {
    const stored = readStoredLanguage();

    if (stored !== "ar") {
      // A cookie left over from an earlier Arabic session would translate the
      // next load behind the reader's back.
      if (document.cookie.includes(`${COOKIE_NAME}=`)) rememberLanguage("en");
      setReady(true);
      return;
    }

    current.current = "ar";
    setLanguage("ar");
    reflectOnDocument("ar");
    rememberLanguage("ar");
    setReady(true);

    void translate("ar").catch(() => {
      if (current.current !== "ar") return;
      commit("en");
      setUnavailable(true);
    });
  }, [commit, translate]);

  // Client-side navigation swaps in fresh English markup, so nudge the widget
  // to translate the new route too.
  useEffect(() => {
    if (!ready || current.current !== "ar") return;
    const timer = window.setTimeout(() => applyLanguage("ar", true), 350);
    return () => window.clearTimeout(timer);
  }, [pathname, ready]);

  const value = useMemo(
    () => ({ language, unavailable, toggleLanguage }),
    [language, unavailable, toggleLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
      <div id={WIDGET_ID} className="goog-te-host notranslate" aria-hidden="true" />
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside <LanguageProvider>.");
  return context;
}
