import { KeyRound } from "lucide-react";

export function SetupNotice() {
  return (
    <section aria-labelledby="setup-heading" className="mx-auto max-w-2xl py-16">
      <KeyRound aria-hidden="true" className="size-9 text-bulb" strokeWidth={1.6} />
      <h1 id="setup-heading" className="mt-4 font-display text-5xl font-bold tracking-tight">
        Add your TMDB API key
      </h1>
      <p className="mt-3 text-lg text-muted">
        This app gets its movie data from TMDB. A free API key takes a couple of minutes to set up.
      </p>
      <ol className="mt-8 space-y-5">
        <li className="setup-step">
          <span className="setup-number">1</span>
          <p>
            Create a free account at{" "}
            <a href="https://www.themoviedb.org/signup" target="_blank" rel="noreferrer" className="link">
              themoviedb.org
            </a>
            .
          </p>
        </li>
        <li className="setup-step">
          <span className="setup-number">2</span>
          <p>
            Open{" "}
            <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" className="link">
              Settings, then API
            </a>
            , request a developer key, and copy the API Key or the API Read Access Token.
          </p>
        </li>
        <li className="setup-step">
          <span className="setup-number">3</span>
          <div className="min-w-0">
            <p>
              Create a file called <code>.env.local</code> in the project folder with this line:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-surface px-4 py-3 text-sm">
              VITE_TMDB_API_KEY=your_key_here
            </pre>
          </div>
        </li>
        <li className="setup-step">
          <span className="setup-number">4</span>
          <p>
            Stop the dev server and run <code>npm run dev</code> again. When deploying, add the same variable in your
            hosting provider's environment settings and redeploy.
          </p>
        </li>
      </ol>
    </section>
  );
}
