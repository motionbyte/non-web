import type { RecordItem } from "@/lib/api";

export type ArticleSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48) || "section";
}

export function articleLead(record: RecordItem) {
  return record.body[0] || record.dek;
}

export function articleSections(record: RecordItem): ArticleSection[] {
  const sections: ArticleSection[] = [];
  const used = new Set<string>();

  function add(title: string, paragraphs: string[]) {
    const text = paragraphs.map((p) => p.trim()).filter(Boolean);
    if (!text.length) return;
    let id = slugify(title);
    if (used.has(id)) id = `${id}-${used.size}`;
    used.add(id);
    sections.push({ id, title, paragraphs: text });
  }

  if (record.pages?.length) {
    for (const page of record.pages) {
      const title = page.title === record.name ? page.kicker || "The record" : page.title;
      add(title, [page.body]);
    }
  } else {
    add("The work", record.body.slice(1));
  }

  if (record.quote) add("In their words", [`“${record.quote}”`]);
  if (record.lane === "filed") add("On this desk", ["This page is a free filing. Verified is a check, not a purchase."]);
  if (record.lane === "sponsored") add("On this desk", ["Sponsored on this desk, labeled. Ranking and verified are not for sale."]);

  return sections;
}

export function infoboxRows(record: RecordItem) {
  const rows: { label: string; value: string }[] = [];
  if (record.headline) rows.push({ label: "Occupation", value: record.headline });
  if (record.category || record.field) rows.push({ label: "Field", value: record.category || record.field || "" });
  if (record.honor) rows.push({ label: "Honor", value: record.honor });
  const place = [record.city, record.country].filter(Boolean).join(", ");
  if (place) rows.push({ label: "Place", value: place });
  if (record.achievements[0]?.text) rows.push({ label: "Known for", value: record.achievements[0].text });
  const status = [record.lane === "editorial" ? "On the record" : record.lane === "sponsored" ? "Sponsored" : "Filed", record.verified ? "Verified" : ""]
    .filter(Boolean)
    .join(" · ");
  if (status) rows.push({ label: "Status", value: status });
  return rows;
}
