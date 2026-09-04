import { useMemo, useState } from "react";
import { WIZARD_QUESTIONS, type Signal } from "../data/content";
import { evaluatePreCheck } from "../utils/precheck";
import { cn } from "../utils/cn";

export interface PreCheckResult {
  caseId: string;
  verdict: string;
  answers: { question: string; answer: string; signal: Signal }[];
}

interface Props {
  onComplete: (result: PreCheckResult) => void;
}

function makeCaseId() {
  const t = Date.now().toString(36).toUpperCase().slice(-4);
  const r = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `GC-89B-${t}${r}`;
}

const SIGNAL_STYLES: Record<Signal, { dot: string; label: string }> = {
  positive: { dot: "bg-emerald-600", label: "spricht für den Anspruch" },
  neutral: { dot: "bg-gc-gold", label: "prüfungsbedürftig" },
  negative: { dot: "bg-gc-burgundy", label: "spricht gegen den Anspruch" },
};

export default function PreCheck({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const total = WIZARD_QUESTIONS.length;
  const q = WIZARD_QUESTIONS[step];
  const selected = answers[q?.id];

  const evaluation = useMemo(() => {
    return evaluatePreCheck(answers);
  }, [answers]);

  const choose = (idx: number) => {
    setAnswers((a) => ({ ...a, [q.id]: idx }));
  };

  const next = () => {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      const id = caseId ?? makeCaseId();
      setCaseId(id);
      setDone(true);
      onComplete({
        caseId: id,
        verdict: evaluation.verdict,
        answers: evaluation.list.map((x) => ({
          question: x.question.title,
          answer: x.opt!.label,
          signal: x.opt!.signal,
        })),
      });
    }
  };

  const copySummary = async () => {
    const text = [
      `Vorab-Check Ausgleichsanspruch § 89b HGB`,
      `Vorgangs-ID: ${caseId}`,
      `Ergebnis: ${evaluation.verdict}`,
      `Einschätzung: ${evaluation.text}`,
      "",
      "Angaben im Detail:",
      ...evaluation.list.map((x) => `• ${x.question.title}: ${x.opt!.label} (${x.opt!.note})`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard error */
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
    setCaseId(null);
  };

  return (
    <section id="vorab-check" className="gc-section bg-gc-light" aria-labelledby="precheck-title">
      <div className="gc-container">
        <div className="mb-10 max-w-3xl">
          <div className="gc-eyebrow mb-3">Digitale Vorprüfung</div>
          <h2 id="precheck-title" className="mb-4">
            Vorab-Check: Kommt ein Ausgleichsanspruch für Sie in Betracht?
          </h2>
          <p className="text-[16px] leading-[26px] text-gc-muted">
            Fünf Fragen, rund zwei Minuten. Der Vorab-Check strukturiert Ihre Ausgangslage anhand der gesetzlichen
            Voraussetzungen und ersetzt keine Rechtsberatung. Ihre Angaben werden ausschließlich lokal in Ihrem
            Browser verarbeitet.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main panel */}
          <div className="gc-card lg:col-span-8">
            {!done ? (
              <>
                <div className="mb-6 flex items-center justify-between border-b border-gc-border-light pb-4">
                  <span className="text-[12px] uppercase tracking-[0.18em] text-gc-muted">
                    Frage {step + 1} von {total}
                  </span>
                  <div className="flex gap-1" aria-hidden="true">
                    {WIZARD_QUESTIONS.map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-[3px] w-8 transition-colors",
                          i < step ? "bg-gc-burgundy" : i === step ? "bg-gc-gold" : "bg-gc-border-light",
                        )}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="mb-2 text-[20px] leading-[30px] text-gc-black">{q.title}</h3>
                <p className="mb-6 text-[14px] leading-[22px] text-gc-muted">{q.help}</p>

                <div className="space-y-2.5" role="radiogroup" aria-label={q.title}>
                  {q.options.map((opt, idx) => (
                    <button
                      key={opt.label}
                      type="button"
                      role="radio"
                      aria-checked={selected === idx}
                      data-selected={selected === idx}
                      onClick={() => choose(idx)}
                      className="gc-choice flex items-start gap-3"
                    >
                      <span
                        className={cn(
                          "mt-[6px] h-3.5 w-3.5 shrink-0 border transition-colors",
                          selected === idx ? "border-gc-burgundy bg-gc-burgundy" : "border-gc-border bg-white",
                        )}
                        aria-hidden="true"
                      />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>

                {selected !== undefined && (
                  <div className="mt-5 border-l-2 border-gc-gold bg-gc-light px-4 py-3 text-[14px] leading-[22px] text-gc-body">
                    <span className="mr-2 text-[11px] uppercase tracking-[0.18em] text-gc-gold-text">Einordnung</span>
                    {q.options[selected].note}
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-gc-border-light pt-5">
                  <button
                    type="button"
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="text-[13px] uppercase tracking-[0.15em] text-gc-muted transition-colors hover:text-gc-black disabled:opacity-30"
                  >
                    ← Zurück
                  </button>
                  <button type="button" onClick={next} disabled={selected === undefined} className="gc-btn-primary">
                    {step === total - 1 ? "Ergebnis anzeigen" : "Weiter"}
                  </button>
                </div>
              </>
            ) : (
              <div>
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-gc-border-light pb-5">
                  <div>
                    <div className="gc-eyebrow mb-2">Ergebnis Ihres Vorab-Checks</div>
                    <h3
                      className={cn(
                        "text-[24px] leading-[32px]",
                        evaluation.tone === "positive" && "text-emerald-700",
                        evaluation.tone === "neutral" && "text-gc-gold",
                        evaluation.tone === "negative" && "text-gc-burgundy",
                      )}
                    >
                      {evaluation.verdict}
                    </h3>
                  </div>
                  <div className="border border-gc-rose-border bg-gc-rose px-3 py-2 font-mono text-[12px] text-gc-burgundy">
                    Vorgangs-ID {caseId}
                  </div>
                </div>

                <p className="mb-6 text-[15px] leading-[25px] text-gc-body">{evaluation.text}</p>

                <ul className="divide-y divide-gc-border-light border-y border-gc-border-light">
                  {evaluation.list.map(({ question, opt }) => (
                    <li key={question.id} className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-12 sm:gap-4">
                      <div className="text-[13px] text-gc-muted sm:col-span-5">{question.title}</div>
                      <div className="sm:col-span-7">
                        <div className="flex items-start gap-2 text-[14px] text-gc-black">
                          <span className={cn("mt-[8px] h-2 w-2 shrink-0", SIGNAL_STYLES[opt!.signal].dot)} />
                          <span>
                            {opt!.label}
                            <span className="ml-2 text-[12px] text-gc-soft">({SIGNAL_STYLES[opt!.signal].label})</span>
                          </span>
                        </div>
                        <div className="mt-1 pl-4 text-[13px] leading-[21px] text-gc-muted">{opt!.note}</div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-3 border-t border-gc-border-light pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    <a href="#kontakt" className="gc-btn-primary">
                      Ergebnis im Erstgespräch besprechen
                    </a>
                    <button
                      type="button"
                      onClick={copySummary}
                      className="gc-btn-secondary gc-btn-sm"
                    >
                      {copied ? "✓ Kopiert" : "Ergebnis kopieren"}
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="gc-btn-secondary gc-btn-sm"
                    >
                      Drucken / PDF
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="text-[13px] uppercase tracking-[0.15em] text-gc-muted hover:text-gc-black cursor-pointer"
                  >
                    Neu starten
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Side panel */}
          <aside className="lg:col-span-4">
            <div className="border border-gc-border-light bg-white p-6">
              <div className="gc-eyebrow mb-4">Ihre Angaben</div>
              <ol className="space-y-3">
                {WIZARD_QUESTIONS.map((question, i) => {
                  const idx = answers[question.id];
                  const answered = idx !== undefined;
                  return (
                    <li key={question.id} className="flex items-start gap-3 text-[13px] leading-[20px]">
                      <span
                        className={cn(
                          "mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center border text-[10px]",
                          answered ? "border-gc-burgundy bg-gc-burgundy text-white" : "border-gc-border text-gc-soft",
                        )}
                      >
                        {answered ? "✓" : i + 1}
                      </span>
                      <span className={answered ? "text-gc-black" : "text-gc-soft"}>
                        {answered ? question.options[idx].label : question.title}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="mt-4 border border-gc-border-light bg-white p-6 text-[13px] leading-[21px] text-gc-muted">
              <span className="font-normal text-gc-black">Hinweis: </span>
              Der Vorab-Check dient der unverbindlichen Erstorientierung und stellt keine Rechtsberatung dar. Er
              berücksichtigt nicht alle Umstände des Einzelfalls.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
