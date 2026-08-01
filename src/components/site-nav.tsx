"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/about", label: "About" },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="11" cy="11" r="5.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15.3 15.3 20 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function WatchlistIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v13.8l-6.5-3.8-6.5 3.8V6A1.5 1.5 0 0 1 7 4.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/") {
    return null;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 transition-colors duration-300",
        scrolled ? "bg-ink-950/96 shadow-[0_12px_40px_rgba(0,0,0,0.24)]" : "bg-ink-950/72 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex w-full max-w-[88rem] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center border border-white/10 bg-[linear-gradient(180deg,rgba(90,141,255,0.26),rgba(255,141,79,0.18))] text-sm font-semibold text-white transition duration-300 group-hover:scale-[1.02]">
            <Image src="/logo.png" alt="MINGFO" width={44} height={44} className="h-full w-full object-cover" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-base font-semibold tracking-[0.18em] text-white">MINGFO</span>
            <span className="block text-[11px] uppercase tracking-[0.26em] text-white/40">movie discovery</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "border-b border-transparent py-1 text-sm font-medium text-white/62 transition duration-200 hover:text-white",
                  active && "border-ember-400 text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search movies"
            className="inline-flex h-10 w-10 items-center justify-center border border-white/10 text-white/72 transition duration-200 hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            <SearchIcon />
          </Link>
          <Link
            href="/watchlist"
            aria-label="Watchlist"
            className="inline-flex h-10 w-10 items-center justify-center border border-white/10 text-white/72 transition duration-200 hover:border-white/20 hover:bg-white/5 hover:text-white md:w-auto md:justify-start md:px-3"
          >
            <WatchlistIcon />
            <span className="sr-only md:not-sr-only md:ml-2">Watchlist</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
