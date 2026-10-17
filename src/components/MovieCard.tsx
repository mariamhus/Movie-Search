import { Star } from "lucide-react";
import { Link } from "react-router";
import { Poster } from "./Poster";
import { WatchlistButton } from "./WatchlistButton";
import { formatRating, releaseYear } from "../lib/format";
import type { MovieSummary } from "../lib/types";

interface MovieCardProps {
  movie: MovieSummary;
  eager?: boolean;
}

export function MovieCard({ movie, eager }: MovieCardProps) {
  const year = releaseYear(movie.release_date);
  const rating = formatRating(movie);

  return (
    <article className="group relative">
      <Link to={`/movie/${movie.id}`} className="block rounded-lg">
        <Poster
          path={movie.poster_path}
          title={movie.title}
          eager={eager}
          className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_14px_30px_-12px_rgb(0_0_0/0.8)]"
        />
        <h3 className="mt-2.5 line-clamp-2 leading-snug font-semibold">{movie.title}</h3>
      </Link>
      <p className="mt-1 flex items-center gap-3 text-sm text-muted">
        {year && <span>{year}</span>}
        {rating ? (
          <span className="inline-flex items-center gap-1">
            <Star aria-hidden="true" className="size-3.5 text-bulb" fill="currentColor" />
            <span className="sr-only">Rated </span>
            {rating}
          </span>
        ) : (
          <span>Not rated yet</span>
        )}
      </p>
      <div className="absolute top-2 right-2">
        <WatchlistButton movie={movie} />
      </div>
    </article>
  );
}

export function MovieCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="aspect-[2/3] rounded-lg bg-raised motion-safe:animate-pulse" />
      <div className="mt-3 h-4 w-4/5 rounded bg-raised motion-safe:animate-pulse" />
      <div className="mt-2 h-3.5 w-2/5 rounded bg-raised motion-safe:animate-pulse" />
    </div>
  );
}
