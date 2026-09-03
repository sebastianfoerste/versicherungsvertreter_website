import { useEffect, useMemo, useRef, useState } from "react";
import { FAQ_ITEMS, REQUIREMENTS, SERVICES } from "../data/content";
import { PAGE_SECTIONS } from "../config";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

interface SearchEntry {
  type: "Abschnitt" | "FAQ" | "Rechtsbegriff" | "Leistung";
  title: string;
  snippet: string;
  href: string;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  // Global keydown for Escape and Cmd+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else {
          const btn = document.querySelector("[aria-label='Suche']") as HTMLButtonElement;
          btn?.click();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const allEntries: SearchEntry[] = useMemo(() => {
    const list: SearchEntry[] = [];

    // Page sections
    PAGE_SECTIONS.forEach((s) => {
      list.push({
        type: "Abschnitt",
        title: s.label,
        snippet: `Direktsprung zum Abschnitt „${s.label}“ auf dieser Seite.`,
        href: `#${s.id}`,
      });
    });

    // FAQs
    FAQ_ITEMS.forEach((f) => {
      list.push({
        type: "FAQ",
        title: f.q,
        snippet: f.a,
        href: "#faq",
      });
    });

    // Requirements
    REQUIREMENTS.forEach((r) => {
      list.push({
        type: "Rechtsbegriff",
        title: `${r.title} (${r.ref})`,
        snippet: r.text,
        href: "#voraussetzungen",
      });
    });

    // Services
    SERVICES.forEach((s) => {
      list.push({
        type: "Leistung",
        title: s,
        snippet: "Anwaltliche Durchsetzung und Beratung durch gunnercooke.",
        href: "#vorgehen",
      });
    });

    return list;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allEntries.slice(0, 8);
    return allEntries.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q),
    );
  }, [query, allEntries]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Suchfenster"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-16 sm:pt-24 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl border border-gc-border-light bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center border-b border-gc-border-light px-4">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gc-soft"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suchbegriff eingeben (z. B. Buchauszug, § 89b, Frist, Provision, Rechner...)"
            className="w-full bg-transparent px-3 py-4 text-[16px] text-gc-black placeholder:text-gc-soft focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Suche schließen"
            className="px-2 py-1 text-[12px] uppercase tracking-[0.1em] text-gc-soft hover:text-gc-black"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="p-8 text-center text-[14px] text-gc-muted">
              Keine Treffer für „{query}“. Bitte versuchen Sie einen anderen Suchbegriff oder nutzen
              Sie die Navigation.
            </div>
          ) : (
            <ul className="divide-y divide-gc-border-light/60">
              {results.map((r, i) => (
                <li key={i}>
                  <a
                    href={r.href}
                    onClick={onClose}
                    className="group block p-3 transition-colors hover:bg-gc-light"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-normal uppercase tracking-[0.15em] text-gc-gold-text">
                        {r.type}
                      </span>
                    </div>
                    <div className="text-[15px] font-normal text-gc-black group-hover:text-gc-burgundy">
                      {r.title}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-[19px] text-gc-muted">
                      {r.snippet}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-gc-border-light bg-gc-light px-4 py-2.5 text-[12px] text-gc-soft flex items-center justify-between">
          <span>Drücken Sie Esc zum Schließen</span>
          <span>{results.length} Ergebnis(se)</span>
        </div>
      </div>
    </div>
  );
}
