import Link from "next/link";

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <p className="kicker text-black/50">Our mission</p>
      <h1 className="mt-4 font-display text-6xl leading-[0.95]">To recognize what truly matters.</h1>
      <p className="mt-8 text-xl leading-9 text-black/70">
        Names of Note is a free encyclopedia of people worth knowing — filed, labeled, and searchable. We do not sell ranking. We do not sell a verified mark. We sell a labeled Sponsored slot for people who want to be found faster.
      </p>
      <p className="mt-5 text-lg leading-8 text-black/70">
        Editorial names sit on the record because the world already knows them. Anyone can file a page. A check is requested, not purchased. Boost is marked Sponsored.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/join" className="inline-block rounded-full bg-black px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em] text-[#f6f3ec]">
          File
        </Link>
        <Link href="/boost" className="inline-block rounded-full border border-black px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em]">
          Boost
        </Link>
      </div>
    </article>
  );
}
