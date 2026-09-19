import Link from "next/link";
import { fetchDirectory, fieldLabel, laneLabel, type RecordItem } from "@/lib/api";
import { categories } from "@/lib/editorial";

export const dynamic = "force-dynamic";

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ field?: string; q?: string }>;
}) {
  const { field, q } = await searchParams;
  const query = { field: field || undefined, q: q || undefined };
  const { records, featured } = await fetchDirectory(query);
  const activeField = fieldLabel(field);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="kicker text-black/50">The record</p>
      <h1 className="mt-4 font-display text-6xl">Directory</h1>
      <p className="mt-3 max-w-xl text-lg text-black/65">
        A free encyclopedia of people worth knowing. Ranking is organic. Sponsored slots are labeled.
      </p>

      <form action="/directory" method="get" className="mt-8 flex flex-col gap-3 sm:flex-row">
        {field ? <input type="hidden" name="field" value={field} /> : null}
        <label className="block flex-1 text-sm">
          <span className="sr-only">Search names</span>
          <input
            name="q"
            defaultValue={q || ""}
            placeholder="Search a name, city, or field"
            className="w-full border border-black/20 bg-transparent px-3 py-2"
          />
        </label>
        <button type="submit" className="rounded-full bg-black px-5 py-2 font-ui text-[11px] uppercase tracking-[0.18em] text-[#f6f3ec]">
          Search
        </button>
      </form>

      {field ? (
        <p className="mt-4 font-ui text-[11px] uppercase tracking-[0.16em] text-black/50">
          {activeField}
          {" · "}
          <Link href={q ? `/directory?q=${encodeURIComponent(q)}` : "/directory"} className="underline">
            All fields
          </Link>
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {categories.map((item) => (
            <Link key={item.slug} href={`/directory?field=${item.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className="kicker text-black/50 hover:text-black">
              {item.name}
            </Link>
          ))}
        </div>
      )}

      {featured.length ? (
        <section className="mt-12 border border-black/15 px-4 py-5 sm:px-6">
          <p className="kicker text-black/45">Sponsored</p>
          <ul className="mt-4 divide-y divide-black/10">
            {featured.map((person) => (
              <PersonRow key={`featured-${person.slug}`} person={person} sponsored />
            ))}
          </ul>
        </section>
      ) : null}

      <ol className="mt-12 divide-y divide-black/10 border-y border-black/10">
        {records.map((person) => (
          <li key={person.slug}>
            <PersonRow person={person} />
          </li>
        ))}
      </ol>
      {records.length === 0 ? <p className="mt-8 text-black/55">No names match that search.</p> : null}
    </div>
  );
}

function PersonRow({ person, sponsored }: { person: RecordItem; sponsored?: boolean }) {
  return (
    <Link href={`/people/${person.slug}`} className="flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between">
      <span className="font-display text-3xl">{person.name}</span>
      <span className="text-black/55">
        {sponsored ? "Sponsored · " : person.lane === "editorial" ? `${laneLabel(person.lane)} · ` : ""}
        {person.headline}
      </span>
    </Link>
  );
}
