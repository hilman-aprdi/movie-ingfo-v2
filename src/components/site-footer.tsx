import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="mx-auto grid w-full max-w-[88rem] gap-10 px-4 pb-28 pt-12 sm:px-6 md:pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pt-14">
        <div className="order-2 space-y-3 lg:order-1">
          <p className="text-sm font-semibold tracking-[0.18em] text-white">MINGFO</p>
          <p className="max-w-md text-[15px] leading-7 text-white/60">Movie Compass for discovering trending films, browsing genres, searching titles, and saving what you want to watch next.</p>
          <p className="pt-2 text-xs text-white/35">© {new Date().getFullYear()} MINGFO</p>
        </div>

        <div className="order-1 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-white/65 sm:grid-cols-3 lg:order-2 lg:grid-cols-2">
          <nav aria-label="Footer navigation" className="col-span-2 grid grid-cols-2 gap-3 sm:col-span-3 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-2">
            <Link className="transition hover:text-white" href="/">Home</Link>
            <Link className="transition hover:text-white" href="/discover">Discover</Link>
            <Link className="transition hover:text-white" href="/search">Search</Link>
            <Link className="transition hover:text-white" href="/watchlist">Watchlist</Link>
            <Link className="transition hover:text-white" href="/about">About</Link>
            <Link className="transition hover:text-white" href="/privacy">Privacy</Link>
            <Link className="transition hover:text-white" href="/terms">Terms</Link>
          </nav>
          <p className="col-span-2 max-w-sm text-[13px] leading-6 text-white/55 sm:col-span-3 lg:col-span-2">
            Movie data and images provided by <a className="font-medium text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white" href="https://www.themoviedb.org/" rel="noreferrer">TMDB</a>. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
