export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-teal-100 bg-gradient-to-br from-[#071d2c] via-[#0f4f50] to-[#0f766e] text-white">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-teal-200/10 blur-2xl" />
      <div className="container-page relative py-10 md:py-14">
        <span className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-200 backdrop-blur">
          Rurally Smile Foundation
        </span>
        <h1 className="font-heading text-3xl font-extrabold text-white md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-teal-50/90 md:text-base">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
