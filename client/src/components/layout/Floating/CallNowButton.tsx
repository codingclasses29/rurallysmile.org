"use client";

import { FaPhoneAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { SITE } from "@/constants/site";

export function CallNowButton() {
  return (
    <motion.a
      href={`tel:${SITE.phones[0]}`}
      className="fixed bottom-24 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary text-white shadow-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-5 sm:right-28 sm:w-auto sm:gap-2 sm:px-4"
      aria-label={`Call Now ${SITE.phones[0]}`}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <FaPhoneAlt size={16} aria-hidden />
      <span className="hidden text-sm font-bold sm:inline">Call Now</span>
    </motion.a>
  );
}
