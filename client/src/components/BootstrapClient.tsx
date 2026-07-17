"use client";

import { useEffect } from "react";

/** Initializes Bootstrap 5 JS (tooltips, collapse, modals) site-wide */
export function BootstrapClient() {
  useEffect(() => {
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return null;
}
