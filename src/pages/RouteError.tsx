import { isRouteErrorResponse, useRouteError } from "react-router";

export function RouteError() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-5xl font-extrabold tracking-tight">
        {notFound ? "Page not found" : "Something went wrong"}
      </h1>
      <p className="mt-3 text-muted">
        {notFound ? "The link may be broken, or the page may have moved." : "Reload the page to try again."}
      </p>
      <a href="/" className="button-primary mt-8">
        Go to home page
      </a>
    </main>
  );
}
