import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteAccountForm, PasswordForm, ProfileSettingsForm, SessionRevokeForm } from "@/components/SettingsForms";
import { getMe } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Security",
  robots: { index: false, follow: false },
};

export default async function SecurityPage() {
  const me = await getMe();
  if (!me) redirect("/sign-in?next=/settings/security");

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="kicker text-black/50">Account</p>
      <h1 className="mt-4 font-display text-6xl">Settings.</h1>
      <p className="mt-3 text-lg text-black/65">
        Password, sessions, and deletion. Encyclopedia pages stay if you leave.{" "}
        <Link href="/desk" className="underline underline-offset-4">
          Desk
        </Link>
      </p>

      <section className="mt-12 border-t border-black/10 pt-10">
        <h2 className="font-display text-3xl">Profile</h2>
        <div className="mt-6">
          <ProfileSettingsForm name={me.user.name} username={me.user.username} bio={me.user.bio} />
        </div>
      </section>

      <section className="mt-12 border-t border-black/10 pt-10">
        <h2 className="font-display text-3xl">Password</h2>
        <div className="mt-6">
          <PasswordForm />
        </div>
      </section>

      <section className="mt-12 border-t border-black/10 pt-10">
        <h2 className="font-display text-3xl">Sessions</h2>
        <p className="mt-3 text-sm text-black/55">Sign out everywhere except this browser.</p>
        <div className="mt-4">
          <SessionRevokeForm />
        </div>
      </section>

      <section className="mt-12 border-t border-black/10 pt-10">
        <h2 className="font-display text-3xl">Leave the desk</h2>
        <p className="mt-3 text-sm text-black/55">Your contributions remain. The account is anonymized.</p>
        <div className="mt-4">
          <DeleteAccountForm />
        </div>
      </section>
    </div>
  );
}
