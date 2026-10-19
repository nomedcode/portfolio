import { credlyBadge, education, profile, skillCategories } from "./content";
import { siteUrl } from "./siteMetadata";

const pageUrl = `${siteUrl}/`;
export const personId = `${pageUrl}#person`;
export const websiteId = `${pageUrl}#website`;
export const profilePageId = `${pageUrl}#page`;

type JsonLd = Record<string, unknown>;

// Everything here comes from content.ts, so the markup cannot claim anything the page does not show.
export function structuredData(): JsonLd {
  const university =
    education.find((item) => item.id === "binus") ?? education[0];

  const knowsAbout = [
    ...new Set([...skillCategories.map((c) => c.name), "Cloud Computing"]),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.fullName,
        alternateName: profile.name,
        url: pageUrl,
        jobTitle: "Cloud Engineering Student",
        description: `Computer Science student at ${university.school}, Cloud Technology stream.`,
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: university.school,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bandung",
          addressCountry: "ID",
        },
        sameAs: profile.socials.map((social) => social.url),
        knowsAbout,
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          name: credlyBadge.name,
          url: credlyBadge.url,
          credentialCategory: "certificate",
          recognizedBy: {
            "@type": "Organization",
            name: credlyBadge.issuer,
          },
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: pageUrl,
        name: profile.fullName,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": profilePageId,
        url: pageUrl,
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
      },
    ],
  };
}

// JSON.stringify output is safe for a <script> body once "<" is escaped, which also covers "</script".
export function structuredDataScript(): string {
  return JSON.stringify(structuredData()).replace(/</g, "\\u003c");
}
