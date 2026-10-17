import { Link } from "react-router";
import { StateMessage } from "../components/StateMessage";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function NotFoundPage() {
  useDocumentTitle("Page not found");
  return (
    <div className="pt-12">
      <StateMessage
        title="Page not found"
        action={
          <Link to="/" className="button-primary">
            Browse movies
          </Link>
        }
      >
        The link may be broken, or the page may have moved.
      </StateMessage>
    </div>
  );
}
