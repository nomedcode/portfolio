import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteMetadata";

// Static export needs metadata routes opted into static generation.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
