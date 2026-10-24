import type { Metadata } from "next";
import Link from "next/link";
import { Badge, ButtonLink, Panel, PanelHead, StarRule, Stat } from "@/components/ui";
import { IconBook, IconBox, IconStore, IconUser, StarMotif } from "@/components/icons";
import { ShopShell } from "@/components/shop/shop-shell";
import { GeometricKhatamCanvas } from "@/components/geometric-khatam-canvas";
import { BranchScene } from "@/components/branch-scene";
import { StudyScene } from "@/components/study-scene";
import { branches, gradeLabels, lessons, products } from "@/lib/data";
import { formatDuration } from "@/lib/format";

export const metadata: Metadata = {
  title: "DashLib — Multi-Branch Educational Library & Learning Hub",
  description:
    "Welcome to DashLib — your multi-branch educational library, learning hub, and store for textbooks, stationery, and lesson material across Main, East, and West branches.",
};

const valuePillars = [
  {
    icon: IconBox,
    title: "Three Branches, One Catalog",
    desc: "Browse live on-shelf counts across Main, East, and West before visiting. One consolidated basket for quick pickup.",
    tag: "Multi-branch",
  },
  {
    icon: IconBook,
    title: "Educator-Curated Materials",
    desc: "Hand-picked syllabus textbooks, stationery sets, and classroom essentials matched directly to current grade curricula.",
    tag: "Curriculum aligned",
  },
  {
    icon: IconUser,
    title: "Integrated Learning Hub",
    desc: "Free chapter guides, download packs, and classroom lesson material paired directly with required reading materials.",
    tag: "Free resources",
  },
];

export default function HomePage() {
  const totalStockUnits = products.reduce(
    (acc, p) => acc + p.stock.main + p.stock.east + p.stock.west,
    0
  );

  return (
    <ShopShell active="store">
      {/* 1. Hero Section with Cinematic Khatam Canvas & Architectural Lighting */}
      <section className="relative overflow-hidden border-b border-line-strong bg-paper">
        {/* Overdrive: 60fps Interactive Geometric Khatam Canvas Background */}
        <GeometricKhatamCanvas />

        <div className="relative z-10 mx-auto grid w-full max-w-[1240px] items-stretch gap-10 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:py-20">
          {/* Main Lead Column */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-forest px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-paper shadow-xs">
                <StarMotif className="h-3 w-3 text-gold-light" />
                Multi-Branch Academic Network
              </span>
              <span className="rounded-sm border border-line-strong bg-cream/90 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-forest">
                Main · East · West
              </span>
            </div>

            <h1 className="font-display text-[40px] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-[54px] lg:text-[60px]">
              The Educational <span className="underline decoration-gold/60 underline-offset-8">Dashboard</span>, Library &amp; Store for Every School.
            </h1>

            <p className="mt-5 max-w-[56ch] text-[15px] font-normal leading-relaxed text-ink/80 sm:text-[16.5px]">
              DashLib combines comprehensive curriculum catalogs, downloadable video lesson guides, and live
              per-branch stock tracking. Students and educators find everything on their syllabus in one place.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ButtonLink variant="primary" size="lg" href="/store" className="min-w-[180px] shadow-sm font-semibold hover:scale-[1.02] transition-transform">
                <IconStore className="h-4.5 w-4.5" />
                Browse Store Catalog
              </ButtonLink>
              <ButtonLink variant="secondary" size="lg" href="/learn" className="min-w-[170px] border-line-strong bg-paper/95 font-semibold hover:border-forest">
                <IconBook className="h-4.5 w-4.5" />
                Explore Lessons
              </ButtonLink>
            </div>

            {/* Quick Metrics Strip with High Contrast Architectural Pillars */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t-2 border-line pt-6">
              <div className="border-l-2 border-forest pl-3">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-stone">Total Titles</div>
                <div className="num mt-1 font-display text-[32px] font-bold leading-none text-ink sm:text-[36px]">{products.length}+</div>
                <div className="mt-1 text-[11.5px] text-stone">Books &amp; supplies</div>
              </div>
              <div className="border-l-2 border-brick pl-3">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-stone">Live Inventory</div>
                <div className="num mt-1 font-display text-[32px] font-bold leading-none text-brick sm:text-[36px]">{totalStockUnits}</div>
                <div className="mt-1 text-[11.5px] text-stone">Units counted live</div>
              </div>
              <div className="border-l-2 border-gold pl-3">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-stone">Open Branches</div>
                <div className="num mt-1 font-display text-[32px] font-bold leading-none text-forest sm:text-[36px]">{branches.length}</div>
                <div className="mt-1 text-[11.5px] text-stone">City-wide network</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Column */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <Panel ticks className="architectural-card-interactive overflow-hidden border-2 border-line-strong p-3.5 shadow-md bg-paper/95 backdrop-blur-xs">
              <div className="relative h-[290px] w-full overflow-hidden bg-cream sm:h-[360px] rounded-xs border border-line">
                <BranchScene className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest/35 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-paper">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-gold-light">
                    <StarMotif className="h-3 w-3 text-gold-light" />
                    Synchronized Branch Desks
                  </div>
                  <p className="mt-1.5 text-[14px] font-medium leading-snug text-paper/95">
                    Real-time stock reservation, verified educator shelves, and unified pickup.
                  </p>
                </div>
              </div>

              <div className="mt-3.5 flex items-center justify-between rounded-xs bg-cream px-3 py-2 text-[12px] text-stone border border-line">
                <span className="font-medium text-ink">Municipal Catalog Sync</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-forest">
                  <span className="h-2 w-2 rounded-full bg-forest animate-pulse" />
                  Live Updates
                </span>
              </div>
            </Panel>
          </div>
        </div>
      </section>

      {/* 2. Core Pillars Grid with Bold Educational Framing */}
      <section className="reveal-on-scroll border-b border-line bg-cream/70 py-16">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 max-w-[1240px]">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-forest">
                <StarMotif className="h-2.5 w-2.5 text-gold" />
                Academic Excellence
              </span>
              <h2 className="mt-2 font-display text-[30px] font-bold text-ink sm:text-[38px] leading-tight">
                Built specifically for how teachers instruct and students study.
              </h2>
            </div>
            <p className="max-w-[42ch] text-[14px] text-stone">
              Every feature exists to eliminate stock friction and link book lists straight to classroom materials.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {valuePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Panel key={pillar.title} className="architectural-card-interactive border-2 border-line bg-paper p-7">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-forest text-gold-light shadow-xs">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-sm border border-line-strong bg-cream px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-ink">
                      {pillar.tag}
                    </span>
                  </div>

                  <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-gold">Pillar 0{idx + 1}</div>
                  <h3 className="mt-1 text-[19px] font-bold text-ink">{pillar.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink/75">{pillar.desc}</p>
                </Panel>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Branch Locations & Hours with Dynamic Branch Stock Anchors */}
      <section className="reveal-on-scroll border-b border-line bg-paper py-16">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brick">
                <StarMotif className="h-2.5 w-2.5 text-brick" />
                Municipal Desks
              </span>
              <h2 className="mt-2 font-display text-[30px] font-bold text-ink sm:text-[38px]">
                Visit your nearest DashLib branch
              </h2>
            </div>
            <p className="max-w-[44ch] text-[14px] text-stone leading-relaxed">
              Orders placed online are held ready for pickup at any of our three dedicated branch desks within 30 minutes.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {branches.map((branch) => (
              <Panel key={branch.id} className="architectural-card-interactive border-2 border-line bg-paper p-6">
                <PanelHead
                  title={<span className="font-bold text-[16px] text-ink">{branch.name}</span>}
                  hint={<span className="font-semibold text-gold">{branch.shortName}</span>}
                  action={
                    <span className="inline-flex items-center gap-1 rounded-sm bg-forest px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-paper">
                      Open Today
                    </span>
                  }
                />

                <div className="mt-5 space-y-3.5 text-[13px]">
                  <div>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone block">Street Address</span>
                    <p className="mt-0.5 font-medium text-ink">{branch.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-sm bg-cream/70 p-2.5 border border-line">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone block">Hours</span>
                      <p className="mt-0.5 font-bold text-forest">{branch.hours}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone block">Desk Phone</span>
                      <p className="num mt-0.5 font-medium text-ink">{branch.phone}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone block">On-Site Leadership</span>
                    <p className="mt-0.5 text-stone font-medium">{branch.manager} · <span className="text-ink font-semibold">{branch.staffOnSite} staff</span> on duty</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-line pt-4">
                  <ButtonLink
                    variant="primary"
                    size="sm"
                    href={`/store?branch=${branch.id}`}
                    className="w-full justify-between px-3 text-[12.5px] group font-semibold"
                  >
                    <span>Check {branch.shortName} on-shelf stock</span>
                    <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
                  </ButtonLink>
                </div>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Curriculum & Learning Highlights */}
      <section className="reveal-on-scroll border-b border-line bg-cream/40 py-14">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="lbl">Free Educational Resources</div>
              <h2 className="mt-1.5 font-display text-[26px] text-ink sm:text-[34px]">
                Connecting required textbooks to classroom practice.
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-stone">
                Our educator community crafts downloadable lesson plans, activity worksheets, and
                chapter walk-throughs aligned with the books in our catalog.
              </p>

              <div className="mt-6 space-y-3">
                {lessons.slice(0, 3).map((lesson) => (
                  <Link
                    key={lesson.slug}
                    href={`/learn/${lesson.slug}`}
                    className="architectural-card flex items-center justify-between rounded-sm border border-line bg-paper px-4 py-3 group"
                  >
                    <div>
                      <div className="text-[13.5px] font-medium text-ink group-hover:text-forest transition-colors">{lesson.title}</div>
                      <div className="mt-0.5 text-[11.5px] text-stone">
                        {lesson.subject} · {gradeLabels[lesson.grade]} · {formatDuration(lesson.durationMin)}
                      </div>
                    </div>
                    <span className="text-[12px] font-medium text-forest group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      Read Lesson →
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-6">
                <ButtonLink variant="secondary" size="md" href="/learn">
                  View All {lessons.length} Lessons
                </ButtonLink>
              </div>
            </div>

            <div className="lg:col-span-6">
              <Panel ticks className="architectural-card overflow-hidden p-2">
                <div className="relative h-[280px] w-full overflow-hidden bg-paper sm:h-[360px]">
                  <StudyScene className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out hover:scale-[1.02]" />
                  <div className="absolute inset-0 bg-forest/15" />
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call to Action Strip */}
      <section className="reveal-on-scroll bg-paper py-14">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <Panel className="architectural-card border border-line bg-cream p-8 sm:p-12 text-center">
            <StarMotif className="mx-auto h-4 w-4 text-gold" />
            <h2 className="mt-3 font-display text-[28px] text-ink sm:text-[36px]">
              Ready to stock your classroom or school?
            </h2>
            <p className="mx-auto mt-2 max-w-[56ch] text-[13.5px] leading-relaxed text-stone">
              Check real-time stock across our branches, create book lists, or access administrative
              tools for branch stock transfers.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink variant="primary" size="lg" href="/store" className="min-w-[170px]">
                Browse Store Catalog
              </ButtonLink>
              <ButtonLink variant="secondary" size="lg" href="/admin" className="min-w-[170px]">
                Staff & Admin Portal
              </ButtonLink>
            </div>

            <div className="mt-8 border-t border-line/60 pt-6">
              <StarRule label="DashLib Municipal Network" />
            </div>
          </Panel>
        </div>
      </section>
    </ShopShell>
  );
}