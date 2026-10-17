import type { Metadata } from "next";
import { profile } from "./content";

// The apex 308-redirects to www, so the canonical and og:url must name the host that serves 200 directly.
export const siteUrl = "https://www.faiq.codes";

const title = `${profile.fullName} — Portfolio`;
const description = `Projects, skills, awards, certificates, and education of ${profile.fullName}.`;

// Relative URLs below (canonical, og:url and the generated opengraph-image) resolve against metadataBase.
export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${profile.fullName} — Portfolio`,
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};
