import Link from "next/link";
import { SignInForm } from "@/components/AuthForms";
import { getMe } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const me = await getMe();
  const { next = "/desk" } = await searchParams;
  const dest = next.startsWith("/") && !next.startsWith("//") ? next : "/desk";
  if (me) redirect(dest);

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6 sm:py-16">
      <p className="kicker text-black/50">Account</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">Sign in.</h1>
      <p className="mt-3 text-lg text-black/65">File a name, talk on a page, or open the moderator desk.</p>
      <div className="mt-8">
        <SignInForm next={dest} />
      </div>
      <p className="mt-8 text-sm text-black/50">
        New here?{" "}
        <Link href={`/sign-up?next=${encodeURIComponent(dest)}`} className="underline underline-offset-4">
          Create an account
        </Link>
        .
      </p>
    </div>
  );
}
