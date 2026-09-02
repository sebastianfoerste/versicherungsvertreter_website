import { useEffect, useState } from "react";
import { BREADCRUMB, PAGE_SECTIONS } from "../config";
import { cn } from "../utils/cn";

export function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="no-print border-b border-gc-border-light bg-white">
      <div className="gc-container">
        <ol className="flex flex-wrap items-center gap-x-2 py-3 text-[12px] tracking-[0.08em] text-gc-muted">
          {BREADCRUMB.map((item, i) => {
            const last = i === BREADCRUMB.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-x-2">
                {item.href && !last ? (
                  <a href={item.href} className="transition-colors hover:text-gc-burgundy">
                    {item.label}
                  </a>
                ) : (
                  <span className="font-normal text-gc-black" aria-current="page">
                    {item.label}
                  </span>
                )}
                {!last && (
                  <span aria-hidden="true" className="text-gc-border">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export function PageNav() {
  const [active, setActive] = useState<string>(PAGE_SECTIONS[0].id);

  useEffect(() => {
    const sections = PAGE_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="no-print sticky z-40 hidden border-b border-gc-border-light bg-white/95 backdrop-blur-sm md:block"
      style={{ top: "var(--gc-header-height)" }}
    >
      <div className="gc-container">
        <nav aria-label="Auf dieser Seite" className="flex items-center gap-1 overflow-x-auto">
          <span className="mr-3 shrink-0 text-[11px] uppercase tracking-[0.2em] text-gc-soft">
            Auf dieser Seite
          </span>
          {PAGE_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cn(
                "relative shrink-0 px-3 py-4 text-[12px] font-normal uppercase tracking-[0.12em] transition-colors",
                active === s.id ? "text-gc-burgundy" : "text-gc-muted hover:text-gc-black",
              )}
              aria-current={active === s.id ? "location" : undefined}
            >
              {s.label}
              <span
                className={cn(
                  "absolute inset-x-3 bottom-0 h-[2px] bg-gc-burgundy transition-opacity",
                  active === s.id ? "opacity-100" : "opacity-0",
                )}
              />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
