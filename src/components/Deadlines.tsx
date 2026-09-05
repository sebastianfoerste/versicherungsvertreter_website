import { useEffect, useMemo, useState } from "react";
import { cn } from "../utils/cn";
import { computeAusschlussfrist, computeVerjaehrung, formatIcsDate, isWeekend } from "../utils/deadlines";

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

export interface DeadlineResult {
  endDateStr: string;
  deadlineStr: string;
  days: number;
}

interface DeadlinesProps {
  onDeadlineChange?: (res: DeadlineResult | null) => void;
}

export function DeadlineCalculator({ onDeadlineChange }: DeadlinesProps) {
  const [end, setEnd] = useState("");

  const info = useMemo(() => {
    if (!end) return null;
    const endDate = new Date(end + "T00:00:00");
    if (Number.isNaN(endDate.getTime())) return null;
    const deadline = computeAusschlussfrist(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.ceil((deadline.getTime() - today.getTime()) / 86400000);
    const limitation = computeVerjaehrung(endDate);
    return { endDate, deadline, days, limitation };
  }, [end]);

  useEffect(() => {
    if (info) {
      onDeadlineChange?.({
        endDateStr: end,
        deadlineStr: fmt(info.deadline),
        days: info.days,
      });
    } else {
      onDeadlineChange?.(null);
    }
  }, [info, end, onDeadlineChange]);

  const downloadIcs = () => {
    if (!info) return;
    const dtStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endNext = new Date(info.deadline);
    endNext.setDate(endNext.getDate() + 1);

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//gunnercooke//Ausgleichsanspruch Frist//DE",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:gc-deadline-${Date.now()}@gunnercooke.de`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART;VALUE=DATE:${formatIcsDate(info.deadline)}`,
      `DTEND;VALUE=DATE:${formatIcsDate(endNext)}`,
      "SUMMARY:Ablauf gesetzliche Ausschlussfrist § 89b Abs. 4 S. 2 HGB",
      "DESCRIPTION:Ausschlussfrist zur Geltendmachung des Ausgleichsanspruchs als Versicherungsvertreter nach § 89b HGB gegenüber der Versicherungsgesellschaft. Nach Ablauf dieser Frist erlischt der Anspruch gesetzlich. Rechtsberatung: gunnercooke (sebastian.foerste@gunnercooke.com).",
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "TRIGGER:-P30D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Erinnerung: In 30 Tagen läuft die Ausschlussfrist für Ihren Ausgleichsanspruch ab.",
      "END:VALARM",
      "BEGIN:VALARM",
      "TRIGGER:-P7D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Dringend: In 7 Tagen erlischt Ihr Ausgleichsanspruch nach § 89b HGB.",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Ausschlussfrist-Ausgleichsanspruch-89b-HGB.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="fristen" className="gc-section border-b border-gc-border-light bg-gc-light" aria-labelledby="calc-deadline-title">
      <div className="gc-container">
        <div className="mx-auto max-w-2xl border border-gc-border-light bg-white p-6 md:p-8 shadow-xs">
          <div className="gc-eyebrow mb-2">Fristrechner § 89b Abs. 4 Satz 2 HGB</div>
          <h2 id="calc-deadline-title" className="mb-2 text-[22px] md:text-[24px] font-normal text-gc-black">
            Bis wann muss ich den Anspruch geltend machen?
          </h2>

          <label htmlFor="end-date" className="gc-label">
            Datum der Vertragsbeendigung
          </label>
          <input
            id="end-date"
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="gc-input mb-4"
          />

          <div className="space-y-4" aria-live="polite">
            {info ? (
              <>
                <div className="border-l-2 border-gc-burgundy bg-gc-light p-4">
                  <div className="text-[12px] uppercase tracking-[0.15em] text-gc-muted">Ausschlussfrist endet</div>
                  <div className="text-[22px] font-light text-gc-black">{fmt(info.deadline)}</div>
                  <div
                    className={cn(
                      "mt-1 text-[14px]",
                      info.days < 0 ? "text-gc-burgundy font-normal" : info.days <= 60 ? "text-gc-gold-text font-normal" : "text-emerald-700",
                    )}
                  >
                    {info.days < 0
                      ? `Frist seit ${Math.abs(info.days)} Tagen abgelaufen – bitte umgehend prüfen lassen, ob Ausnahmen greifen.`
                      : info.days === 0
                        ? "Die Frist endet heute."
                        : info.days === 1
                          ? "Noch 1 Tag – zeitnahe Geltendmachung dringend empfohlen."
                          : `Noch ${info.days} Tage${info.days <= 60 ? " – zeitnahe Geltendmachung dringend empfohlen." : "."}`}
                  </div>
                  {isWeekend(info.deadline) && (
                    <div className="mt-2 text-[13px] leading-[20px] text-gc-gold-text border-t border-gc-border-light pt-1.5">
                      Der letzte Tag fällt auf ein Wochenende. Verlassen Sie sich nicht auf eine Verlängerung nach § 193 BGB, sondern machen Sie den Anspruch vorher geltend.
                    </div>
                  )}
                </div>
                <div className="border-l-2 border-gc-border-light bg-gc-light p-4">
                  <div className="text-[12px] uppercase tracking-[0.15em] text-gc-muted">
                    Regelmäßige Verjährung (nach Geltendmachung)
                  </div>
                  <div className="text-[16px] text-gc-black">{fmt(info.limitation)}</div>
                </div>
                <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={downloadIcs}
                    className="cursor-pointer inline-flex flex-1 items-center justify-center gap-2 border border-gc-burgundy bg-white px-4 py-2.5 text-[12px] uppercase tracking-[0.15em] text-gc-burgundy transition-colors hover:bg-gc-burgundy hover:text-white"
                  >
                    <span aria-hidden="true">📅</span> Kalender-Eintrag (.ics)
                  </button>
                  <a
                    href="#kontakt"
                    className="inline-flex flex-1 items-center justify-center gap-2 border border-gc-border bg-white px-4 py-2.5 text-[12px] uppercase tracking-[0.15em] text-gc-body transition-colors hover:bg-gc-light hover:text-gc-black"
                  >
                    Frist übernehmen →
                  </a>
                </div>
                <p className="text-[12px] leading-[19px] text-gc-soft">
                  Orientierungswerte ohne Gewähr. Fällt das Fristende auf ein Wochenende oder einen Feiertag, kann § 193
                  BGB anwendbar sein; maßgeblich ist stets der Zugang beim Versicherer.
                </p>
              </>
            ) : (
              <p className="text-[14px] leading-[22px] text-gc-soft">
                Geben Sie das Datum ein, zu dem Ihr Agenturvertrag rechtlich beendet wurde – in der Regel der letzte Tag
                der Kündigungsfrist oder das im Aufhebungsvertrag genannte Datum.
              </p>
            )}
          </div>

          <a href="#kontakt" className="gc-btn-primary mt-6 block text-center">
            Fristwahrung anwaltlich sichern
          </a>
        </div>
      </div>
    </section>
  );
}

export function DeadlinesExplainer() {
  return (
    <section id="ausschlussfrist" className="gc-section bg-gc-black text-white" aria-labelledby="deadline-explainer-title">
      <div className="gc-container">
        <div className="max-w-3xl">
          <div className="gc-eyebrow mb-3 text-gc-gold">Gesetzliche Ausschlussfrist</div>
          <h2 id="deadline-explainer-title" className="mb-6 text-white">
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
      </div>
    </section>
  );
}

export default DeadlineCalculator;
