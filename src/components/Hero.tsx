export default function Hero() {
  return (
    <section className="bg-white" aria-labelledby="page-title">
      <div className="gc-container grid grid-cols-1 items-center gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-16 lg:py-16">
        <div className="lg:col-span-6">
          {/* Editorial inline breadcrumb trail */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-x-2 text-[12px] tracking-[0.06em] text-gc-muted">
              <li>
                <a href="https://gunnercookede.com" className="transition-colors hover:text-gc-burgundy">
                  Home
                </a>
              </li>
              <li aria-hidden="true" className="text-gc-border">/</li>
              <li>
                <a href="https://gunnercookede.com/practice-area/commercial-law/" className="transition-colors hover:text-gc-burgundy">
                  Commercial Law
                </a>
              </li>
              <li aria-hidden="true" className="text-gc-border">/</li>
              <li>
                <span className="text-gc-muted">Vertriebsrecht</span>
              </li>
              <li aria-hidden="true" className="text-gc-border">/</li>
              <li className="font-normal text-gc-black" aria-current="page">
                § 89b HGB
              </li>
            </ol>
          </nav>

          <div className="gc-eyebrow mb-3">Praxisgruppe Vertrieb, Handel &amp; Logistik</div>
          <h1 id="page-title" className="mb-2">
            Ausgleichsanspruch für Versicherungsvertreter
          </h1>
          <div className="mb-6 text-[18px] font-light text-gc-gold">nach § 89b HGB – prüfen, beziffern, durchsetzen</div>
          <p className="gc-lead mb-8 max-w-xl">
            Mit dem Ende des Agenturvertrags verbleibt der von Ihnen aufgebaute Bestand beim Versicherer. Der
            gesetzliche Ausgleichsanspruch soll diesen Vorteil vergüten, er muss jedoch rechtzeitig geltend
            gemacht werden. Wir begleiten Sie von der Erstberatung bis zur Durchsetzung Ihres Anspruchs.
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
            <picture>
              <source srcSet="/images/hero-ausgleichsanspruch.webp" type="image/webp" />
              <img
                src="/images/hero-ausgleichsanspruch.jpg"
                alt="Beratung zum Ausgleichsanspruch für Versicherungsvertreter"
                className="aspect-[16/10] sm:aspect-[16/9] h-auto w-full object-cover"
                width={1376}
                height={768}
                fetchPriority="high"
              />
            </picture>
            <figcaption className="absolute right-0 bottom-0 bg-gc-burgundy px-5 py-3 text-[12px] uppercase tracking-[0.18em] text-white">
              Versicherungsvertreterrecht
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
