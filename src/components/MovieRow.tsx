import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MovieRowProps {
  title: string;
  children: ReactNode;
  itemClassName?: string;
}

export function MovieRow({ title, children, itemClassName = "w-36 sm:w-44" }: MovieRowProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const headingId = `row-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  function scroll(direction: 1 | -1) {
    const list = listRef.current;
    if (!list) return;
    list.scrollBy({ left: direction * list.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <section aria-labelledby={headingId}>
      <div className="flex items-end justify-between gap-4">
        <h2 id={headingId} className="section-title">
          {title}
        </h2>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`} className="icon-button">
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`} className="icon-button">
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
      <ul
        ref={listRef}
        className="scrollbar-none -mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pt-1 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8"
      >
        {Array.isArray(children)
          ? children.map((child, index) => (
              <li key={index} className={`shrink-0 snap-start ${itemClassName}`}>
                {child}
              </li>
            ))
          : children}
      </ul>
    </section>
  );
}
