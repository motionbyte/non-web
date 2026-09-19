"use client";

import { useState } from "react";
import { categories } from "@/lib/editorial";

const API = "/api/v1";

type Sku = { id: string; name: string; label: string; blurb: string };
type Field = "headline" | "category" | "city" | "country" | "achievements" | "origin" | "building" | "story" | "interview" | "unknown" | "photo";

export function Form({
  skus,
  fields,
  submitLabel,
  signedIn = false,
  defaultName = "",
}: {
  skus: Sku[];
  fields: Field[];
  submitLabel: string;
  signedIn?: boolean;
  defaultName?: string;
}) {
  const paid = skus.length > 0;
  const [sku, setSku] = useState(skus[0]?.id || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [photoDataUrl, setPhoto] = useState("");
  const [matches, setMatches] = useState<{ slug: string; name: string; dek?: string }[]>([]);
  const [confirmDuplicate, setConfirm] = useState(false);

  async function onPhoto(file?: File) {
    if (!file) return;
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL("image/jpeg", 0.72));
  }

  async function finish(id: string) {
    const verify = await fetch(`${API}/checkout/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, paymentId: "demo" }),
    });
    const published = (await verify.json()) as { slug?: string; error?: string };
    if (!verify.ok || !published.slug) throw new Error(published.error || "Publish failed");
    window.location.href = `/people/${published.slug}`;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      if (!paid) {
        const filed = await fetch(`${API}/file`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, photoDataUrl, confirmDuplicate }),
        });
        const page = (await filed.json()) as { slug?: string; error?: string; code?: string; matches?: { slug: string; name: string; dek?: string }[] };
        if (filed.status === 401) {
          window.location.href = `/sign-in?next=${paid ? "/boost" : "/join"}`;
          return;
        }
        if (filed.status === 409 && page.code === "POSSIBLE_DUPLICATE") {
          setMatches(page.matches || []);
          setConfirm(true);
          throw new Error("A similar page already exists. Open it, or file anyway.");
        }
        if (filed.status === 409 && page.slug) {
          window.location.href = `/people/${page.slug}`;
          return;
        }
        if (!filed.ok || !page.slug) throw new Error(page.error || "Could not file the name");
        window.location.href = `/people/${page.slug}`;
        return;
      }
      const opened = await fetch(`${API}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sku, photoDataUrl }),
      });
      const order = (await opened.json()) as { id?: string; slug?: string; error?: string };
      if (opened.status === 401) {
        window.location.href = "/sign-in?next=/boost";
        return;
      }
      if (!opened.ok || !order.id) throw new Error(order.error || "Could not open the desk");
      await finish(order.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something stalled");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {paid ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {skus.map((item) => (
            <button key={item.id} type="button" onClick={() => setSku(item.id)} className={`border px-3 py-3 text-left ${sku === item.id ? "border-black" : "border-black/20"}`}>
              <p className="text-[11px] uppercase tracking-[0.14em]">{item.name}</p>
              <p className="font-display text-2xl">{item.label}</p>
              <p className="mt-1 text-xs opacity-70">{item.blurb}</p>
            </button>
          ))}
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm"><span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Full name</span><input name="name" required defaultValue={defaultName} className="mt-1 w-full border border-black/20 bg-transparent px-3 py-2" /></label>
        {signedIn ? null : (
          <label className="block text-sm"><span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Email</span><input name="email" type="email" required className="mt-1 w-full border border-black/20 bg-transparent px-3 py-2" /></label>
        )}
        {fields.includes("headline") ? <label className="block text-sm sm:col-span-2"><span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Title</span><input name="headline" required className="mt-1 w-full border border-black/20 bg-transparent px-3 py-2" /></label> : null}
        {fields.includes("category") ? (
          <label className="block text-sm">
            <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Field</span>
            <select name="category" required className="mt-1 w-full border border-black/20 bg-transparent px-3 py-2">
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </label>
        ) : null}
        {fields.includes("city") ? <label className="block text-sm"><span className="text-[11px] uppercase tracking-[0.12em] opacity-60">City</span><input name="city" required className="mt-1 w-full border border-black/20 bg-transparent px-3 py-2" /></label> : null}
        {fields.includes("country") ? <label className="block text-sm"><span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Country</span><input name="country" required className="mt-1 w-full border border-black/20 bg-transparent px-3 py-2" /></label> : null}
      </div>
      {fields.includes("achievements") ? <label className="block text-sm"><span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Achievements</span><textarea name="achievements" rows={4} className="mt-1 w-full border border-black/20 bg-transparent px-3 py-2" /></label> : null}
      {fields.includes("story") ? <label className="block text-sm"><span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Your story</span><textarea name="story" required rows={4} className="mt-1 w-full border border-black/20 bg-transparent px-3 py-2" /></label> : null}
      {fields.includes("origin") ? <label className="block text-sm"><span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Where this started</span><textarea name="origin" rows={3} className="mt-1 w-full border border-black/20 bg-transparent px-3 py-2" /></label> : null}
      {fields.includes("building") ? <label className="block text-sm"><span className="text-[11px] uppercase tracking-[0.12em] opacity-60">What you are building</span><textarea name="building" rows={3} className="mt-1 w-full border border-black/20 bg-transparent px-3 py-2" /></label> : null}
      {fields.includes("interview") ? <label className="block text-sm"><span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Interview notes</span><textarea name="interview" rows={4} className="mt-1 w-full border border-black/20 bg-transparent px-3 py-2" /></label> : null}
      {fields.includes("unknown") ? <label className="block text-sm"><span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Five things they don&apos;t know</span><textarea name="unknown" rows={3} className="mt-1 w-full border border-black/20 bg-transparent px-3 py-2" /></label> : null}
      {fields.includes("photo") ? <label className="block text-sm"><span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Portrait</span><input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={(e) => onPhoto(e.target.files?.[0])} /></label> : null}
      {matches.length ? (
        <div className="border border-black/10 px-4 py-3 text-sm">
          <p className="kicker text-black/40">Possible matches</p>
          <ul className="mt-2 space-y-2">
            {matches.map((item) => (
              <li key={item.slug}>
                <a href={`/people/${item.slug}`} className="underline underline-offset-4">
                  {item.name}
                </a>
                {item.dek ? <span className="text-black/50"> — {item.dek}</span> : null}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-black/55">If this is a different person, submit again to file anyway.</p>
        </div>
      ) : null}
      {error ? <p className="text-sm">{error}</p> : null}
      <button type="submit" disabled={busy} className="w-full rounded-full bg-black px-4 py-3 font-ui text-[12px] uppercase tracking-[0.18em] text-[#f6f3ec] disabled:opacity-60">
        {busy ? "Filing…" : submitLabel}
      </button>
    </form>
  );
}
