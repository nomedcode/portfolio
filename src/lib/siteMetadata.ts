import type { Metadata } from "next";
import { profile } from "./content";

// The apex 308-redirects to www, so the canonical and og:url must name the host that serves 200 directly.
export const siteUrl = "https://www.faiq.codes";

// The title says whose page it is and what it is.
const title = `${profile.fullName} | Personal Portfolio`;
const description =
  "Cloud engineering student at BINUS University in Bandung. AWS re/Start learner with a Google Cloud Computing Foundations certificate.";

// Relative URLs below (canonical, og:url and the generated opengraph-image) resolve against metadataBase.
export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.fullName,
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
