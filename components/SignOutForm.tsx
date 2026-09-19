import { signOut } from "@/app/actions/auth";

export function SignOutForm({ className = "" }: { className?: string }) {
  return (
    <form action={signOut} className={className}>
      <button type="submit" className="font-ui text-[11px] uppercase tracking-[0.2em] hover:opacity-60">
        Sign out
      </button>
    </form>
  );
}
