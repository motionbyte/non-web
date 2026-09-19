import { categories, editorialBySlug, encyclopedia, type EditorialName } from "@/lib/editorial";

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4010";

export type Lane = "editorial" | "filed" | "sponsored";

export type RecordItem = {
  slug: string;
  name: string;
  headline: string;
  dek: string;
  body: string[];
  achievements: { text: string; verified: boolean }[];
  verified: boolean;
  lane: Lane;
  field?: string;
  category?: string;
  city?: string;
  country?: string;
  origin?: string;
  building?: string;
  story?: string;
  featuredUntil?: string | null;
  badgeYear: number;
  needsReview?: boolean;
  protected?: boolean;
  ownerUserId?: string | null;
  createdBy?: string | null;
  currentRevisionId?: string | null;
  revisionCount?: number;
  references?: { title: string; url?: string; author?: string }[];
  tags?: string[];
  website?: string;
  protectionLevel?: string;
  protectionReason?: string;
  linkedinPost: string;
  pullQuote: string;
  interview?: string;
  coverLine?: string;
  photoDataUrl?: string;
  photo?: string;
  honor?: string;
  quote?: string;
  issueNo?: number;
  pages?: { kicker: string; title: string; body: string }[];
};

export type Sku = { id: string; name: string; label: string; blurb: string };

export function laneLabel(lane: Lane) {
  if (lane === "editorial") return "On the record";
  if (lane === "sponsored") return "Sponsored";
  return "Filed";
}

export function editorialToRecord(person: EditorialName): RecordItem {
  return {
    slug: person.slug,
    name: person.name,
    headline: person.headline,
    dek: person.dek,
    body: person.body,
    achievements: person.achievements,
    verified: true,
    lane: "editorial",
    field: person.field,
    category: person.fieldLabel,
    featuredUntil: null,
    badgeYear: 2026,
    linkedinPost: `${person.name} — on the record at Names of Note.`,
    pullQuote: person.quote || person.dek,
    coverLine: person.headline,
    photo: person.photo,
    honor: person.honor,
    quote: person.quote,
  };
}

function matchesField(row: RecordItem, field?: string) {
  if (!field) return true;
  return row.field === field;
}

function matchesQuery(row: RecordItem, q?: string) {
  if (!q) return true;
  const hay = [row.name, row.headline, row.dek, row.category, row.city, row.country, row.field].join(" ").toLowerCase();
  return hay.includes(q.toLowerCase());
}

export function mergeDirectory(filed: RecordItem[], query?: { field?: string; q?: string }) {
  const editorial = encyclopedia.map(editorialToRecord);
  const seen = new Set(filed.map((row) => row.slug));
  const editorialHits = editorial.filter(
    (row) => !seen.has(row.slug) && matchesField(row, query?.field) && matchesQuery(row, query?.q),
  );
  return [...editorialHits, ...filed];
}

export function editorialSearchHits(q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return encyclopedia
    .map(editorialToRecord)
    .filter((row) => matchesQuery(row, needle))
    .map((row) => ({
      type: "person" as const,
      slug: row.slug,
      title: row.name,
      description: row.dek,
      category: row.category,
    }));
}

export function fieldLabel(slug?: string) {
  return categories.find((item) => item.slug === slug)?.name || slug || "";
}

export async function fetchRecords(query?: { field?: string; q?: string }) {
  const params = new URLSearchParams();
  if (query?.field) params.set("field", query.field);
  if (query?.q) params.set("q", query.q);
  const suffix = params.toString() ? `?${params}` : "";
  const res = await fetch(`${API}/v1/records${suffix}`, { cache: "no-store" });
  if (!res.ok) return { records: [] as RecordItem[], featured: [] as RecordItem[] };
  return (await res.json()) as { records: RecordItem[]; featured: RecordItem[] };
}

export async function fetchDirectory(query?: { field?: string; q?: string }) {
  const { records, featured } = await fetchRecords(query);
  return { records: mergeDirectory(records, query), featured };
}

export async function fetchRecord(slug: string) {
  const res = await fetch(`${API}/v1/records/${slug}`, { cache: "no-store" });
  if (res.ok) {
    const data = (await res.json()) as { record: RecordItem };
    return { ...data.record, lane: data.record.lane || "filed" };
  }
  const editorial = editorialBySlug(slug);
  return editorial ? editorialToRecord(editorial) : null;
}

export async function fetchSkus() {
  const res = await fetch(`${API}/v1/catalog`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as { skus: Sku[] };
  return data.skus;
}
