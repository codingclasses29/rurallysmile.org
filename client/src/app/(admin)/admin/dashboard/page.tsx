"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  adminService,
  type DashboardStats,
} from "@/services/admin.service";
import { notify } from "@/components/ui/toast/Toast";
import { SITE } from "@/constants/site";

const primaryCards: {
  key: keyof DashboardStats;
  label: string;
  icon: string;
  bar: string;
  iconBg: string;
  href: string;
}[] = [
  {
    key: "totalStudents",
    label: "Total Registration",
    icon: "bi-people-fill",
    bar: "#0f766e",
    iconBg: "rgba(15,118,110,.12)",
    href: "/admin/students",
  },
  {
    key: "approvedStudents",
    label: "Approved Students",
    icon: "bi-person-check-fill",
    bar: "#16a34a",
    iconBg: "rgba(22,163,74,.12)",
    href: "/admin/students?status=Approved",
  },
  {
    key: "pendingStudents",
    label: "Pending Approval",
    icon: "bi-hourglass-split",
    bar: "#f97316",
    iconBg: "rgba(249,115,22,.15)",
    href: "/admin/students?status=Pending",
  },
  {
    key: "totalAdmitCards",
    label: "Admit Cards Generated",
    icon: "bi-card-heading",
    bar: "#1399a2",
    iconBg: "rgba(19,153,162,.12)",
    href: "/admin/admit-card",
  },
  {
    key: "registrationsToday",
    label: "New Today",
    icon: "bi-calendar-plus",
    bar: "#7c3aed",
    iconBg: "rgba(124,58,237,.12)",
    href: `/admin/students?dateFrom=${new Date().toISOString().slice(0, 10)}&dateTo=${new Date().toISOString().slice(0, 10)}`,
  },
  {
    key: "rejectedStudents",
    label: "Rejected",
    icon: "bi-person-x-fill",
    bar: "#be123c",
    iconBg: "rgba(190,18,60,.12)",
    href: "/admin/students?status=Rejected",
  },
  {
    key: "publishedResults",
    label: "Results Published",
    icon: "bi-trophy-fill",
    bar: "#dc2626",
    iconBg: "rgba(220,38,38,.12)",
    href: "/admin/marksheet",
  },
];

const secondaryCards: {
  key: keyof DashboardStats;
  label: string;
  icon: string;
  href: string;
}[] = [
  { key: "totalResults", label: "Total Results", icon: "bi-bar-chart-fill", href: "/admin/results" },
  { key: "pendingResults", label: "Results Pending", icon: "bi-clock-history", href: "/admin/results?published=false" },
  { key: "approvedWithoutAdmit", label: "Admit Pending", icon: "bi-person-vcard", href: "/admin/students?status=Approved" },
  { key: "totalCenters", label: "Exam Centres", icon: "bi-geo-alt-fill", href: "/admin/exam-centers" },
  { key: "totalSubjects", label: "Subjects", icon: "bi-journal-bookmark-fill", href: "/admin/subjects" },
  { key: "totalNotices", label: "Published Notices", icon: "bi-megaphone-fill", href: "/admin/notices" },
  { key: "totalGallery", label: "Gallery Items", icon: "bi-images", href: "/admin/gallery" },
  { key: "totalAdmins", label: "Admin Users", icon: "bi-person-gear", href: "/admin/users" },
];

const modules = [
  { href: "/admin/students", title: "Students", desc: "Approve · Search · Admit", icon: "bi-people", color: "#0f766e" },
  { href: "/admin/students/upload", title: "Student Import", desc: "Excel + media ZIP", icon: "bi-file-earmark-arrow-up", color: "#15803d" },
  { href: "/admin/admit-card", title: "Admit Card", desc: "Generate · PDF · Print", icon: "bi-card-heading", color: "#0ea5e9" },
  { href: "/admin/marksheet", title: "Marksheet", desc: "Marks · Publish · PDF", icon: "bi-file-earmark-text", color: "#1399a2" },
  { href: "/admin/results", title: "Results", desc: "List · Publish status", icon: "bi-bar-chart", color: "#dc2626" },
  { href: "/admin/results/upload", title: "Result Import", desc: "Excel + Google Sheets", icon: "bi-file-earmark-excel", color: "#16a34a" },
  { href: "/admin/notices", title: "Notice", desc: "Publish announcements", icon: "bi-megaphone", color: "#f59e0b" },
  { href: "/admin/exam-centers", title: "Centers", desc: "Exam venues", icon: "bi-geo-alt", color: "#0f766e" },
  { href: "/admin/merit-list", title: "Merit List", desc: "Toppers · Rank", icon: "bi-trophy", color: "#b45309" },
  { href: "/admin/reports", title: "Reports", desc: "Analytics charts", icon: "bi-graph-up", color: "#0f766e" },
  { href: "/admin/gallery", title: "Gallery", desc: "Event photos", icon: "bi-images", color: "#f97316" },
  { href: "/admin/users", title: "Users", desc: "Admins · Roles", icon: "bi-person-gear", color: "#475569" },
  { href: "/admin/settings", title: "Settings", desc: "Dates · SEO · Logo", icon: "bi-gear", color: "#334155" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await adminService.dashboard();
        setStats(res.data || null);
      } catch (err: unknown) {
        const message =
          typeof err === "object" && err && "message" in err
            ? String((err as { message: string }).message)
            : "Failed to load dashboard";
        setError(message);
        notify.error(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <p className="text-uppercase text-primary fw-semibold mb-1" style={{ fontSize: 11, letterSpacing: "0.08em" }}>
            Dashboard Overview
          </p>
          <h1 className="h3 fw-bold mb-0">Welcome, Admin</h1>
          <p className="text-muted mb-0">
            {SITE.titleHindi} · Live portal statistics
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link href="/admin/students?status=Pending" className="btn btn-admin-orange">
            <i className="bi bi-clipboard-check me-1" /> Approval Queue
          </Link>
          <Link href="/admin/admit-card" className="btn btn-primary">
            <i className="bi bi-card-heading me-1" /> Admit Cards
          </Link>
          <Link href="/admin/results/upload" className="btn btn-admin-success">
            <i className="bi bi-upload me-1" /> Upload Excel
          </Link>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading dashboard…</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && stats && (
        <>
          <div className="row g-3 mb-4">
            {primaryCards.map((c) => (
              <div className="col-6 col-xl" key={c.key}>
                <Link href={c.href} className="admin-stat-card bg-white">
                  <div className="stat-top" style={{ background: c.bar }} />
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div>
                        <div className="text-muted small fw-semibold text-uppercase">
                          {c.label}
                        </div>
                        <div className="fs-2 fw-bold text-dark mt-1 tabular-nums">
                          {(stats[c.key] ?? 0).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div
                        className="stat-icon"
                        style={{ background: c.iconBg, color: c.bar }}
                      >
                        <i className={`bi ${c.icon}`} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="row g-3 mb-4">
            {secondaryCards.map((card) => (
              <div className="col-6 col-md-4 col-xl-3" key={card.key}>
                <Link href={card.href} className="admin-module-tile h-100">
                  <span className="tile-icon bg-primary">
                    <i className={`bi ${card.icon}`} />
                  </span>
                  <span>
                    <span className="d-block fs-4 fw-bold text-dark tabular-nums">
                      {(stats[card.key] ?? 0).toLocaleString("en-IN")}
                    </span>
                    <span className="small text-muted">{card.label}</span>
                  </span>
                </Link>
              </div>
            ))}
          </div>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="h5 fw-bold mb-0">Quick Modules</h2>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
              Foundation Operations
            </span>
          </div>
          <div className="row g-3">
            {modules.map((m) => (
              <div className="col-6 col-md-4 col-xl-3" key={m.href}>
                <Link href={m.href} className="admin-module-tile">
                  <span className="tile-icon" style={{ background: m.color }}>
                    <i className={`bi ${m.icon}`} />
                  </span>
                  <span>
                    <span className="d-block fw-bold">{m.title}</span>
                    <span className="small text-muted">{m.desc}</span>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
