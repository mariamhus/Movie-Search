import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { MovieGrid } from "../components/MovieGrid";
import { StateMessage } from "../components/StateMessage";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useWatchlist } from "../hooks/useWatchlist";
import type { WatchlistItem } from "../lib/watchlist";

const SORTS = [
  { id: "added", label: "Recently added" },
  { id: "title", label: "Title" },
  { id: "release", label: "Release date" },
  { id: "rating", label: "Rating" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

const compare: Record<SortId, (a: WatchlistItem, b: WatchlistItem) => number> = {
  added: (a, b) => b.addedAt.localeCompare(a.addedAt),
  title: (a, b) => a.title.localeCompare(b.title),
  release: (a, b) => (b.release_date ?? "").localeCompare(a.release_date ?? ""),
  rating: (a, b) => b.vote_average - a.vote_average,
};

export function WatchlistPage() {
  useDocumentTitle("Watchlist");
  const { items } = useWatchlist();
  const [params, setParams] = useSearchParams();
  const sortParam = params.get("sort");
  const sort: SortId = SORTS.some((option) => option.id === sortParam) ? (sortParam as SortId) : "added";
  const sorted = useMemo(() => [...items].sort(compare[sort]), [items, sort]);

  return (
    <section aria-labelledby="watchlist-heading" className="pt-8 sm:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="watchlist-heading" className="font-display text-5xl font-extrabold tracking-tight">
            Watchlist
          </h1>
          <p className="mt-2 text-muted">
            {items.length === 0 ? "Nothing saved yet" : `${items.length} ${items.length === 1 ? "movie" : "movies"} to watch`}
          </p>
        </div>
        {items.length > 1 && (
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-muted">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(event) => {
                const next = new URLSearchParams(params);
                if (event.target.value === "added") next.delete("sort");
                else next.set("sort", event.target.value);
                setParams(next, { replace: true });
              }}
              className="h-10 rounded-full border border-line bg-surface px-4 text-sm font-medium focus:border-accent focus:outline-none"
            >
              {SORTS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="mt-8">
        {items.length === 0 ? (
          <StateMessage
            title="Your watchlist is empty"
            action={
              <Link to="/" className="button-primary">
                Browse movies
              </Link>
            }
          >
            Tap the bookmark on any movie to save it here for later.
          </StateMessage>
        ) : (
          <MovieGrid movies={sorted} />
        )}
      </div>
    </section>
  );
}
