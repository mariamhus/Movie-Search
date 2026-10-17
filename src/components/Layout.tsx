import { Bookmark } from "lucide-react";
import { Link, NavLink, Outlet, ScrollRestoration } from "react-router";
import { SearchBox } from "./SearchBox";
import { SetupNotice } from "./SetupNotice";
import { ThemeToggle } from "./ThemeToggle";
import { useWatchlist } from "../hooks/useWatchlist";
import { hasApiKey } from "../lib/tmdb";

export function Layout() {
  const { items } = useWatchlist();

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-line/60 bg-bg/85 backdrop-blur-lg">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-8 md:grid-cols-[auto_minmax(0,32rem)_1fr]">
          <Link to="/" className="font-display text-2xl font-extrabold tracking-tight">
            Movie Search
          </Link>
          <div className="col-span-2 row-start-2 md:col-span-1 md:row-start-auto">
            <SearchBox />
          </div>
          <nav aria-label="Main" className="flex items-center justify-end gap-2">
            <NavLink
              to="/watchlist"
              className={({ isActive }) =>
                `inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
                  isActive ? "bg-ink text-bg" : "hover:bg-surface"
                }`
              }
            >
              <Bookmark aria-hidden="true" className="size-4" />
              Watchlist
              {items.length > 0 && (
                <span className="rounded-full bg-bulb px-1.5 text-xs leading-5 font-bold text-bulb-ink tabular-nums">
                  {items.length}
                </span>
              )}
            </NavLink>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-8">
        {hasApiKey ? <Outlet /> : <SetupNotice />}
      </main>

      <footer className="mx-auto mt-20 w-full max-w-7xl border-t border-line px-4 py-6 text-sm text-muted sm:px-8">
        Movie data and images from{" "}
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="link">
          TMDB
        </a>
        . This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
      <ScrollRestoration />
    </div>
  );
}
