import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";
import { SITE } from "@/constants/site";
import { FooterLinks } from "./FooterLinks";
import { Copyright } from "./Copyright";

const social = [
  { Icon: FaFacebookF, href: SITE.social.facebook, label: "Facebook" },
  { Icon: FaInstagram, href: SITE.social.instagram, label: "Instagram" },
  { Icon: FaYoutube, href: SITE.social.youtube, label: "YouTube" },
  { Icon: FaTelegramPlane, href: SITE.social.telegram, label: "Telegram" },
  { Icon: FaWhatsapp, href: SITE.social.whatsapp, label: "WhatsApp" },
] as const;

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-gradient-to-br from-[#071824] via-[#0b3338] to-[#0f766e] text-white"
      role="contentinfo"
    >
      <div className="pointer-events-none absolute -right-28 top-8 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="h-1 bg-gradient-to-r from-orange-500 via-teal-300 to-orange-500" />
      <div className="container-page relative grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <section aria-labelledby="footer-about">
          <Link href="/" className="inline-block">
            <Image
              src="/icons/icons.png"
              alt="Rurally Smile Foundation"
              width={200}
              height={105}
              className="h-16 w-auto object-contain drop-shadow"
            />
          </Link>
          <h2 id="footer-about" className="sr-only">About the Foundation</h2>
          <p className="mt-4 text-sm leading-relaxed text-teal-50/80">
            <strong className="text-white">About:</strong> {SITE.mission}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-teal-50/80">
            <strong className="text-white">Mission:</strong> {SITE.slogan}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-teal-50/80">
            <strong className="text-white">Vision:</strong> {SITE.vision}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {social.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:-translate-y-1 hover:border-orange-300 hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                <Icon size={16} aria-hidden />
              </a>
            ))}
          </div>
        </section>

        <FooterLinks />
      </div>

      <Copyright />
    </footer>
  );
}
