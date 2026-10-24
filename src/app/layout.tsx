import type { Metadata } from "next";
import { Amiri, Rubik } from "next/font/google";
import "@/styles/globals.css";
import { BasketProvider } from "@/components/basket-provider";
import { LanguageProvider } from "@/components/language-provider";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin", "arabic"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DashLib — Library store & learning",
    template: "%s · DashLib",
  },
  description:
    "DashLib is the store, library and learning hub for a multi-branch educational library: catalog, basket, lessons, shifts and branch operations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${amiri.variable} ${rubik.variable} h-full antialiased`}>
      <body className="min-h-full">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:bg-forest focus:px-4 focus:py-2 focus:text-[13px] focus:text-paper"
        >
          Skip to content
        </a>
        <LanguageProvider>
          <BasketProvider>{children}</BasketProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
