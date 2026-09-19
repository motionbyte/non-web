import Link from "next/link";
import { SignOutForm } from "@/components/SignOutForm";

export function MobileNav({ signedIn, moderator }: { signedIn: boolean; moderator: boolean }) {
  const links = [
    { href: "/search", label: "Search" },
    { href: "/directory", label: "Directory" },
    { href: "/categories", label: "Categories" },
    { href: "/stories", label: "Stories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/join", label: "File" },
    { href: "/boost", label: "Boost" },
    ...(signedIn ? [{ href: "/desk", label: "My desk" }, { href: "/watchlist", label: "Watchlist" }] : [{ href: "/sign-in", label: "Sign in" }, { href: "/sign-up", label: "Sign up" }]),
    ...(moderator ? [{ href: "/moderation", label: "Moderation" }] : []),
  ];

  return (
    <details className="md:hidden">
      <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center [&::-webkit-details-marker]:hidden">
        <span className="sr-only">Menu</span>
        <span className="relative block h-3.5 w-5" aria-hidden>
          <span className="absolute top-0 left-0 h-px w-5 bg-black" />
          <span className="absolute top-1.5 left-0 h-px w-5 bg-black" />
          <span className="absolute top-3 left-0 h-px w-5 bg-black" />
        </span>
      </summary>
      <nav className="fixed inset-x-0 top-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-50 overflow-y-auto border-b border-black/10 bg-[#f6f3ec] px-5 py-7 sm:px-6">
        <div className="flex flex-col gap-4">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="font-display text-[2rem] leading-none sm:text-4xl">
              {item.label}
            </Link>
          ))}
          {signedIn ? <SignOutForm className="pt-4" /> : null}
        </div>
      </nav>
    </details>
  );
}
