"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

export const slideInVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
};

export const zoomVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

export const scaleVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

type MotionBoxProps = HTMLMotionProps<"div"> & {
  preset?: "fade" | "slide" | "slideIn" | "zoom" | "scale";
};

const presets: Record<NonNullable<MotionBoxProps["preset"]>, Variants> = {
  fade: fadeVariants,
  slide: slideUpVariants,
  slideIn: slideInVariants,
  zoom: zoomVariants,
  scale: scaleVariants,
};

export const MotionBox = forwardRef<HTMLDivElement, MotionBoxProps>(
  ({ preset = "fade", className, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={presets[preset]}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.35, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
);
MotionBox.displayName = "MotionBox";

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3 },
};

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};
