import type { Metadata } from "next";
import { Form } from "@/components/Form";
import { getMe } from "@/lib/session";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "File a page",
  description: "Create a public encyclopedia page on Names of Note. Wikipedia notability is theirs. Filing here is free, attributed, and open to search.",
  alternates: { canonical: "/join" },
};

export default async function ApplyPage() {
  const me = await getMe();
  if (!me) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        <p className="kicker text-black/50">Become a name of note</p>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl">File.</h1>
        <p className="mt-3 text-lg text-black/65">
          A free public encyclopedia page. Not a Wikipedia article. Sign in first so the filing is attributed.
        </p>
        <p className="mt-3 text-sm leading-6 text-black/50">
          <Link href="/about/wikipedia" className="underline underline-offset-4">
            Wikipedia and this desk
          </Link>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/sign-in?next=/join" className="rounded-full bg-black px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em] text-[#f6f3ec]">
            Sign in
          </Link>
          <Link href="/sign-up?next=/join" className="rounded-full border border-black px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em]">
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">Become a name of note</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">File.</h1>
      <p className="mt-3 text-lg text-black/65">
        A free public encyclopedia page. Search first so we do not file the same name twice. Write who they are — that lead is what search can fetch. Verified is a check, not a purchase.
      </p>
      <div className="mt-8">
        <Form skus={[]} fields={["headline", "category", "city", "country", "achievements", "origin", "building"]} submitLabel="File" signedIn defaultName={me.user.name} />
      </div>
      <p className="mt-8 text-sm text-black/50">
        Want a labeled slot on lists? <Link href="/boost" className="underline">Boost</Link>
        {" · "}
        <Link href="/about/wikipedia" className="underline">
          Wikipedia
        </Link>
        .
      </p>
    </div>
  );
}
