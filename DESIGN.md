# DashLib — design system

The visual world is **The Geometric Border**: Islamic geometric tilework used as the
structural rhythm of a working product. On screens people operate, the world lends only
four things — type, palette, density, and one signature move. Navigation, controls and
tables stay the web-standard things a visitor already knows how to use.

## 1. Colors & Palette

Colour is committed at region scale, not sprinkled as accents: a forest rail and header,
a plaster ground, paper work surfaces, gold and brick carrying meaning.

| Token | Value | Role |
| --- | --- | --- |
| `plaster` | `#f3eee3` | Page ground behind every panel |
| `paper` | `#fffdf7` | Panels, cards, tables, fields |
| `cream` | `#faf6ec` | Table headers, inset blocks, quiet fills |
| `ink` | `#16241c` | Headings and primary body text |
| `forest` | `#1b3d2e` | Primary actions, staff rail, chart line, active nav |
| `forest-deep` | `#0e2118` | Primary hover, dark accents inside illustration |
| `gold` | `#b0863c` | Hairline rules, star marks, active accents — never body text |
| `gold-light` | `#e4c58a` | Text and icons on the forest rail |
| `brick` | `#a5382c` | Prices, alerts, the “today” marker, caret |
| `sage` | `#e4e8dc` | Soft fills, active nav chip, meters |
| `moss` | `#cbd2c1` | Borders on controls, disabled states |
| `line` | `#e3ddce` | 1px panel and table hairlines |
| `stone` | `#5b6357` | Secondary text, labels, metadata |
| `line-field` | `#dcd5c4` | Field border at rest |
| `line-strong` | `#c4baa5` | Field and card border on hover |
| `brick-deep` | `#8a2d23` | Danger hover |
| `brick-tint` | `#f6dfdb` | Brick badge fill |
| `brick-wash` | `#fbf0ee` | Alert block fill |
| `brick-ink` | `#8f2c22` | Text on `brick-tint` |
| `gold-tint` | `#f5e7c9` | Gold badge and step fill |
| `gold-ink` | `#6b4a10` | Text on `gold-tint` |
| `gold-lift` | `#eddcb9` | Hover on `gold-light` actions |
| `forest-tint` | `#e7efe4` | Success note, selected and handed-in fills |

Contrast: `stone` on `paper` 6.0:1, `brick` on `paper` 5.6:1, `paper` on `forest` 10:1,
`gold-light` on `forest` 6.9:1. Gold is ornament and large numerals only; it is never
used for small text on a light ground.

## 2. Typography & Type

- **Display — Amiri** (Arabic + Latin serif). Page titles, panel titles, prices, KPI
  numerals, the teacher's shift clock. Its Arabic lineage is why the world reads as local
  rather than themed.
- **Interface — Rubik** (Latin + Arabic). All controls, body copy, labels, tables. Data is
  always tabular: `.num` sets `font-variant-numeric: tabular-nums`.

Scale: page title 30–42px; section 17–22px; card title 13.5–15px; body 12.5–13.5px;
table 12–13px; label 10–11px at 0.14em tracking, uppercase. Headings balance; body copy
is capped at 58–62ch.

## 3. Density and layout

- 4px rhythm; panel padding 16–20px; table cells 11px × 14px; 1px hairlines.
- Page shell: 6px geometric band, 56px header (storefront) or 236px forest rail (portals),
  content capped at 1240px, 20–32px gutters.
- Sticky: storefront header, portal header, catalog filter panel, checkout summary.
- Breakpoints: filters collapse to a two-column block under the catalog; portal rails
  become a horizontal scrolling nav; every table sits in an `overflow-x-auto` shell.

## 4. Components

- **Panel** — paper, 1px `line`, square corners (2px max). `ticks` adds two gold hairline
  corner brackets (top-left, bottom-right); used only on primary surfaces, never nested.
- **PanelHead** — 8-point star + display title + optional count, bottom hairline.
- **Badge** — 10px uppercase, 2px radius, tinted fill; tones: neutral, forest, gold,
  brick, outline.
- **Button** — 40px default, 32px small, 48px large; 2px radius. Primary forest, secondary
  outlined paper, ghost sage, danger brick. Compact controls carry `.tap-target`, which
  keeps their drawn size but widens the touch hit area to 44×44px.
- **Field** — paper ground, `line-field` border, `line-strong` on hover, 2px focus outline in forest; native select
  keeps a drawn chevron; labels are the same 10px tracked caps as table headers.
- **Table** (`.tbl`) — cream header row, tracked caps header labels, hairline row rules,
  hover tint; numeric columns right-aligned and tabular.
- **Meter** — 6px track in sage; forest fill, brick for stock alerts, gold for partial
  progress.
- **Empty** — star, display heading, one line of guidance, one action. Every list, filter
  and basket has one.

## 5. Signature move

An eight-point khatam star mark followed by a gold hairline rule (`StarRule`), repeated as
the separator above every section inside a panel. It is paired with the 6px tessellated
band at the top of every shell: forest and gold tiles stepping against paper. Both are
drawn in CSS/SVG, never an image.

Illustration follows the same discipline: catalog covers and lesson covers are flat
geometric compositions authored per category (`src/components/product-art.tsx`,
`src/components/lesson-thumb.tsx`) — no emoji, no icon fonts, no gradients, no stock
photography. Icons are one 24px stroke set (`src/components/icons.tsx`).

## 6. Motion

Deliberate and short. 120–160ms colour and border transitions on controls; no entrance
animations on data. The live elements are the ones that earn it: the shift clock, the
session clock in the header, the green “live” dot. Under `prefers-reduced-motion` the
movement goes and the feedback stays: transforms, smooth scrolling and repeating
keyframes are removed, while colour, border and opacity still transition in 120ms so a
state change is never silent.

## 7. Browser surfaces

Selection is gold-light on forest-deep. The caret is brick. Focus rings are 2px forest with
2px offset. Scrollbars are thin and moss on transparent. Link underlines sit 4px off the
baseline and turn gold on hover. Numerals in tables and totals are tabular everywhere.

## 8. Copy

Controls name their action (“Hand in task”, “Send transfer”, “Receive”). Empty states name
the next move. Errors name the problem and the recovery. Where the build is a preview, the
interface says so in one quiet sentence — it never dresses sample data as real trade.
