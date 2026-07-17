"use client";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="h3 fw-bold mb-1">Users &amp; Roles</h1>
      <p className="text-muted mb-4">
        Role-based access · Super Admin · Admin · Coordinator
      </p>
      <div className="admin-coming-card p-4">
        <p className="mb-2">
          Create admin accounts via <code>POST /api/v1/admin/create</code>{" "}
          (Super Admin only).
        </p>
        <ul className="mb-0">
          <li>
            <strong>SUPER_ADMIN</strong> — full access
          </li>
          <li>
            <strong>ADMIN</strong> — students, admit, results, notices
          </li>
          <li>
            <strong>COORDINATOR</strong> — view / limited approve
          </li>
        </ul>
      </div>
    </div>
  );
}
