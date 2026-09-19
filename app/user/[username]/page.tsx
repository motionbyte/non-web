import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet } from "@/lib/session";

export const dynamic = "force-dynamic";

type Profile = {
  username: string;
  name: string;
  bio?: string;
  role: string;
  createdAt: string;
  editCount?: number;
  pagesCreated?: number;
};

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  return {
    title: username,
    robots: { index: false, follow: true },
  };
}

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await apiGet<{
    profile: Profile;
    created: { slug: string; name: string; dek: string }[];
    recent: { slug: string; summary: string; createdAt: string; status: string }[];
  }>(`/v1/users/${username}`);
  if (!data?.profile) notFound();
  const { profile } = data;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="kicker text-black/50">{profile.role}</p>
      <h1 className="mt-4 font-display text-6xl">{profile.name}.</h1>
      <p className="mt-3 text-lg text-black/65">@{profile.username}</p>
      {profile.bio ? <p className="mt-4 text-black/70">{profile.bio}</p> : null}
      <p className="mt-6 text-sm text-black/55">
        Joined {new Date(profile.createdAt).toLocaleDateString()} · {profile.editCount || 0} edits · {profile.pagesCreated || 0} pages filed
      </p>
      <p className="mt-4 text-sm">
        <Link href={`/user/${profile.username}/contributions`} className="underline underline-offset-4">
          Contributions
        </Link>
      </p>

      <section className="mt-12 border-t border-black/10 pt-10">
        <h2 className="font-display text-3xl">Filed</h2>
        <ul className="mt-5 space-y-3">
          {data.created.length ? (
            data.created.map((item) => (
              <li key={item.slug}>
                <Link href={`/people/${item.slug}`} className="font-display text-2xl hover:opacity-60">
                  {item.name}
                </Link>
                <p className="text-sm text-black/55">{item.dek}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-black/50">No pages filed yet.</li>
          )}
        </ul>
      </section>

      <section className="mt-12 border-t border-black/10 pt-10">
        <h2 className="font-display text-3xl">Recent edits</h2>
        <ul className="mt-5 space-y-3">
          {data.recent.length ? (
            data.recent.map((item) => (
              <li key={`${item.slug}-${item.createdAt}`} className="border-b border-black/10 py-3">
                <Link href={`/people/${item.slug}`} className="underline underline-offset-4">
                  {item.slug}
                </Link>
                <p className="text-sm text-black/55">{item.summary}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-black/50">No edits yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
