import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Names of Note is a free encyclopedia of people. File a public page. We do not sell ranking, verified, or a Wikipedia article.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">Our mission</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl leading-[0.95]">To recognize what truly matters.</h1>
      <p className="mt-8 text-xl leading-9 text-black/70">
        Names of Note is a free encyclopedia of people worth knowing — filed, labeled, and searchable. We do not sell ranking. We do not sell a verified mark. We sell a labeled Sponsored slot for people who want to be found faster.
      </p>
      <p className="mt-5 text-lg leading-8 text-black/70">
        Editorial names sit on the record because the world already knows them. Anyone can file a page. A check is requested, not purchased. Boost is marked Sponsored.
      </p>
      <p className="mt-5 text-lg leading-8 text-black/70">
        People who want a Wikipedia page often cannot get one — notability is theirs, and we do not skip it. Filing here opens a public encyclopedia URL that search engines can fetch. That is the product.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/join" className="inline-block rounded-full bg-black px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em] text-[#f6f3ec]">
          File
        </Link>
        <Link href="/about/wikipedia" className="inline-block rounded-full border border-black px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em]">
          Wikipedia
        </Link>
        <Link href="/boost" className="inline-block rounded-full border border-black px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em]">
          Boost
        </Link>
      </div>
    </article>
  );
}
