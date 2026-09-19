import type { MetadataRoute } from "next";
import { encyclopedia } from "@/lib/editorial";

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4010";
const site = process.env.NEXT_PUBLIC_SITE_URL || "https://namesofnote.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = ["", "/directory", "/categories", "/stories", "/about", "/contact"].map((path) => ({
    url: `${site}${path || "/"}`,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));
  const editorialPages: MetadataRoute.Sitemap = encyclopedia.map((person) => ({
    url: `${site}/people/${person.slug}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }));
  try {
    const res = await fetch(`${API}/v1/sitemap`, { next: { revalidate: 60 } });
    if (!res.ok) return [...staticPages, ...editorialPages];
    const data = (await res.json()) as { pages: { slug: string; updatedAt?: string }[] };
    const seen = new Set(encyclopedia.map((person) => person.slug));
    const people = (data.pages || [])
      .filter((page) => !seen.has(page.slug))
      .map((page) => ({
        url: `${site}/people/${page.slug}`,
        lastModified: page.updatedAt ? new Date(page.updatedAt) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    return [...staticPages, ...editorialPages, ...people];
  } catch {
    return [...staticPages, ...editorialPages];
  }
}
