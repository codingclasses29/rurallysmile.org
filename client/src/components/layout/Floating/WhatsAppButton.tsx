"use client";

import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { SITE } from "@/constants/site";

export function WhatsAppButton() {
  return (
    <motion.a
      href={SITE.social.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      aria-label="Chat on WhatsApp — Need Help?"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <FaWhatsapp size={22} aria-hidden />
      <span className="hidden sm:inline">
        Need Help?
        <span className="block text-[10px] font-medium opacity-90">
          Chat on WhatsApp
        </span>
      </span>
    </motion.a>
  );
}
