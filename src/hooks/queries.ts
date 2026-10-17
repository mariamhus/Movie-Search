import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchFeedPage, fetchGenres, fetchMovie, fetchTrending, nextPage } from "../lib/tmdb";
import type { Feed } from "../lib/types";

export function useTrending() {
  return useQuery({
    queryKey: ["trending"],
    queryFn: ({ signal }) => fetchTrending(signal),
    staleTime: 30 * 60 * 1000,
  });
}

export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: ({ signal }) => fetchGenres(signal),
    staleTime: Infinity,
  });
}

export function useMovie(id: number) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: ({ signal }) => fetchMovie(id, signal),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useFeed(feed: Feed) {
  return useInfiniteQuery({
    queryKey: ["feed", feed],
    queryFn: ({ pageParam, signal }) => fetchFeedPage(feed, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled: feed.kind !== "search" || feed.query.length > 0,
  });
}
