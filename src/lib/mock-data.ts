import type { Genre, MovieDetails, MovieSummary, PagedResponse } from "@/lib/types";

export const mockGenres: Genre[] = [
  { id: 28, name: "Action" },
  { id: 16, name: "Animation" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 12, name: "Adventure" },
  { id: 18, name: "Drama" },
  { id: 35, name: "Comedy" },
];

const movies: MovieDetails[] = [
  {
    id: 101,
    adult: false,
    title: "Crimson Orbit",
    overview:
      "A pilot and a rogue systems engineer race to stop a drifting warship from erasing a city above the clouds.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2025-03-14",
    rating: 8.6,
    genreIds: [28, 878, 12],
    genreNames: ["Action", "Science Fiction", "Adventure"],
    runtime: 134,
    status: "Released",
    tagline: "The sky remembers everything.",
    videos: [
      {
        id: "v101-1",
        key: "dQw4w9WgXcQ",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      },
    ],
  },
  {
    id: 102,
    adult: false,
    title: "Lantern Echo",
    overview:
      "A quiet animator discovers that the characters in her sketchbook can whisper back at night.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2024-11-08",
    rating: 8.1,
    genreIds: [16, 12, 18],
    genreNames: ["Animation", "Adventure", "Drama"],
    runtime: 108,
    status: "Released",
    tagline: "Drawn into a world she cannot erase.",
    videos: [
      {
        id: "v102-1",
        key: "QH2-TGUlwu4",
        name: "Teaser Clip",
        site: "YouTube",
        type: "Clip",
        official: false,
      },
    ],
  },
  {
    id: 103,
    adult: false,
    title: "Hollow Signal",
    overview:
      "A rescue crew answers a distress signal from a station that appears only when nobody is looking at it.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2024-09-19",
    rating: 7.9,
    genreIds: [27, 53, 878],
    genreNames: ["Horror", "Thriller", "Science Fiction"],
    runtime: 117,
    status: "Released",
    tagline: "If you hear it, it has already found you.",
    videos: [],
  },
  {
    id: 104,
    adult: false,
    title: "Neon Vanguard",
    overview:
      "An underground courier carries a drive that can expose the city council's synthetic memory program.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2025-01-25",
    rating: 8.4,
    genreIds: [28, 53, 878],
    genreNames: ["Action", "Thriller", "Science Fiction"],
    runtime: 126,
    status: "Released",
    tagline: "Fast enough to outrun the truth.",
    videos: [],
  },
  {
    id: 105,
    adult: false,
    title: "Ash House",
    overview:
      "Three friends stay overnight in a burned manor and uncover the family that never left the walls.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2024-10-31",
    rating: 7.8,
    genreIds: [27, 18],
    genreNames: ["Horror", "Drama"],
    runtime: 101,
    status: "Released",
    tagline: "Some homes keep their grief.",
    videos: [],
  },
  {
    id: 106,
    adult: false,
    title: "Aurora Drift",
    overview:
      "A transport ship crew follows a strange aurora to a planet where time moves out of order.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2025-02-07",
    rating: 8.0,
    genreIds: [16, 878, 12],
    genreNames: ["Animation", "Science Fiction", "Adventure"],
    runtime: 112,
    status: "Released",
    tagline: "The horizon is alive.",
    videos: [],
  },
  {
    id: 107,
    adult: false,
    title: "Atlas Run",
    overview:
      "A former street racer is pulled into a convoy mission that crosses a failing megacity during blackout season.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2024-08-02",
    rating: 7.6,
    genreIds: [28, 53],
    genreNames: ["Action", "Thriller"],
    runtime: 119,
    status: "Released",
    tagline: "Every route has a price.",
    videos: [],
  },
  {
    id: 108,
    adult: false,
    title: "Mirror Children",
    overview:
      "A town's children begin speaking in one voice after the first winter storm breaks the lake's ice.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2024-12-13",
    rating: 7.7,
    genreIds: [27, 18, 53],
    genreNames: ["Horror", "Drama", "Thriller"],
    runtime: 104,
    status: "Released",
    tagline: "They came back different.",
    videos: [],
  },
];

function toSummary(movie: MovieDetails): MovieSummary {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.posterPath,
    backdropPath: movie.backdropPath,
    releaseDate: movie.releaseDate,
    rating: movie.rating,
    genreIds: movie.genreIds,
    genreNames: movie.genreNames,
    adult: false,
  };
}

function buildPagedResponse(items: MovieSummary[], page: number, pageSize: number): PagedResponse<MovieSummary> {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const totalResults = items.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const start = (safePage - 1) * pageSize;
  const results = items.slice(start, start + pageSize);

  return {
    page: Math.min(safePage, totalPages),
    total_pages: totalPages,
    total_results: totalResults,
    results,
  };
}

export function getMockGenres() {
  return mockGenres;
}

export function getMockTrendingMovies(page = 1, pageSize = 6): PagedResponse<MovieSummary> {
  return buildPagedResponse(movies.map(toSummary), page, pageSize);
}

export function getMockMoviesByGenre(genreId: number, page = 1, pageSize = 6): PagedResponse<MovieSummary> {
  const results = movies.filter((movie) => movie.genreIds.includes(genreId)).map(toSummary);
  return buildPagedResponse(results.length > 0 ? results : movies.map(toSummary), page, pageSize);
}

export function getMockSearchResults(query: string, page = 1, pageSize = 6): PagedResponse<MovieSummary> {
  const normalized = query.trim().toLowerCase();
  const results = movies.filter((movie) => movie.title.toLowerCase().includes(normalized)).map(toSummary);
  return buildPagedResponse(results.length > 0 ? results : movies.map(toSummary), page, pageSize);
}

export function getMockMovieById(id: number): MovieDetails {
  return movies.find((movie) => movie.id === id) ?? movies[0];
}

export function hasMockMovie(id: number) {
  return movies.some((movie) => movie.id === id);
}
