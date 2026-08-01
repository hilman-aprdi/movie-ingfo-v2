import Image from "next/image";
import Link from "next/link";
import type { MovieSummary } from "@/lib/types";
import { backdropUrl } from "@/lib/tmdb";

const shortcuts = [
  { title: "Highly rated", href: "/discover?collection=top-rated" },
  { title: "Coming soon", href: "/discover?collection=coming-soon" },
  { title: "Browse genres", href: "/discover" },
  { title: "Trending now", href: "/discover?collection=trending" },
];

interface LandingDiscoveryShortcutsProps {
  movies: MovieSummary[];
}

export function LandingDiscoveryShortcuts({ movies }: LandingDiscoveryShortcutsProps) {
  return (
    <section className="space-y-5" aria-labelledby="shortcuts-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ember-300/90">Keep exploring</p>
          <h2 id="shortcuts-heading" className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
            Find your way in
          </h2>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {shortcuts.map((shortcut, index) => {
          const imagePath = movies[index]?.backdropPath;

          return (
            <Link
              key={shortcut.href}
              href={shortcut.href}
              className="group relative isolate flex min-h-28 items-end overflow-hidden border border-white/10 bg-ink-900/70 p-4 transition hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300"
            >
              {imagePath ? (
                <Image
                  src={backdropUrl(imagePath)}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="-z-20 object-cover opacity-55 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-70"
                />
              ) : null}
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,_rgba(5,8,22,0.12)_0%,_rgba(5,8,22,0.9)_100%)]" />
              <span className="relative text-base font-semibold text-white transition group-hover:text-ember-200">
                {shortcut.title}
                <span className="ml-2 text-white/45" aria-hidden="true">→</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
