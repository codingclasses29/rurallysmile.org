"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppProviders } from "@/components/layout/AppProviders";
import { authService } from "@/services/auth.service";
import { SITE } from "@/constants/site";
import "../../admin-premium.css";

type NavLink = { href: string; label: string; icon?: string; nested?: boolean };
type NavGroup = { title: string; items: NavLink[] };

const today = new Date().toISOString().slice(0, 10);

const groups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    ],
  },
  {
    title: "Student Management",
    items: [
      {
        href: "/admin/students",
        label: "All Students",
        icon: "bi-people",
      },
      {
        href: `/admin/students?dateFrom=${today}&dateTo=${today}`,
        label: "New Students (Today)",
        icon: "bi-calendar-plus",
        nested: true,
      },
      {
        href: "/registration",
        label: "New Registration Form",
        icon: "bi-box-arrow-up-right",
        nested: true,
      },
      {
        href: "/admin/students/upload",
        label: "Student Excel Import",
        icon: "bi-file-earmark-arrow-up",
        nested: true,
      },
      {
        href: "/admin/students?status=Pending",
        label: "Pending Approval",
        icon: "bi-hourglass-split",
        nested: true,
      },
      {
        href: "/admin/students?status=Approved",
        label: "Approved Students",
        icon: "bi-check2-circle",
        nested: true,
      },
      {
        href: "/admin/students?status=Rejected",
        label: "Rejected Students",
        icon: "bi-x-circle",
        nested: true,
      },
    ],
  },
  {
    title: "Exam Management",
    items: [
      {
        href: "/admin/exam-schedule",
        label: "Exam Schedule",
        icon: "bi-calendar-event",
      },
      { href: "/admin/subjects", label: "Subjects", icon: "bi-journal-text" },
      {
        href: "/admin/exam-centers",
        label: "Exam Centre",
        icon: "bi-geo-alt",
      },
    ],
  },
  {
    title: "Admit Card",
    items: [
      {
        href: "/admin/admit-card",
        label: "Generate / Download",
        icon: "bi-card-heading",
      },
    ],
  },
  {
    title: "Result & Marksheet",
    items: [
      {
        href: "/admin/results/upload",
        label: "Result Import Center",
        icon: "bi-cloud-arrow-up",
      },
      {
        href: "/admin/results/upload?tab=excel",
        label: "Excel Upload",
        icon: "bi-file-earmark-excel",
        nested: true,
      },
      {
        href: "/admin/results/upload?tab=google",
        label: "Google Sheets",
        icon: "bi-google",
        nested: true,
      },
      { href: "/admin/results", label: "Results", icon: "bi-bar-chart" },
      {
        href: "/admin/marksheet",
        label: "Digital Marksheet",
        icon: "bi-file-earmark-text",
      },
      {
        href: "/admin/merit-list",
        label: "Merit List",
        icon: "bi-trophy",
      },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/notices", label: "Notice", icon: "bi-megaphone" },
      { href: "/admin/gallery", label: "Gallery", icon: "bi-images" },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/reports", label: "Reports", icon: "bi-graph-up" },
      { href: "/admin/users", label: "Users", icon: "bi-person-gear" },
      { href: "/admin/settings", label: "Website Settings", icon: "bi-gear" },
    ],
  },
];

function isActive(pathname: string | null, href: string, search: string) {
  if (!pathname) return false;
  const [base, qs] = href.split("?");
  if (pathname !== base && !pathname.startsWith(`${base}/`)) return false;
  if (!qs) {
    if (base === "/admin/students" && pathname !== base) return false;
    // Prefer exact match for the parent when a student view filter is active.
    if (
      base === "/admin/students" &&
      (search.includes("status=") || search.includes("dateFrom="))
    )
      return false;
    return pathname === base || pathname.startsWith(`${base}/`);
  }
  const want = new URLSearchParams(qs);
  const have = new URLSearchParams(search.replace(/^\?/, ""));
  for (const [k, v] of want.entries()) {
    if (have.get(k) !== v) return false;
  }
  return true;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-4">Loading admin…</div>}>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Suspense>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLogin = pathname?.includes("/admin/login");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentSearch = searchParams?.toString()
    ? `?${searchParams.toString()}`
    : "";

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [sidebarOpen]);

  if (isLogin) {
    return <AppProviders>{children}</AppProviders>;
  }

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore */
    }
    router.push("/admin/login");
  };

  const SidebarInner = () => (
    <>
      <div className="p-3 border-bottom border-secondary border-opacity-25">
        <div className="d-flex align-items-center gap-2">
          <Image
            src="/icons/icons.png"
            alt="Rurally Smile Foundation"
            width={140}
            height={74}
            className="brand-logo"
            style={{ width: "auto", height: 44, objectFit: "contain" }}
          />
          <div className="lh-sm">
            <div className="text-info" style={{ fontSize: 11 }}>
              Admin Dashboard
            </div>
            <div className="text-white-50" style={{ fontSize: 10 }}>
              Pratibha Khoj 2026
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-light ms-auto d-lg-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
            <i className="bi bi-x-lg" aria-hidden />
          </button>
        </div>
      </div>

      <div className="flex-grow-1 overflow-auto py-2 pb-4">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="admin-nav-group-title">{group.title}</div>
            <div className="d-flex flex-column gap-1 mb-2">
              {group.items.map((link) => {
                const active = isActive(pathname, link.href, currentSearch);
                return (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`admin-nav-link ${link.nested ? "nested" : ""} ${
                      active ? "active" : ""
                    }`}
                  >
                    {link.icon ? <i className={`bi ${link.icon}`} /> : null}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <button
          type="button"
          className="admin-nav-link w-100 border-0 bg-transparent text-start mt-2"
          onClick={logout}
        >
          <i className="bi bi-box-arrow-right" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <AppProviders>
      <div className="admin-shell d-flex min-vh-100">
        <aside className="admin-sidebar d-none d-lg-flex flex-column text-white flex-shrink-0">
          <SidebarInner />
        </aside>

        {sidebarOpen && (
          <div
            className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 1040, background: "rgba(15,23,42,.45)" }}
            onClick={() => setSidebarOpen(false)}
            role="presentation"
          >
            <aside
              className="admin-sidebar h-100 d-flex flex-column text-white"
              style={{ width: 280 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Admin navigation"
            >
              <SidebarInner />
            </aside>
          </div>
        )}

        <div className="flex-grow-1 d-flex flex-column min-vh-100">
          <header className="admin-header-bar sticky-top shadow-sm">
            <div className="d-flex align-items-center justify-content-between gap-3 px-3 px-lg-4 py-2">
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-light d-lg-none"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <i className="bi bi-list fs-5" />
                </button>
                <div className="lh-sm">
                  <div className="fw-bold small">
                    {SITE.org} · Admin Dashboard
                  </div>
                  <div className="opacity-75" style={{ fontSize: 11 }}>
                    {SITE.titleHindi} · Foundation Control Panel
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-light position-relative"
                  aria-label="Notifications"
                >
                  <i className="bi bi-bell" />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    8
                  </span>
                </button>
                <div className="d-none d-md-flex align-items-center gap-2 px-2 text-white">
                  <div
                    className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: 36, height: 36 }}
                  >
                    A
                  </div>
                  <div className="lh-sm">
                    <div className="fw-semibold small">Admin</div>
                    <div className="opacity-75" style={{ fontSize: 11 }}>
                      Super Admin
                    </div>
                  </div>
                </div>
                <Link href="/" className="btn btn-sm btn-outline-light">
                  <i className="bi bi-house me-1" />
                  Website
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-admin-orange"
                  onClick={logout}
                >
                  <i className="bi bi-box-arrow-right me-1" />
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-grow-1 p-3 p-lg-4">{children}</main>

          <footer className="border-top bg-white px-3 px-lg-4 py-3 small text-muted d-flex flex-wrap justify-content-between gap-2">
            <span>
              © {SITE.year} {SITE.org}. All rights reserved.
            </span>
            <span>
              Designed & Developed by{" "}
              <a
                href="https://sachin-net.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none fw-semibold"
              >
                Sachin.net
              </a>
            </span>
          </footer>
        </div>
      </div>
    </AppProviders>
  );
}
