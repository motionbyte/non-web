import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { getMe, isMod } from "@/lib/session";

const nav = [
  { href: "/directory", label: "Directory" },
  { href: "/categories", label: "Categories" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
];

export async function SiteHeader() {
  const me = await getMe();
  const moderator = isMod(me?.user);

  return (
    <header className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[#f6f3ec] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="min-w-0 shrink">
          <p className="font-display text-[1.35rem] leading-none tracking-tight sm:text-[1.65rem]">Names of Note</p>
          <p className="mt-1 hidden font-ui text-[9px] uppercase tracking-[0.22em] text-black/55 sm:block">A free encyclopedia of people</p>
        </Link>
        <nav className="hidden items-center gap-7 font-ui text-[11px] uppercase tracking-[0.2em] md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:opacity-60">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/search" aria-label="Search the encyclopedia" className="text-black/70 hover:text-black">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </Link>
          {me ? (
            <>
              {moderator ? (
                <Link href="/moderation" className="hidden font-ui text-[11px] uppercase tracking-[0.2em] hover:opacity-60 lg:inline">
                  Mods
                </Link>
              ) : null}
              <Link href="/desk" className="hidden font-ui text-[11px] uppercase tracking-[0.2em] hover:opacity-60 sm:inline">
                Desk
              </Link>
            </>
          ) : (
            <Link href="/sign-in" className="hidden font-ui text-[11px] uppercase tracking-[0.2em] hover:opacity-60 sm:inline">
              Sign in
            </Link>
          )}
          <Link href="/join" className="rounded-full bg-black px-3.5 py-2 font-ui text-[10px] uppercase tracking-[0.18em] text-[#f6f3ec] sm:px-4 sm:text-[11px] sm:tracking-[0.2em]">
            File
          </Link>
          <MobileNav signedIn={Boolean(me)} moderator={moderator} />
        </div>
      </div>
    </header>
  );
}
