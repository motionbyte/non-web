import type { RecordItem } from "@/lib/api";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://namesofnote.com";

export const INDEXNOW_KEY = "c4e8f1a29b6d47c0a3158e7d2f90b4c6";

export const SITE_DESCRIPTION =
  "File a public encyclopedia page. Names of Note is a free encyclopedia of people — not a Wikipedia article for sale. Ranking is organic. Sponsored slots are labeled.";

export function personDescription(record: RecordItem) {
  const who = record.headline ? `${record.name} is a ${record.headline}.` : `${record.name}.`;
  const rest = record.dek ? ` ${record.dek}` : "";
  return `${who}${rest} Public page on Names of Note.`.replace(/\s+/g, " ").trim().slice(0, 160);
}

export function indexableRecord(record: RecordItem) {
  if (record.lane === "editorial") return true;
  const blob = [record.headline, record.dek, record.origin, record.building, ...(record.body || [])].join(" ").replace(/\s+/g, " ").trim();
  return blob.length >= 80;
}

export function personJsonLd(record: RecordItem) {
  const photo = record.photo && !record.photo.startsWith("data:") ? (record.photo.startsWith("http") ? record.photo : `${SITE_URL}${record.photo}`) : undefined;
  const sameAs = record.website && /^https?:\/\//i.test(record.website) ? [record.website] : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: record.name,
    description: record.dek || record.headline,
    jobTitle: record.headline || undefined,
    image: photo,
    url: `${SITE_URL}/people/${record.slug}`,
    sameAs,
    ...(record.city || record.country
      ? { homeLocation: { "@type": "Place", name: [record.city, record.country].filter(Boolean).join(", ") } }
      : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Names of Note",
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/directory?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        name: "Names of Note",
        url: SITE_URL,
        description: "A free encyclopedia of people. File a public page. Wikipedia notability is theirs.",
      },
    ],
  };
}
