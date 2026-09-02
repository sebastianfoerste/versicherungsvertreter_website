import { useEffect, useState } from "react";
import { MAIN_NAV, PAGE_SECTIONS, SITE } from "../config";
import { cn } from "../utils/cn";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <a
      href={`${SITE.baseUrl}/`}
      aria-label="gunnercooke – zur Startseite"
      className={cn(
        "inline-flex items-baseline font-light tracking-[-0.02em] select-none",
        light ? "text-white" : "text-gc-black",
        className,
      )}
    >
      <span>gunner</span>
      <em className="italic">cooke</em>
      <span className="ml-1.5 inline-block h-[7px] w-[7px] translate-y-[-2px] bg-gc-burgundy" aria-hidden="true" />
    </a>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "no-print fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-200",
        scrolled ? "shadow-[0_1px_0_0_#dfdfdf,0_6px_18px_-12px_rgba(0,0,0,0.25)]" : "shadow-[0_1px_0_0_#dfdfdf]",
      )}
    >
      {/* Utility bar (desktop) */}
      <div className="hidden border-b border-gc-border-light bg-gc-light lg:block">
        <div className="gc-container flex h-[41px] items-center justify-between text-[12px] tracking-[0.12em] text-gc-muted">
          <div className="flex items-center gap-6">
            <a href={SITE.phoneHref} className="transition-colors hover:text-gc-burgundy">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-gc-burgundy">
              {SITE.email}
            </a>
          </div>
          <div className="flex items-center gap-6 uppercase">
            <a href={`${SITE.baseUrl}/people/`} className="transition-colors hover:text-gc-burgundy">
              People
            </a>
            <a href={`${SITE.baseUrl}/standorte/`} className="transition-colors hover:text-gc-burgundy">
              Standorte
            </a>
            <span className="flex items-center gap-1.5" aria-label="Sprache">
              <span className="font-normal text-gc-black" aria-current="true">
                DE
              </span>
              <span className="text-gc-border">|</span>
              <a href="https://gunnercooke.com/" className="transition-colors hover:text-gc-burgundy">
                EN
              </a>
            </span>
            <button
              type="button"
              className="flex items-center gap-1.5 transition-colors hover:text-gc-burgundy"
              aria-label="Suche"
            >
              <SearchIcon />
              <span>Suche</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="gc-container flex h-[66px] items-center justify-between lg:h-[86px]">
        <Logo className="text-[26px] lg:text-[30px]" />

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-8 lg:flex xl:gap-10">
          {MAIN_NAV.map((item) =>
            item.label === "Get in Touch" ? (
              <a key={item.label} href="#kontakt" className="gc-btn-primary gc-btn-sm">
                {item.label}
              </a>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="gc-nav-link"
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          className="flex h-11 w-11 items-center justify-center text-gc-black lg:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={cn(
                "absolute left-0 block h-[1.5px] w-6 bg-current transition-all duration-200",
                open ? "top-[7px] rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute top-[7px] left-0 block h-[1.5px] w-6 bg-current transition-opacity duration-200",
                open ? "opacity-0" : "opacity-100",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-[1.5px] w-6 bg-current transition-all duration-200",
                open ? "top-[7px] -rotate-45" : "top-[14px]",
              )}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-[66px] bottom-0 overflow-y-auto border-t border-gc-border-light bg-white transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="gc-container py-6">
          <nav aria-label="Hauptnavigation mobil" className="flex flex-col divide-y divide-gc-border-light">
            {MAIN_NAV.map((item) => (
              <a
                key={item.label}
                href={item.label === "Get in Touch" ? "#kontakt" : item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 text-[14px] uppercase tracking-[0.15em] text-gc-black"
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
                <span className="text-gc-burgundy" aria-hidden="true">
                  ›
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-8">
            <div className="gc-eyebrow mb-3">Auf dieser Seite</div>
            <div className="flex flex-wrap gap-2">
              {PAGE_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className="border border-gc-border px-3 py-1.5 text-[13px] text-gc-body hover:border-gc-burgundy hover:text-gc-burgundy"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-gc-border-light pt-6 text-[14px] text-gc-muted">
            <a href={SITE.phoneHref} className="block py-1 hover:text-gc-burgundy">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="block py-1 hover:text-gc-burgundy">
              {SITE.email}
            </a>
            <div className="mt-3 flex items-center gap-2 uppercase tracking-[0.12em]">
              <span className="font-normal text-gc-black">DE</span>
              <span className="text-gc-border">|</span>
              <a href="https://gunnercooke.com/">EN</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
