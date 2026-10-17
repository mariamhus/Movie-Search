import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Video } from "../lib/types";

interface TrailerDialogProps {
  video: Video | null;
  movieTitle: string;
  open: boolean;
  onClose: () => void;
}

export function TrailerDialog({ video, movieTitle, open, onClose }: TrailerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-label={`${movieTitle} trailer`}
      className="trailer"
    >
      <div className="flex items-center justify-between gap-4 pb-3">
        <p className="truncate font-semibold">{video?.name ?? `${movieTitle} trailer`}</p>
        <button type="button" onClick={onClose} aria-label="Close trailer" className="icon-button">
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>
      <div className="aspect-video overflow-hidden rounded-lg bg-black">
        {open && video && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0`}
            title={video.name}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="size-full"
          />
        )}
      </div>
    </dialog>
  );
}
