"use client";

import { useActionState } from "react";
import { signIn, signUp, type AuthState } from "@/app/actions/auth";

const field = "mt-1 w-full border border-black/20 bg-transparent px-3 py-2";
const label = "block text-sm";
const kicker = "text-[11px] uppercase tracking-[0.12em] opacity-60";

export function SignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, undefined as AuthState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className={label}>
        <span className={kicker}>Email</span>
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className={label}>
        <span className={kicker}>Password</span>
        <input name="password" type="password" required autoComplete="current-password" className={field} />
      </label>
      {state?.error ? <p className="text-sm text-black/70">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="w-full rounded-full bg-black px-4 py-3 font-ui text-[12px] uppercase tracking-[0.18em] text-[#f6f3ec] disabled:opacity-60">
        {pending ? "Opening…" : "Sign in"}
      </button>
    </form>
  );
}

export function SignUpForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signUp, undefined as AuthState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className={label}>
        <span className={kicker}>Your name</span>
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className={label}>
        <span className={kicker}>Email</span>
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className={label}>
        <span className={kicker}>Password</span>
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className={field} />
      </label>
      {state?.error ? <p className="text-sm text-black/70">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="w-full rounded-full bg-black px-4 py-3 font-ui text-[12px] uppercase tracking-[0.18em] text-[#f6f3ec] disabled:opacity-60">
        {pending ? "Filing the account…" : "Create account"}
      </button>
    </form>
  );
}
