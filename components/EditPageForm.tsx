"use client";

import { useActionState, useEffect, useRef } from "react";
import { savePage, type AuthState } from "@/app/actions/auth";
import type { RecordItem } from "@/lib/api";

const field = "mt-1 w-full border border-black/20 bg-transparent px-3 py-2";

export function EditPageForm({ record }: { record: RecordItem }) {
  const [state, action, pending] = useActionState(savePage, undefined as AuthState);
  const achievements = (record.achievements || []).map((item) => item.text).join("\n");
  const body = (record.body || []).join("\n\n");
  const saved = useRef(false);

  useEffect(() => {
    const onLeave = (event: BeforeUnloadEvent) => {
      if (!saved.current) event.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const form = document.getElementById("edit-page-form") as HTMLFormElement | null;
      if (!form) return;
      const data = new FormData(form);
      fetch("/api/v1/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: data.get("slug"),
          name: record.name,
          headline: data.get("headline"),
          dek: data.get("dek"),
          body: data.get("body"),
          origin: data.get("origin"),
          building: data.get("building"),
        }),
      }).catch(() => undefined);
    }, 20000);
    return () => window.clearInterval(timer);
  }, [record.name]);

  return (
    <form
      id="edit-page-form"
      action={action}
      className="space-y-4"
      onSubmit={() => {
        saved.current = true;
      }}
    >
      <input type="hidden" name="slug" value={record.slug} />
      <input type="hidden" name="expectedRevisionId" value={record.currentRevisionId || ""} />
      <label className="block text-sm">
        <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Title</span>
        <input name="headline" defaultValue={record.headline} required className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Dek</span>
        <textarea name="dek" rows={2} defaultValue={record.dek} className={field} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">City</span>
          <input name="city" defaultValue={record.city || ""} className={field} />
        </label>
        <label className="block text-sm">
          <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Country</span>
          <input name="country" defaultValue={record.country || ""} className={field} />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Achievements</span>
        <textarea name="achievements" rows={4} defaultValue={achievements} className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Where this started</span>
        <textarea name="origin" rows={3} defaultValue={record.origin || ""} className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">What comes next</span>
        <textarea name="building" rows={3} defaultValue={record.building || ""} className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Body</span>
        <textarea name="body" rows={8} defaultValue={body} className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Edit summary</span>
        <input name="summary" required minLength={4} placeholder="What did you change?" className={field} />
      </label>
      {state?.error ? <p className="text-sm">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="rounded-full bg-black px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.18em] text-[#f6f3ec] disabled:opacity-60">
        {pending ? "Saving…" : "Submit edit"}
      </button>
    </form>
  );
}
