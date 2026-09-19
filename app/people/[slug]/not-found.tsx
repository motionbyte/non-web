import Link from "next/link";

export default function PersonNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="kicker text-black/50">Missing</p>
      <h1 className="mt-4 font-display text-6xl">This name is not filed.</h1>
      <p className="mt-4 text-lg text-black/65">No encyclopedia page matches that address. Search similar names, or file it.</p>
      <form action="/directory" method="get" className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label className="block flex-1 text-sm">
          <span className="sr-only">Search names</span>
          <input name="q" placeholder="Search a name" className="w-full border border-black/20 bg-transparent px-3 py-2" />
        </label>
        <button type="submit" className="rounded-full bg-black px-5 py-2 font-ui text-[11px] uppercase tracking-[0.18em] text-[#f6f3ec]">
          Search
        </button>
      </form>
      <p className="mt-8 text-sm text-black/55">
        <Link href="/join" className="underline underline-offset-4">
          File this name
        </Link>
        {" · "}
        <Link href="/directory" className="underline underline-offset-4">
          Open the directory
        </Link>
      </p>
    </div>
  );
}
