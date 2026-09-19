import { Form } from "@/components/Form";
import { getMe } from "@/lib/session";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ApplyPage() {
  const me = await getMe();
  if (!me) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="kicker text-black/50">Become a name of note</p>
        <h1 className="mt-4 font-display text-6xl">File.</h1>
        <p className="mt-3 text-lg text-black/65">A free page in the encyclopedia. Sign in first so the filing is attributed.</p>
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
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="kicker text-black/50">Become a name of note</p>
      <h1 className="mt-4 font-display text-6xl">File.</h1>
      <p className="mt-3 text-lg text-black/65">A free page in the encyclopedia. Search first so we do not file the same name twice. Verified is a check, not a purchase.</p>
      <div className="mt-8">
        <Form skus={[]} fields={["headline", "category", "city", "country", "achievements", "origin", "building"]} submitLabel="File" signedIn defaultName={me.user.name} />
      </div>
      <p className="mt-8 text-sm text-black/50">
        Want a labeled slot on lists? <Link href="/boost" className="underline">Boost</Link>.
      </p>
    </div>
  );
}
