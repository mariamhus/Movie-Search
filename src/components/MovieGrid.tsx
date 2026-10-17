import { useEffect, useRef } from "react";
import { LoaderCircle } from "lucide-react";
import { MovieCard, MovieCardSkeleton } from "./MovieCard";
import type { MovieSummary } from "../lib/types";

export const GRID = "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

interface MovieGridProps {
  movies: MovieSummary[];
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export function MovieGrid({ movies, hasMore = false, loadingMore = false, onLoadMore }: MovieGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || !onLoadMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingMore) onLoadMore();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore]);

  return (
    <>
      <div className={GRID}>
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} eager={index < 6} />
        ))}
      </div>
      {hasMore && onLoadMore && (
        <div ref={sentinelRef} className="mt-10 flex justify-center">
          <button type="button" onClick={onLoadMore} disabled={loadingMore} className="button-secondary">
            {loadingMore && <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" />}
            {loadingMore ? "Loading more movies" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}

export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div role="status" className={GRID}>
      <span className="sr-only">Loading movies</span>
      {Array.from({ length: count }, (_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}
