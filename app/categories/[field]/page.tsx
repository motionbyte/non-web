import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchDirectory } from "@/lib/api";
import { categories } from "@/lib/editorial";

export const revalidate = 60;

export function generateStaticParams() {
  return categories.map((item) => ({ field: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ field: string }> }): Promise<Metadata> {
  const { field } = await params;
  const item = categories.find((row) => row.slug === field);
  if (!item) return { title: "Field", robots: { index: false, follow: true } };
  return {
    title: item.name,
    description: `${item.name} names on Names of Note — a free encyclopedia of people. Organic order. Sponsored slots labeled.`,
    alternates: { canonical: `/categories/${item.slug}` },
  };
}

export default async function FieldPage({ params }: { params: Promise<{ field: string }> }) {
  const { field } = await params;
  const item = categories.find((row) => row.slug === field);
  if (!item) notFound();
  const { records, featured } = await fetchDirectory({ field: item.slug });
  const names = records.filter((person) => person.field === item.slug);
  const boosted = featured.filter((person) => person.field === item.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">The field</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">{item.name}</h1>
      <p className="mt-3 max-w-xl text-lg text-black/65">Organic order on this desk. Sponsored names stay labeled.</p>
      <p className="mt-4 text-sm text-black/50">
        <Link href="/categories" className="underline underline-offset-4">
          All fields
        </Link>
        {" · "}
        <Link href="/join" className="underline underline-offset-4">
          File a name
        </Link>
      </p>
      {boosted.length ? (
        <p className="mt-8 text-sm text-black/50">
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
        <ul className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {names.map((person) => (
            <li key={person.slug}>
              <Link href={`/people/${person.slug}`} className="flex flex-col py-5 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="font-display text-2xl sm:text-3xl">{person.name}</span>
                <span className="text-sm text-black/50">{person.headline}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-sm text-black/45">No names filed in this field yet.</p>
      )}
    </div>
  );
}
