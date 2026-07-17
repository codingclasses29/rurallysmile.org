"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SITE } from "@/constants/site";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { TopBar } from "./TopBar";
import { Announcement } from "./Announcement";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import { HeaderSearch } from "./HeaderSearch";
import { NotificationBell } from "./NotificationBell";
import { cn } from "@/utils/cn";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40" role="banner">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-ui focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:shadow-modal"
      >
        Skip to main content
      </a>

      <Announcement />
      <TopBar />

      <motion.div
        className={cn(
          "border-b border-white/10 bg-gradient-to-r from-[#081c2c] via-[#0f3e43] to-[#0f766e] text-white transition-shadow",
          scrolled && "shadow-xl shadow-teal-950/20"
        )}
        animate={{
          minHeight: scrolled ? 60 : 76,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={cn(
            "container-page flex items-center justify-between gap-3",
            scrolled ? "h-[60px]" : "h-[76px]"
          )}
        >
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
            aria-label={`${SITE.org} home`}
          >
            {/* Official logo from rurallysmile.org */}
            <Image
              src="/icons/icons.png"
              alt="Rurally Smile Foundation"
              width={200}
              height={105}
              className={cn(
                "h-auto w-auto object-contain drop-shadow-sm transition group-hover:scale-[1.02]",
                scrolled ? "max-h-11" : "max-h-14"
              )}
              priority
            />
            <span className="hidden min-w-0 border-l border-white/20 pl-3 2xl:block">
              <span
                className={cn(
                  "block truncate font-semibold leading-tight text-teal-200",
                  scrolled ? "text-[10px]" : "text-xs"
                )}
              >
                {SITE.titleHindi}
              </span>
              <span className="block truncate text-[10px] text-white/70">
                Pratibha Khoj 2026
              </span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <Navbar />
          </div>
          <div className="hidden min-w-0 flex-1 justify-center md:flex lg:hidden">
            <Navbar compact />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden 2xl:block">
              <HeaderSearch />
            </div>
            <div className="hidden 2xl:block">
              <NotificationBell />
            </div>
            <div className="hidden 2xl:block">
              <ThemeToggle />
            </div>
            <Link href="/admin/login" className="hidden sm:block">
              <Button size="sm" variant="success" className="rounded-pill shadow-sm">
                Admin Login
              </Button>
            </Link>
            <MobileMenu />
          </div>
        </div>
      </motion.div>
    </header>
  );
}
