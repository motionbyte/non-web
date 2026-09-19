import type { Metadata } from "next";
import Link from "next/link";
import { NamesField } from "@/components/NamesField";
import { fetchDirectory } from "@/lib/api";
import { categories, encyclopedia } from "@/lib/editorial";
import { SITE_DESCRIPTION } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Names of Note" },
  description: SITE_DESCRIPTION,
};

const desks = [
  { href: "/directory", kicker: "01", name: "Directory", dek: "Every name on the desk, searchable." },
  { href: "/categories", kicker: "02", name: "Fields", dek: "Nine lists. Organic order." },
  { href: "/stories", kicker: "03", name: "Stories", dek: "Longer entries, still on the record." },
  { href: "/join", kicker: "04", name: "File", dek: "Open a public page. Free. Not a Wikipedia article for sale." },
];

export default async function HomePage() {
  const { records } = await fetchDirectory();
  const names = [...encyclopedia.map((person) => person.name), ...records.map((person) => person.name)];

  return (
    <div className="relative isolate">
      <NamesField names={names} />

      <section className="relative">
        <div className="mx-auto flex min-h-[calc(100dvh-5.5rem)] max-w-[90rem] flex-col justify-start px-4 pb-12 pt-5 sm:min-h-[calc(100dvh-4.5rem)] sm:px-6 sm:pb-16 sm:pt-8">
          <h1 className="text-center font-display text-[clamp(3.5rem,16vw,18rem)] leading-[0.82] tracking-[-0.06em] sm:text-[clamp(5.5rem,20vw,18rem)] sm:leading-[0.8]">
            Names
            <br />
            of Note
          </h1>

          <p className="mt-4 text-center font-display text-[1.15rem] italic text-black/58 sm:mt-5 sm:text-[1.65rem]">
            The free encyclopedia of people.
          </p>
          <p className="mx-auto mt-2 max-w-md px-1 text-center text-sm leading-6 text-black/48">
            File a public page. Wikipedia has notability rules — this desk does not sell a Wikipedia article. Ranking is organic.
          </p>

          <div className="mx-auto mt-5 w-full max-w-2xl border border-black/25 bg-[#f6f3ec]/92 sm:mt-6">
            <form action="/directory" method="get" className="flex min-h-[3.25rem]">
              <label className="block min-w-0 flex-1">
                <span className="sr-only">Search the encyclopedia</span>
                <input
                  name="q"
                  placeholder="Search a name"
                  className="w-full bg-transparent px-3 py-3 text-base outline-none sm:px-4 sm:py-3.5 sm:text-lg"
                  autoComplete="off"
                />
              </label>
              <button type="submit" className="shrink-0 bg-black px-4 font-ui text-[10px] uppercase tracking-[0.18em] text-[#f6f3ec] sm:px-6 sm:text-[11px] sm:tracking-[0.2em]">
                Search
              </button>
            </form>

            <nav aria-label="Fields" className="border-t border-black/15 px-4 py-4 sm:px-5">
              <p className="kicker text-center text-black/32">Or open a field</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2.5">
                {categories.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/categories/${item.slug}`} className="group inline-flex items-baseline gap-1.5">
                      <span className="kicker text-[10px] text-black/28">{item.n}</span>
                      <span className="font-display text-[1.12rem] leading-none italic tracking-[-0.03em] text-black/72 underline-offset-4 group-hover:text-black group-hover:underline">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      <section className="relative border-t border-black/10">
        <div className="mx-auto grid max-w-6xl gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
          {desks.map((desk) => (
            <Link key={desk.href} href={desk.href} className="bg-[#f6f3ec]/92 px-5 py-8 sm:px-6">
              <p className="kicker text-black/40">{desk.kicker}</p>
              <p className="mt-3 font-display text-3xl leading-none">{desk.name}</p>
              <p className="mt-3 max-w-[14rem] text-sm leading-6 text-black/55">{desk.dek}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
