"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="kicker text-black/50">Desk closed</p>
      <h1 className="mt-4 font-display text-6xl">Something stalled.</h1>
      <p className="mt-4 text-lg text-black/65">{error.message || "The page could not be opened."}</p>
      <button type="button" onClick={reset} className="mt-8 rounded-full bg-black px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em] text-[#f6f3ec]">
        Try again
      </button>
    </div>
  );
}
