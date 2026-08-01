import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Discover what fits",
    description: "Browse trending titles, genres, ratings, and curated collections.",
    href: "/discover",
    action: "Explore titles",
  },
  {
    number: "02",
    title: "Search movies and TV",
    description: "Find a title quickly and open its details.",
    href: "/search",
    action: "Search titles",
  },
  {
    number: "03",
    title: "Save for later",
    description: "Build a private watchlist stored locally in the browser.",
    href: "/watchlist",
    action: "Open watchlist",
  },
];

function FeatureIcon({ number }: { number: string }) {
  if (number === "01") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 lg:h-6 lg:w-6" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="m15.7 8.3-2.1 5.3-5.3 2.1 2.1-5.3 5.3-2.1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="1.1" fill="currentColor" />
      </svg>
    );
  }

  if (number === "02") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 lg:h-6 lg:w-6" aria-hidden="true">
        <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.6" />
        <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 lg:h-6 lg:w-6" aria-hidden="true">
      <path d="M6.5 4.75A1.75 1.75 0 0 1 8.25 3h7.5a1.75 1.75 0 0 1 1.75 1.75v16.1l-5.5-3.2-5.5 3.2V4.75Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function LandingFeatureGrid() {
  return (
    <section className="space-y-6 border-y border-white/10 py-10 sm:py-12" aria-labelledby="features-heading">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-medium text-ember-300/90">What MINGFO does</p>
        <h2 id="features-heading" className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">A simpler way to decide what to watch.</h2>
        <p className="text-sm leading-7 text-white/60 sm:text-base">The essentials for finding something to watch, without filling the page with noise.</p>
      </div>
      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.number} className="min-w-0 border-t border-white/15 pt-4 text-center">
            <div className="flex items-center justify-center gap-3 text-ember-300/90">
              <FeatureIcon number={feature.number} />
              <p className="text-xs font-medium tracking-[0.16em]">{feature.number}</p>
            </div>
            <h3 className="mt-4 text-lg font-semibold leading-6 text-white">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">{feature.description}</p>
            <Link href={feature.href} className="mt-4 inline-flex py-1 text-sm font-medium text-white/70 transition hover:text-ember-200 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300">{feature.action} <span className="ml-1" aria-hidden="true">→</span></Link>
          </article>
        ))}
      </div>
    </section>
  );
}
