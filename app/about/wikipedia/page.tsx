import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wikipedia and Names of Note",
  description:
    "Names of Note is a free encyclopedia of people. We do not create, edit, or sell Wikipedia articles. File a public page here instead.",
  alternates: { canonical: "/about/wikipedia" },
};

export default function WikipediaPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">The other desk</p>
      <h1 className="mt-4 font-display text-4xl leading-[0.95] sm:text-6xl">Wikipedia is not for sale. Neither is ranking here.</h1>
      <p className="mt-8 text-xl leading-9 text-black/70">
        If you searched how to create a Wikipedia page, you are in the right place to understand the split — and the wrong place if you want someone to bypass Wikipedia&apos;s rules.
      </p>

      <section className="mt-12 space-y-5 text-lg leading-8 text-black/70">
        <h2 className="font-display text-3xl leading-none text-black">What Wikipedia is</h2>
        <p>
          Wikipedia is a volunteer encyclopedia with notability guidelines. Many people — founders, professionals, public figures still becoming known — will not get an article there, or will have one deleted. That is their policy. We do not edit Wikipedia, we do not sell a Wikipedia page, and we do not claim we can get you one.
        </p>
      </section>

      <section className="mt-12 space-y-5 text-lg leading-8 text-black/70">
        <h2 className="font-display text-3xl leading-none text-black">What Names of Note is</h2>
        <p>
          A free encyclopedia of people. You file a page. It lives at a public URL on this desk. Search engines can crawl it. Ranking on lists here is organic. Verified is a check, not a purchase. Boost is a labeled Sponsored slot.
        </p>
        <p>File if you want a public record of a name. Do not file if you want us to impersonate Wikipedia.</p>
      </section>

      <section className="mt-12 space-y-5 text-lg leading-8 text-black/70">
        <h2 className="font-display text-3xl leading-none text-black">After you file</h2>
        <p>
          Published pages are listed in the sitemap and announced to search indexes. A page still needs a real lead — who the person is, in their own words — so it is worth fetching. Empty names do not help you, and they do not help this desk.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/join" className="inline-block rounded-full bg-black px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em] text-[#f6f3ec]">
          File a page
        </Link>
        <Link href="/about" className="inline-block rounded-full border border-black px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em]">
          About
        </Link>
      </div>
    </article>
  );
}
