import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Filings, corrections, and a request to check a name: desk@namesofnote.com",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">The desk</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">Contact</h1>
      <p className="mt-8 text-xl leading-9 text-black/70">
        For filings, corrections, and a request to check a name: <a className="underline" href="mailto:desk@namesofnote.com">desk@namesofnote.com</a>
      </p>
      <p className="mt-5 text-lg leading-8 text-black/70">
        Boost is a labeled Sponsored slot. It does not change ranking or verified.
      </p>
    </article>
  );
}
