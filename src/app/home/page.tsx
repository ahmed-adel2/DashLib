import type { Metadata } from "next";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui";
import { Badge } from "@/components/ui";
import { StarMotif } from "@/components/icons";
import { LanguageToggle } from "@/components/language-toggle";
import { BranchScene } from "@/components/branch-scene";
import { StudyScene } from "@/components/study-scene";

export const metadata: Metadata = {
  title: "DashLib — Library Learning Hub",
  description:
    "Welcome to DashLib — your multi-branch educational library, learning hub, and store for textbooks, stationery, and lesson material.",
};

function SocialTag({ href, label, title }: { href: string; label: string; title: string }) {
  return (
    <Badge
      tone="gold"
      className="hover:bg-gold-tint hover:text-gold-ink transition-colors"
      aria-label={title}
    >
      <Link href={href} className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-gold-ink underline underline-offset-2 hover:text-gold">
        {label}
      </Link>
    </Badge>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      {/* Hero Section */}
      <header className="pt-20 pb-12 relative overflow-hidden">
        <div className="absolute right-5 top-5 z-20 sm:right-8">
          <LanguageToggle />
        </div>
        <BranchScene className="w-full h-[400px] sm:h-[500px] md:h-[600px] -order-2 sm:-order-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-gold/20 to-transparent opacity-80"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between max-w-[1240px] mx-auto px-5 gap-8 sm:px-8">
          <div className="order-1 sm:order-2 text-center sm:text-left">
            <h1 className="text-[36px] sm:text-[48px] leading-[1.05] font-display text-gold mb-4">
              The Smartest Choice for Your School
            </h1>
            <p className="text-[14px] sm:text-[16px] leading-relaxed text-stone/70 mb-6 max-w-lg">
              DashLib combines a comprehensive catalog, learning resources, and a convenient store — all across three branches. Everything your students need, in one place.
            </p>
            <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
              <SocialTag
                href="https://twitter.com/dashlib"
                label="#DashLib"
                title="Follow DashLib on Twitter"
              />
              <SocialTag
                href="https://instagram.com/dashlib"
                label="@dashlib"
                title="Follow DashLib on Instagram"
              />
              <SocialTag
                href="https://facebook.com/dashlib"
                label="DashLib"
                title="Like DashLib on Facebook"
              />
            </div>
          </div>

          {/* Feature cards - what makes us special */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 order-2 sm:order-1">
            <div className="bg-cream border border-line rounded-lg p-6 hover:border-forest transition-colors">
              <div className="h-12 w-12 bg-gold-tint rounded-lg flex items-center justify-center mb-4">
                <StarMotif className="h-5 w-5 text-gold" />
              </div>
              <h3 className="text-[15px] font-medium text-forest mb-2">Three Branches, One System</h3>
              <p className="text-[12px] text-stone/60 leading-relaxed">
 Access your library catalog, basket, and learning materials across Main, East, and West branches seamlessly.
              </p>
            </div>

            <div className="bg-cream border border-line rounded-lg p-6 hover:border-forest transition-colors">
              <div className="h-12 w-12 bg-gold-tint rounded-lg flex items-center justify-center mb-4">
                <StarMotif className="h-5 w-5 text-gold" />
              </div>
              <h3 className="text-[15px] font-medium text-forest mb-2">Curated for Students</h3>
              <p className="text-[12px] text-stone/60 leading-relaxed">
 Our collection is hand-picked by educators — textbooks, stationery, and art supplies that actually get used in the classroom.
              </p>
            </div>

            <div className="bg-cream border border-line rounded-lg p-6 hover:border-forest transition-colors">
              <div className="h-12 w-12 bg-gold-tint rounded-lg flex items-center justify-center mb-4">
                <StarMotif className="h-5 w-5 text-gold" />
              </div>
              <h3 className="text-[15px] font-medium text-forest mb-2">Branch Stock Check</h3>
              <p className="text-[12px] text-stone/60 leading-relaxed">
 Know exactly what's in stock at your branch before you visit. No wasted trips, no disappointment.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* About Us Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[28px] sm:text-[34px] font-display text-gold mb-6">
                Why Schools Choose DashLib
              </h2>
              <p className="text-[14px] leading-relaxed text-stone/70 mb-6">
                We're more than just a store — we're a learning partner for educational institutions across the city. From individual textbooks to bulk supplies for entire grades, we handle it all with branch-specific stock tracking and flexible pickup options.
              </p>
              <ul className="list-disc list-inside space-y-3 text-stone/80">
                <li>
                  Comprehensive catalog with live stock visibility per branch
                </li>
                <li>
                  Educator-curated selections at school-appropriate prices
                </li>
                <li>
                  Branch-exclusive deals and bundles
                </li>
                <li>
                  Flexible pickup and delivery options
                </li>
              </ul>
            </div>

            <div className="relative">
              <StudyScene className="w-full rounded-lg overflow-hidden h-[300px] sm:h-[350px]" />
              <div className="absolute inset-0 bg-forest/10 rounded-lg opacity-70"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 bg-paper">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[28px] sm:text-[34px] font-display text-gold mb-6">
                Get in Touch
              </h2>
              <p className="text-[14px] leading-relaxed text-stone/70 mb-8">
                We'd love to hear from you. Whether you're a teacher building a classroom library, an administrator stocking three branches, or a student looking for a specific title — we're here to help.
              </p>

              <div className="space-y-4 text-stone/80">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-forest rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-paper"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M17 21v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h" />
                      <circle cx="9" cy="21" r="1" />
                      <path d="M21 21l2.667-3.333" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-ink">WhatsApp</p>
                    <p className="text-[11px] mt-0.5">
                      Message us directly for quick questions and orders: <strong className="text-gold">+1 (555) 123-4567</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-forest rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-paper"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-ink">Phone</p>
                    <p className="text-[11px] mt-0.5">
                      Call our support line: <strong className="text-gold">+1 (555) 987-6543</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-forest rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-paper"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-ink">Email</p>
                    <p className="text-[11px] mt-0.5">
                      Send us a message: <strong className="text-gold">info@dashlib.edu</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-[20px] font-display text-gold mb-4">Location</h3>
                <p className="text-[13px] text-stone/70 leading-relaxed">
                  Main Branch: 18 Al Andalus Street, City Center<br />
                  East Branch: Al Noor Plaza, District 2<br />
                  West Branch: 7 Al Wasl Road, Al Safa
                </p>
              </div>

              <div>
                <h3 className="text-[20px] font-display text-gold mb-4">Office Hours</h3>
                <p className="text-[13px] text-stone/70 leading-relaxed">
                  Monday – Friday: 8:00 AM – 6:00 PM<br />
                  Saturday: 9:00 AM – 2:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section at the bottom */}
      <section className="py-16 bg-gold-tint">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center">
            <h2 className="text-[28px] sm:text-[34px] font-display text-forest mb-4">
              Ready to Stock Your Library?
            </h2>
            <p className="text-[14px] sm:text-[16px] text-stone/80 mb-8">
              Join thousands of teachers and administrators who've already discovered the DashLib difference. Browse our catalog, check branch stock, and place your order today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonLink
                variant="primary"
                size="lg"
                href="/store"
                className="px-8 py-3"
              >
                Browse Store
              </ButtonLink>
              <ButtonLink
                variant="secondary"
                size="lg"
                href="/admin"
                className="px-8 py-3"
              >
                Admin Access
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}