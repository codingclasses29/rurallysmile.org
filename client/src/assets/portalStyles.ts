/**
 * Centralized portal UI styles — adapted from Medicare dummyStyles pattern
 * for Rurally Smile Foundation (teal · orange · navy brand).
 */

export const portalPage = {
  sectionAlt:
    "relative overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/40 to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
  sectionWhite: "bg-white/80 backdrop-blur-sm dark:bg-slate-950/90",
  sectionDark:
    "bg-gradient-to-br from-[#0F172A] via-[#13233f] to-[#1399A2] text-white",
  container: "container-page relative z-10",
  badge:
    "inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-700 shadow-sm backdrop-blur dark:border-cyan-800 dark:bg-slate-900/80 dark:text-cyan-300",
  title:
    "font-heading text-2xl font-extrabold tracking-tight text-[#0F172A] dark:text-white md:text-3xl lg:text-4xl",
  titleGradient:
    "bg-gradient-to-r from-[#1399A2] via-cyan-600 to-[#F97316] bg-clip-text text-transparent",
  subtitle:
    "mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 md:text-base",
  headerCenter: "mx-auto max-w-2xl text-center",
};

export const portalCard = {
  base: "group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-100/50 dark:border-slate-700 dark:bg-slate-900/90 dark:hover:shadow-cyan-900/20",
  highlight:
    "rounded-3xl border-2 border-amber-300/60 bg-gradient-to-b from-amber-50 via-white to-white p-5 shadow-xl ring-2 ring-amber-200/40 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900",
  iconWrap:
    "mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1399A2] to-cyan-500 text-xl text-white shadow-md transition group-hover:scale-110",
  title: "font-heading text-sm font-bold text-[#0F172A] dark:text-white",
  desc: "mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400",
};

export const portalHero = {
  section:
    "relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#13233f] to-[#0e7490] text-white",
  glow1: "pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-cyan-400/20 blur-3xl",
  glow2: "pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-orange-400/15 blur-3xl",
  orgBadge:
    "mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md",
  heading: "font-heading text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl",
  infoBox:
    "mt-6 space-y-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm backdrop-blur-md sm:text-base",
  ctaPrimary:
    "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition hover:-translate-y-0.5 hover:shadow-xl",
  ctaSecondary:
    "inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20",
  ctaAccent:
    "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-bold text-[#0F172A] shadow-lg transition hover:-translate-y-0.5",
  admitFrame:
    "relative overflow-hidden rounded-3xl border border-white/25 bg-white shadow-2xl shadow-black/30",
  admitHeader:
    "flex items-center gap-3 bg-gradient-to-r from-[#1399A2] to-cyan-600 px-5 py-4 text-white",
};

export const portalForm = {
  card: "rounded-3xl border border-cyan-100 bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80",
  label: "mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200",
  input:
    "w-full rounded-full border border-cyan-200 bg-cyan-50/30 px-4 py-2.5 font-mono text-sm transition focus:border-[#1399A2] focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-800",
  button:
    "w-full rounded-full bg-gradient-to-r from-[#1399A2] to-cyan-600 px-4 py-3 font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-60",
  previewWrap:
    "overflow-auto rounded-3xl border border-cyan-100 bg-gradient-to-br from-slate-100 to-cyan-50/50 p-4 shadow-inner dark:border-slate-700 dark:from-slate-900 dark:to-slate-800",
};

export const portalDocument = {
  shell:
    "mx-auto overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-2xl print:shadow-none",
  topBar: "h-1.5 bg-gradient-to-r from-[#1399A2] via-cyan-500 to-[#F97316]",
  header:
    "flex items-start justify-between gap-3 border-b border-cyan-100 bg-gradient-to-r from-cyan-50/80 to-white px-4 py-4 md:px-6",
  logo: "h-14 w-auto max-w-[150px] object-contain md:h-16 bg-[#2a2a2a] rounded-lg p-1.5",
  orgName: "text-sm font-bold text-[#1399A2] md:text-base",
  docTitle: "text-base font-extrabold text-[#0F172A] md:text-lg",
  docSub: "text-xs text-slate-500",
  body: "px-4 pb-5 md:px-6",
  table: "w-full overflow-hidden rounded-xl border border-slate-200 text-sm",
  tableHead: "bg-[#0F172A] text-white",
  tableRow: "border-b border-slate-100 even:bg-slate-50/80",
  totalRow: "bg-emerald-50 font-bold text-emerald-900",
  passBadge:
    "inline-flex rounded-full px-4 py-1.5 text-sm font-bold text-white",
  pass: "bg-emerald-600",
  fail: "bg-rose-600",
  infoBox: "rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-sm",
  slotBox: "rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-sm",
};

export const portalStats = {
  grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
  card: "rounded-2xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-md transition hover:bg-white/15",
  value: "font-mono text-3xl font-bold tabular-nums text-amber-300 sm:text-4xl",
  label: "mt-2 text-xs font-semibold uppercase tracking-wider text-cyan-100",
};

export const portalSteps = {
  card: "relative h-full rounded-3xl border border-cyan-100 bg-white/90 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900",
  number:
    "inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1399A2] font-mono text-lg font-bold text-white shadow-md",
};

export const portalAnimations = `
  @keyframes portal-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes portal-shine {
    0% { transform: translateX(-100%) skewX(-12deg); }
    100% { transform: translateX(200%) skewX(-12deg); }
  }
  @keyframes portal-border-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .portal-float { animation: portal-float 4s ease-in-out infinite; }
  .portal-card-shine { position: relative; overflow: hidden; }
  .portal-card-shine::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
    transform: translateX(-100%) skewX(-12deg);
    transition: none;
  }
  .portal-card-shine:hover::after {
    animation: portal-shine 0.9s ease;
  }
  .portal-border-animated {
    background: linear-gradient(90deg, #1399A2, #F97316, #1399A2);
    background-size: 200% 100%;
    animation: portal-border-flow 4s ease infinite;
  }
`;
