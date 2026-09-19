"use client";

import { useState } from "react";

export function TalkThread({
  slug,
  signedIn,
  posts,
}: {
  slug: string;
  signedIn: boolean;
  posts: { id: string; userName: string; role?: string; body: string; createdAt: string }[];
}) {
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/v1/talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, body }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not post.");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post.");
      setBusy(false);
    }
  }

  return (
    <section id="talk" className="scroll-mt-28 border-t border-black/10 pt-10">
      <p className="kicker text-black/40">Talk</p>
      <h2 className="mt-2 font-display text-3xl leading-none">On this page</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
        Corrections, sources, and disputes. Community moderators watch this thread.
      </p>
      <ul className="mt-6 max-w-2xl space-y-4">
        {posts.length ? (
          posts.map((post) => (
            <li key={post.id} className="border border-black/10 px-4 py-3">
              <p className="kicker text-black/40">
                {post.userName}
                {post.role === "moderator" || post.role === "desk" ? ` · ${post.role}` : ""}
              </p>
              <p className="mt-2 text-[15px] leading-6">{post.body}</p>
            </li>
          ))
        ) : (
          <li className="text-sm text-black/50">No notes yet.</li>
        )}
      </ul>
      {signedIn ? (
        <form onSubmit={onSubmit} className="mt-6 max-w-2xl space-y-3">
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            required
            minLength={4}
            placeholder="A source, a correction, a question."
            className="w-full border border-black/20 bg-transparent px-3 py-2"
          />
          {error ? <p className="text-sm">{error}</p> : null}
          <button type="submit" disabled={busy} className="rounded-full bg-black px-5 py-2 font-ui text-[11px] uppercase tracking-[0.18em] text-[#f6f3ec] disabled:opacity-60">
            {busy ? "Posting…" : "Post to talk"}
          </button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-black/55">
          <a href={`/sign-in?next=/people/${slug}`} className="underline underline-offset-4">
            Sign in
          </a>{" "}
          to talk on this page.
        </p>
      )}
    </section>
  );
}

export function FlagButton({ slug, signedIn }: { slug: string; signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/v1/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, reason }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not flag.");
      setMessage("Flagged for community moderators.");
      setOpen(false);
      setReason("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not flag.");
    } finally {
      setBusy(false);
    }
  }

  if (!signedIn) {
    return (
      <a href={`/sign-in?next=/people/${slug}`} className="underline underline-offset-4">
        Sign in to flag
      </a>
    );
  }

  return (
    <span>
      <button type="button" onClick={() => setOpen((value) => !value)} className="underline underline-offset-4">
        Flag
      </button>
      {open ? (
        <form onSubmit={onSubmit} className="mt-3 max-w-md space-y-2">
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={2}
            required
            minLength={4}
            placeholder="What is wrong on this page?"
            className="w-full border border-black/20 bg-transparent px-3 py-2 text-sm"
          />
          <button type="submit" disabled={busy} className="rounded-full border border-black px-4 py-1.5 font-ui text-[10px] uppercase tracking-[0.16em] disabled:opacity-60">
            {busy ? "Sending…" : "Send to moderators"}
          </button>
        </form>
      ) : null}
      {message ? <p className="mt-2 text-sm text-black/55">{message}</p> : null}
    </span>
  );
}
