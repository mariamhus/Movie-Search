import { Star } from "lucide-react";
import { Link } from "react-router";
import { WatchlistButton } from "./WatchlistButton";
import { formatRating, releaseYear } from "../lib/format";
import { imageUrl } from "../lib/tmdb";
import type { MovieSummary } from "../lib/types";

export function FeaturedMovie({ movie }: { movie: MovieSummary }) {
  const backdrop = imageUrl(movie.backdrop_path, "w1280");
  const year = releaseYear(movie.release_date);
  const rating = formatRating(movie);

  return (
    <section aria-labelledby="featured-title" className="featured relative -mx-4 overflow-hidden sm:mx-0 sm:mt-6 sm:rounded-3xl">
      {backdrop && <img src={backdrop} alt="" className="absolute inset-0 size-full object-cover object-top" />}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/10 sm:bg-gradient-to-r sm:from-bg/95 sm:via-bg/60 sm:to-transparent" />
      <div className="relative flex min-h-[30rem] max-w-2xl flex-col justify-end px-4 pt-40 pb-8 sm:min-h-[34rem] sm:px-10 sm:pb-12">
        <p className="font-semibold text-bulb">Number one trending this week</p>
        <h1 id="featured-title" className="mt-2 font-display text-[clamp(3.25rem,9vw,6.75rem)] leading-[0.88] font-extrabold tracking-tight">
          {movie.title}
        </h1>
        <p className="mt-4 flex items-center gap-4 text-ink/85">
          {year && <span>{year}</span>}
          {rating && (
            <span className="inline-flex items-center gap-1.5">
              <Star aria-hidden="true" className="size-4 text-bulb" fill="currentColor" />
              {rating}
              <span className="sr-only">out of 10</span>
            </span>
          )}
        </p>
        {movie.overview && <p className="mt-3 line-clamp-3 max-w-xl text-lg text-ink/85">{movie.overview}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={`/movie/${movie.id}`} className="button-primary">
            See details
          </Link>
          <WatchlistButton movie={movie} variant="full" />
        </div>
      </div>
    </section>
  );
}

export function FeaturedMovieSkeleton() {
  return <div aria-hidden="true" className="-mx-4 h-[30rem] bg-surface motion-safe:animate-pulse sm:mx-0 sm:mt-6 sm:h-[34rem] sm:rounded-3xl" />;
}
