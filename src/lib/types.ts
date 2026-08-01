export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface MovieSummary {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  rating: number;
  voteCount?: number;
  popularity?: number;
  genreIds: number[];
  genreNames: string[];
  mediaType?: "movie" | "tv";
  adult?: boolean;
}

export interface MovieDetails extends MovieSummary {
  adult: boolean;
  runtime: number;
  status: string;
  tagline: string | null;
  videos: Video[];
  cast?: CastMember[];
  crew?: Array<{ id: number; name: string; job: string }>;
  originalLanguage?: string;
  productionCountries?: string[];
  productionCompanies?: string[];
  budget?: number;
  revenue?: number;
  recommendations?: MovieSummary[];
}

export interface TvSeason {
  id: number;
  name: string;
  seasonNumber: number;
  airDate: string;
  episodeCount: number;
  overview: string;
  posterPath: string | null;
}

export interface TvDetails extends MovieSummary {
  mediaType: "tv";
  adult: boolean;
  runtime: number;
  status: string;
  tagline: string | null;
  videos: Video[];
  cast?: CastMember[];
  originalLanguage?: string;
  originCountries?: string[];
  productionCompanies?: string[];
  networks?: string[];
  creators?: string[];
  lastAirDate?: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  seasons?: TvSeason[];
  recommendations?: MovieSummary[];
}

export interface PagedResponse<T> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}

export interface BookmarkMovie extends MovieSummary {
  savedAt: string;
}
