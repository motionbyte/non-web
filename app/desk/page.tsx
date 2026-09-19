import type { Metadata } from "next";
import Link from "next/link";
import { EditPageForm } from "@/components/EditPageForm";
import { SignOutForm } from "@/components/SignOutForm";
import { apiGet, getMe, isMod } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Desk",
  robots: { index: false, follow: false },
};

type Note = { id: string; title: string; body: string; href?: string; read: boolean; createdAt: string };
type Watch = { slug: string; name: string; dek: string; updatedAt?: string };
type Draft = { id: string; slug: string; title?: string; savedAt: string };

export default async function DeskPage() {
  const me = await getMe();
  if (!me) redirect("/sign-in?next=/desk");
  const { user, record } = me;
  const moderator = isMod(user);
  const notifications = (await apiGet<{ notifications: Note[] }>("/v1/notifications"))?.notifications || [];
  const watchlist = (await apiGet<{ watchlist: Watch[] }>("/v1/watchlist"))?.watchlist || [];
  const drafts = (await apiGet<{ drafts: Draft[] }>("/v1/drafts"))?.drafts || [];
  const contrib = user.username
    ? (await apiGet<{ contributions: { slug: string; summary: string; createdAt: string; status: string; name: string }[] }>(
        `/v1/users/${user.username}/contributions`,
      ))?.contributions || []
    : [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">{user.role === "member" ? "Your desk" : user.role}</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">{user.name}.</h1>
      <p className="mt-3 text-lg text-black/65">
        {user.username ? `@${user.username}` : user.email}
        {me.unread ? ` · ${me.unread} unread` : ""}
      </p>
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        {user.username ? (
          <Link href={`/user/${user.username}`} className="underline underline-offset-4">
            Public profile
          </Link>
        ) : null}
        <Link href="/watchlist" className="underline underline-offset-4">
          Watchlist
        </Link>
        <Link href="/settings/security" className="underline underline-offset-4">
          Settings
        </Link>
        {moderator ? (
          <Link href="/moderation" className="underline underline-offset-4">
            Moderation queue
          </Link>
        ) : null}
        <SignOutForm />
      </div>

      <section className="mt-12 border-t border-black/10 pt-10">
        <p className="kicker text-black/40">Notifications</p>
        <h2 className="mt-2 font-display text-4xl">The wire</h2>
        <ul className="mt-5 space-y-3">
          {notifications.length ? (
            notifications.slice(0, 8).map((item) => (
              <li key={item.id} className="border-b border-black/10 py-3">
                <p className="font-display text-xl">{item.title}</p>
                <p className="mt-1 text-sm text-black/55">{item.body}</p>
                {item.href ? (
                  <Link href={item.href} className="mt-2 inline-block text-sm underline underline-offset-4">
                    Open
                  </Link>
                ) : null}
              </li>
            ))
          ) : (
            <li className="text-sm text-black/50">No notifications.</li>
          )}
        </ul>
      </section>

      <section className="mt-12 border-t border-black/10 pt-10">
        <p className="kicker text-black/40">Contributions</p>
        <h2 className="mt-2 font-display text-4xl">Your edits</h2>
        <ul className="mt-5 space-y-3">
          {contrib.length ? (
            contrib.slice(0, 10).map((item) => (
              <li key={`${item.slug}-${item.createdAt}`} className="flex flex-wrap justify-between gap-3 border-b border-black/10 py-3">
                <div>
                  <Link href={`/people/${item.slug}`} className="font-display text-xl hover:opacity-60">
                    {item.name || item.slug}
                  </Link>
                  <p className="text-sm text-black/55">{item.summary}</p>
                </div>
                <p className="kicker text-black/40">{item.status}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-black/50">No contributions yet.</li>
          )}
        </ul>
      </section>

      <section className="mt-12 border-t border-black/10 pt-10">
        <p className="kicker text-black/40">Watchlist</p>
        <h2 className="mt-2 font-display text-4xl">Pages you watch</h2>
        <ul className="mt-5 space-y-3">
          {watchlist.length ? (
            watchlist.slice(0, 8).map((item) => (
              <li key={item.slug}>
                <Link href={`/people/${item.slug}`} className="font-display text-xl hover:opacity-60">
                  {item.name}
                </Link>
                <p className="text-sm text-black/55">{item.dek}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-black/50">No watched pages yet.</li>
          )}
        </ul>
      </section>

      <section className="mt-12 border-t border-black/10 pt-10">
        <p className="kicker text-black/40">Drafts</p>
        <h2 className="mt-2 font-display text-4xl">Unfinished</h2>
        <ul className="mt-5 space-y-3">
          {drafts.length ? (
            drafts.map((item) => (
              <li key={item.id} className="text-sm">
                <Link href={item.slug ? `/people/${item.slug}/edit` : "/join"} className="underline underline-offset-4">
                  {item.title || item.slug || "Untitled draft"}
                </Link>
                <span className="text-black/45"> · {new Date(item.savedAt).toLocaleString()}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-black/50">No drafts.</li>
          )}
        </ul>
      </section>

      {record ? (
        <section className="mt-12 border-t border-black/10 pt-10">
          <p className="kicker text-black/40">A page you filed</p>
          <h2 className="mt-2 font-display text-4xl">{record.name}</h2>
          <p className="mt-2 text-black/60">
            {record.headline}
            {record.needsReview ? " · Needs review" : ""}
            {record.verified ? " · Verified" : ""}
          </p>
          <p className="mt-4 text-sm">
            <Link href={`/people/${record.slug}`} className="underline underline-offset-4">
              Open in the encyclopedia
            </Link>
            {" · "}
            <Link href={`/people/${record.slug}/edit`} className="underline underline-offset-4">
              Edit
            </Link>
            {" · "}
            <Link href="/boost" className="underline underline-offset-4">
              Boost
            </Link>
          </p>
          {record.protected ? (
            <p className="mt-6 text-sm text-black/55">This page is locked. Ask a moderator on Talk.</p>
          ) : (
            <div className="mt-8">
              <EditPageForm record={record} />
            </div>
          )}
        </section>
      ) : (
        <section className="mt-12 border-t border-black/10 pt-10">
          <p className="kicker text-black/40">File</p>
          <h2 className="mt-2 font-display text-4xl">No page yet.</h2>
          <p className="mt-3 text-black/65">A free encyclopedia page. Verified is a check, not a purchase.</p>
          <Link href="/join" className="mt-6 inline-block rounded-full bg-black px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em] text-[#f6f3ec]">
            File a name
          </Link>
        </section>
      )}
    </div>
  );
}
