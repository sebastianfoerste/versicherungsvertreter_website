import { useEffect, useMemo, useState } from "react";

const SPARTEN = [
  { id: "sach", label: "Sach / HUK", note: "Berechnung in der Praxis nach den „Grundsätzen Sach“ auf Basis der Bestandsprovision." },
  { id: "leben", label: "Leben", note: "Berechnung in der Praxis nach den „Grundsätzen Leben“ auf Basis der Bewertungssummen." },
  { id: "kranken", label: "Kranken", note: "Berechnung in der Praxis nach den „Grundsätzen Kranken“ mit sparteneigenen Faktoren." },
  { id: "bauspar", label: "Bauspar / Finanzierung", note: "Berechnung in der Praxis nach den „Grundsätzen Bauspar“ sowie nach BGH-Rechtsprechung." },
  { id: "gemischt", label: "Gemischter Bestand", note: "Sparten werden getrennt berechnet und anschließend zusammengeführt." },
];

const eur = (n: number) =>
  n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function parseNum(v: string) {
  const n = Number(v.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export interface CalculatorResult {
  estimate: number;
  avg: number;
  cap: number;
  eligible: number;
  raw: number;
  sparteLabel: string;
  share: number;
  factor: number;
  capped: boolean;
}

interface CalculatorProps {
  onCalculate?: (res: CalculatorResult | null) => void;
}

export default function Calculator({ onCalculate }: CalculatorProps) {
  const [years, setYears] = useState<string[]>(["", "", "", "", ""]);
  const [sparte, setSparte] = useState("sach");
  const [share, setShare] = useState(70);
  const [factor, setFactor] = useState(1.5);

  const calc = useMemo(() => {
    const values = years.map(parseNum).filter((v) => v > 0);
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    const cap = avg * 3;
    const eligible = avg * (share / 100);
    const raw = eligible * factor;
    const estimate = Math.min(raw, cap);
    return { values, avg, cap, eligible, raw, estimate, capped: raw > cap && cap > 0 };
  }, [years, share, factor]);

  useEffect(() => {
    if (calc.avg > 0) {
      onCalculate?.({
        estimate: Math.round(calc.estimate),
        avg: Math.round(calc.avg),
        cap: Math.round(calc.cap),
        eligible: Math.round(calc.eligible),
        raw: Math.round(calc.raw),
        sparteLabel: SPARTEN.find((s) => s.id === sparte)?.label || sparte,
        share,
        factor,
        capped: calc.capped,
      });
    } else {
      onCalculate?.(null);
    }
  }, [calc, sparte, share, factor, onCalculate]);

  const reset = () => {
    setYears(["", "", "", "", ""]);
    setSparte("sach");
    setShare(70);
    setFactor(1.5);
  };

  const setYear = (i: number, v: string) => setYears((y) => y.map((x, j) => (j === i ? v : x)));

  return (
    <section id="rechner" className="gc-section bg-white" aria-labelledby="calc-title">
      <div className="gc-container">
        <div className="mb-10 max-w-3xl">
          <div className="gc-eyebrow mb-3">Orientierungsrechner</div>
          <h2 id="calc-title" className="mb-4">
            Größenordnung des Ausgleichsanspruchs einschätzen
          </h2>
          <p className="text-[16px] leading-[26px] text-gc-muted">
            Für Versicherungsvertreter ist der Ausgleich auf drei Jahresprovisionen begrenzt, berechnet nach dem
            Durchschnitt der letzten fünf Jahre (§ 89b Abs. 5 Satz 2 HGB). Der Rechner zeigt Ihnen diese Höchstgrenze
            und einen Orientierungswert – die belastbare Berechnung erfolgt nach den branchenüblichen „Grundsätzen“
            auf Basis des Buchauszugs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <fieldset>
              <legend className="gc-label">Provisionseinnahmen der letzten fünf Vertragsjahre (brutto, in €)</legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {years.map((v, i) => (
                  <div key={i}>
                    <label htmlFor={`year-${i}`} className="mb-1 block text-[12px] text-gc-soft">
                      {i === 4 ? "Letztes Jahr" : `Jahr ${i + 1}`}
                    </label>
                    <input
                      id={`year-${i}`}
                      inputMode="decimal"
                      placeholder="z. B. 85.000"
                      value={v}
                      onChange={(e) => setYear(i, e.target.value)}
                      className="gc-input px-3 py-2 text-[14px]"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[12px] leading-[19px] text-gc-soft">
                Bei kürzerer Vertragsdauer genügen die vorhandenen Jahre – der Durchschnitt wird nur über ausgefüllte
                Felder gebildet (§ 89b Abs. 2 Satz 2 HGB).
              </p>
            </fieldset>

            <div>
              <div className="gc-label">Überwiegende Sparte</div>
              <div className="flex flex-wrap gap-2">
                {SPARTEN.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSparte(s.id)}
                    data-selected={sparte === s.id}
                    className="gc-choice w-auto px-4 py-2 text-[14px]"
                    aria-pressed={sparte === s.id}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[13px] leading-[21px] text-gc-muted">{SPARTEN.find((s) => s.id === sparte)?.note}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="share" className="gc-label">
                  Anteil ausgleichsfähiger Provisionen: <span className="text-gc-black">{share} %</span>
                </label>
                <input
                  id="share"
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={share}
                  onChange={(e) => setShare(Number(e.target.value))}
                  className="w-full accent-gc-burgundy"
                />
                <p className="mt-1 text-[12px] leading-[19px] text-gc-soft">
                  Anteil der Provisionen aus selbst vermittelten Verträgen (ohne übernommenen Altbestand, Verwaltungs-
                  und Inkassovergütungen).
                </p>
              </div>
              <div>
                <label htmlFor="factor" className="gc-label">
                  Prognose- und Billigkeitsfaktor: <span className="text-gc-black">{factor.toFixed(1)}</span>
                </label>
                <input
                  id="factor"
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={factor}
                  onChange={(e) => setFactor(Number(e.target.value))}
                  className="w-full accent-gc-burgundy"
                />
                <p className="mt-1 text-[12px] leading-[19px] text-gc-soft">
                  Vereinfachter Faktor für Prognosezeitraum, Abwanderung und Abzinsung. Realistisch je nach Sparte,
                  Vertragsdauer und Bestandsqualität.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-gc-border-light bg-gc-light p-6 md:p-8" aria-live="polite">
              <div className="gc-eyebrow mb-5">Ergebnis</div>
              <dl className="space-y-4 text-[14px]">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-gc-muted">Jahresdurchschnittsprovision ({calc.values.length || 0} Jahre)</dt>
                  <dd className="font-normal text-gc-black tabular-nums">{eur(calc.avg)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-gc-muted">Davon ausgleichsfähig ({share} %)</dt>
                  <dd className="font-normal text-gc-black tabular-nums">{eur(calc.eligible)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-gc-muted">Rohausgleich (× {factor.toFixed(1)})</dt>
                  <dd className="font-normal text-gc-black tabular-nums">{eur(calc.raw)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-gc-border-light pt-4">
                  <dt className="text-gc-muted">
                    Höchstgrenze (3 Jahresprovisionen)
                    <span className="block text-[11px] uppercase tracking-[0.12em] text-gc-soft">§ 89b Abs. 5 S. 2 HGB</span>
                  </dt>
                  <dd className="font-normal text-gc-burgundy tabular-nums">{eur(calc.cap)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-gc-border pt-4">
                  <dt className="text-[15px] font-normal text-gc-black">Orientierungswert</dt>
                  <dd className="text-[26px] font-light text-gc-burgundy tabular-nums">
                    {calc.avg ? `~ ${eur(calc.estimate)}` : "–"}
                  </dd>
                </div>
              </dl>
              {calc.capped && (
                <p className="mt-4 border-l-2 border-gc-gold bg-white px-3 py-2 text-[13px] leading-[21px] text-gc-body">
                  Der rechnerische Rohausgleich übersteigt die gesetzliche Höchstgrenze. Maßgeblich ist daher die
                  Kappungsgrenze.
                </p>
              )}
              <p className="mt-5 text-[12px] leading-[19px] text-gc-soft">
                * Unverbindliche Orientierungsberechnung. Die Bezifferung im Einzelfall richtet sich nach den
                „Grundsätzen zur Errechnung der Höhe des Ausgleichsanspruchs“ der jeweiligen Sparte bzw. der
                Rechtsprechung des BGH und setzt die Auswertung des Buchauszugs nach § 87c HGB voraus.
              </p>
              <div className="mt-6 space-y-2">
                <a href="#kontakt" className="gc-btn-primary w-full text-center">
                  Bezifferung anwaltlich prüfen lassen
                </a>
                {calc.avg > 0 && (
                  <p className="text-center text-[12px] font-normal text-emerald-700">
                    ✓ Orientierungswert wird für Ihr Erstgespräch vorgemerkt
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
