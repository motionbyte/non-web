"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FlagButton, TalkThread } from "@/components/TalkThread";
import { WatchButton } from "@/components/WatchButton";

type TalkPost = { id: string; userName: string; role?: string; body: string; createdAt: string };

export function PersonTools({ slug, filed }: { slug: string; filed: boolean }) {
  const [signedIn, setSignedIn] = useState(false);
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.all([
      fetch("/api/v1/me", { credentials: "same-origin" }).then((res) => (res.ok ? res.json() : null)),
      fetch("/api/v1/watchlist", { credentials: "same-origin" }).then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([me, list]) => {
        if (!live) return;
        setSignedIn(Boolean(me?.user));
        const rows = (list?.watchlist || []) as { slug: string }[];
        setWatching(rows.some((item) => item.slug === slug));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [slug]);

  return (
    <p className="mt-6 max-w-2xl text-sm leading-6 text-black/55">
      <Link href={`/people/${slug}/history`} className="underline underline-offset-4">
        History
      </Link>
      {" · "}
      <Link href={`/people/${slug}/edit`} className="underline underline-offset-4">
        Edit
      </Link>
      {" · "}
          <WatchButton key={watching ? "watching" : "watch"} slug={slug} watching={watching} />
      {" · "}
      <FlagButton slug={slug} signedIn={signedIn} />
      {filed ? (
        <>
          {" · "}
          <Link href="/boost" className="underline underline-offset-4">
            Boost
          </Link>
        </>
      ) : null}
    </p>
  );
}

export function PersonTalk({ slug }: { slug: string }) {
  const [signedIn, setSignedIn] = useState(false);
  const [posts, setPosts] = useState<TalkPost[]>([]);

  useEffect(() => {
    let live = true;
    Promise.all([
      fetch("/api/v1/me", { credentials: "same-origin" }).then((res) => (res.ok ? res.json() : null)),
      fetch(`/api/v1/talk/${slug}`, { credentials: "same-origin" }).then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([me, data]) => {
        if (!live) return;
        setSignedIn(Boolean(me?.user));
        setPosts(data?.talk || []);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [slug]);

  return <TalkThread slug={slug} signedIn={signedIn} posts={posts} />;
}
