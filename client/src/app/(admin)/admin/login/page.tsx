"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToastProvider, notify } from "@/components/ui/toast/Toast";
import { authService } from "@/services/auth.service";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.success) {
        notify.loginSuccess();
        const next = searchParams.get("next") || "/admin/dashboard";
        window.location.href = next.startsWith("/admin")
          ? next
          : "/admin/dashboard";
      } else {
        notify.error(res.message || "Login failed");
      }
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Login failed";
      notify.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow border-0" style={{ maxWidth: 420, width: "100%" }}>
      <div className="card-body p-4 p-md-5">
        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-brand-admin text-white d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: 56, height: 56 }}
          >
            <i className="bi bi-shield-lock fs-4" />
          </div>
          <h1 className="h4 fw-bold mb-1">Admin Login</h1>
          <p className="text-muted small mb-0">Pratibha Khoj Exam Portal</p>
        </div>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <ToastProvider />
      <Suspense fallback={<div className="spinner-border text-primary" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
