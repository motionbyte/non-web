import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { fetchRecord } from "@/lib/api";
import { getMe } from "@/lib/session";
import { EditPageForm } from "@/components/EditPageForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit",
  robots: { index: false, follow: false },
};

export default async function EditPersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const me = await getMe();
  if (!me) redirect(`/sign-in?next=/people/${slug}/edit`);
  const record = await fetchRecord(slug);
  if (!record) notFound();
  if (record.protected) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="kicker text-black/50">Locked</p>
        <h1 className="mt-4 font-display text-6xl">{record.name}.</h1>
        <p className="mt-4 text-lg text-black/65">This page is locked. Ask a moderator on Talk.</p>
        <p className="mt-8 text-sm">
          <Link href={`/people/${record.slug}`} className="underline underline-offset-4">
            Back to the page
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="kicker text-black/50">Edit</p>
      <h1 className="mt-4 font-display text-6xl">{record.name}.</h1>
      <p className="mt-3 text-lg text-black/65">
        Pages belong to the encyclopedia. Add a short summary of what you changed.{" "}
        <Link href={`/people/${record.slug}`} className="underline underline-offset-4">
          View
        </Link>
        {" · "}
        <Link href={`/people/${record.slug}/history`} className="underline underline-offset-4">
          History
        </Link>
      </p>
      <div className="mt-10">
        <EditPageForm record={record} />
      </div>
    </div>
  );
}
