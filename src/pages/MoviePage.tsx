import { useState } from "react";
import { Play, Star } from "lucide-react";
import { Link, useParams } from "react-router";
import { MovieCard } from "../components/MovieCard";
import { MovieRow } from "../components/MovieRow";
import { Poster } from "../components/Poster";
import { StateMessage } from "../components/StateMessage";
import { TrailerDialog } from "../components/TrailerDialog";
import { WatchlistButton } from "../components/WatchlistButton";
import { useMovie } from "../hooks/queries";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { formatDate, formatRuntime, pickTrailer, releaseYear, uniqueById } from "../lib/format";
import { imageUrl, TmdbError } from "../lib/tmdb";
import type { MovieDetails } from "../lib/types";
import { NotFoundPage } from "./NotFoundPage";

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold">{children}</dd>
    </div>
  );
}

function MovieView({ movie }: { movie: MovieDetails }) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const backdrop = imageUrl(movie.backdrop_path, "w1280");
  const trailer = pickTrailer(movie.videos.results);
  const released = formatDate(movie.release_date);
  const runtime = formatRuntime(movie.runtime);
  const directors = movie.credits.crew.filter((person) => person.job === "Director").map((person) => person.name);
  const cast = movie.credits.cast.slice(0, 16);
  const recommendations = uniqueById(movie.recommendations.results).slice(0, 18);

  return (
    <article>
      <div className="relative -mx-4 h-64 overflow-hidden sm:mx-0 sm:mt-6 sm:h-[26rem] sm:rounded-3xl">
        {backdrop && <img src={backdrop} alt="" className="absolute inset-0 size-full object-cover object-[center_20%]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-bg/20" />
      </div>

      <div className="relative -mt-28 grid gap-8 sm:-mt-44 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-12">
        <Poster
          path={movie.poster_path}
          title={movie.title}
          size="w500"
          eager
          className="w-40 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.9)] ring-1 ring-ink/10 sm:ml-8 sm:w-52 md:w-[calc(100%-2rem)]"
        />

        <div className="md:pt-36">
          <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.9] font-extrabold tracking-tight">
            {movie.title}
          </h1>
          {movie.tagline && <p className="mt-3 text-lg text-muted">{movie.tagline}</p>}

          <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:flex sm:flex-wrap">
            {released && <Fact label={movie.status === "Released" ? "Released" : "Release date"}>{released}</Fact>}
            {runtime && <Fact label="Runtime">{runtime}</Fact>}
            {movie.vote_count ? (
              <Fact label="Rating">
                <span className="inline-flex items-center gap-1.5">
                  <Star aria-hidden="true" className="size-4 text-bulb" fill="currentColor" />
                  {movie.vote_average.toFixed(1)}
                  <span className="font-normal text-muted">/ 10</span>
                </span>
                <span className="block text-sm font-normal text-muted">
                  {movie.vote_count.toLocaleString()} {movie.vote_count === 1 ? "vote" : "votes"}
                </span>
              </Fact>
            ) : null}
            {directors.length > 0 && <Fact label={directors.length > 1 ? "Directors" : "Director"}>{directors.join(", ")}</Fact>}
          </dl>

          {movie.genres.length > 0 && (
            <ul aria-label="Genres" className="mt-6 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <li key={genre.id}>
                  <Link to={`/?genre=${genre.id}`} className="chip inline-flex items-center">
                    {genre.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {trailer && (
              <button type="button" onClick={() => setTrailerOpen(true)} className="button-primary">
                <Play aria-hidden="true" className="size-4" fill="currentColor" />
                Watch trailer
              </button>
            )}
            <WatchlistButton movie={movie} variant="full" />
          </div>

          <section aria-labelledby="overview-heading" className="mt-10 max-w-2xl">
            <h2 id="overview-heading" className="section-title">
              Overview
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-ink/90">
              {movie.overview || "TMDB doesn't have an overview for this movie yet."}
            </p>
          </section>
        </div>
      </div>

      {cast.length > 0 && (
        <div className="mt-16">
          <MovieRow title="Cast" itemClassName="w-28 sm:w-36">
            {cast.map((person) => (
              <div key={person.id}>
                <Poster path={person.profile_path} title={person.name} size="w185" />
                <p className="mt-2 text-sm leading-snug font-semibold">{person.name}</p>
                {person.character && <p className="mt-0.5 line-clamp-2 text-sm text-muted">{person.character}</p>}
              </div>
            ))}
          </MovieRow>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-16">
          <MovieRow title="More like this">
            {recommendations.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </MovieRow>
        </div>
      )}

      <TrailerDialog video={trailer} movieTitle={movie.title} open={trailerOpen} onClose={() => setTrailerOpen(false)} />
    </article>
  );
}

function MovieSkeleton() {
  return (
    <div role="status" aria-hidden="false">
      <span className="sr-only">Loading movie</span>
      <div aria-hidden="true" className="-mx-4 h-64 bg-surface motion-safe:animate-pulse sm:mx-0 sm:mt-6 sm:h-[26rem] sm:rounded-3xl" />
      <div aria-hidden="true" className="relative -mt-28 grid gap-8 sm:-mt-44 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-12">
        <div className="aspect-[2/3] w-40 rounded-lg bg-raised motion-safe:animate-pulse sm:ml-8 sm:w-52 md:w-[calc(100%-2rem)]" />
        <div className="space-y-4 md:pt-36">
          <div className="h-16 w-3/4 rounded-lg bg-raised motion-safe:animate-pulse" />
          <div className="h-5 w-1/2 rounded bg-raised motion-safe:animate-pulse" />
          <div className="h-24 w-full max-w-2xl rounded-lg bg-raised motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function MoviePage() {
  const { id } = useParams();
  const movieId = Number(id);
  const valid = Number.isInteger(movieId) && movieId > 0;
  const query = useMovie(movieId);
  const movie = query.data;
  const year = releaseYear(movie?.release_date);
  useDocumentTitle(movie ? `${movie.title}${year ? ` (${year})` : ""}` : null);

  if (!valid) return <NotFoundPage />;
  if (query.isPending) return <MovieSkeleton />;
  if (query.isError) {
    const missing = query.error instanceof TmdbError && query.error.status === 404;
    return (
      <div className="pt-12">
        <StateMessage
          role="alert"
          title={missing ? "Movie not found" : "This movie didn't load"}
          onRetry={missing ? undefined : () => void query.refetch()}
          action={
            <Link to="/" className="button-secondary">
              Browse movies
            </Link>
          }
        >
          {query.error.message}
        </StateMessage>
      </div>
    );
  }
  return <MovieView key={query.data.id} movie={query.data} />;
}
