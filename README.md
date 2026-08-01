# MINGFO

MINGFO is a movie and TV discovery application for finding trending titles, browsing genres, searching globally, opening movie or TV details, and saving titles to a private browser watchlist.

## Stack

- Next.js App Router
- TypeScript with strict checking
- Tailwind CSS
- TMDB API
- Vercel-compatible deployment
- `localStorage` for the watchlist

## Routes

- `/` — landing page
- `/discover` — movie and TV exploration, filters, and pagination
- `/search` — global movie and TV search
- `/watchlist` — locally saved titles
- `/movie/{id}-{slug}` — movie details
- `/tv/{id}-{slug}` — TV series details
- `/tv/{id}-{slug}/season/{seasonNumber}` — TV season details
- `/about` — project information and TMDB attribution
- `/privacy` — privacy information
- `/terms` — terms of use

The legacy `/home` and `/bookmarks` paths redirect to their current equivalents when compatibility is needed.

## Local setup

Requirements: Node.js 20 or newer and npm.

```bash
npm install
cp .env.example .env.local
```

Set the environment variables in `.env.local`:

```env
TMDB_API_KEY=your_tmdb_api_key
TMDB_LANGUAGE=en-US
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`TMDB_API_KEY` is server-only and must not use the `NEXT_PUBLIC_` prefix. Never commit `.env.local` or a real key.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run start
```

## Vercel deployment

Create a Vercel project connected to this repository and configure these environment variables for the required environments:

- `TMDB_API_KEY` — TMDB server-side API key
- `TMDB_LANGUAGE` — optional metadata language, defaults to `en-US`
- `NEXT_PUBLIC_SITE_URL` — public canonical site URL, for example `https://your-domain.example`

Run lint, typecheck, and build before deploying. Watchlist data is stored in each visitor's browser and is not synchronized to Vercel or a MINGFO database.

## TMDB attribution

Movie and TV metadata and imagery are provided through TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.

## Google Search Console

After the production domain is configured:

1. Verify the domain or URL prefix in [Google Search Console](https://search.google.com/search-console).
2. Submit `https://your-production-domain.example/sitemap.xml` under **Sitemaps**.
3. Check `https://your-production-domain.example/robots.txt` and use URL Inspection for `/`, `/discover`, and representative Movie/TV detail URLs.
4. Review the reported canonical URL, rendered metadata, indexing status, and Core Web Vitals after production traffic is available.

The sitemap contains the main static pages plus a limited set of current trending Movie and TV URLs. Search queries and personal watchlists are intentionally excluded from indexing targets.

MINGFO applies a small, conservative server-side content-safety filter to explicit adult search terms and TMDB results. It is not a complete moderation or age-classification system.
