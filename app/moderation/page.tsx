import type { Metadata } from "next";
import Link from "next/link";
import { moderationAct } from "@/app/actions/auth";
import { apiGet, getMe, isMod } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Moderation",
  robots: { index: false, follow: false },
};

type Queue = {
  filings: { slug: string; name: string; headline: string; lane: string; verified?: boolean; protected?: boolean }[];
  flags: { id: string; slug: string; userName: string; reason: string; createdAt: string }[];
  pendingEdits?: { id: string; slug: string; name?: string; summary: string; createdAt: string; author?: { name?: string } | null }[];
  recent: { slug: string; name: string; lane: string; needsReview?: boolean; verified?: boolean; protected?: boolean; updatedAt?: string }[];
  talk: { id: string; slug: string; userName: string; body: string; createdAt: string }[];
  audit?: { id: string; action: string; targetId?: string; createdAt: string }[];
};

function Act({ action, slug, id, label }: { action: string; slug?: string; id?: string; label: string }) {
  return (
    <form action={moderationAct}>
      <input type="hidden" name="action" value={action} />
      {slug ? <input type="hidden" name="slug" value={slug} /> : null}
      {id ? <input type="hidden" name="id" value={id} /> : null}
      <button type="submit" className="underline underline-offset-4">
        {label}
      </button>
    </form>
  );
}

export default async function ModerationPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const me = await getMe();
  const { error } = await searchParams;
  if (!me) redirect("/sign-in?next=/moderation");
  if (!isMod(me.user)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        <p className="kicker text-black/50">The desk</p>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl">Moderators only.</h1>
        <p className="mt-4 text-lg text-black/65">Community moderators are invited, like Wikipedia admins. File, talk, and flag from your desk.</p>
        <Link href="/desk" className="mt-8 inline-block underline underline-offset-4">
          Back to your desk
        </Link>
      </div>
    );
  }

  const queue = (await apiGet<Queue>("/v1/moderation/queue")) || { filings: [], flags: [], pendingEdits: [], recent: [], talk: [] };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">Community</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">Moderation.</h1>
      <p className="mt-3 text-lg text-black/65">
        Recent filings, flags, and talk. Verified is a check. Protect locks a page. Revert undoes the last edit.
      </p>
      {error ? <p className="mt-4 text-sm text-black/70">{error}</p> : null}

      <section className="mt-12">
        <h2 className="font-display text-3xl">Needs review</h2>
        <ul className="mt-5 space-y-4">
          {queue.filings.length ? (
            queue.filings.map((row) => (
              <li key={row.slug} className="border border-black/10 px-4 py-4">
                <Link href={`/people/${row.slug}`} className="font-display text-2xl hover:opacity-60">
                  {row.name}
                </Link>
                <p className="mt-1 text-sm text-black/55">{row.headline} · {row.lane}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <Act action="approve" slug={row.slug} label="Approve" />
                  <Act action="verify" slug={row.slug} label="Grant check" />
                  <Act action="protect" slug={row.slug} label="Protect" />
                  <Act action="revert" slug={row.slug} label="Revert" />
                </div>
              </li>
            ))
          ) : (
            <li className="text-sm text-black/50">The queue is clear.</li>
          )}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Pending edits</h2>
        <ul className="mt-5 space-y-4">
          {queue.pendingEdits?.length ? (
            queue.pendingEdits.map((item) => (
              <li key={item.id} className="border border-black/10 px-4 py-4">
                <Link href={`/people/${item.slug}/history`} className="font-display text-2xl hover:opacity-60">
                  {item.name || item.slug}
                </Link>
                <p className="mt-1 text-sm text-black/55">
                  {item.author?.name || "Contributor"} · {item.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <Act action="approve-edit" id={item.id} label="Approve" />
                  <Act action="reject-edit" id={item.id} label="Reject" />
                  <Link href={`/people/${item.slug}/history`} className="underline underline-offset-4">
                    Diff
                  </Link>
                </div>
              </li>
            ))
          ) : (
            <li className="text-sm text-black/50">No pending edits.</li>
          )}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Flags</h2>
        <ul className="mt-5 space-y-4">
          {queue.flags.length ? (
            queue.flags.map((flag) => (
              <li key={flag.id} className="border border-black/10 px-4 py-4">
                <p className="kicker text-black/40">{flag.userName}</p>
                <Link href={`/people/${flag.slug}`} className="mt-1 block font-display text-2xl hover:opacity-60">
                  {flag.slug}
                </Link>
                <p className="mt-2 text-[15px] leading-6">{flag.reason}</p>
                <div className="mt-3 text-sm">
                  <Act action="resolve-flag" id={flag.id} label="Resolve" />
                </div>
              </li>
            ))
          ) : (
            <li className="text-sm text-black/50">No open flags.</li>
          )}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Recent changes</h2>
        <ul className="mt-5 space-y-3">
          {queue.recent.map((row) => (
            <li key={row.slug} className="flex flex-wrap items-baseline justify-between gap-3 border-b border-black/10 py-3">
              <div>
                <Link href={`/people/${row.slug}`} className="font-display text-xl hover:opacity-60">
                  {row.name}
                </Link>
                <p className="text-xs text-black/45">
                  {row.lane}
                  {row.needsReview ? " · review" : ""}
                  {row.verified ? " · verified" : ""}
                  {row.protected ? " · locked" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                {row.verified ? <Act action="unverify" slug={row.slug} label="Remove check" /> : <Act action="verify" slug={row.slug} label="Check" />}
                {row.protected ? <Act action="unprotect" slug={row.slug} label="Unlock" /> : <Act action="protect" slug={row.slug} label="Lock" />}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
