"use client";

import { motion } from "framer-motion";

export function SuccessCheck() {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 14 }}
      className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-brand-success text-4xl text-white shadow-lg shadow-emerald-200/50"
      aria-hidden
    >
      ✓
    </motion.div>
  );
}
