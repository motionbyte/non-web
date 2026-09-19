import { Form } from "@/components/Form";
import { fetchSkus } from "@/lib/api";
import { getMe } from "@/lib/session";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BoostPage() {
  const me = await getMe();
  if (!me) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="kicker text-black/50">Visibility</p>
        <h1 className="mt-4 font-display text-6xl">Boost.</h1>
        <p className="mt-3 text-lg text-black/65">A labeled Sponsored slot. Sign in so Boost attaches to your page, not someone else&apos;s.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/sign-in?next=/boost" className="rounded-full bg-black px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em] text-[#f6f3ec]">
            Sign in
          </Link>
          <Link href="/sign-up?next=/boost" className="rounded-full border border-black px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em]">
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  const skus = await fetchSkus();
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="kicker text-black/50">Visibility</p>
      <h1 className="mt-4 font-display text-6xl">Boost.</h1>
      <p className="mt-3 text-lg text-black/65">
        A labeled Sponsored slot on this desk. It does not change ranking or verified.
        {me.record ? ` This will mark ${me.record.name} as Sponsored.` : " You can file and boost in one step."}
      </p>
      <div className="mt-8">
        <Form
          skus={skus}
          fields={me.record ? [] : ["headline", "category", "city", "country", "achievements", "origin", "building"]}
          submitLabel="Boost"
          signedIn
          defaultName={me.record?.name || me.user.name}
        />
      </div>
      <p className="mt-8 text-sm text-black/50">
        Just need a page? <Link href="/join" className="underline">File for free</Link>.
      </p>
    </div>
  );
}
