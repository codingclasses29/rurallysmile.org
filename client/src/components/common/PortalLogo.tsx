import Image from "next/image";
import { cn } from "@/utils/cn";

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  /** Show on dark backgrounds (default). Set false for white cards with dark pad. */
  onDark?: boolean;
  className?: string;
};

/** Official logo from https://rurallysmile.org/ */
const LOGO = "/icons/icons.png";

const sizes = {
  sm: { w: 120, h: 63, maxH: "max-h-9" },
  md: { w: 160, h: 84, maxH: "max-h-12" },
  lg: { w: 220, h: 116, maxH: "max-h-16" },
  xl: { w: 280, h: 147, maxH: "max-h-20 md:max-h-24" },
};

export function PortalLogo({ size = "md", onDark = true, className }: Props) {
  const s = sizes[size];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center overflow-hidden",
        !onDark && "rounded-xl bg-[#2a2a2a] px-2 py-1.5 shadow-md",
        className
      )}
    >
      <Image
        src={LOGO}
        alt="Rurally Smile Foundation"
        width={s.w}
        height={s.h}
        className={cn("h-auto w-auto object-contain", s.maxH)}
        priority={size === "lg" || size === "xl"}
      />
    </span>
  );
}
