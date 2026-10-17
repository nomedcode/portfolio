import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteMetadata";

// Static export needs metadata routes opted into static generation.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
