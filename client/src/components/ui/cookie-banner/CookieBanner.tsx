"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button/Button";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";

const COOKIE_KEY = "rsf_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (value: "accepted" | "rejected" | "custom") => {
    try {
      localStorage.setItem(
        COOKIE_KEY,
        value === "custom" ? JSON.stringify({ analytics }) : value
      );
    } catch {
      /* ignore */
    }
    setVisible(false);
    setCustomize(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 p-4"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
        >
          <div className="container-page">
            <div className="rounded-ui-lg border border-brand-border bg-white p-4 shadow-modal sm:p-5 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                हम आपकी बेहतर सेवा के लिए Cookies का उपयोग करते हैं।{" "}
                <Link
                  href="/cookie-policy"
                  className="font-semibold text-brand-secondary underline"
                >
                  Cookie Policy
                </Link>
              </p>

              {customize && (
                <div className="mt-3 space-y-2 rounded-ui bg-slate-50 p-3 dark:bg-slate-800">
                  <Checkbox label="Essential (आवश्यक)" checked disabled />
                  <Checkbox
                    label="Analytics"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                  />
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="success" onClick={() => save("accepted")}>
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={() => save("rejected")}>
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (customize) save("custom");
                    else setCustomize(true);
                  }}
                >
                  {customize ? "Save Preferences" : "Customize"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
