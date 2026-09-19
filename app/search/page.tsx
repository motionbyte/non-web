import type { Metadata } from "next";
import Link from "next/link";
import { editorialSearchHits } from "@/lib/api";

export const dynamic = "force-dynamic";

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4010";

export const metadata: Metadata = {
  title: "Search",
};

type Result = { type: string; slug?: string; username?: string; title: string; description?: string; category?: string; updatedAt?: string };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const { q = "", type = "all" } = await searchParams;
  let results: Result[] = [];
  if (q) {
    try {
      const params = new URLSearchParams({ q, type });
      const res = await fetch(`${API}/v1/search?${params}`, { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { results: Result[] };
        results = data.results || [];
      }
    } catch {
      results = [];
    }
    if (type === "all" || type === "person") {
      const seen = new Set(results.filter((item) => item.type === "person").map((item) => item.slug));
      results = [...editorialSearchHits(q).filter((item) => !seen.has(item.slug)), ...results];
    }
  }

  function href(item: Result) {
    if (item.type === "person" && item.slug) return `/people/${item.slug}`;
    if (item.type === "user" && item.username) return `/user/${item.username}`;
    if (item.type === "category" && item.slug) return `/directory?field=${item.slug}`;
    return "/directory";
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">Search</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">Look up.</h1>
      <p className="mt-3 text-lg text-black/65">People, fields, and contributors.</p>
      <form action="/search" method="get" className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label className="block flex-1 text-sm">
          <span className="sr-only">Search</span>
          <input name="q" defaultValue={q} placeholder="A name, a field, a contributor" className="w-full border border-black/20 bg-transparent px-3 py-2" />
        </label>
        <button type="submit" className="rounded-full bg-black px-5 py-2 font-ui text-[11px] uppercase tracking-[0.18em] text-[#f6f3ec]">
          Search
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        {["all", "person", "users", "categories"].map((item) => (
          <Link key={item} href={q ? `/search?q=${encodeURIComponent(q)}&type=${item}` : `/search?type=${item}`} className="underline underline-offset-4">
            {item === "person" ? "People" : item[0].toUpperCase() + item.slice(1)}
          </Link>
        ))}
      </div>
      <ul className="mt-12 space-y-5">
        {q && !results.length ? <li className="text-sm text-black/50">No results. Try another spelling, or file the name.</li> : null}
        {results.map((item) => (
          <li key={`${item.type}-${item.slug || item.username || item.title}`} className="border-b border-black/10 pb-4">
            <p className="kicker text-black/40">{item.type}</p>
            <Link href={href(item)} className="mt-1 block font-display text-3xl hover:opacity-60">
              {item.title}
            </Link>
            <p className="mt-2 text-sm text-black/55">{item.description}</p>
          </li>
        ))}
      </ul>
      {q && !results.length ? (
        <p className="mt-8 text-sm">
          <Link href="/join" className="underline underline-offset-4">
            File this name
          </Link>
        </p>
      ) : null}
    </div>
  );
}
