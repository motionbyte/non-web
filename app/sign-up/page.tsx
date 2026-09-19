import Link from "next/link";
import { SignUpForm } from "@/components/AuthForms";
import { getMe } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const me = await getMe();
  const { next = "/desk" } = await searchParams;
  const dest = next.startsWith("/") && !next.startsWith("//") ? next : "/desk";
  if (me) redirect(dest);

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <p className="kicker text-black/50">Account</p>
      <h1 className="mt-4 font-display text-6xl">Sign up.</h1>
      <p className="mt-3 text-lg text-black/65">A free account to file a page, talk, and flag. Ranking is not for sale.</p>
      <div className="mt-8">
        <SignUpForm next={dest} />
      </div>
      <p className="mt-8 text-sm text-black/50">
        Already on this desk?{" "}
        <Link href={`/sign-in?next=${encodeURIComponent(dest)}`} className="underline underline-offset-4">
          Sign in
        </Link>
        .
      </p>
    </div>
  );
}
