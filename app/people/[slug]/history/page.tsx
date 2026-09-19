import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchRecord } from "@/lib/api";
import { apiGet, getMe, isMod } from "@/lib/session";
import { RevertForm } from "@/components/RevertForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

type Revision = {
  id: string;
  summary: string;
  status: string;
  createdAt: string;
  current?: boolean;
  author?: { name?: string; username?: string };
};

export default async function HistoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { slug } = await params;
  const { from, to } = await searchParams;
  const record = await fetchRecord(slug);
  if (!record) notFound();
  const me = await getMe();
  const data = await apiGet<{ revisions: Revision[]; currentRevisionId?: string }>(`/v1/records/${slug}/revisions`);
  const revisions = data?.revisions || [];
  const left = from || revisions[1]?.id || revisions[0]?.id;
  const right = to || revisions[0]?.id;
  const diff =
    left && right
      ? await apiGet<{
          diff: { type: string; text: string }[];
          from: { id: string };
          to: { id: string };
        }>(`/v1/records/${slug}/revisions/${left}/diff?to=${right}`)
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">History</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">{record.name}.</h1>
      <p className="mt-3 text-lg text-black/65">
        Every save is a revision. Revert writes a new one.{" "}
        <Link href={`/people/${record.slug}`} className="underline underline-offset-4">
          Article
        </Link>
        {me && !record.protected ? (
          <>
            {" · "}
            <Link href={`/people/${record.slug}/edit`} className="underline underline-offset-4">
              Edit
            </Link>
          </>
        ) : null}
      </p>

      {revisions.length ? (
        <ol className="mt-12 space-y-4">
          {revisions.map((item) => (
            <li key={item.id} className="border border-black/10 px-4 py-4">
              <p className="kicker text-black/40">
                {new Date(item.createdAt).toLocaleString()}
                {item.current ? " · Current" : ""}
                {item.status !== "approved" ? ` · ${item.status}` : ""}
              </p>
              <p className="mt-2 font-display text-2xl">{item.author?.name || "Contributor"}</p>
              <p className="mt-1 text-sm text-black/60">{item.summary}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <Link href={`/people/${record.slug}/history?from=${item.id}&to=${data?.currentRevisionId || item.id}`} className="underline underline-offset-4">
                  Compare
                </Link>
                {isMod(me?.user) && !item.current ? <RevertForm slug={record.slug} revisionId={item.id} /> : null}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-12 text-sm text-black/50">No revisions stored on this desk yet.</p>
      )}

      {diff?.diff?.length ? (
        <section className="mt-16">
          <h2 className="font-display text-3xl">Diff</h2>
          <p className="mt-2 text-sm text-black/50">
            {diff.from.id} → {diff.to.id}
          </p>
          <div className="mt-6 space-y-1 font-mono text-[13px] leading-6">
            {diff.diff.map((row, index) => (
              <p
                key={`${row.type}-${index}`}
                className={row.type === "added" ? "bg-black/[0.06] px-2" : row.type === "removed" ? "px-2 text-black/40 line-through" : "px-2 text-black/70"}
              >
                {row.type === "added" ? "+ " : row.type === "removed" ? "− " : "  "}
                {row.text}
              </p>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
