import { REQUIREMENTS, SERVICES } from "../data/content";

const LEGAL_BASIS = [
  { ref: "§ 89b Abs. 1 HGB", text: "Anspruchsvoraussetzungen: Beendigung, Unternehmervorteile, Billigkeit" },
  { ref: "§ 89b Abs. 3 HGB", text: "Ausschlussgründe bei Eigenkündigung und wichtigem Grund" },
  { ref: "§ 89b Abs. 4 HGB", text: "Unabdingbarkeit im Voraus, Ausschlussfrist von einem Jahr" },
  { ref: "§ 89b Abs. 5 HGB", text: "Besonderheiten für Versicherungsvertreter, Höchstgrenze drei Jahresprovisionen" },
  { ref: "§ 92b HGB", text: "Ausnahme für nebenberufliche Versicherungsvertreter" },
  { ref: "§ 87c HGB", text: "Abrechnung, Buchauszug und Bucheinsicht" },
];

export default function Overview() {
  return (
    <>
      <section id="ueberblick" className="gc-section bg-gc-light" aria-labelledby="overview-title">
        <div className="gc-container grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 id="overview-title" className="mb-6">
              Ihr Partner für den Ausgleichsanspruch nach § 89b HGB: Von der ersten Einordnung bis zur Durchsetzung
            </h2>
            <p className="gc-lead mb-6">
              Versicherungsvertreter bauen über Jahre einen Bestand auf, von dem der Versicherer
              nach Vertragsende weiter profitiert. Der Ausgleichsanspruch ist das gesetzliche Gegengewicht, viele Vertreter machen ihn jedoch zu spät oder zu niedrig geltend.
            </p>

            <p className="mb-2 text-[13px] font-normal uppercase tracking-[0.18em] text-gc-black">Zusammenfassung:</p>
            <p className="mb-8 text-gc-body">
              Wir prüfen Ihren Agenturvertrag und die Umstände der Beendigung, wahren die einjährige Ausschlussfrist,
              setzen den Buchauszug nach § 87c HGB durch und beziffern Ihren Anspruch nach den anerkannten
              Berechnungsgrundsätzen. Anschließend verhandeln wir mit dem Versicherer und vertreten Sie, wo nötig,
              vor Gericht. Digitale Werkzeuge wie unser Vorab-Check und der Orientierungsrechner strukturieren die
              erste Einordnung; die rechtliche Bewertung erfolgt persönlich durch unsere Partner.
            </p>

            <p className="mb-3 text-[13px] font-normal uppercase tracking-[0.18em] text-gc-black">
              Unser Tätigkeitsfeld umfasst:
            </p>
            <ul className="gc-list text-[15px] leading-[25px] text-gc-body">
              {SERVICES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-4" aria-label="Rechtsgrundlagen">
            <div className="border border-gc-border-light bg-white p-6 lg:sticky lg:top-[calc(var(--gc-header-height)+72px)]">
              <div className="gc-eyebrow mb-4">Rechtsgrundlagen</div>
              <ul className="divide-y divide-gc-border-light">
                {LEGAL_BASIS.map((l) => (
                  <li key={l.ref} className="py-3 first:pt-0 last:pb-0">
                    <div className="text-[14px] font-normal text-gc-burgundy">{l.ref}</div>
                    <div className="text-[13px] leading-[21px] text-gc-muted">{l.text}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-gc-border-light pt-5">
                <a href="#kontakt" className="gc-btn-primary w-full">
                  Unterlagen prüfen lassen
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="voraussetzungen" className="gc-section bg-white" aria-labelledby="req-title">
        <div className="gc-container">
          <div className="mb-10 max-w-3xl">
            <div className="gc-eyebrow mb-3">Voraussetzungen</div>
            <h2 id="req-title" className="mb-4">
              Wann besteht ein Ausgleichsanspruch?
            </h2>
            <p className="text-[16px] leading-[26px] text-gc-muted">
              Vier Voraussetzungen müssen zusammen vorliegen. Für Versicherungsvertreter gelten dabei Besonderheiten:
              Maßgeblich sind die von Ihnen vermittelten Versicherungsverträge, nicht die Kundenbeziehung als solche
              (§ 89b Abs. 5 HGB).
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-gc-border-light sm:grid-cols-2 lg:grid-cols-4">
            {REQUIREMENTS.map((r) => (
              <article key={r.no} className="flex flex-col bg-white p-6 lg:p-7">
                <div className="mb-4 text-[13px] tracking-[0.2em] text-gc-gold">{r.no}</div>
                <h3 className="mb-3 text-[18px] leading-[26px]">{r.title}</h3>
                <p className="flex-1 text-[14px] leading-[23px] text-gc-muted">{r.text}</p>
                <div className="mt-5 border-t border-gc-border-light pt-3 text-[12px] uppercase tracking-[0.12em] text-gc-burgundy">
                  {r.ref}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
