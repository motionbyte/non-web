import type { Metadata } from "next";
import Link from "next/link";
import { fetchDirectory } from "@/lib/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Stories",
  description: "Longer entries on Names of Note, still on the record.",
  alternates: { canonical: "/stories" },
};

export default async function StoriesPage() {
  const { records } = await fetchDirectory();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">On the record</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">Stories</h1>
      <ul className="mt-12 divide-y divide-black/10 border-y border-black/10">
        {records.map((person) => (
          <li key={person.slug}>
            <Link href={`/people/${person.slug}`} className="block py-8">
              <p className="kicker text-black/40">{person.headline}</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">{person.name}</h2>
              <p className="mt-3 max-w-2xl text-lg text-black/65">{person.dek}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
