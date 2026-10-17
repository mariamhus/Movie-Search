export interface MovieSummary {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average: number;
  vote_count?: number;
  overview?: string;
}

export interface Page<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
}

export interface Video {
  key: string;
  site: string;
  type: string;
  name: string;
  official?: boolean;
}

export interface MovieDetails extends MovieSummary {
  tagline: string | null;
  runtime: number | null;
  genres: Genre[];
  status: string;
  credits: { cast: CastMember[]; crew: CrewMember[] };
  videos: { results: Video[] };
  recommendations: Page<MovieSummary>;
}

export type Feed =
  | { kind: "search"; query: string }
  | { kind: "list"; list: ListId }
  | { kind: "genre"; genreId: number };

export type ListId = "popular" | "top_rated" | "now_playing" | "upcoming";
