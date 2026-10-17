import type { Feed, Genre, ListId, MovieDetails, MovieSummary, Page } from "./types";

const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p";
const MAX_PAGES = 500;

const credential = (import.meta.env.VITE_TMDB_API_KEY ?? "").trim();
const usesReadToken = credential.length > 60;

export const hasApiKey = credential.length > 0;

export class TmdbError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
  }
}

type Params = Record<string, string | number | boolean | undefined>;

async function request<T>(path: string, params: Params = {}, signal?: AbortSignal): Promise<T> {
  const url = new URL(`${API_URL}${path}`);
  url.searchParams.set("language", "en-US");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const headers: Record<string, string> = { accept: "application/json" };
  if (usesReadToken) headers.Authorization = `Bearer ${credential}`;
  else url.searchParams.set("api_key", credential);

  let response: Response;
  try {
    response = await fetch(url, { headers, signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new TmdbError("Couldn't reach TMDB. Check your connection and try again.", 0);
  }

  if (response.status === 401) {
    throw new TmdbError("TMDB didn't accept the API key. Check VITE_TMDB_API_KEY and restart the app.", 401);
  }
  if (response.status === 404) throw new TmdbError("This movie isn't in TMDB's database.", 404);
  if (!response.ok) throw new TmdbError("TMDB isn't responding right now. Try again in a moment.", response.status);
  return response.json() as Promise<T>;
}

export const LISTS: { id: ListId; label: string }[] = [
  { id: "popular", label: "Popular" },
  { id: "top_rated", label: "Top rated" },
  { id: "now_playing", label: "In theaters" },
  { id: "upcoming", label: "Coming soon" },
];

export function isListId(value: string | null): value is ListId {
  return LISTS.some((list) => list.id === value);
}

export function fetchFeedPage(feed: Feed, page: number, signal?: AbortSignal): Promise<Page<MovieSummary>> {
  switch (feed.kind) {
    case "search":
      return request("/search/movie", { query: feed.query, page, include_adult: false }, signal);
    case "list":
      return request(`/movie/${feed.list}`, { page }, signal);
    case "genre":
      return request(
        "/discover/movie",
        { with_genres: feed.genreId, sort_by: "popularity.desc", "vote_count.gte": 50, include_adult: false, page },
        signal,
      );
  }
}

export function nextPage(last: Page<MovieSummary>): number | undefined {
  return last.page < Math.min(last.total_pages, MAX_PAGES) ? last.page + 1 : undefined;
}

export function fetchTrending(signal?: AbortSignal) {
  return request<Page<MovieSummary>>("/trending/movie/week", {}, signal);
}

export async function fetchGenres(signal?: AbortSignal): Promise<Genre[]> {
  const data = await request<{ genres: Genre[] }>("/genre/movie/list", {}, signal);
  return data.genres;
}

export function fetchMovie(id: number, signal?: AbortSignal) {
  return request<MovieDetails>(`/movie/${id}`, { append_to_response: "credits,videos,recommendations" }, signal);
}

export function imageUrl(path: string | null | undefined, size: "w185" | "w342" | "w500" | "w780" | "w1280"): string | null {
  return path ? `${IMAGE_URL}/${size}${path}` : null;
}
