import { PARTNER } from "../config";

export default function MobileBottomBar() {
  return (
    <aside
      className="no-print fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 border-t border-gc-border bg-white/95 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden"
      aria-label="Schnellkontakt"
    >
      <a
        href={PARTNER.phoneHref}
        className="gc-btn-secondary flex-1 text-center py-2.5 text-[14px] font-normal"
      >
        Anrufen
      </a>
      <a
        href="#kontakt"
        className="gc-btn-primary flex-1 text-center py-2.5 text-[14px] font-normal"
      >
        Erstgespräch
      </a>
    </aside>
  );
}
