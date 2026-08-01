import Link from "next/link";

export function LandingTrustNote() {
  return (
    <section className="grid gap-4 border-y border-white/10 py-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-8" aria-labelledby="trust-heading">
      <div className="max-w-3xl space-y-2">
        <p className="text-sm font-medium text-ember-300/90">A discovery interface, not a streaming service</p>
        <h2 id="trust-heading" className="text-xl font-semibold tracking-[-0.02em] text-white">MINGFO helps you find what to watch next.</h2>
        <p className="text-sm leading-6 text-white/55">Movie and TV data, ratings, and images are provided through TMDB. MINGFO is an independent project and is not endorsed or certified by TMDB.</p>
      </div>
      <Link href="/about" className="inline-flex h-10 items-center border border-white/10 px-4 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300">About MINGFO</Link>
    </section>
  );
}
