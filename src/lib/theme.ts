export type Theme = "light" | "dark";

const KEY = "movies:theme";
const META_COLORS: Record<Theme, string> = { dark: "#10141f", light: "#f5f6f9" };
const listeners = new Set<() => void>();
const media = window.matchMedia("(prefers-color-scheme: light)");

function readStored(): Theme | null {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

let stored = readStored();
let current: Theme = resolve();

function resolve(): Theme {
  return stored ?? (media.matches ? "light" : "dark");
}

function apply() {
  current = resolve();
  document.documentElement.dataset.theme = current;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", META_COLORS[current]);
  for (const listener of listeners) listener();
}

apply();

media.addEventListener("change", () => {
  if (!stored) apply();
});

window.addEventListener("storage", (event) => {
  if (event.key !== KEY) return;
  stored = readStored();
  apply();
});

export const theme = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return current;
  },
  toggle() {
    stored = current === "dark" ? "light" : "dark";
    try {
      window.localStorage.setItem(KEY, stored);
    } catch {
      // Still switch for this session when storage is unavailable.
    }
    apply();
  },
};
