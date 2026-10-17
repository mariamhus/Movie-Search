import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { theme } from "../lib/theme";

export function ThemeToggle() {
  const current = useSyncExternalStore(theme.subscribe, theme.getSnapshot);
  const next = current === "dark" ? "light" : "dark";

  return (
    <button type="button" onClick={theme.toggle} className="icon-button" aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}>
      {current === "dark" ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
    </button>
  );
}
