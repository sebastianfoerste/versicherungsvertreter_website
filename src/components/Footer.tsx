import { FOOTER_LINKS, OFFICES, SITE } from "../config";
import { Logo } from "./Header";

export default function Footer() {
  return (
    <footer className="no-print bg-gc-black text-gc-ink-text" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Fußzeile
      </h2>

      {/* CTA band */}
      <div className="border-b border-gc-ink-border">
        <div className="gc-container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="gc-eyebrow mb-2 text-gc-gold">gunnercooke Deutschland</div>
            <p className="max-w-2xl text-[18px] font-light leading-[28px] text-white">
              Juristische und unternehmerische Expertise für Ihre Businessthemen – persönlich betreut durch unsere
              Partnerinnen und Partner.
            </p>
          </div>
          <a href={`${SITE.baseUrl}/get-in-touch/`} className="gc-btn-light shrink-0">
            Get in Touch
          </a>
        </div>
      </div>

      <div className="gc-container grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light className="text-[28px]" />
          <p className="mt-5 max-w-sm text-[14px] leading-[23px]">
            gunnercooke ist eine der am schnellsten wachsenden Wirtschaftskanzleien mit Büros in Großbritannien, den
            USA, Deutschland, Österreich und der Schweiz. Unsere Anwältinnen und Anwälte bringen langjährige
            Erfahrung aus Wirtschaftsunternehmen und -kanzleien mit.
          </p>
          <div className="mt-6 space-y-1 text-[14px]">
            <a href={SITE.phoneHref} className="block transition-colors hover:text-white">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="block transition-colors hover:text-white">
              {SITE.email}
            </a>
          </div>
          <ul className="mt-6 flex gap-3" aria-label="Soziale Netzwerke">
            {FOOTER_LINKS.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="flex h-9 w-9 items-center justify-center border border-gc-ink-border text-[11px] uppercase tracking-[0.05em] transition-colors hover:border-white hover:text-white"
                  aria-label={s.label}
                  rel="noopener"
                >
                  {s.label.slice(0, 2)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-4 text-[12px] uppercase tracking-[0.18em] text-white">Expertise</div>
          <ul className="space-y-2 text-[14px]">
            {FOOTER_LINKS.expertise.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-4 text-[12px] uppercase tracking-[0.18em] text-white">Kanzlei</div>
          <ul className="space-y-2 text-[14px]">
            {FOOTER_LINKS.firm.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-4">
          <div className="mb-4 text-[12px] uppercase tracking-[0.18em] text-white">Standorte</div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4 text-[13px] leading-[20px] sm:grid-cols-2">
            {OFFICES.map((o) => (
              <li key={o.city}>
                <div className="font-normal text-white">{o.city}</div>
                {o.lines.slice(1).map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gc-ink-border">
        <div className="gc-container py-6 text-[12px] leading-[19px]">
          <p className="mb-4 max-w-4xl">
            {SITE.legalName}, {SITE.registeredOffice}, {SITE.register}. Alle Rechtsanwältinnen und Rechtsanwälte der
            gunnercooke GmbH sind in Deutschland oder Österreich zugelassen und Mitglieder der jeweils zuständigen
            Rechtsanwaltskammer. gunnercooke GmbH ist Teil der gunnercooke-Gruppe.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex flex-wrap gap-x-5 gap-y-1 uppercase tracking-[0.12em]">
              {FOOTER_LINKS.legal.map((l) => (
                <li key={l.label}>
                  {l.label === "Cookie-Einstellungen" ? (
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-modal"))}
                      className="cursor-pointer uppercase tracking-[0.12em] transition-colors hover:text-white"
                    >
                      {l.label}
                    </button>
                  ) : (
                    <a href={l.href} className="transition-colors hover:text-white">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <span>© {new Date().getFullYear()} gunnercooke. Alle Rechte vorbehalten.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
