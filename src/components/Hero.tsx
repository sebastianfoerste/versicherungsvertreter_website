export default function Hero() {
  return (
    <section className="bg-white" aria-labelledby="page-title">
      <div className="gc-container grid grid-cols-1 items-center gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
        <div className="lg:col-span-6">
          <div className="gc-eyebrow mb-4">Commercial · Vertrieb, Handel &amp; Logistik</div>
          <h1 id="page-title" className="mb-2">
            Ausgleichsanspruch für Versicherungsvertreter
          </h1>
          <div className="mb-6 text-[18px] font-light text-gc-gold">nach § 89b HGB – prüfen, beziffern, durchsetzen</div>
          <p className="gc-lead mb-8 max-w-xl">
            Mit dem Ende des Agenturvertrags verbleibt der von Ihnen aufgebaute Bestand beim Versicherer. Der
            gesetzliche Ausgleichsanspruch soll diesen Vorteil vergüten – wenn er rechtzeitig und fundiert geltend
            gemacht wird. Unsere Anwälte begleiten Sie von der ersten Einordnung bis zur Durchsetzung.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#vorab-check" className="gc-btn-primary">
              Vorab-Check starten
            </a>
            <a href="#kontakt" className="gc-btn-secondary">
              Erstgespräch anfragen
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div className="absolute -bottom-4 -left-4 hidden h-full w-full border border-gc-gold/50 md:block" aria-hidden="true" />
          <figure className="relative overflow-hidden bg-gc-light">
            <img
              src="/images/hero-ausgleichsanspruch.jpg"
              alt="Prüfung eines Agenturvertrags in einer Kanzlei"
              className="aspect-[16/11] h-auto w-full object-cover"
              width={1600}
              height={1100}
              fetchPriority="high"
            />
            <figcaption className="absolute right-0 bottom-0 bg-gc-burgundy px-5 py-3 text-[12px] uppercase tracking-[0.18em] text-white">
              Handelsvertreterrecht
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Key facts */}
      <div className="border-y border-gc-border-light bg-gc-light">
        <div className="gc-container grid grid-cols-1 divide-y divide-gc-border-light sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { value: "1 Jahr", label: "Ausschlussfrist ab Vertragsende", ref: "§ 89b Abs. 4 S. 2 HGB" },
            { value: "3 Jahresprovisionen", label: "Höchstgrenze für Versicherungsvertreter", ref: "§ 89b Abs. 5 S. 2 HGB" },
            { value: "Unabdingbar", label: "Anspruch auf Buchauszug", ref: "§ 87c Abs. 2, 5 HGB" },
          ].map((f) => (
            <div key={f.label} className="py-6 sm:px-8 sm:first:pl-0 sm:last:pr-0">
              <div className="text-[22px] font-light text-gc-burgundy">{f.value}</div>
              <div className="text-[14px] text-gc-body">{f.label}</div>
              <div className="mt-1 text-[12px] uppercase tracking-[0.12em] text-gc-soft">{f.ref}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
