"use client";

import Link from "next/link";

type Crumb = { label: string; href?: string };

type Props = {
  title: string;
  crumbs?: Crumb[];
  backHref?: string;
  actions?: React.ReactNode;
};

export function AdminPageHeader({ title, crumbs, backHref, actions }: Props) {
  return (
    <header className="admin-page-header d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              {crumbs.map((c, i) => (
                <li
                  key={c.label}
                  className={`breadcrumb-item ${i === crumbs.length - 1 ? "active" : ""}`}
                >
                  {c.href && i < crumbs.length - 1 ? (
                    <Link href={c.href}>{c.label}</Link>
                  ) : (
                    c.label
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="h3 fw-bold text-dark mb-0">{title}</h1>
      </div>
      <div className="d-flex flex-wrap gap-2">
        {actions}
        {backHref && (
          <Link href={backHref} className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1" />
            Back
          </Link>
        )}
      </div>
    </header>
  );
}
