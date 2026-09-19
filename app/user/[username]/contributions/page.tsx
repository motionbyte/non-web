import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function ContributionsPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await apiGet<{ profile: { name: string; username: string } }>(`/v1/users/${username}`);
  if (!profile?.profile) notFound();
  const data = await apiGet<{
    contributions: { slug: string; summary: string; createdAt: string; status: string; name: string; revisionId: string }[];
  }>(`/v1/users/${username}/contributions`);
  const items = data?.contributions || [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">Contributions</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">{profile.profile.name}.</h1>
      <p className="mt-3 text-lg text-black/65">
        <Link href={`/user/${username}`} className="underline underline-offset-4">
          Profile
        </Link>
      </p>
      <ul className="mt-12 space-y-4">
        {items.length ? (
          items.map((item) => (
            <li key={item.revisionId} className="border-b border-black/10 py-4">
              <p className="kicker text-black/40">
                {new Date(item.createdAt).toLocaleString()} · {item.status}
              </p>
              <Link href={`/people/${item.slug}`} className="mt-2 block font-display text-2xl hover:opacity-60">
                {item.name || item.slug}
              </Link>
              <p className="mt-1 text-sm text-black/55">{item.summary}</p>
              <Link href={`/people/${item.slug}/history`} className="mt-2 inline-block text-sm underline underline-offset-4">
                History
              </Link>
            </li>
          ))
        ) : (
          <li className="text-sm text-black/50">No contributions yet.</li>
        )}
      </ul>
    </div>
  );
}
