import type { ReactNode } from "react";
import { RotateCw } from "lucide-react";

interface StateMessageProps {
  title: string;
  children?: ReactNode;
  onRetry?: () => void;
  action?: ReactNode;
  role?: "alert" | "status";
}

export function StateMessage({ title, children, onRetry, action, role = "status" }: StateMessageProps) {
  return (
    <div role={role} className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
      <p className="font-display text-3xl font-bold tracking-tight">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-muted">{children}</div>}
      {(onRetry || action) && (
        <div className="mt-6 flex justify-center">
          {onRetry ? (
            <button type="button" onClick={onRetry} className="button-secondary">
              <RotateCw aria-hidden="true" className="size-4" />
              Try again
            </button>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
}
