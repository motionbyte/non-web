import type { Metadata } from "next";
import Link from "next/link";
import { fetchDirectory } from "@/lib/api";
import { categories } from "@/lib/editorial";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Categories",
  description: "People by field on Names of Note. Organic order. Sponsored names stay labeled.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const { records, featured } = await fetchDirectory();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">The field</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">Categories</h1>
      <p className="mt-3 max-w-xl text-lg text-black/65">Lists by field. Organic order. Sponsored names stay labeled.</p>
      <ol className="mt-12 divide-y divide-black/10 border-y border-black/10">
        {categories.map((item) => {
          const names = records.filter((person) => person.field === item.slug);
          const boosted = featured.filter((person) => person.field === item.slug);
          return (
            <li key={item.slug} id={item.slug} className="scroll-mt-24 py-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <span className="kicker text-black/35">{item.n}</span>
                <h2 className="min-w-0 flex-1 font-display text-3xl sm:text-4xl">{item.name}</h2>
                <Link href={`/categories/${item.slug}`} className="kicker text-black/50">
                  View →
                </Link>
              </div>
              {boosted.length ? (
                <p className="mt-4 text-sm text-black/50">
                  Sponsored:{" "}
                  {boosted.map((person, index) => (
                    <span key={person.slug}>
                      {index ? ", " : ""}
                      <Link href={`/people/${person.slug}`} className="underline">
                        {person.name}
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}
              {names.length ? (
                <ul className="mt-4 space-y-2">
                  {names.map((person) => (
                    <li key={person.slug}>
                      <Link href={`/people/${person.slug}`} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                        <span className="font-display text-2xl">{person.name}</span>
                        <span className="text-sm text-black/50">{person.headline}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-black/45">No names filed in this field yet.</p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
