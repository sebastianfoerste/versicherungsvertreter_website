import { useMemo, useState } from "react";
import { LETTER_ITEMS, LETTER_PRELUDE_OPTIONS } from "../data/content";
import { cn } from "../utils/cn";

const STEPS = ["Vertragsdaten", "Auskunftspunkte", "Frist & Vorlauf", "Absender"];

interface LetterData {
  versicherer: string;
  versichererAnschrift: string;
  nummer: string;
  von: string;
  bis: string;
  vorlauf: string;
  fristTage: number;
  name: string;
  anschrift: string;
  ort: string;
}

const fmtDate = (d: Date) => d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

function buildLetter(d: LetterData, items: string[]): string {
  const today = new Date();
  const deadline = new Date(today.getTime() + d.fristTage * 86400000);
  const or = (v: string, fallback: string) => (v.trim() ? v.trim() : fallback);

  const prelude =
    d.vorlauf === LETTER_PRELUDE_OPTIONS[1]
      ? "Meine bisherige schriftliche Aufforderung zur Erteilung eines Buchauszugs blieb ohne Erfolg. "
      : d.vorlauf === LETTER_PRELUDE_OPTIONS[2]
        ? "Trotz mehrfacher Aufforderung haben Sie den geschuldeten Buchauszug bislang nicht erteilt. "
        : "";

  const closing =
    d.vorlauf === LETTER_PRELUDE_OPTIONS[2]
      ? "Sollte diese letzte Frist fruchtlos verstreichen, werde ich meine Ansprüche ohne weitere Ankündigung gerichtlich – gegebenenfalls im Wege der Stufenklage – geltend machen. Die dadurch entstehenden Kosten gehen zu Ihren Lasten."
      : "Sollte die Frist fruchtlos verstreichen, behalte ich mir die gerichtliche Durchsetzung meiner Ansprüche vor.";

  return [
    or(d.name, "[Vor- und Nachname]"),
    or(d.anschrift, "[Straße, PLZ Ort]"),
    "",
    or(d.versicherer, "[Versicherungsgesellschaft]"),
    or(d.versichererAnschrift, "[Anschrift der Gesellschaft]"),
    "",
    `${or(d.ort, "[Ort]")}, den ${fmtDate(today)}`,
    "",
    "Anforderung eines Buchauszugs gemäß § 87c Abs. 2 HGB",
    `Vermittler-/Agenturnummer: ${or(d.nummer, "[Nummer]")}`,
    `Agenturverhältnis vom ${or(d.von, "[Beginn]")} bis ${or(d.bis, "[Vertragsende]")}`,
    "",
    "Sehr geehrte Damen und Herren,",
    "",
    `zwischen Ihrem Haus und mir bestand vom ${or(d.von, "[Beginn]")} bis zum ${or(d.bis, "[Vertragsende]")} ein Agenturverhältnis (Vermittler-/Agenturnummer ${or(d.nummer, "[Nummer]")}). ${prelude}Zur Überprüfung meiner Provisionsansprüche sowie zur Vorbereitung der Bezifferung meines Ausgleichsanspruchs nach § 89b HGB benötige ich vollständige Auskunft über sämtliche von mir vermittelten und betreuten Verträge.`,
    "",
    `Ich fordere Sie hiermit auf, mir einen vollständigen und übersichtlich gegliederten Buchauszug gemäß § 87c Abs. 2 HGB über alle provisionspflichtigen Geschäfte für den Zeitraum vom ${or(d.von, "[Beginn]")} bis zum ${or(d.bis, "[Vertragsende]")} – einschließlich des Zeitraums der Stornohaftung – zu erteilen.`,
    "",
    "Der Buchauszug hat insbesondere folgende Angaben zu enthalten:",
    ...items.map((it) => `– ${it}`),
    "",
    "Der Anspruch auf Erteilung des Buchauszugs ist gemäß § 87c Abs. 5 HGB unabdingbar. Provisionsabrechnungen oder Bestandslisten ersetzen den Buchauszug nicht; er muss alle für die Provisionsberechnung wesentlichen Umstände in geordneter Form wiedergeben.",
    "",
    `Ich bitte um Übersendung des Buchauszugs bis spätestens ${fmtDate(deadline)}. ${closing}`,
    "",
    "Die Geltendmachung weiterer Ansprüche, insbesondere des Ausgleichsanspruchs nach § 89b HGB sowie etwaiger Provisions- und Auskunftsansprüche, behalte ich mir ausdrücklich vor.",
    "",
    "Mit freundlichen Grüßen",
    "",
    "",
    or(d.name, "[Vor- und Nachname]"),
  ].join("\n");
}

export default function LetterGenerator() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<LetterData>({
    versicherer: "",
    versichererAnschrift: "",
    nummer: "",
    von: "",
    bis: "",
    vorlauf: LETTER_PRELUDE_OPTIONS[0],
    fristTage: 14,
    name: "",
    anschrift: "",
    ort: "",
  });
  const [excluded, setExcluded] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const items = useMemo(() => LETTER_ITEMS.filter((_, i) => !excluded[i]), [excluded]);
  const letter = useMemo(() => buildLetter(data, items), [data, items]);

  const set = <K extends keyof LetterData>(k: K, v: LetterData[K]) => setData((d) => ({ ...d, [k]: v }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard nicht verfügbar */
    }
  };

  const downloadTxt = () => {
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Buchauszug-Anforderung-87c-HGB.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="buchauszug" className="gc-section bg-gc-light" aria-labelledby="letter-title">
      <div className="gc-container">
        <div className="mb-10 max-w-3xl">
          <div className="gc-eyebrow mb-3">Muster-Generator</div>
          <h2 id="letter-title" className="mb-4">
            Buchauszug anfordern nach § 87c Abs. 2 HGB
          </h2>
          <p className="text-[16px] leading-[26px] text-gc-muted">
            Der Buchauszug ist die Grundlage jeder belastbaren Bezifferung. Der Anspruch ist gesetzlich zwingend und
            kann vertraglich nicht abbedungen werden (§ 87c Abs. 5 HGB). Erstellen Sie hier ein strukturiertes
            Aufforderungsschreiben an Ihre Gesellschaft – die Daten verbleiben in Ihrem Browser.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Form */}
          <div className="gc-card no-print lg:col-span-5">
            <div className="mb-6 flex flex-wrap gap-1 border-b border-gc-border-light pb-4" role="tablist">
              {STEPS.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  aria-selected={step === i}
                  onClick={() => setStep(i)}
                  className={cn(
                    "px-3 py-1.5 text-[12px] uppercase tracking-[0.12em] transition-colors",
                    step === i ? "bg-gc-black text-white" : "text-gc-muted hover:text-gc-black",
                  )}
                >
                  {i + 1}. {s}
                </button>
              ))}
            </div>

            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="l-vers" className="gc-label">Versicherungsgesellschaft</label>
                  <input id="l-vers" className="gc-input" placeholder="z. B. Muster Versicherungs-AG" value={data.versicherer} onChange={(e) => set("versicherer", e.target.value)} />
                </div>
                <div>
                  <label htmlFor="l-vers-adr" className="gc-label">Anschrift der Gesellschaft</label>
                  <input id="l-vers-adr" className="gc-input" placeholder="Straße, PLZ Ort" value={data.versichererAnschrift} onChange={(e) => set("versichererAnschrift", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="l-von" className="gc-label">Vertragsbeginn</label>
                    <input id="l-von" className="gc-input" placeholder="01.01.2015" value={data.von} onChange={(e) => set("von", e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="l-bis" className="gc-label">Vertragsende</label>
                    <input id="l-bis" className="gc-input" placeholder="31.12.2025" value={data.bis} onChange={(e) => set("bis", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label htmlFor="l-nr" className="gc-label">Vermittler- / Agenturnummer</label>
                  <input id="l-nr" className="gc-input" placeholder="z. B. VM-123456" value={data.nummer} onChange={(e) => set("nummer", e.target.value)} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="gc-label">Katalog der Auskunftspunkte</div>
                <p className="mb-3 text-[13px] leading-[21px] text-gc-muted">
                  Der Katalog orientiert sich an der Rechtsprechung des BGH zum Inhalt des Buchauszugs. Nicht
                  einschlägige Punkte können Sie abwählen.
                </p>
                <ul className="max-h-80 space-y-1 overflow-y-auto pr-1">
                  {LETTER_ITEMS.map((it, i) => (
                    <li key={i}>
                      <label className="flex cursor-pointer items-start gap-3 p-2 text-[14px] leading-[22px] hover:bg-gc-light">
                        <input
                          type="checkbox"
                          checked={!excluded[i]}
                          onChange={(e) => setExcluded((x) => ({ ...x, [i]: !e.target.checked }))}
                          className="mt-1.5 accent-gc-burgundy"
                        />
                        <span>{it}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <div className="gc-label">Bisheriger Schriftverkehr</div>
                  <div className="space-y-2">
                    {LETTER_PRELUDE_OPTIONS.map((o) => (
                      <button key={o} type="button" data-selected={data.vorlauf === o} onClick={() => set("vorlauf", o)} className="gc-choice text-[14px]" aria-pressed={data.vorlauf === o}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="l-frist" className="gc-label">
                    Frist zur Erteilung: <span className="text-gc-black">{data.fristTage} Tage</span>
                  </label>
                  <input id="l-frist" type="range" min={7} max={30} step={1} value={data.fristTage} onChange={(e) => set("fristTage", Number(e.target.value))} className="w-full accent-gc-burgundy" />
                  <p className="mt-1 text-[12px] text-gc-soft">Üblich sind zwei bis drei Wochen; bei einer letzten Aufforderung genügt eine kürzere Frist.</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="l-name" className="gc-label">Ihr Name</label>
                  <input id="l-name" className="gc-input" placeholder="Vor- und Nachname" value={data.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div>
                  <label htmlFor="l-adr" className="gc-label">Ihre Anschrift</label>
                  <input id="l-adr" className="gc-input" placeholder="Straße, PLZ Ort" value={data.anschrift} onChange={(e) => set("anschrift", e.target.value)} />
                </div>
                <div>
                  <label htmlFor="l-ort" className="gc-label">Ort (für die Datumszeile)</label>
                  <input id="l-ort" className="gc-input" placeholder="z. B. Hamburg" value={data.ort} onChange={(e) => set("ort", e.target.value)} />
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-gc-border-light pt-4">
              <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className="text-[13px] uppercase tracking-[0.15em] text-gc-muted hover:text-gc-black disabled:opacity-30">
                ← Zurück
              </button>
              <button type="button" disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)} className="text-[13px] uppercase tracking-[0.15em] text-gc-burgundy hover:underline disabled:opacity-30">
                Weiter →
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col border border-gc-border-light bg-white lg:col-span-7">
            <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-gc-border-light px-5 py-3">
              <span className="text-[12px] uppercase tracking-[0.18em] text-gc-gold-text">Vorschau des Schreibens</span>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={copy} className="gc-btn-secondary gc-btn-sm">
                  {copied ? "✓ Kopiert" : "Kopieren"}
                </button>
                <button type="button" onClick={downloadTxt} className="gc-btn-secondary gc-btn-sm">
                  Text (.txt)
                </button>
                <button type="button" onClick={() => window.print()} className="gc-btn-primary gc-btn-sm">
                  Drucken / PDF
                </button>
              </div>
            </div>
            <pre className="print-area max-h-[560px] flex-1 overflow-y-auto p-6 font-sans text-[14px] leading-[23px] whitespace-pre-wrap text-gc-body md:p-8">
              {letter}
            </pre>
            <div className="no-print flex flex-col gap-2 border-t border-gc-border-light px-5 py-3 text-[13px] text-gc-muted sm:flex-row sm:items-center sm:justify-between">
              <span>Rechtsgrundlage: § 87c Abs. 2 i. V. m. Abs. 5 HGB</span>
              <a href="#kontakt" className="gc-link">
                Gesellschaft verweigert den Buchauszug? Unterstützung anfragen →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
