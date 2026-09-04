import { useEffect, useState } from "react";
import { SITE } from "../config";

export default function CookieModal() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Check hash on load or hash change
    const checkHash = () => {
      if (window.location.hash === "#cookie-einstellungen") {
        setOpen(true);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);

    const onCustomOpen = () => setOpen(true);
    window.addEventListener("open-cookie-modal", onCustomOpen);

    // Also check if user has made a choice
    const consent = localStorage.getItem("gc_cookie_consent");
    if (!consent) {
      // First visit banner/modal delayed slightly for smooth load
      const t = setTimeout(() => setOpen(true), 1200);
      return () => {
        clearTimeout(t);
        window.removeEventListener("open-cookie-modal", onCustomOpen);
        window.removeEventListener("hashchange", checkHash);
      };
    }
    return () => {
      window.removeEventListener("open-cookie-modal", onCustomOpen);
      window.removeEventListener("hashchange", checkHash);
    };
  }, []);

  const accept = (type: "all" | "necessary") => {
    localStorage.setItem(
      "gc_cookie_consent",
      JSON.stringify({
        type,
        timestamp: new Date().toISOString(),
      }),
    );
    setSaved(true);
    setTimeout(() => {
      setOpen(false);
      setSaved(false);
      if (window.location.hash === "#cookie-einstellungen") {
        history.replaceState(null, "", window.location.pathname);
      }
    }, 400);
  };

  const close = () => {
    setOpen(false);
    if (window.location.hash === "#cookie-einstellungen") {
      history.replaceState(null, "", window.location.pathname);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xl border border-gc-border-light bg-white p-6 shadow-2xl md:p-8">
        <div className="flex items-start justify-between border-b border-gc-border-light pb-4">
          <div>
            <div className="gc-eyebrow mb-1 text-gc-gold">Datenschutz & Transparenz</div>
            <h2 id="cookie-modal-title" className="text-[20px] font-light text-gc-black">
              Cookie- & Speichereinstellungen
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Schließen"
            className="text-[22px] text-gc-soft hover:text-gc-black"
          >
            ×
          </button>
        </div>

        <div className="my-5 space-y-4 text-[14px] leading-[22px] text-gc-body">
          <p>
            Wir verwenden auf dieser Website{" "}
            <strong>ausschließlich technisch notwendige Funktionen</strong> zur lokalen Speicherung
            Ihrer Angaben (z. B. für den Vorab-Check, den Orientierungsrechner und den
            Muster-Generator für den Buchauszug).
          </p>
          <div className="border border-gc-border-light bg-gc-light p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-normal text-gc-black">Notwendige Speicherfunktionen</span>
                <p className="mt-0.5 text-[12px] text-gc-muted">
                  Lokale Datenhaltung im Browser für Rechner, Fristen und Musterschreiben. Keine
                  Drittanbieter-Cookies.
                </p>
              </div>
              <span className="shrink-0 border border-emerald-600 bg-emerald-50 px-2 py-0.5 text-[11px] font-normal uppercase tracking-[0.1em] text-emerald-700">
                Aktiv
              </span>
            </div>
          </div>
          <p className="text-[12px] text-gc-muted">
            Ihre Daten verbleiben auf Ihrem Endgerät und werden nicht für Werbe- oder Trackingzwecke
            verwendet. Weitere Details finden Sie in unserer{" "}
            <a
              href={`${SITE.baseUrl}/datenschutz/`}
              target="_blank"
              rel="noreferrer"
              className="gc-link"
            >
              Datenschutzerklärung
            </a>
            .
          </p>
        </div>

        {saved ? (
          <div className="text-center font-normal text-emerald-700 py-2">
            ✓ Einstellungen gespeichert
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end border-t border-gc-border-light pt-5">
            <button
              type="button"
              onClick={() => accept("necessary")}
              className="gc-btn-secondary gc-btn-sm"
            >
              Nur Notwendige
            </button>
            <button
              type="button"
              onClick={() => accept("all")}
              className="gc-btn-primary gc-btn-sm"
            >
              Alle akzeptieren
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
