"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/watchlist", label: "Watchlist" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(5,8,22,0.74)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[88rem] items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" aria-label="MINGFO home" className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300">
          <span className="grid h-12 w-12 place-items-center border border-white/10 bg-[linear-gradient(180deg,rgba(90,141,255,0.26),rgba(255,141,79,0.18))] text-sm font-semibold text-white transition duration-300 group-hover:scale-[1.02]">
            <Image src="/logo.png" alt="MINGFO" width={48} height={48} className="h-full w-full object-cover" priority={pathname === "/"} />
          </span>
          <span className="block">
            <span className="block text-[17px] font-semibold tracking-[0.18em] text-white">MINGFO</span>
            <span className="hidden text-[11px] uppercase tracking-[0.24em] text-white/40 sm:block">movie compass</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-7 md:flex" aria-label="Primary navigation">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "border-b py-1 text-sm font-medium transition duration-200 hover:border-ember-400/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300",
                  active && "border-ember-400 text-white",
                  !active && "border-transparent text-white/64",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href={pathname === "/" ? "/discover" : "/search"}
            aria-label={pathname === "/" ? "Discover movies and TV shows" : "Search movies and TV shows"}
            className="inline-flex h-10 items-center border border-white/10 bg-white px-4 text-sm font-semibold text-ink-950 transition duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300"
          >
            {pathname === "/" ? "Discover" : "Search"}
          </Link>
        </div>
      </div>
    </header>
  );
}
