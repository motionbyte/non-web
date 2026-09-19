import type { MetadataRoute } from "next";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://namesofnote.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/desk", "/moderation", "/sign-in", "/sign-up", "/settings", "/watchlist", "/boost"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
  };
}
