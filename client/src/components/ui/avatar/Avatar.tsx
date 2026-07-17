import Image from "next/image";
import { cn } from "@/utils/cn";

export type AvatarProps = {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({
  src,
  alt = "Avatar",
  name,
  size = "md",
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-secondary/15 font-heading font-bold text-brand-secondary",
        sizes[size],
        className
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes="80px" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}
