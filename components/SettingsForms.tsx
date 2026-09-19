"use client";

import { useActionState } from "react";
import { changePassword, requestDelete, revokeSessions, updateProfile, type AuthState } from "@/app/actions/auth";

const field = "mt-1 w-full border border-black/20 bg-transparent px-3 py-2";

export function ProfileSettingsForm({ name, username, bio }: { name: string; username?: string; bio?: string }) {
  const [state, action, pending] = useActionState(updateProfile, undefined as AuthState);
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm">
        <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Display name</span>
        <input name="name" defaultValue={name} required className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Username</span>
        <input name="username" defaultValue={username || ""} className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Bio</span>
        <textarea name="bio" rows={4} defaultValue={bio || ""} className={field} />
      </label>
      {state?.error ? <p className="text-sm">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="rounded-full bg-black px-5 py-2 font-ui text-[11px] uppercase tracking-[0.18em] text-[#f6f3ec] disabled:opacity-60">
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined as AuthState);
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm">
        <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">Current password</span>
        <input name="current" type="password" required className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-[11px] uppercase tracking-[0.12em] opacity-60">New password</span>
        <input name="next" type="password" required minLength={8} className={field} />
      </label>
      {state?.error ? <p className="text-sm">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="rounded-full bg-black px-5 py-2 font-ui text-[11px] uppercase tracking-[0.18em] text-[#f6f3ec] disabled:opacity-60">
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}

export function SessionRevokeForm() {
  return (
    <form action={revokeSessions}>
      <button type="submit" className="underline underline-offset-4">
        Sign out other sessions
      </button>
    </form>
  );
}

export function DeleteAccountForm() {
  return (
    <form action={requestDelete}>
      <button type="submit" className="underline underline-offset-4">
        Request account deletion
      </button>
    </form>
  );
}
