"use client";

import toast, { Toaster, type ToastOptions } from "react-hot-toast";

const base: ToastOptions = {
  duration: 3500,
  position: "top-right",
  style: {
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "14px",
  },
};

export const notify = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, { ...base, ...options }),
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, { ...base, ...options }),
  info: (message: string, options?: ToastOptions) =>
    toast(message, { ...base, icon: "ℹ️", ...options }),
  registrationSuccess: () =>
    notify.success("Registration Successful! पंजीकरण सफल।"),
  loginSuccess: () => notify.success("Login Successful! लॉगिन सफल।"),
  deleteSuccess: () => notify.success("Deleted successfully."),
  custom: toast,
};

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "font-body",
        success: {
          iconTheme: { primary: "#16A34A", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#DC2626", secondary: "#fff" },
        },
      }}
    />
  );
}
