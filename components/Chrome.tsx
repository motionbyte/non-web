import Link from "next/link";
import { HeaderAccount } from "@/components/HeaderAccount";

const nav = [
  { href: "/directory", label: "Directory" },
  { href: "/categories", label: "Categories" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
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
        <HeaderAccount />
      </div>
    </header>
  );
}
