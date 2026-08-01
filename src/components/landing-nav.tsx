import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/watchlist", label: "Watchlist" },
];

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(5,8,22,0.74)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[88rem] items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center border border-white/10 bg-[linear-gradient(180deg,rgba(90,141,255,0.26),rgba(255,141,79,0.18))] text-sm font-semibold text-white transition duration-300 group-hover:scale-[1.02]">
            <Image src="/logo.png" alt="MINGFO" width={48} height={48} className="h-full w-full object-cover" priority />
          </span>
          <span className="block">
            <span className="block text-[17px] font-semibold tracking-[0.18em] text-white">MINGFO</span>
            <span className="hidden text-[11px] uppercase tracking-[0.24em] text-white/40 sm:block">movie compass</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href === "/" ? "page" : undefined}
              className={`border-b py-1 text-sm font-medium transition duration-200 hover:border-ember-400/70 hover:text-white ${link.href === "/" ? "border-ember-400 text-white" : "border-transparent text-white/64"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/discover"
            className="inline-flex h-10 items-center border border-white/10 bg-white px-4 text-sm font-semibold text-ink-950 transition duration-200 hover:bg-slate-100"
          >
            Discover
          </Link>
        </div>
      </div>
    </header>
  );
}
