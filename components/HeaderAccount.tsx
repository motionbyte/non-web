"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileNav } from "@/components/MobileNav";

type MeState = { signedIn: boolean; moderator: boolean };

export function HeaderAccount() {
  const [me, setMe] = useState<MeState>({ signedIn: false, moderator: false });

  useEffect(() => {
    let live = true;
    fetch("/api/v1/me", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!live || !data?.user) return;
        const role = data.user.role;
        setMe({ signedIn: true, moderator: role === "moderator" || role === "desk" });
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  return (
    <div className="flex items-center gap-3 sm:gap-5">
      <Link href="/search" aria-label="Search the encyclopedia" className="text-black/70 hover:text-black">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </Link>
      {me.signedIn ? (
        <>
          {me.moderator ? (
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
      <MobileNav signedIn={me.signedIn} moderator={me.moderator} />
    </div>
  );
}
