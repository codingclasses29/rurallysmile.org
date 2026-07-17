"use client";

import { HiMoon, HiSun, HiDesktopComputer } from "react-icons/hi";
import { Button } from "@/components/ui/button/Button";
import { useTheme, type ThemeMode } from "@/theme/ThemeProvider";
import { cn } from "@/utils/cn";

const modes: { mode: ThemeMode; icon: typeof HiSun; label: string }[] = [
  { mode: "light", icon: HiSun, label: "Light" },
  { mode: "dark", icon: HiMoon, label: "Dark" },
  { mode: "system", icon: HiDesktopComputer, label: "System" },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-ui border border-brand-border bg-white p-1 dark:border-slate-700 dark:bg-slate-900",
        className
      )}
      role="group"
      aria-label="Theme"
    >
      {modes.map(({ mode, icon: Icon, label }) => (
        <Button
          key={mode}
          size="sm"
          variant={theme === mode ? "secondary" : "ghost"}
          className="!px-2.5"
          onClick={() => setTheme(mode)}
          aria-pressed={theme === mode}
          title={label}
        >
          <Icon size={16} />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}
