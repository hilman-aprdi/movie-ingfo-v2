const steps = [
  ["Find a title", "Browse trending lists, genres, upcoming releases, or search by name."],
  ["Check the details", "Open movie or TV information, cast, trailers, seasons, and similar titles."],
  ["Save it for later", "Add a title to your browser-based watchlist when you are not ready to watch it yet."],
] as const;

export function LandingHowItWorks() {
  return (
    <section className="grid gap-8 border-t border-white/10 pt-10 sm:pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16" aria-labelledby="how-it-works-heading">
      <div className="space-y-3">
        <p className="text-sm font-medium text-ember-300/90">How it works</p>
        <h2 id="how-it-works-heading" className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">From “what should I watch?” to a short list.</h2>
      </div>
      <ol className="divide-y divide-white/10 border-y border-white/10">
        {steps.map(([title, description], index) => (
          <li key={title} className="grid gap-3 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-5">
            <span className="text-sm font-semibold text-ember-300/85">0{index + 1}</span>
            <div><h3 className="text-base font-semibold text-white">{title}</h3><p className="mt-1.5 max-w-xl text-sm leading-6 text-white/55">{description}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
