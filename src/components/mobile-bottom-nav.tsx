"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/discover", label: "Discover", icon: CompassIcon },
  { href: "/watchlist", label: "Watchlist", icon: BookmarkIcon },
];

function iconClassName(active: boolean) {
  return cn("h-5 w-5", active ? "text-white" : "text-white/55");
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(active)} aria-hidden="true">
      <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6.5h-5V21H5a1 1 0 0 1-1-1v-8.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function CompassIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(active)} aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="m14.8 8.8-1.4 4.5-4.5 1.4 1.4-4.5 4.5-1.4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(active)} aria-hidden="true">
      <path d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v13.8l-6.5-3.8-6.5 3.8V6A1.5 1.5 0 0 1 7 4.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[linear-gradient(180deg,rgba(7,10,20,0.98),rgba(7,10,20,0.86))] px-3 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] pt-2 shadow-[0_-18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-[28rem] grid-cols-3 gap-2">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 border px-2 py-2 text-[11px] font-medium transition duration-200",
                active
                  ? "border-aurora-400/35 bg-[linear-gradient(180deg,rgba(90,141,255,0.18),rgba(90,141,255,0.06))] text-white"
                  : "border-transparent text-white/55 hover:border-white/10 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon active={active} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
