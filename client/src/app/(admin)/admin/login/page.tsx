"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToastProvider, notify } from "@/components/ui/toast/Toast";
import { authService } from "@/services/auth.service";

function resolveNextPath(next: string | null) {
  if (!next) return "/admin/dashboard";
  if (!next.startsWith("/admin")) return "/admin/dashboard";
  if (/\s|`/.test(next)) return "/admin/dashboard";
  return next;
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();
      const res = await authService.login({ email: cleanEmail, password: cleanPassword });
      if (res.success) {
        notify.loginSuccess();
        window.location.href = resolveNextPath(searchParams.get("next"));
      } else {
        const msg = res.message || "Login failed";
        setErrorMsg(msg);
        notify.error(msg);
      }
    } catch (err: unknown) {
      const ax = err as {
        response?: { status?: number; data?: { message?: string; errors?: Array<{ msg?: string; message?: string }> } };
        message?: string;
        errors?: Array<{ msg?: string; message?: string }> | null;
        status?: number;
      };
      const status = ax.response?.status || ax.status;
      const apiMsg =
        ax.errors?.[0]?.msg ||
        ax.errors?.[0]?.message ||
        ax.response?.data?.errors?.[0]?.msg ||
        ax.response?.data?.message ||
        ax.message ||
        "Login failed";

      let finalMsg = apiMsg;
      if (status === 401) {
        finalMsg = "गलत पासवर्ड (Invalid Password). कृपया सही पासवर्ड दर्ज करें।";
      } else if (status === 404) {
        finalMsg = "एडमिन खाता नहीं मिला (Admin not found). ईमेल सही से जांचें।";
      } else if (status === 429) {
        finalMsg = "बहुत अधिक प्रयास (Too many requests). कृपया 5–10 मिनट बाद पुनः प्रयास करें।";
      } else if (status === 504 || status === 502 || apiMsg.includes("fetch failed") || apiMsg.includes("Network Error")) {
        finalMsg = "सर्वर चालू हो रहा है (Server waking up). कृपया 30 सेकंड बाद दोबारा 'Sign In' दबाएं।";
      }

      setErrorMsg(finalMsg);
      notify.error(finalMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow border-0" style={{ maxWidth: 440, width: "100%" }}>
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

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small mb-3 d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill shrink-0 fs-5" />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="email">
              Admin Email / ईमेल
            </label>
            <input
              id="email"
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              required
              autoComplete="username"
              placeholder="Enter admin email"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold" htmlFor="password">
              Password / पासवर्ड
            </label>
            <div className="input-group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-control form-control-lg"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="btn btn-outline-secondary px-3"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                <i className={`bi bi-eye${showPassword ? "-slash" : ""}`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 btn-lg shadow-sm"
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
