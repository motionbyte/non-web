import type { Metadata } from "next";
import Link from "next/link";
import { apiGet, getMe } from "@/lib/session";
import { redirect } from "next/navigation";
import { WatchButton } from "@/components/WatchButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Watchlist",
  robots: { index: false, follow: false },
};

export default async function WatchlistPage() {
  const me = await getMe();
  if (!me) redirect("/sign-in?next=/watchlist");
  const items = (await apiGet<{ watchlist: { slug: string; name: string; dek: string }[] }>("/v1/watchlist"))?.watchlist || [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">Desk</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">Watchlist.</h1>
      <p className="mt-3 text-lg text-black/65">When a watched page changes, it lands on your desk.</p>
      <ul className="mt-12 space-y-5">
        {items.length ? (
          items.map((item) => (
            <li key={item.slug} className="border-b border-black/10 pb-4">
              <Link href={`/people/${item.slug}`} className="font-display text-3xl hover:opacity-60">
                {item.name}
              </Link>
              <p className="mt-2 text-sm text-black/55">{item.dek}</p>
              <div className="mt-3 text-sm">
                <WatchButton slug={item.slug} watching />
              </div>
            </li>
          ))
        ) : (
          <li className="text-sm text-black/50">No watched pages yet.</li>
        )}
      </ul>
    </div>
  );
}
