import Link from "next/link";
import { FOOTER_IMPORTANT, FOOTER_QUICK, SITE } from "@/constants/site";

export function FooterLinks() {
  return (
    <>
      <nav aria-labelledby="footer-quick">
        <h3 id="footer-quick" className="font-heading text-sm font-bold uppercase tracking-wider text-orange-300">
          Quick Links
        </h3>
        <ul className="mt-4 space-y-2">
          {FOOTER_QUICK.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm text-teal-50/80 transition hover:translate-x-1 hover:text-orange-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-labelledby="footer-important">
        <h3 id="footer-important" className="font-heading text-sm font-bold uppercase tracking-wider text-orange-300">
          Important Links
        </h3>
        <ul className="mt-4 space-y-2">
          {FOOTER_IMPORTANT.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm text-teal-50/80 transition hover:translate-x-1 hover:text-orange-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <address className="not-italic">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-orange-300">
          Contact
        </h3>
        <div className="mt-4 space-y-2 text-sm text-teal-50/80">
          <p className="font-semibold text-white">Exam Office</p>
          <p>{SITE.examCentre}</p>
          <p>
            {SITE.district}, {SITE.state}
          </p>
          {SITE.phones.map((phone) => (
            <p key={phone}>
              <a
                href={`tel:${phone}`}
                className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                📞 {phone}
              </a>
            </p>
          ))}
          <p>
            <a
              href={SITE.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              🌐 www.rurallysmile.org
            </a>
          </p>
          <p>
            <a
              href={`mailto:${SITE.email}`}
              className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              ✉ {SITE.email}
            </a>
          </p>
        </div>
      </address>
    </>
  );
}
