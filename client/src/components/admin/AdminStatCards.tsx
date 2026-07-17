"use client";

type Stat = {
  label: string;
  value: string | number;
  icon: string;
  tone: "primary" | "success" | "warning" | "info" | "danger" | "secondary";
};

const toneBg: Record<Stat["tone"], string> = {
  primary: "bg-primary-subtle text-primary",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  info: "bg-info-subtle text-info",
  danger: "bg-danger-subtle text-danger",
  secondary: "bg-secondary-subtle text-secondary",
};

export function AdminStatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="row g-3 mb-4">
      {stats.map((s) => (
        <div className="col-6 col-lg-3" key={s.label}>
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div
                className={`rounded-3 d-flex align-items-center justify-content-center ${toneBg[s.tone]}`}
                style={{ width: 48, height: 48 }}
              >
                <i className={`bi ${s.icon} fs-5`} />
              </div>
              <div>
                <div className="text-muted small">{s.label}</div>
                <div className="fw-bold fs-4 lh-1">{s.value}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
