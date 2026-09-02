import { useMemo, useState } from "react";
import { cn } from "../utils/cn";

const RULES = [
  {
    no: "01",
    title: "Fristbeginn",
    text: "Die Frist beginnt mit der rechtlichen Beendigung des Vertragsverhältnisses – nicht mit Zugang der Kündigung und nicht mit der letzten Provisionsabrechnung.",
  },
  {
    no: "02",
    title: "Form der Geltendmachung",
    text: "Eine formlose, aber nachweisbare Erklärung genügt, aus der hervorgeht, dass ein Ausgleich verlangt wird. Eine Bezifferung ist nicht erforderlich und kann nachgereicht werden.",
  },
  {
    no: "03",
    title: "Keine Hemmung durch Verhandlungen",
    text: "Anders als Verjährungsfristen wird die Ausschlussfrist durch laufende Gespräche nicht gehemmt. Die Geltendmachung sollte daher stets schriftlich und frühzeitig erfolgen.",
  },
  {
    no: "04",
    title: "Verjährung nach Geltendmachung",
    text: "Ist der Anspruch fristgerecht geltend gemacht, gilt die regelmäßige Verjährung von drei Jahren (§§ 195, 199 BGB) ab dem Schluss des Jahres der Vertragsbeendigung.",
  },
];

const fmt = (d: Date) => d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

export default function Deadlines() {
  const [end, setEnd] = useState("");

  const info = useMemo(() => {
    if (!end) return null;
    const endDate = new Date(end + "T00:00:00");
    if (Number.isNaN(endDate.getTime())) return null;
    const deadline = new Date(endDate);
    deadline.setFullYear(deadline.getFullYear() + 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.ceil((deadline.getTime() - today.getTime()) / 86400000);
    const limitation = new Date(endDate.getFullYear() + 3, 11, 31);
    return { endDate, deadline, days, limitation };
  }, [end]);

  return (
    <section id="fristen" className="gc-section bg-gc-black text-white" aria-labelledby="deadline-title">
      <div className="gc-container grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <div className="gc-eyebrow mb-3 text-gc-gold">Gesetzliche Ausschlussfrist</div>
          <h2 id="deadline-title" className="mb-6 text-white">
            Ein Jahr nach Vertragsende – § 89b Abs. 4 Satz 2 HGB
          </h2>
          <p className="mb-8 text-[16px] leading-[26px] text-gc-ink-text">
            Der Ausgleichsanspruch muss{" "}
            <strong className="text-white">innerhalb eines Jahres nach Beendigung des Vertragsverhältnisses</strong>{" "}
            gegenüber dem Versicherer geltend gemacht werden. Es handelt sich um eine materielle Ausschlussfrist:
            Nach ihrem Ablauf erlischt der Anspruch – unabhängig von seiner Höhe und unabhängig davon, ob er dem
            Grunde nach bestand.
          </p>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {RULES.map((r) => (
              <li key={r.no} className="border-t border-gc-ink-border pt-4">
                <div className="mb-1 text-[12px] tracking-[0.2em] text-gc-gold">{r.no}</div>
                <h3 className="mb-2 text-[17px] leading-[26px] text-white">{r.title}</h3>
                <p className="text-[14px] leading-[22px] text-gc-ink-text">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-gc-ink-border bg-gc-ink p-6 md:p-8 lg:col-span-5">
          <div className="gc-eyebrow mb-2 text-gc-gold">Fristrechner</div>
          <h3 className="mb-5 text-[20px] text-white">Bis wann muss ich den Anspruch geltend machen?</h3>
          <label htmlFor="end-date" className="gc-label text-gc-ink-text">
            Datum der Vertragsbeendigung
          </label>
          <input
            id="end-date"
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="gc-input border-gc-ink-border bg-gc-black text-white [color-scheme:dark] focus:border-gc-gold"
          />

          <div className="mt-6 space-y-4" aria-live="polite">
            {info ? (
              <>
                <div className="border-l-2 border-gc-burgundy pl-4">
                  <div className="text-[12px] uppercase tracking-[0.15em] text-gc-ink-text">Ausschlussfrist endet</div>
                  <div className="text-[22px] font-light text-white">{fmt(info.deadline)}</div>
                  <div
                    className={cn(
                      "mt-1 text-[14px]",
                      info.days < 0 ? "text-gc-burgundy" : info.days <= 60 ? "text-gc-gold" : "text-emerald-400",
                    )}
                  >
                    {info.days < 0
                      ? `Frist seit ${Math.abs(info.days)} Tagen abgelaufen – bitte umgehend prüfen lassen, ob Ausnahmen greifen.`
                      : info.days === 0
                        ? "Die Frist endet heute."
                        : `Noch ${info.days} Tage${info.days <= 60 ? " – zeitnahe Geltendmachung dringend empfohlen." : "."}`}
                  </div>
                </div>
                <div className="border-l-2 border-gc-ink-border pl-4">
                  <div className="text-[12px] uppercase tracking-[0.15em] text-gc-ink-text">
                    Regelmäßige Verjährung (nach Geltendmachung)
                  </div>
                  <div className="text-[16px] text-white">{fmt(info.limitation)}</div>
                </div>
                <p className="text-[12px] leading-[19px] text-gc-ink-text/80">
                  Orientierungswerte ohne Gewähr. Fällt das Fristende auf ein Wochenende oder einen Feiertag, kann § 193
                  BGB anwendbar sein; maßgeblich ist stets der Zugang beim Versicherer.
                </p>
              </>
            ) : (
              <p className="text-[14px] leading-[22px] text-gc-ink-text">
                Geben Sie das Datum ein, zu dem Ihr Agenturvertrag rechtlich beendet wurde – in der Regel der letzte Tag
                der Kündigungsfrist oder das im Aufhebungsvertrag genannte Datum.
              </p>
            )}
          </div>

          <a href="#kontakt" className="gc-btn-light mt-8 w-full">
            Fristwahrung anwaltlich sichern
          </a>
        </div>
      </div>
    </section>
  );
}
