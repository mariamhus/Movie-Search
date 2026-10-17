import { useState } from "react";
import { Clapperboard } from "lucide-react";
import { imageUrl } from "../lib/tmdb";

interface PosterProps {
  path: string | null;
  title: string;
  size?: "w185" | "w342" | "w500";
  eager?: boolean;
  className?: string;
}

export function Poster({ path, title, size = "w342", eager = false, className = "" }: PosterProps) {
  const [failed, setFailed] = useState(false);
  const src = imageUrl(path, size);

  return (
    <div className={`relative aspect-[2/3] overflow-hidden rounded-lg bg-raised ${className}`}>
      {src && !failed ? (
        <img
          src={src}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center text-muted">
          <Clapperboard aria-hidden="true" className="size-7" strokeWidth={1.5} />
          <span className="line-clamp-3 text-sm font-medium">{title}</span>
        </div>
      )}
    </div>
  );
}
