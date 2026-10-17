import type { MovieSummary, Video } from "./types";

export function releaseYear(date?: string): string | null {
  return date && date.length >= 4 ? date.slice(0, 4) : null;
}

export function formatDate(date?: string): string | null {
  if (!date) return null;
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

export function formatRuntime(minutes: number | null): string | null {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

export function formatRating(movie: Pick<MovieSummary, "vote_average" | "vote_count">): string | null {
  if (!movie.vote_average || movie.vote_count === 0) return null;
  return movie.vote_average.toFixed(1);
}

export function pickTrailer(videos: Video[]): Video | null {
  const youtube = videos.filter((video) => video.site === "YouTube");
  return (
    youtube.find((video) => video.type === "Trailer" && video.official) ??
    youtube.find((video) => video.type === "Trailer") ??
    youtube.find((video) => video.type === "Teaser") ??
    null
  );
}

export function uniqueById<T extends { id: number }>(items: T[]): T[] {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
