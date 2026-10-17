import { Bookmark, BookmarkCheck } from "lucide-react";
import { useWatchlist } from "../hooks/useWatchlist";
import type { MovieSummary } from "../lib/types";

interface WatchlistButtonProps {
  movie: MovieSummary;
  variant?: "icon" | "full";
}

export function WatchlistButton({ movie, variant = "icon" }: WatchlistButtonProps) {
  const { has, toggle } = useWatchlist();
  const saved = has(movie.id);
  const Icon = saved ? BookmarkCheck : Bookmark;

  if (variant === "full") {
    return (
      <button type="button" aria-pressed={saved} onClick={() => toggle(movie)} className="button-secondary">
        <Icon aria-hidden="true" className="size-5" fill={saved ? "currentColor" : "none"} />
        {saved ? "On your watchlist" : "Add to watchlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
      title={saved ? "Remove from watchlist" : "Add to watchlist"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(movie);
      }}
      className={`grid size-9 place-items-center rounded-full backdrop-blur-md transition-colors ${
        saved ? "bg-bulb text-bulb-ink" : "bg-bg/70 text-ink hover:bg-bg/90"
      }`}
    >
      <Icon aria-hidden="true" className="size-4" fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
