import type { Metadata } from "next";
import Link from "next/link";
import { fetchRecord, fieldLabel, laneLabel } from "@/lib/api";
import { articleLead, articleSections, infoboxRows } from "@/lib/article";
import { Portrait } from "@/components/Portrait";
import { PersonTalk, PersonTools } from "@/components/PersonTools";
import { indexableRecord, personDescription, personJsonLd, SITE_URL } from "@/lib/seo";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const record = await fetchRecord(slug);
  if (!record) return { title: "Not on this desk", robots: { index: false, follow: false } };
  const description = personDescription(record);
  const url = `${SITE_URL}/people/${record.slug}`;
  const image = record.photo && !record.photo.startsWith("data:") ? record.photo : undefined;
  const index = indexableRecord(record);
  return {
    title: record.name,
    description,
    alternates: { canonical: url },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "profile",
      title: `${record.name} — Names of Note`,
      description,
      url,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${record.name} — Names of Note`,
      description,
    },
  };
}

export default async function DetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = await fetchRecord(slug);
  if (!record) notFound();

  const photo = record.photo || record.photoDataUrl;
  const lead = articleLead(record);
  const sections = articleSections(record);
  const facts = infoboxRows(record);
  const locked = Boolean(record.protected);
  const jsonLd = personJsonLd(record);
  const toc = [
    { id: "top", title: lead ? "The name" : "Top" },
    ...sections.map((section) => ({ id: section.id, title: section.title })),
    { id: "talk", title: "Talk" },
  ];

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="kicker text-black/45">
        {laneLabel(record.lane)}
        {record.verified ? " · Verified" : ""}
        {record.needsReview ? " · Needs review" : ""}
        {locked ? " · Locked" : ""}
        {record.field ? ` · ${fieldLabel(record.field)}` : ""}
      </p>
      <h1 id="top" className="mt-3 scroll-mt-28 font-display text-5xl leading-[0.92] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
        {record.name}
      </h1>
      <p className="mt-4 max-w-2xl font-display text-xl italic leading-snug text-black/60 sm:text-2xl">{record.dek}</p>
      <PersonTools slug={record.slug} filed={record.lane === "filed"} />

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[11rem_minmax(0,1fr)_16rem] lg:gap-10">
        <Contents items={toc} />

        <div>
          <Infobox name={record.name} photo={photo} facts={facts} className="mb-8 lg:hidden" />
          <div className="article-body max-w-2xl space-y-5 text-[1.05rem] leading-8 text-black/80">
            {lead ? <p>{lead}</p> : null}
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28 border-t border-black/10 pt-8">
                <h2 className="font-display text-3xl leading-none">{section.title}</h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 28)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          {record.references?.length ? (
            <section className="mt-10 max-w-2xl border-t border-black/10 pt-8">
              <h2 className="font-display text-3xl leading-none">References</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-black/70">
                {record.references.map((item) => (
                  <li key={`${item.title}-${item.url}`}>
                    {item.url ? (
                      <a href={item.url} className="underline underline-offset-4" rel="nofollow noopener noreferrer">
                        {item.title || item.url}
                      </a>
                    ) : (
                      item.title
                    )}
                    {item.author ? ` — ${item.author}` : ""}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
          <PersonTalk slug={record.slug} />
        </div>

        <Infobox name={record.name} photo={photo} facts={facts} className="hidden lg:block" sticky />
      </div>
    </article>
  );
}

function Contents({ items }: { items: { id: string; title: string }[] }) {
  return (
    <nav aria-label="Contents" className="lg:sticky lg:top-24">
      <details className="border border-black/15 lg:border-0" open>
        <summary className="cursor-pointer px-4 py-3 lg:cursor-default lg:px-0 lg:py-0">
          <p className="kicker text-black/40">Contents</p>
        </summary>
        <ol className="space-y-3 px-4 pb-4 pt-1 lg:mt-5 lg:px-0 lg:pb-0">
          {items.map((item, index) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="group flex items-baseline gap-3">
                <span className="kicker text-black/30">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-display text-lg leading-tight group-hover:opacity-60">{item.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}

function Infobox({
  name,
  photo,
  facts,
  className = "",
  sticky = false,
}: {
  name: string;
  photo?: string;
  facts: { label: string; value: string }[];
  className?: string;
  sticky?: boolean;
}) {
  return (
    <aside className={`${sticky ? "lg:sticky lg:top-24" : ""} ${className}`}>
      <div className="border border-black/15 bg-[#f6f3ec]">
        <p className="border-b border-black/10 px-4 py-3 text-center font-display text-2xl leading-none">{name}</p>
        {photo ? (
          <div className="relative aspect-[4/5] bg-black/5">
            <Portrait src={photo} alt={name} sizes="(max-width: 1024px) 100vw, 288px" priority />
          </div>
        ) : null}
        <dl>
          {facts.map((row) => (
            <div key={row.label} className="grid grid-cols-[6.5rem_1fr] gap-3 border-t border-black/10 px-4 py-3">
              <dt className="kicker pt-0.5 text-black/40">{row.label}</dt>
              <dd className="text-[15px] leading-6">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
