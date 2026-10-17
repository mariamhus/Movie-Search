import type { MovieSummary } from "./types";

export interface WatchlistItem extends MovieSummary {
  addedAt: string;
}

const KEY = "movies:watchlist";
const listeners = new Set<() => void>();

function read(): WatchlistItem[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as WatchlistItem[]) : [];
  } catch {
    return [];
  }
}

let items: WatchlistItem[] = read();

function emit() {
  for (const listener of listeners) listener();
}

function write(next: WatchlistItem[]) {
  items = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    emit();
    return;
  }
  emit();
}

window.addEventListener("storage", (event) => {
  if (event.key !== KEY) return;
  items = read();
  emit();
});

export const watchlist = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return items;
  },
  toggle(movie: MovieSummary) {
    if (items.some((item) => item.id === movie.id)) {
      write(items.filter((item) => item.id !== movie.id));
      return false;
    }
    const entry: WatchlistItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      addedAt: new Date().toISOString(),
    };
    write([entry, ...items]);
    return true;
  },
};
