import { useSyncExternalStore } from "react";
import { watchlist } from "../lib/watchlist";

export function useWatchlist() {
  const items = useSyncExternalStore(watchlist.subscribe, watchlist.getSnapshot);
  return {
    items,
    has: (id: number) => items.some((item) => item.id === id),
    toggle: watchlist.toggle,
  };
}
