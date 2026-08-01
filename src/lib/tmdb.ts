import type { CastMember, Genre, MovieDetails, MovieSummary, PagedResponse, TvDetails, TvSeason, Video } from "@/lib/types";
import {
  getMockGenres,
  getMockMovieById,
  getMockMoviesByGenre,
  getMockSearchResults,
  getMockTrendingMovies,
  hasMockMovie,
} from "@/lib/mock-data";
import { evaluateSearchSafety, filterSafeSummaryResults } from "@/lib/content-safety";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const TMDB_LANGUAGE = process.env.TMDB_LANGUAGE?.trim() || "en-US";
const TMDB_API_KEY = process.env.TMDB_API_KEY?.trim();
const TMDB_REQUEST_TIMEOUT_MS = 10_000;

type RequestParams = Record<string, string | number | undefined>;

type RawVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export class TmdbRequestError extends Error {
  constructor(public readonly status: number) {
    super(`TMDB request failed with status ${status}`);
    this.name = "TmdbRequestError";
  }
}

export class RestrictedSearchError extends Error {
  constructor() {
    super("SEARCH_RESTRICTED");
    this.name = "RestrictedSearchError";
  }
}

export class RestrictedMediaError extends Error {
  constructor() {
    super("MEDIA_RESTRICTED");
    this.name = "RestrictedMediaError";
  }
}

function hasRealApiKey() {
  if (process.env.NODE_ENV === "production" && !TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY_MISSING");
  }

  return typeof TMDB_API_KEY === "string" && TMDB_API_KEY.trim().length > 0;
}

function buildUrl(path: string, params: RequestParams = {}) {
  const url = new URL(`${TMDB_BASE_URL}/${path}`);
  url.searchParams.set("language", TMDB_LANGUAGE);

  if (TMDB_API_KEY) {
    url.searchParams.set("api_key", TMDB_API_KEY);
  }

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && `${value}`.length > 0) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function tmdbRequest<T>(path: string, params: RequestParams = {}): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    next: { revalidate: 60 * 60 },
    signal: AbortSignal.timeout(TMDB_REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new TmdbRequestError(response.status);
  }

  return (await response.json()) as T;
}

function mapGenreList(genres: Array<{ id: number; name: string }>) {
  return genres.map((genre) => ({ id: genre.id, name: genre.name }));
}

function mapSummary(movie: {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number | null;
  vote_count?: number | null;
  popularity?: number | null;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  media_type?: "movie" | "tv";
  adult?: boolean;
}): MovieSummary {
  return {
    id: movie.id,
    title: movie.title?.trim() || movie.name?.trim() || "Untitled",
    overview: movie.overview?.trim() || "No overview available.",
    posterPath: movie.poster_path ?? null,
    backdropPath: movie.backdrop_path ?? null,
    releaseDate: movie.release_date || "",
    rating: Number(movie.vote_average ?? 0),
    voteCount: Number(movie.vote_count ?? 0),
    popularity: Number(movie.popularity ?? 0),
    genreIds: movie.genre_ids ?? movie.genres?.map((genre) => genre.id) ?? [],
    genreNames: movie.genres?.map((genre) => genre.name) ?? [],
    mediaType: movie.media_type ?? "movie",
    adult: movie.adult === true,
  };
}

function mapVideo(video: RawVideo): Video {
  return {
    id: video.id,
    key: video.key,
    name: video.name,
    site: video.site,
    type: video.type,
    official: video.official,
  };
}

function mapDetails(movie: {
  id: number;
  adult?: boolean;
  title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number | null;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  runtime?: number | null;
  status?: string;
  tagline?: string | null;
  videos?: { results?: RawVideo[] };
  original_language?: string;
  production_countries?: Array<{ name: string }>;
  production_companies?: Array<{ name: string }>;
  budget?: number | null;
  revenue?: number | null;
  credits?: {
    cast?: Array<{ id: number; name: string; character?: string; profile_path?: string | null }>;
    crew?: Array<{ id: number; name: string; job?: string }>;
  };
  recommendations?: PagedResponse<{
    id: number;
    title?: string;
    overview?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    release_date?: string;
    vote_average?: number | null;
    genre_ids?: number[];
    genres?: Array<{ id: number; name: string }>;
  }>;
}): MovieDetails {
  const summary = mapSummary(movie);

  return {
    ...summary,
    adult: movie.adult === true,
    runtime: Number(movie.runtime ?? 0),
    status: movie.status || "Unknown",
    tagline: movie.tagline ?? null,
    videos: movie.videos?.results?.map(mapVideo) ?? [],
    originalLanguage: movie.original_language,
    productionCountries: movie.production_countries?.map((country) => country.name) ?? [],
    productionCompanies: movie.production_companies?.map((company) => company.name) ?? [],
    budget: Number(movie.budget ?? 0),
    revenue: Number(movie.revenue ?? 0),
    cast: movie.credits?.cast?.slice(0, 12).map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character?.trim() || "Unknown role",
      profilePath: member.profile_path ?? null,
    })),
    crew: movie.credits?.crew?.filter((member) => member.job).map((member) => ({
      id: member.id,
      name: member.name,
      job: member.job as string,
    })),
    recommendations: filterSafeSummaryResults(movie.recommendations?.results?.map(mapSummary) ?? []),
  };
}

export function posterUrl(path: string | null, size = "w780") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : "/placeholder-poster.svg";
}

export function backdropUrl(path: string | null, size = "w1280") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : "/placeholder-backdrop.svg";
}

export function profileUrl(path: string | null, size = "w185") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null;
}

export async function getGenres(): Promise<Genre[]> {
  if (!hasRealApiKey()) {
    return getMockGenres();
  }

  const data = await tmdbRequest<{ genres: Array<{ id: number; name: string }> }>(
    "genre/movie/list",
  );

  return mapGenreList(data.genres);
}

export async function getTvGenres(): Promise<Genre[]> {
  if (!hasRealApiKey()) {
    return getMockGenres();
  }

  const data = await tmdbRequest<{ genres: Array<{ id: number; name: string }> }>("genre/tv/list");
  return mapGenreList(data.genres);
}

export async function getTrendingMovies(page = 1): Promise<PagedResponse<MovieSummary>> {
  if (!hasRealApiKey()) {
    return getMockTrendingMovies(page);
  }

  const data = await tmdbRequest<PagedResponse<MovieSummary>>("trending/movie/week", { page, include_adult: "false" });
  return {
    ...data,
    results: filterSafeSummaryResults(data.results.map(mapSummary)),
  };
}

export async function getTrendingTv(page = 1): Promise<PagedResponse<MovieSummary>> {
  if (!hasRealApiKey()) {
    const data = getMockTrendingMovies(page);
    return { ...data, results: data.results.map((item) => ({ ...item, mediaType: "tv" as const })) };
  }

  const data = await tmdbRequest<PagedResponse<MovieSummary>>("trending/tv/week", { page, include_adult: "false" });
  return { ...data, results: filterSafeSummaryResults(data.results.map((item) => mapSummary({ ...item, media_type: "tv" }))) };
}

export type DiscoverMediaType = "movie" | "tv";

export interface DiscoverFilters {
  genre?: number;
  originCountry?: string;
  year?: number;
  minRating?: number;
  minVotes?: number;
  language?: string;
  sort?: string;
  page?: number;
}

export async function getDiscoverResults(mediaType: DiscoverMediaType, filters: DiscoverFilters = {}): Promise<PagedResponse<MovieSummary>> {
  const page = filters.page ?? 1;
  if (!hasRealApiKey()) {
    const data = getMockMoviesByGenre(filters.genre ?? 0, page);
    return { ...data, results: data.results.map((item) => ({ ...item, mediaType })) };
  }

  const path = mediaType === "tv" ? "discover/tv" : "discover/movie";
  const sortBy = mediaType === "tv"
    ? filters.sort?.replace("primary_release_date", "first_air_date")
    : filters.sort;
  const params: RequestParams = {
    page,
    sort_by: sortBy || "popularity.desc",
    with_genres: filters.genre,
    with_origin_country: filters.originCountry,
    with_original_language: filters.language,
    "vote_average.gte": filters.minRating,
    "vote_count.gte": filters.minVotes,
    include_adult: "false",
    ...(mediaType === "tv" ? { first_air_date_year: filters.year } : { primary_release_year: filters.year }),
  };
  const data = await tmdbRequest<PagedResponse<MovieSummary>>(path, params);
  return {
    ...data,
    results: filterSafeSummaryResults(data.results.map((item) => mapSummary({ ...item, media_type: mediaType }))),
  };
}

export function getIndonesianDiscover(mediaType: DiscoverMediaType, page = 1) {
  return getDiscoverResults(mediaType, { page, sort: "popularity.desc", originCountry: "ID" });
}

export function getHighlyRated(mediaType: DiscoverMediaType, page = 1) {
  return getDiscoverResults(mediaType, { page, sort: "vote_average.desc", minRating: 7, minVotes: 200 });
}

export async function getPopularMovies(page = 1): Promise<PagedResponse<MovieSummary>> {
  if (!hasRealApiKey()) {
    return getMockTrendingMovies(page);
  }

  const data = await tmdbRequest<PagedResponse<MovieSummary>>("movie/popular", { page, include_adult: "false" });
  return {
    ...data,
    results: filterSafeSummaryResults(data.results.map(mapSummary)),
  };
}

async function getRegionalMovies(path: string, page = 1): Promise<PagedResponse<MovieSummary>> {
  if (!hasRealApiKey()) {
    return getMockTrendingMovies(page);
  }

  const data = await tmdbRequest<PagedResponse<MovieSummary>>(path, {
    language: "id-ID",
    region: "ID",
    page,
    include_adult: "false",
  });

  return {
    ...data,
    results: filterSafeSummaryResults(data.results.map(mapSummary)),
  };
}

export function getNowPlayingMoviesIndonesia(page = 1) {
  return getRegionalMovies("movie/now_playing", page);
}

export function getUpcomingMoviesIndonesia(page = 1) {
  return getRegionalMovies("movie/upcoming", page);
}

export async function getUpcomingTv(page = 1): Promise<PagedResponse<MovieSummary>> {
  if (!hasRealApiKey()) {
    const data = getMockTrendingMovies(page);
    return { ...data, results: data.results.map((item) => ({ ...item, mediaType: "tv" as const })) };
  }

  const today = new Date().toISOString().slice(0, 10);
  const data = await tmdbRequest<PagedResponse<MovieSummary>>("discover/tv", {
    first_air_date_gte: today,
    sort_by: "first_air_date.asc",
    include_adult: "false",
    page,
  });

  return { ...data, results: filterSafeSummaryResults(data.results.map((item) => mapSummary({ ...item, media_type: "tv" }))) };
}

export async function getMoviesByGenre(genreId: number, page = 1): Promise<PagedResponse<MovieSummary>> {
  if (!hasRealApiKey()) {
    return getMockMoviesByGenre(genreId, page);
  }

  const data = await tmdbRequest<PagedResponse<MovieSummary>>("discover/movie", {
    with_genres: genreId,
    include_adult: "false",
    page,
  });

  return {
    ...data,
    results: filterSafeSummaryResults(data.results.map(mapSummary)),
  };
}

export async function searchMovies(query: string, page = 1): Promise<PagedResponse<MovieSummary>> {
  if (!evaluateSearchSafety(query).allowed) throw new RestrictedSearchError();
  if (!hasRealApiKey()) {
    return getMockSearchResults(query, page);
  }

  const data = await tmdbRequest<PagedResponse<MovieSummary>>("search/movie", {
    query,
    page,
    include_adult: "false",
  });

  return {
    ...data,
    results: filterSafeSummaryResults(data.results.map(mapSummary)),
  };
}

export async function searchTv(query: string, page = 1): Promise<PagedResponse<MovieSummary>> {
  if (!evaluateSearchSafety(query).allowed) throw new RestrictedSearchError();
  if (!hasRealApiKey()) {
    const data = getMockSearchResults(query, page);
    return { ...data, results: data.results.map((item) => ({ ...item, mediaType: "tv" as const })) };
  }

  const data = await tmdbRequest<PagedResponse<MovieSummary>>("search/tv", {
    query,
    page,
    include_adult: "false",
  });

  return {
    ...data,
    results: filterSafeSummaryResults(data.results.map((item) => mapSummary({ ...item, media_type: "tv" }))),
  };
}

export async function searchMulti(query: string, page = 1): Promise<PagedResponse<MovieSummary>> {
  if (!evaluateSearchSafety(query).allowed) throw new RestrictedSearchError();
  if (!hasRealApiKey()) {
    return getMockSearchResults(query, page);
  }

  const data = await tmdbRequest<PagedResponse<{
    id: number;
    adult?: boolean;
    media_type?: string;
    title?: string;
    name?: string;
    overview?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average?: number | null;
    vote_count?: number | null;
    popularity?: number | null;
    genre_ids?: number[];
  }>>("search/multi", { query, page, include_adult: "false" });

  const results = data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => mapSummary({
      ...item,
      title: item.title ?? item.name,
      release_date: item.release_date ?? item.first_air_date,
      media_type: item.media_type as "movie" | "tv",
    }));

  return { ...data, results: filterSafeSummaryResults(results) };
}

export async function getTvByGenre(genreId: number, page = 1): Promise<PagedResponse<MovieSummary>> {
  if (!hasRealApiKey()) {
    const data = getMockMoviesByGenre(genreId, page);
    return {
      ...data,
      results: data.results.map((movie) => ({ ...movie, mediaType: "tv" as const })),
    };
  }

  const data = await tmdbRequest<PagedResponse<{
    id: number;
    name?: string;
    overview?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    first_air_date?: string;
    vote_average?: number | null;
    vote_count?: number | null;
    popularity?: number | null;
    genre_ids?: number[];
  }>>("discover/tv", { with_genres: genreId, page, include_adult: "false" });

  return {
    ...data,
    results: filterSafeSummaryResults(data.results.map((show) => mapSummary({
      ...show,
      title: show.name,
      release_date: show.first_air_date,
      media_type: "tv",
    }))),
  };
}

export async function getTvById(id: number): Promise<TvDetails> {
  if (!hasRealApiKey()) {
    const fallback = getMockMovieById(id);
    return { ...fallback, mediaType: "tv", seasons: [] };
  }

  type RawSeason = {
    id: number;
    name?: string;
    season_number?: number;
    air_date?: string;
    episode_count?: number;
    overview?: string;
    poster_path?: string | null;
  };
  type RawShow = {
    id: number;
    adult?: boolean;
    name?: string;
    overview?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    first_air_date?: string;
    vote_average?: number | null;
    vote_count?: number | null;
    popularity?: number | null;
    genres?: Array<{ id: number; name: string }>;
    episode_run_time?: number[];
    status?: string;
    tagline?: string | null;
    last_air_date?: string;
    number_of_seasons?: number;
    number_of_episodes?: number;
    original_language?: string;
    origin_country?: string[];
    created_by?: Array<{ id: number; name: string }>;
    networks?: Array<{ id: number; name: string }>;
    production_companies?: Array<{ id: number; name: string }>;
    seasons?: RawSeason[];
    videos?: { results?: RawVideo[] };
    similar?: PagedResponse<{
      id: number;
      name?: string;
      overview?: string;
      poster_path?: string | null;
      backdrop_path?: string | null;
      first_air_date?: string;
      vote_average?: number | null;
      vote_count?: number | null;
      popularity?: number | null;
      genre_ids?: number[];
    }>;
  };
  type RawAggregateCredits = {
    cast?: Array<{
      id: number;
      name: string;
      profile_path?: string | null;
      order?: number;
      roles?: Array<{ character?: string; episode_count?: number }>;
    }>;
  };

  const [showResult, aggregateCreditsResult] = await Promise.allSettled([
    tmdbRequest<RawShow>(`tv/${id}`, { append_to_response: "videos,similar" }),
    tmdbRequest<RawAggregateCredits>(`tv/${id}/aggregate_credits`),
  ]);

  if (showResult.status === "rejected") {
    throw showResult.reason;
  }

  const show = showResult.value;
  if (show.adult === true) throw new RestrictedMediaError();
  const aggregateCredits = aggregateCreditsResult.status === "fulfilled" ? aggregateCreditsResult.value : undefined;
  const cast: CastMember[] | undefined = aggregateCredits?.cast
    ?.slice()
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
    .slice(0, 12)
    .map((member) => ({
      id: member.id,
      name: member.name,
      character: member.roles?.map((role) => role.character).filter(Boolean).slice(0, 2).join(" / ") || "Cast member",
      profilePath: member.profile_path ?? null,
    }));

  return {
    ...mapSummary({
      ...show,
      title: show.name,
      release_date: show.first_air_date,
      media_type: "tv",
    }),
    mediaType: "tv",
    adult: false,
    runtime: show.episode_run_time?.[0] ?? 0,
    status: show.status || "Unknown",
    tagline: show.tagline ?? null,
    videos: show.videos?.results?.map(mapVideo) ?? [],
    cast,
    originalLanguage: show.original_language,
    originCountries: show.origin_country ?? [],
    productionCompanies: show.production_companies?.map((company) => company.name) ?? [],
    networks: show.networks?.map((network) => network.name) ?? [],
    creators: show.created_by?.map((creator) => creator.name) ?? [],
    lastAirDate: show.last_air_date,
    numberOfSeasons: show.number_of_seasons,
    numberOfEpisodes: show.number_of_episodes,
    seasons: show.seasons?.map((season): TvSeason => ({
      id: season.id,
      name: season.name?.trim() || `Season ${season.season_number ?? 0}`,
      seasonNumber: Number(season.season_number ?? 0),
      airDate: season.air_date || "",
      episodeCount: Number(season.episode_count ?? 0),
      overview: season.overview?.trim() || "",
      posterPath: season.poster_path ?? null,
    })).filter((season) => season.seasonNumber > 0) ?? [],
    recommendations: filterSafeSummaryResults(show.similar?.results?.map((recommendation) => mapSummary({
      ...recommendation,
      title: recommendation.name,
      release_date: recommendation.first_air_date,
      media_type: "tv",
    })) ?? []),
  };
}

export async function getTvSeasonById(tvId: number, seasonNumber: number) {
  type SeasonEpisode = { id: number; name: string; episodeNumber: number; airDate: string; overview: string; runtime: number };
  if (!hasRealApiKey()) {
    return {
      id: seasonNumber,
      name: `Season ${seasonNumber}`,
      seasonNumber,
      airDate: "",
      episodeCount: 0,
      overview: "",
      posterPath: null,
      episodes: [] as SeasonEpisode[],
    };
  }

  const season = await tmdbRequest<{
    id: number;
    name?: string;
    season_number?: number;
    air_date?: string;
    episode_count?: number;
    overview?: string;
    poster_path?: string | null;
    episodes?: Array<{ id: number; name: string; episode_number: number; air_date?: string; overview?: string; still_path?: string | null; runtime?: number | null }>;
  }>(`tv/${tvId}/season/${seasonNumber}`);

  return {
    id: season.id,
    name: season.name || `Season ${seasonNumber}`,
    seasonNumber: Number(season.season_number ?? seasonNumber),
    airDate: season.air_date || "",
    episodeCount: Number(season.episode_count ?? 0),
    overview: season.overview || "",
    posterPath: season.poster_path ?? null,
    episodes: season.episodes?.map((episode): SeasonEpisode => ({
      id: episode.id,
      name: episode.name,
      episodeNumber: episode.episode_number,
      airDate: episode.air_date || "",
      overview: episode.overview || "",
      runtime: Number(episode.runtime ?? 0),
    })) ?? [],
  };
}

export async function getMovieById(id: number): Promise<MovieDetails> {
  if (!hasRealApiKey()) {
    if (!hasMockMovie(id)) {
      throw new Error("MOVIE_NOT_FOUND");
    }

    return getMockMovieById(id);
  }

  const [movie, videos] = await Promise.all([
    tmdbRequest<{
    id: number;
    adult?: boolean;
    title?: string;
    overview?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    release_date?: string;
    vote_average?: number | null;
    genre_ids?: number[];
    genres?: Array<{ id: number; name: string }>;
    runtime?: number | null;
    status?: string;
    tagline?: string | null;
    original_language?: string;
    production_countries?: Array<{ name: string }>;
    production_companies?: Array<{ name: string }>;
    budget?: number | null;
    revenue?: number | null;
    credits?: {
      cast?: Array<{ id: number; name: string; character?: string; profile_path?: string | null }>;
      crew?: Array<{ id: number; name: string; job?: string }>;
    };
    recommendations?: PagedResponse<{
      id: number;
      title?: string;
      overview?: string;
      poster_path?: string | null;
      backdrop_path?: string | null;
      release_date?: string;
      vote_average?: number | null;
      genre_ids?: number[];
      genres?: Array<{ id: number; name: string }>;
    }>;
  }>(`movie/${id}`, { append_to_response: "credits,recommendations" }),
    getMovieVideos(id).catch(() => []),
  ]);

  if (movie.adult === true) throw new RestrictedMediaError();
  return mapDetails({ ...movie, videos: { results: videos } });
}

export async function getMovieVideos(id: number): Promise<Video[]> {
  if (!hasRealApiKey()) {
    return getMockMovieById(id).videos;
  }

  const data = await tmdbRequest<{
    id: number;
    results: RawVideo[];
  }>(`movie/${id}/videos`);

  return data.results.map(mapVideo);
}

export function buildQueryHref(basePath: string, params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && `${value}`.trim().length > 0) {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function normalizePage(page: string | string[] | undefined) {
  const raw = Array.isArray(page) ? page[0] : page;
  const parsed = Number(raw ?? "1");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
