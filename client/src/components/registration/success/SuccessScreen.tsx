"use client";

import { motion } from "framer-motion";
import { SITE } from "@/constants/site";
import type { RegistrationSuccess } from "@/types/registration";
import { SuccessCheck } from "./SuccessCheck";
import { RegistrationSummaryCard } from "./RegistrationSummaryCard";
import { ReceiptActions } from "./ReceiptActions";

export function SuccessScreen({ result }: { result: RegistrationSuccess }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg text-center"
    >
      <SuccessCheck />
      <h2 className="mt-5 font-heading text-2xl font-extrabold text-brand-primary dark:text-white sm:text-3xl">
        Registration Successful
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        आपका आवेदन Admin Approval के लिए भेज दिया गया है। Registration Number
        सुरक्षित रखें।
      </p>

      <div className="mt-6">
        <RegistrationSummaryCard result={result} />
      </div>

      <div className="mt-6">
        <ReceiptActions registrationNumber={result.registrationNumber} />
      </div>

      <p className="mt-8 text-xs text-slate-500">
        {SITE.org} · WhatsApp / Email confirmation भेजा जा सकता है।
      </p>
    </motion.div>
  );
}
