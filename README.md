# MINGFO v2

MINGFO is a movie and TV discovery application focused on helping people find something worth watching without an endless catalog-first experience.

This repository is the second version of MINGFO, continued from the original project at [movie-ingfo](https://github.com/hilman-aprdi/movie-ingfo). The v2 version keeps the core idea—discovering movies through TMDB—but expands it into a server-rendered movie and TV experience with canonical detail pages, global search, genre exploration, and a private browser watchlist.

## Concept

MINGFO is built around a simple flow:

1. Discover trending, popular, upcoming, and highly rated titles.
2. Browse movies and TV shows by genre, year, language, or rating.
3. Search globally across movie and TV titles.
4. Open a focused detail page with synopsis, metadata, cast, seasons, trailers, and related titles.
5. Save titles locally to decide what to watch later.

MINGFO is a discovery platform, not a streaming service. It does not host, upload, or distribute movies or TV episodes.

## Main features

- Cinematic landing page with featured movie content and discovery shortcuts.
- Movie and TV show discovery modes.
- Trending movies and TV shows.
- Indonesian cinema exploration.
- Coming-soon and upcoming title sections.
- Genre, year, language, rating, and sort filters.
- Global movie and TV search.
- Canonical Movie and TV detail URLs using readable title slugs.
- Movie details including overview, runtime, cast, crew, videos, and related titles.
- TV details including seasons, episode counts, networks, creators, cast, videos, and similar shows.
- YouTube privacy-enhanced trailer embeds with one active player at a time.
- Private browser watchlist using `localStorage`.
- Responsive layouts for mobile, tablet, and desktop.
- Conservative server-side filtering for explicit adult content.
- About, Privacy Policy, and Terms of Use pages.

## Tech stack

- [Next.js](https://nextjs.org/) 15 with App Router
- React 19
- TypeScript with strict checking
- Tailwind CSS 3
- TMDB API for movie and TV data
- Next/Image for poster, backdrop, profile, and trailer thumbnails
- Node.js built-in test runner
- Vercel-compatible server rendering and caching
- `localStorage` for browser-only watchlist persistence

## Routes

- `/` — MINGFO v2 landing page
- `/discover` — movie and TV exploration, filters, collections, and pagination
- `/search` — global movie and TV search
- `/watchlist` — locally saved titles
- `/movie/{id}-{slug}` — movie detail page
- `/tv/{id}-{slug}` — TV series detail page
- `/tv/{id}-{slug}/season/{seasonNumber}` — TV season detail page
- `/about` — project information and TMDB attribution
- `/privacy` — privacy information
- `/terms` — terms of use

Legacy compatibility routes are kept where needed:

- `/home` redirects to `/`
- `/bookmarks` redirects to `/watchlist`

## Data and architecture

The project uses a server-first architecture:

- `src/app/` contains App Router pages, metadata, robots, and sitemap files.
- `src/components/` contains reusable UI and small interactive client components.
- `src/lib/tmdb.ts` contains the server-side TMDB request layer, response mapping, image helpers, and query helpers.
- `src/lib/types.ts` contains shared TypeScript models.
- `src/lib/bookmarks.ts` contains validated browser watchlist storage.
- `src/lib/content-safety.ts` contains conservative query and result filtering.
- `test/` contains unit tests for critical safety and URL behavior.

Movie and TV content remains server-rendered where possible. Browser-only behavior such as watchlist persistence, search interaction, filter dialogs, pagination input, and video selection is isolated in client components.

## Local setup

Requirements:

- Node.js 20 or newer
- npm
- A TMDB API key for live data

Install dependencies:

```bash
npm install
cp .env.example .env.local
```

Set the values in `.env.local`:

```env
TMDB_API_KEY=your_tmdb_api_key
TMDB_LANGUAGE=en-US
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`TMDB_API_KEY` is server-only. Never rename it with a `NEXT_PUBLIC_` prefix, commit `.env.local`, or expose it in browser code.

When no API key is available during local development, the project can use its small mock dataset. Production requires `TMDB_API_KEY` and does not silently fall back to mock content.

## Available commands

```bash
npm run dev
npm test
npm run lint
npm run typecheck
npm run build
npm run start
```

## Watchlist behavior

The watchlist is private to the current browser and is stored under the `mingfo-bookmarks` localStorage key.

- No user account is required.
- Watchlist data is not synchronized to a MINGFO database.
- Saved titles do not automatically follow the user to another device or browser.
- Clearing browser storage can remove saved titles.
- Invalid localStorage data is ignored so it does not break the application.

## Content safety

MINGFO applies a small, conservative server-side content-safety layer. It normalizes search text, blocks a limited set of explicit adult terms and phrases, sends `include_adult=false` to supported TMDB endpoints, and filters results marked as adult by TMDB.

This is not a complete moderation, age-verification, or content-classification system. Ambiguous words are intentionally not blocked to avoid hiding mainstream movie and TV titles.

## Third-party services and attribution

Movie and TV metadata, ratings, and imagery are provided through TMDB. Trailer and video content may be embedded from YouTube using its privacy-enhanced embed domain.

> This product uses the TMDB API but is not endorsed or certified by TMDB.

MINGFO does not claim ownership of third-party movie imagery, metadata, video content, or trademarks.

## Legal and transparency pages

The project includes:

- `/about` for the project concept, features, independence, and data attribution.
- `/privacy` for localStorage, technical data, third-party services, and privacy information.
- `/terms` for acceptable use, third-party data, service limitations, and project terms.

MINGFO is currently a noncommercial independent project. The legal pages describe the implementation as it exists today and should be reviewed again if accounts, payments, analytics, advertising, or other data services are introduced.

## Project status

MINGFO v2 is an actively refined movie and TV discovery project. The current priority is a focused, readable, and maintainable discovery experience rather than a full streaming catalog or social platform.

The project intentionally does not include user accounts, payments, cloud watchlist synchronization, or original editorial reviews.
