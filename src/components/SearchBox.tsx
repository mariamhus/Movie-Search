import { useEffect, useRef, useState, type FormEvent } from "react";
import { LoaderCircle, Search, X } from "lucide-react";
import { useIsFetching } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useDebounce } from "../hooks/useDebounce";

export function SearchBox() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";
  const urlQuery = onHome ? (params.get("q") ?? "") : "";
  const [value, setValue] = useState(urlQuery);
  const debounced = useDebounce(value.trim(), 350);
  const lastApplied = useRef(urlQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const searching = useIsFetching({ queryKey: ["feed", { kind: "search" }] }) > 0;

  useEffect(() => {
    if (urlQuery !== lastApplied.current) {
      lastApplied.current = urlQuery;
      setValue(urlQuery);
    }
  }, [urlQuery]);

  function apply(query: string) {
    if (query === lastApplied.current) return;
    lastApplied.current = query;
    if (query) {
      navigate({ pathname: "/", search: `?q=${encodeURIComponent(query)}` }, { replace: onHome && urlQuery !== "" });
    } else if (onHome) {
      navigate("/", { replace: true });
    }
  }

  useEffect(() => {
    apply(debounced);
  }, [debounced]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    apply(value.trim());
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative w-full">
      <label htmlFor="movie-search" className="sr-only">
        Search movies
      </label>
      <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
      <input
        ref={inputRef}
        id="movie-search"
        type="search"
        value={value}
        autoComplete="off"
        spellCheck={false}
        placeholder="Search for a movie"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setValue("");
            apply("");
          }
        }}
        className="h-11 w-full rounded-full border border-line bg-surface pr-11 pl-11 text-[15px] placeholder:text-muted focus:border-accent focus:outline-none"
      />
      {searching ? (
        <LoaderCircle
          aria-hidden="true"
          className="absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted motion-safe:animate-spin"
        />
      ) : (
        value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              apply("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-ink"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )
      )}
    </form>
  );
}
