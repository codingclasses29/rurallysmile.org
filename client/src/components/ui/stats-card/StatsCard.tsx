"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { IconType } from "react-icons";
import { hoverLift } from "@/components/ui/motion";

export type StatsCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: IconType;
  trend?: string;
  tone?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  className?: string;
};

const tones = {
  primary: "from-slate-800 to-slate-900 text-white",
  secondary: "from-blue-600 to-blue-700 text-white",
  success: "from-emerald-600 to-green-700 text-white",
  warning: "from-amber-500 to-orange-500 text-brand-primary",
  danger: "from-red-500 to-rose-600 text-white",
  info: "from-cyan-500 to-sky-600 text-white",
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  tone = "secondary",
  className,
}: StatsCardProps) {
  return (
    <motion.div
      {...hoverLift}
      className={cn(
        "relative overflow-hidden rounded-ui-lg bg-gradient-to-br p-5 shadow-card",
        tones[tone],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
            {title}
          </p>
          <p className="mt-2 font-mono text-3xl font-bold tabular-nums">{value}</p>
          {subtitle && <p className="mt-1 text-xs opacity-80">{subtitle}</p>}
          {trend && (
            <p className="mt-2 text-xs font-semibold opacity-90">{trend}</p>
          )}
        </div>
        {Icon && (
          <span className="rounded-ui bg-white/15 p-2.5">
            <Icon size={22} />
          </span>
        )}
      </div>
    </motion.div>
  );
}
