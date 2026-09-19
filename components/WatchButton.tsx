"use client";

import { useState } from "react";

export function WatchButton({ slug, watching: initial }: { slug: string; watching: boolean }) {
  const [watching, setWatching] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      const res = await fetch("/api/v1/watch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.status === 401) {
        window.location.href = `/sign-in?next=/people/${slug}`;
        return;
      }
      const data = (await res.json()) as { watching?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "Could not watch.");
      setWatching(Boolean(data.watching));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={toggle} disabled={busy} className="underline underline-offset-4 disabled:opacity-60">
      {watching ? "Watching" : "Watch"}
    </button>
  );
}
