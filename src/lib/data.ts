/**
 * Sample data for the DashLib front end.
 *
 * INTEGRATION POINT — Supabase
 * Every export below stands in for a query. When the project is connected,
 * replace these arrays with `createClient()` reads (products, orders, lessons,
 * tasks, shifts, transfers, profiles) and keep the same shapes so the UI does
 * not change. Realtime: subscribe to `orders`, `stock_levels` and `transfers`
 * and revalidate the route on change.
 */

export type BranchId = "main" | "east" | "west";
export type GradeBand = "elementary" | "middle" | "high";
export type CategoryId = "books" | "stationery" | "art" | "bags" | "prints";
export type Role = "admin" | "teacher" | "student";

export type Branch = {
  id: BranchId;
  name: string;
  shortName: string;
  address: string;
  phone: string;
  manager: string;
  hours: string;
  staffOnSite: number;
};

export const branches: Branch[] = [
  {
    id: "main",
    name: "Main Branch",
    shortName: "Main",
    address: "18 Al Andalus Street, Building 4",
    phone: "+1 (555) 0142",
    manager: "Farah Nasser",
    hours: "8:00 AM – 8:00 PM",
    staffOnSite: 6,
  },
  {
    id: "east",
    name: "East Branch",
    shortName: "East",
    address: "Al Noor Plaza, Unit 12",
    phone: "+1 (555) 0188",
    manager: "Samir Fahmy",
    hours: "8:30 AM – 7:00 PM",
    staffOnSite: 4,
  },
  {
    id: "west",
    name: "West Branch",
    shortName: "West",
    address: "7 Al Wasl Road, Ground Floor",
    phone: "+1 (555) 0193",
    manager: "Huda Karim",
    hours: "9:00 AM – 6:30 PM",
    staffOnSite: 3,
  },
];

export const branchLabel = (id: BranchId) =>
  branches.find((branch) => branch.id === id)?.shortName ?? "Branch";

export const gradeLabels: Record<GradeBand, string> = {
  elementary: "Elementary",
  middle: "Middle school",
  high: "High school",
};

export type Category = {
  id: CategoryId;
  label: string;
  blurb: string;
};

export const categories: Category[] = [
  { id: "books", label: "Books", blurb: "Textbooks, workbooks and readers" },
  { id: "stationery", label: "Stationery", blurb: "Everyday classroom tools" },
  { id: "art", label: "Art Supplies", blurb: "Paint, paper and drawing media" },
  { id: "bags", label: "Bags", blurb: "Backpacks, cases and covers" },
  { id: "prints", label: "Printed Materials", blurb: "Posters, planners and charts" },
];

export const categoryLabel = (id: CategoryId) =>
  categories.find((category) => category.id === id)?.label ?? "Catalog";

export type Product = {
  id: string;
  slug: string;
  code: string;
  title: string;
  publisher: string;
  category: CategoryId;
  grades: GradeBand[];
  price: number;
  stock: Record<BranchId, number>;
  blurb: string;
  specs: { label: string; value: string }[];
  badge?: "new" | "popular";
  tone: 0 | 1 | 2;
};

export const products: Product[] = [
  {
    id: "p-1",
    slug: "mathematics-grade-7-textbook",
    code: "BK-0712",
    title: "Mathematics Grade 7 Textbook",
    publisher: "Ministry of Education",
    category: "books",
    grades: ["middle"],
    price: 12.5,
    stock: { main: 42, east: 18, west: 9 },
    blurb:
      "The approved Grade 7 course book, covering ratios, integers, expressions and geometry with end-of-chapter practice sets.",
    specs: [
      { label: "Pages", value: "284" },
      { label: "Binding", value: "Softcover" },
      { label: "Edition", value: "2026–27" },
      { label: "Language", value: "English" },
    ],
    tone: 0,
  },
  {
    id: "p-2",
    slug: "arabic-language-workbook",
    code: "BK-0415",
    title: "Arabic Language Workbook",
    publisher: "Al-Nahda Publishing",
    category: "books",
    grades: ["elementary"],
    price: 8.75,
    stock: { main: 6, east: 24, west: 31 },
    blurb:
      "Reading, dictation and handwriting practice in one workbook, with a teacher's answer key at the back.",
    specs: [
      { label: "Pages", value: "148" },
      { label: "Binding", value: "Softcover" },
      { label: "Language", value: "Arabic" },
      { label: "Level", value: "Grades 3–5" },
    ],
    tone: 1,
  },
  {
    id: "p-3",
    slug: "watercolor-paint-set-24",
    code: "ART-0024",
    title: "Watercolor Paint Set — 24 Colors",
    publisher: "Faber-Castell",
    category: "art",
    grades: ["elementary", "middle"],
    price: 15,
    stock: { main: 14, east: 5, west: 0 },
    blurb:
      "Twenty-four pans of lightfast watercolor with a refillable water brush and a mixing lid that doubles as a palette.",
    specs: [
      { label: "Colors", value: "24 pans" },
      { label: "Includes", value: "Water brush, mixing lid" },
      { label: "Grade", value: "Student grade" },
    ],
    badge: "new",
    tone: 2,
  },
  {
    id: "p-4",
    slug: "student-backpack-navy",
    code: "BAG-0103",
    title: "Student Backpack — Navy",
    publisher: "DashLib Collection",
    category: "bags",
    grades: ["elementary", "middle", "high"],
    price: 24.99,
    stock: { main: 22, east: 8, west: 11 },
    blurb:
      "A 22-litre pack with a padded laptop sleeve, two bottle pockets and reinforced stitching at the shoulder seams.",
    specs: [
      { label: "Capacity", value: "22 L" },
      { label: "Fits", value: "A4 folders, 14\" laptop" },
      { label: "Warranty", value: "2 years" },
    ],
    tone: 0,
  },
  {
    id: "p-5",
    slug: "hb-pencil-pack-12",
    code: "ST-0501",
    title: "HB Pencil Pack (12 pcs)",
    publisher: "Staedtler",
    category: "stationery",
    grades: ["elementary", "middle", "high"],
    price: 3.25,
    stock: { main: 120, east: 88, west: 64 },
    blurb:
      "Break-resistant HB graphite with a soft eraser tip. The pack every classroom list starts with.",
    specs: [
      { label: "Quantity", value: "12 pencils" },
      { label: "Grade", value: "HB" },
      { label: "Wood", value: "FSC certified" },
    ],
    badge: "popular",
    tone: 1,
  },
  {
    id: "p-6",
    slug: "ruled-notebook-a4",
    code: "ST-0208",
    title: "Ruled Notebook A4 — 200 Pages",
    publisher: "DashLib Collection",
    category: "stationery",
    grades: ["elementary", "middle", "high"],
    price: 4.5,
    stock: { main: 76, east: 54, west: 40 },
    blurb:
      "Seventy sheets of 80 gsm ruled paper with a lay-flat sewn binding and a name panel on the cover.",
    specs: [
      { label: "Pages", value: "200" },
      { label: "Paper", value: "80 gsm" },
      { label: "Ruling", value: "8 mm lined" },
    ],
    badge: "popular",
    tone: 2,
  },
  {
    id: "p-7",
    slug: "geometry-set-compass",
    code: "ST-0312",
    title: "Geometry Set with Compass",
    publisher: "Maped",
    category: "stationery",
    grades: ["middle", "high"],
    price: 6.75,
    stock: { main: 18, east: 6, west: 3 },
    blurb:
      "Nine pieces in a metal tin: compass, dividers, two set squares, protractor, ruler and a spare lead refill.",
    specs: [
      { label: "Pieces", value: "9" },
      { label: "Case", value: "Metal tin" },
      { label: "Compass", value: "Locking hinge" },
    ],
    tone: 0,
  },
  {
    id: "p-8",
    slug: "science-grade-8-lab-manual",
    code: "BK-0830",
    title: "Science Grade 8 Lab Manual",
    publisher: "Oxford Press",
    category: "books",
    grades: ["middle"],
    price: 11,
    stock: { main: 9, east: 2, west: 0 },
    blurb:
      "Thirty-four guided experiments with safety notes, data tables and space to record observations.",
    specs: [
      { label: "Pages", value: "196" },
      { label: "Experiments", value: "34" },
      { label: "Edition", value: "2026–27" },
    ],
    tone: 1,
  },
  {
    id: "p-9",
    slug: "high-school-physics-volume-2",
    code: "BK-0921",
    title: "High School Physics — Volume 2",
    publisher: "Cambridge",
    category: "books",
    grades: ["high"],
    price: 18,
    stock: { main: 12, east: 4, west: 7 },
    blurb:
      "Waves, electricity and modern physics with worked examples and exam-style questions at the end of each unit.",
    specs: [
      { label: "Pages", value: "352" },
      { label: "Binding", value: "Softcover" },
      { label: "Edition", value: "3rd" },
    ],
    tone: 2,
  },
  {
    id: "p-10",
    slug: "a3-sketchbook-120gsm",
    code: "ART-0118",
    title: "A3 Sketchbook — 120 gsm",
    publisher: "Canson",
    category: "art",
    grades: ["middle", "high"],
    price: 9.5,
    stock: { main: 4, east: 0, west: 6 },
    blurb:
      "Forty sheets of acid-free 120 gsm paper that takes pencil, charcoal and light washes without buckling.",
    specs: [
      { label: "Sheets", value: "40" },
      { label: "Paper", value: "120 gsm" },
      { label: "Size", value: "A3 (297 × 420 mm)" },
    ],
    badge: "new",
    tone: 0,
  },
  {
    id: "p-11",
    slug: "weekly-planner-pad",
    code: "PRT-0402",
    title: "Weekly Planner Pad",
    publisher: "DashLib Press",
    category: "prints",
    grades: ["middle", "high"],
    price: 5.25,
    stock: { main: 34, east: 21, west: 17 },
    blurb:
      "A tear-off weekly pad with subject rows, homework columns and a weekend box for revision.",
    specs: [
      { label: "Sheets", value: "52" },
      { label: "Size", value: "A4" },
      { label: "Format", value: "Tear-off pad" },
    ],
    tone: 1,
  },
  {
    id: "p-12",
    slug: "scientific-calculator-fx82",
    code: "ST-0640",
    title: "Scientific Calculator — FX-82",
    publisher: "Casio",
    category: "stationery",
    grades: ["high"],
    price: 21,
    stock: { main: 3, east: 1, west: 2 },
    blurb:
      "The exam-approved scientific calculator: 252 functions, two-line display and a slide-on hard case.",
    specs: [
      { label: "Functions", value: "252" },
      { label: "Power", value: "AAA ×1" },
      { label: "Approved", value: "Exam list A" },
    ],
    tone: 2,
  },
  {
    id: "p-13",
    slug: "canvas-pencil-case",
    code: "BAG-0121",
    title: "Canvas Pencil Case",
    publisher: "DashLib Collection",
    category: "bags",
    grades: ["elementary", "middle", "high"],
    price: 7.75,
    stock: { main: 28, east: 14, west: 19 },
    blurb:
      "A wide-mouth canvas case with a brass zip and a flat base so it stands on the desk while you work.",
    specs: [
      { label: "Material", value: "12 oz canvas" },
      { label: "Size", value: "21 × 9 cm" },
      { label: "Zip", value: "Brass" },
    ],
    tone: 1,
  },
  {
    id: "p-14",
    slug: "multiplication-chart-poster",
    code: "PRT-0431",
    title: "Multiplication Chart Poster",
    publisher: "DashLib Press",
    category: "prints",
    grades: ["elementary"],
    price: 2.75,
    stock: { main: 41, east: 27, west: 22 },
    blurb:
      "A1 chart with the full 12 × 12 grid, printed on matte paper that takes dry-wipe marker.",
    specs: [
      { label: "Size", value: "A1 (594 × 841 mm)" },
      { label: "Paper", value: "Matte 170 gsm" },
      { label: "Finish", value: "Write-on" },
    ],
    tone: 0,
  },
];

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);

export const getProductById = (id: string) => products.find((product) => product.id === id);

export const totalStock = (product: Product) =>
  product.stock.main + product.stock.east + product.stock.west;

export const LOW_STOCK_THRESHOLD = 12;

export const isLowStock = (product: Product) => totalStock(product) < LOW_STOCK_THRESHOLD;

/* ------------------------------------------------------------------ */
/* Sales                                                               */
/* ------------------------------------------------------------------ */

const seeded = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const SERIES_DAYS = 30;
const SERIES_END = Date.UTC(2026, 9, 24);

export type DaySales = {
  date: string;
  label: string;
  revenue: number;
  orders: number;
  branches: Record<BranchId, number>;
};

const dayFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export const dailySales: DaySales[] = Array.from({ length: SERIES_DAYS }, (_, index) => {
  const day = new Date(SERIES_END);
  day.setUTCDate(day.getUTCDate() - (SERIES_DAYS - 1 - index));
  const weekday = day.getUTCDay();
  const busyDay = weekday === 5 || weekday === 6;
  const base = busyDay ? 2060 : 1430;
  const revenue = Math.round((base + seeded(index + 5) * 620) * 100) / 100;
  const orders = Math.round(revenue / 27 + seeded(index + 11) * 7);
  const main = Math.round(revenue * (0.5 + seeded(index + 21) * 0.1) * 100) / 100;
  const east = Math.round(revenue * (0.26 + seeded(index + 31) * 0.06) * 100) / 100;

  return {
    date: day.toISOString().slice(0, 10),
    label: dayFmt.format(day),
    revenue,
    orders,
    branches: {
      main,
      east,
      west: Math.round((revenue - main - east) * 100) / 100,
    },
  };
});

export type MonthSales = {
  month: string;
  label: string;
  revenue: number;
  orders: number;
};

export const monthlySales: MonthSales[] = [
  { month: "2025-11", label: "Nov 2025", revenue: 31840, orders: 1182 },
  { month: "2025-12", label: "Dec 2025", revenue: 36410, orders: 1338 },
  { month: "2026-01", label: "Jan 2026", revenue: 34210, orders: 1264 },
  { month: "2026-02", label: "Feb 2026", revenue: 29980, orders: 1102 },
  { month: "2026-03", label: "Mar 2026", revenue: 35620, orders: 1301 },
  { month: "2026-04", label: "Apr 2026", revenue: 38470, orders: 1394 },
  { month: "2026-05", label: "May 2026", revenue: 33180, orders: 1210 },
  { month: "2026-06", label: "Jun 2026", revenue: 21640, orders: 842 },
  { month: "2026-07", label: "Jul 2026", revenue: 19820, orders: 771 },
  { month: "2026-08", label: "Aug 2026", revenue: 34890, orders: 1276 },
  { month: "2026-09", label: "Sep 2026", revenue: 42610, orders: 1514 },
  { month: "2026-10", label: "Oct 2026", revenue: 41860, orders: 1483 },
];

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export const todaySales = dailySales[dailySales.length - 1];
export const yesterdaySales = dailySales[dailySales.length - 2];

const monthDays = dailySales.filter((day) => day.date.startsWith("2026-10"));

export const monthTotals = {
  revenue: sum(monthDays.map((day) => day.revenue)),
  orders: sum(monthDays.map((day) => day.orders)),
  branches: {
    main: sum(monthDays.map((day) => day.branches.main)),
    east: sum(monthDays.map((day) => day.branches.east)),
    west: sum(monthDays.map((day) => day.branches.west)),
  },
};

export const avgBasket = (day: DaySales) => day.revenue / day.orders;

export const revenueChange = (current: number, previous: number) =>
  previous === 0 ? 0 : ((current - previous) / previous) * 100;

export type OrderStatus = "paid" | "packed" | "collected";

export type Order = {
  id: string;
  time: string;
  branch: BranchId;
  items: number;
  total: number;
  status: OrderStatus;
  customer: string;
};

export const recentOrders: Order[] = [
  { id: "DL-2481", time: "2026-10-24T12:41:00Z", branch: "main", items: 3, total: 34.25, status: "paid", customer: "Omar S." },
  { id: "DL-2480", time: "2026-10-24T12:18:00Z", branch: "east", items: 1, total: 21.0, status: "packed", customer: "Hana K." },
  { id: "DL-2479", time: "2026-10-24T11:52:00Z", branch: "main", items: 6, total: 58.5, status: "collected", customer: "Grade 7 — Room 2" },
  { id: "DL-2478", time: "2026-10-24T11:26:00Z", branch: "west", items: 2, total: 16.75, status: "collected", customer: "Yara M." },
  { id: "DL-2477", time: "2026-10-24T10:44:00Z", branch: "main", items: 4, total: 27.25, status: "collected", customer: "Ali R." },
  { id: "DL-2476", time: "2026-10-24T10:09:00Z", branch: "east", items: 2, total: 19.5, status: "packed", customer: "Mariam T." },
  { id: "DL-2475", time: "2026-10-24T09:38:00Z", branch: "main", items: 1, total: 4.5, status: "collected", customer: "Sami H." },
  { id: "DL-2474", time: "2026-10-24T09:12:00Z", branch: "west", items: 5, total: 44.0, status: "collected", customer: "Grade 5 — Room 1" },
  { id: "DL-2473", time: "2026-10-23T17:46:00Z", branch: "main", items: 3, total: 23.75, status: "collected", customer: "Layal A." },
  { id: "DL-2472", time: "2026-10-23T16:20:00Z", branch: "east", items: 2, total: 12.25, status: "collected", customer: "Nour D." },
];

/* ------------------------------------------------------------------ */
/* People                                                              */
/* ------------------------------------------------------------------ */

export type StaffStatus = "active" | "invited" | "paused";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  branch: BranchId;
  status: StaffStatus;
  since: string;
};

export const staff: StaffMember[] = [
  { id: "a-1", name: "Farah Nasser", email: "farah@dashlib.school", role: "admin", title: "Owner", branch: "main", status: "active", since: "2023-02-14" },
  { id: "a-2", name: "Samir Fahmy", email: "samir@dashlib.school", role: "admin", title: "Branch manager", branch: "east", status: "active", since: "2024-01-08" },
  { id: "t-sara", name: "Sara Mansour", email: "sara@dashlib.school", role: "teacher", title: "Mathematics", branch: "main", status: "active", since: "2024-03-04" },
  { id: "t-yousef", name: "Yousef Alami", email: "yousef@dashlib.school", role: "teacher", title: "Science", branch: "east", status: "active", since: "2024-09-16" },
  { id: "t-nour", name: "Nour Haddad", email: "nour@dashlib.school", role: "teacher", title: "Arabic", branch: "west", status: "active", since: "2025-01-20" },
  { id: "t-lina", name: "Lina Aziz", email: "lina@dashlib.school", role: "teacher", title: "English", branch: "main", status: "invited", since: "2026-10-19" },
];

/** Signed-in people for the demo build. Clerk replaces these once wired. */
export const demoAdmin: StaffMember = staff.find((member) => member.id === "a-1") ?? staff[0];
export const demoTeacher: StaffMember = staff.find((member) => member.id === "t-sara") ?? staff[2];

export type Shift = {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: number;
};

export const shifts: Shift[] = [
  { id: "s-1", date: "2026-10-23", clockIn: "08:56", clockOut: "17:12", hours: 8.27 },
  { id: "s-2", date: "2026-10-22", clockIn: "09:04", clockOut: "16:48", hours: 7.73 },
  { id: "s-3", date: "2026-10-21", clockIn: "08:51", clockOut: "17:05", hours: 8.23 },
  { id: "s-4", date: "2026-10-20", clockIn: "09:12", clockOut: "17:30", hours: 8.3 },
  { id: "s-5", date: "2026-10-19", clockIn: "08:58", clockOut: "16:55", hours: 7.95 },
  { id: "s-6", date: "2026-10-16", clockIn: "09:02", clockOut: "17:08", hours: 8.1 },
  { id: "s-7", date: "2026-10-15", clockIn: "08:47", clockOut: "17:02", hours: 8.25 },
];

/* ------------------------------------------------------------------ */
/* Lessons and tasks                                                   */
/* ------------------------------------------------------------------ */

export type LessonStatus = "published" | "draft" | "processing";

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  subject: string;
  grade: GradeBand;
  teacherId: string;
  teacher: string;
  durationMin: number;
  publishedAt: string;
  summary: string;
  chapters: { at: string; label: string }[];
  materials: string[];
  status: LessonStatus;
  tone: 0 | 1 | 2;
};

export const lessons: Lesson[] = [
  {
    id: "l-1",
    slug: "fractions-that-stick",
    title: "Fractions that stick",
    subject: "Mathematics",
    grade: "elementary",
    teacherId: "t-sara",
    teacher: "Sara Mansour",
    durationMin: 18,
    publishedAt: "2026-10-20",
    summary:
      "Equivalent fractions explained with folded paper: every fold gives a new name for the same amount.",
    chapters: [
      { at: "00:00", label: "One whole, folded twice" },
      { at: "04:10", label: "Naming the pieces" },
      { at: "09:35", label: "Equivalent families" },
      { at: "14:20", label: "Try it: three quarters" },
    ],
    materials: ["Two sheets of paper", "Pencil", "Practice set (attached)"],
    status: "published",
    tone: 0,
  },
  {
    id: "l-2",
    slug: "the-water-cycle-drawn",
    title: "The water cycle, drawn",
    subject: "Science",
    grade: "middle",
    teacherId: "t-yousef",
    teacher: "Yousef Alami",
    durationMin: 22,
    publishedAt: "2026-10-19",
    summary:
      "Evaporation, condensation and precipitation drawn as a single loop, then annotated with the terms your exam uses.",
    chapters: [
      { at: "00:00", label: "The loop in one drawing" },
      { at: "05:40", label: "Heat and evaporation" },
      { at: "11:15", label: "Clouds and condensation" },
      { at: "17:05", label: "Label your own diagram" },
    ],
    materials: ["Unlined paper", "Colored pencils", "Lab manual p. 42"],
    status: "published",
    tone: 1,
  },
  {
    id: "l-3",
    slug: "arabic-roots-three-letter-families",
    title: "Arabic roots: three-letter families",
    subject: "Arabic",
    grade: "middle",
    teacherId: "t-nour",
    teacher: "Nour Haddad",
    durationMin: 16,
    publishedAt: "2026-10-18",
    summary:
      "How one three-letter root grows into a family of nouns and verbs, with a reading passage to mark up.",
    chapters: [
      { at: "00:00", label: "Finding the root" },
      { at: "05:20", label: "Patterns that repeat" },
      { at: "10:45", label: "Reading passage" },
    ],
    materials: ["Workbook p. 61", "Highlighter"],
    status: "published",
    tone: 2,
  },
  {
    id: "l-4",
    slug: "writing-a-thesis-statement",
    title: "Writing a thesis statement",
    subject: "English",
    grade: "high",
    teacherId: "t-sara",
    teacher: "Sara Mansour",
    durationMin: 27,
    publishedAt: "2026-10-16",
    summary:
      "Three tests for a thesis: is it arguable, is it specific, and can a reader disagree with it?",
    chapters: [
      { at: "00:00", label: "What a thesis is not" },
      { at: "07:30", label: "The three tests" },
      { at: "15:10", label: "Rewriting a weak claim" },
      { at: "21:40", label: "Draft your own" },
    ],
    materials: ["Notebook", "Draft task (attached)"],
    status: "published",
    tone: 0,
  },
  {
    id: "l-5",
    slug: "angles-in-polygons",
    title: "Angles in polygons",
    subject: "Mathematics",
    grade: "middle",
    teacherId: "t-yousef",
    teacher: "Yousef Alami",
    durationMin: 24,
    publishedAt: "2026-10-14",
    summary:
      "From the triangle's 180° to the general interior-sum rule, with a compass construction you can repeat.",
    chapters: [
      { at: "00:00", label: "Starting from triangles" },
      { at: "06:50", label: "Splitting a polygon" },
      { at: "13:25", label: "The rule and its uses" },
      { at: "19:00", label: "Construction practice" },
    ],
    materials: ["Geometry set", "Notebook"],
    status: "published",
    tone: 1,
  },
  {
    id: "l-6",
    slug: "lab-safety-walkthrough",
    title: "Lab safety walkthrough",
    subject: "Science",
    grade: "high",
    teacherId: "t-yousef",
    teacher: "Yousef Alami",
    durationMin: 12,
    publishedAt: "2026-10-12",
    summary:
      "A walk through the lab stations before your first practical: what to wear, what to report, where the eyewash is.",
    chapters: [
      { at: "00:00", label: "Before you enter" },
      { at: "04:30", label: "At the bench" },
      { at: "08:15", label: "If something spills" },
    ],
    materials: ["Lab manual p. 3"],
    status: "published",
    tone: 2,
  },
];

export const getLesson = (slug: string) => lessons.find((lesson) => lesson.slug === slug);

export const lessonsByTeacher = (teacherId: string) =>
  lessons.filter((lesson) => lesson.teacherId === teacherId);

export type Task = {
  id: string;
  title: string;
  lessonSlug: string;
  subject: string;
  grade: GradeBand;
  due: string;
  submitted: number;
  assigned: number;
  points: number;
  instructions: string;
};

export const tasks: Task[] = [
  {
    id: "t-1",
    title: "Fractions practice set",
    lessonSlug: "fractions-that-stick",
    subject: "Mathematics",
    grade: "elementary",
    due: "2026-10-27",
    submitted: 18,
    assigned: 24,
    points: 10,
    instructions: "Complete questions 1–12. Show the fold you used beside each answer.",
  },
  {
    id: "t-2",
    title: "Water cycle diagram",
    lessonSlug: "the-water-cycle-drawn",
    subject: "Science",
    grade: "middle",
    due: "2026-10-26",
    submitted: 21,
    assigned: 24,
    points: 15,
    instructions: "Draw the loop, label the three stages and add one example from your week.",
  },
  {
    id: "t-3",
    title: "Root family worksheet",
    lessonSlug: "arabic-roots-three-letter-families",
    subject: "Arabic",
    grade: "middle",
    due: "2026-10-29",
    submitted: 12,
    assigned: 26,
    points: 10,
    instructions: "Fill the table for the three roots on page 61, then write one sentence per family.",
  },
  {
    id: "t-4",
    title: "Thesis statement draft",
    lessonSlug: "writing-a-thesis-statement",
    subject: "English",
    grade: "high",
    due: "2026-10-25",
    submitted: 9,
    assigned: 22,
    points: 20,
    instructions: "Submit one sentence. Add a note naming which of the three tests it passes and why.",
  },
  {
    id: "t-5",
    title: "Polygon angles quiz",
    lessonSlug: "angles-in-polygons",
    subject: "Mathematics",
    grade: "middle",
    due: "2026-11-02",
    submitted: 3,
    assigned: 25,
    points: 25,
    instructions: "Ten questions, 20 minutes, one attempt. Bring your geometry set to class.",
  },
];

export const tasksByLesson = (slug: string) => tasks.filter((task) => task.lessonSlug === slug);

/* ------------------------------------------------------------------ */
/* Transfers                                                           */
/* ------------------------------------------------------------------ */

export type TransferStatus = "draft" | "in-transit" | "received" | "cancelled";

export type Transfer = {
  id: string;
  from: BranchId;
  to: BranchId;
  productId: string;
  quantity: number;
  status: TransferStatus;
  created: string;
  requestedBy: string;
};

export const transfers: Transfer[] = [
  { id: "TR-1052", from: "main", to: "east", productId: "p-7", quantity: 12, status: "in-transit", created: "2026-10-24", requestedBy: "Farah Nasser" },
  { id: "TR-1051", from: "west", to: "main", productId: "p-3", quantity: 6, status: "in-transit", created: "2026-10-24", requestedBy: "Huda Karim" },
  { id: "TR-1050", from: "east", to: "west", productId: "p-6", quantity: 40, status: "received", created: "2026-10-23", requestedBy: "Samir Fahmy" },
  { id: "TR-1049", from: "main", to: "west", productId: "p-10", quantity: 10, status: "received", created: "2026-10-22", requestedBy: "Farah Nasser" },
  { id: "TR-1048", from: "east", to: "main", productId: "p-5", quantity: 50, status: "received", created: "2026-10-21", requestedBy: "Samir Fahmy" },
  { id: "TR-1047", from: "west", to: "east", productId: "p-14", quantity: 15, status: "draft", created: "2026-10-21", requestedBy: "Nour Haddad" },
];
