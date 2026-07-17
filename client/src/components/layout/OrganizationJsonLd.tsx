import { SITE } from "@/constants/site";

/** Organization + WebSite JSON-LD for SEO */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE.org,
        url: SITE.website,
        logo: "/icons/icons.png",
        email: SITE.email,
        telephone: SITE.phones.map((p) => `+91${p}`),
        sameAs: [
          SITE.social.facebook,
          SITE.social.instagram,
          SITE.social.youtube,
          SITE.social.telegram,
          SITE.social.whatsapp,
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE.district,
          addressRegion: SITE.state,
          addressCountry: "IN",
        },
      },
      {
        "@type": "WebSite",
        name: SITE.name,
        url: "/",
        inLanguage: ["hi", "en"],
        potentialAction: {
          "@type": "SearchAction",
          target: "/notice?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Event",
        name: SITE.titleHindi,
        startDate: "2026-09-05",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: SITE.examCentre,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Ratnpura",
            addressRegion: "Bihar",
            addressCountry: "IN",
          },
        },
        organizer: {
          "@type": "Organization",
          name: SITE.org,
          url: SITE.website,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
