import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { FeaturedMovie, FeaturedMovieSkeleton } from "../components/FeaturedMovie";
import { MovieCard, MovieCardSkeleton } from "../components/MovieCard";
import { MovieGrid, MovieGridSkeleton } from "../components/MovieGrid";
import { MovieRow } from "../components/MovieRow";
import { StateMessage } from "../components/StateMessage";
import { useFeed, useGenres, useTrending } from "../hooks/queries";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { uniqueById } from "../lib/format";
import { isListId, LISTS } from "../lib/tmdb";
import type { Feed } from "../lib/types";

function FeedResults({ feed, emptyMessage }: { feed: Feed; emptyMessage: string }) {
  const query = useFeed(feed);
  const movies = useMemo(() => uniqueById(query.data?.pages.flatMap((page) => page.results) ?? []), [query.data]);
  const { hasNextPage, isFetching, fetchNextPage } = query;
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetching) void fetchNextPage();
  }, [hasNextPage, isFetching, fetchNextPage]);

  if (query.isPending) return <MovieGridSkeleton />;
  if (query.isError) {
    return (
      <StateMessage role="alert" title="Movies didn't load" onRetry={() => void query.refetch()}>
        {query.error.message}
      </StateMessage>
    );
  }
  if (movies.length === 0) return <StateMessage title="No movies found">{emptyMessage}</StateMessage>;
  return (
    <MovieGrid movies={movies} hasMore={Boolean(hasNextPage)} loadingMore={query.isFetchingNextPage} onLoadMore={loadMore} />
  );
}

function SearchResults({ query }: { query: string }) {
  const feed = useMemo<Feed>(() => ({ kind: "search", query }), [query]);
  const results = useFeed(feed);
  const total = results.data?.pages[0]?.total_results;

  return (
    <section aria-labelledby="results-heading" className="pt-8 sm:pt-12">
      <h1 id="results-heading" className="font-display text-5xl font-extrabold tracking-tight break-words">
        Results for “{query}”
      </h1>
      <p className="mt-2 min-h-6 text-muted" aria-live="polite">
        {total !== undefined && `${total.toLocaleString()} ${total === 1 ? "movie" : "movies"} found`}
      </p>
      <div className="mt-8">
        <FeedResults
          feed={feed}
          emptyMessage={`No movies match “${query}”. Check the spelling or try the original title.`}
        />
      </div>
    </section>
  );
}

function Browse() {
  const trending = useTrending();
  const genres = useGenres();
  const [params, setParams] = useSearchParams();
  const genreId = Number(params.get("genre"));
  const listParam = params.get("list");
  const activeGenre = genres.data?.find((genre) => genre.id === genreId);

  const feed = useMemo<Feed>(
    () =>
      genreId > 0 ? { kind: "genre", genreId } : { kind: "list", list: isListId(listParam) ? listParam : "popular" },
    [genreId, listParam],
  );

  function select(next: { list?: string; genre?: number }) {
    const search = new URLSearchParams();
    if (next.genre) search.set("genre", String(next.genre));
    else if (next.list && next.list !== "popular") search.set("list", next.list);
    setParams(search, { replace: true, preventScrollReset: true });
  }

  const featured = trending.data?.results[0];
  const rest = trending.data?.results.slice(1, 20) ?? [];

  return (
    <>
      {trending.isPending ? (
        <FeaturedMovieSkeleton />
      ) : trending.isError ? (
        <div className="pt-8">
          <StateMessage role="alert" title="Movies didn't load" onRetry={() => void trending.refetch()}>
            {trending.error.message}
          </StateMessage>
        </div>
      ) : (
        featured && <FeaturedMovie movie={featured} />
      )}

      {(trending.isPending || rest.length > 0) && (
        <div className="mt-12">
          <MovieRow title="Trending this week">
            {trending.isPending
              ? Array.from({ length: 8 }, (_, index) => <MovieCardSkeleton key={index} />)
              : rest.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </MovieRow>
        </div>
      )}

      <section aria-labelledby="browse-heading" className="mt-16">
        <h2 id="browse-heading" className="section-title">
          {activeGenre ? `Popular ${activeGenre.name.toLowerCase()} movies` : "Browse movies"}
        </h2>
        <div
          role="group"
          aria-label="Browse by"
          className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {LISTS.map((list) => (
            <button
              key={list.id}
              type="button"
              aria-pressed={feed.kind === "list" && feed.list === list.id}
              onClick={() => select({ list: list.id })}
              className="chip"
            >
              {list.label}
            </button>
          ))}
          {genres.data && <span aria-hidden="true" className="mx-1 w-px shrink-0 self-stretch bg-line" />}
          {genres.data?.map((genre) => (
            <button
              key={genre.id}
              type="button"
              aria-pressed={feed.kind === "genre" && feed.genreId === genre.id}
              onClick={() => select({ genre: genre.id })}
              className="chip"
            >
              {genre.name}
            </button>
          ))}
        </div>
        <div className="mt-8">
          <FeedResults key={JSON.stringify(feed)} feed={feed} emptyMessage="There are no movies in this list right now." />
        </div>
      </section>
    </>
  );
}

export function HomePage() {
  const [params] = useSearchParams();
  const query = (params.get("q") ?? "").trim();
  useDocumentTitle(query ? `Results for “${query}”` : null);
  return query ? <SearchResults key={query} query={query} /> : <Browse />;
}
