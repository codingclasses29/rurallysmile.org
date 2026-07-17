"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminService, type DashboardStats } from "@/services/admin.service";

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminService.dashboard();
        setStats(res.data || null);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const bars = [
    {
      label: "Registrations",
      value: stats?.totalStudents ?? 0,
      max: Math.max(stats?.totalStudents ?? 1, 1),
      color: "#2563eb",
    },
    {
      label: "Approved",
      value: stats?.approvedStudents ?? 0,
      max: Math.max(stats?.totalStudents ?? 1, 1),
      color: "#16a34a",
    },
    {
      label: "Admit Cards",
      value: stats?.totalAdmitCards ?? 0,
      max: Math.max(stats?.approvedStudents ?? 1, 1),
      color: "#7c3aed",
    },
    {
      label: "Results Published",
      value: stats?.publishedResults ?? 0,
      max: Math.max(stats?.totalResults ?? 1, 1),
      color: "#dc2626",
    },
  ];

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-0">Reports &amp; Analytics</h1>
          <p className="text-muted mb-0">
            Monthly registration · Class · District · Pass % (live snapshot)
          </p>
        </div>
        <Link href="/admin/dashboard" className="btn btn-outline-primary">
          Dashboard
        </Link>
      </div>

      <div className="row g-3">
        {bars.map((b) => {
          const pct = Math.min(100, Math.round((b.value / b.max) * 100));
          return (
            <div className="col-md-6" key={b.label}>
              <div className="admin-coming-card p-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">{b.label}</span>
                  <span className="fw-bold" style={{ color: b.color }}>
                    {b.value.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="progress" style={{ height: 10 }}>
                  <div
                    className="progress-bar"
                    style={{ width: `${pct}%`, background: b.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="alert alert-light border mt-4">
        Charts for district-wise / class-wise / pass % will expand here with
        dedicated analytics endpoints.
      </div>
    </div>
  );
}
