import { useEffect, useState, type FormEvent } from "react";
import { PARTNER, SITE } from "../config";
import type { PreCheckResult } from "./PreCheck";
import type { CalculatorResult } from "./Calculator";
import type { DeadlineResult } from "./Deadlines";
import { Portrait } from "./KeyContacts";
import { cn } from "../utils/cn";

interface Props {
  precheck: PreCheckResult | null;
  calculator?: CalculatorResult | null;
  deadline?: DeadlineResult | null;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  end: string;
  message: string;
  consent: boolean;
  website: string; // Honeypot
}

function makeCaseId() {
  const t = Date.now().toString(36).toUpperCase().slice(-4);
  const r = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `GC-89B-${t}${r}`;
}

export default function ContactForm({ precheck, calculator, deadline }: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    end: "",
    message: "",
    consent: false,
    website: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverDelivered, setServerDelivered] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  const [activeCaseId, setActiveCaseId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Sync deadline contract end date if selected in Fristrechner
  useEffect(() => {
    if (deadline?.endDateStr && !form.end) {
      setForm((f) => ({ ...f, end: deadline.endDateStr }));
    }
  }, [deadline?.endDateStr, form.end]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 3) e.name = "Bitte geben Sie Ihren vollständigen Namen an.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email))
      e.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
    if (form.phone.trim().length < 6)
      e.phone = "Bitte geben Sie eine Telefonnummer für den Rückruf an.";
    if (!form.consent) e.consent = "Ohne Ihre Einwilligung können wir die Anfrage nicht bearbeiten.";
    return e;
  };

  const buildSummary = (id: string) => {
    const lines = [
      `==================================================`,
      `ANFRAGE ERSTGESPRÄCH: AUSGLEICHSANSPRUCH § 89b HGB`,
      `Kanzlei: gunnercooke GmbH (Rechtsanwalt Sebastian Foerste)`,
      `Vorgangs-ID: ${id}`,
      `Datum: ${new Date().toLocaleString("de-DE")}`,
      `==================================================`,
      ``,
      `KONTAKTDATEN:`,
      `Name: ${form.name}`,
      `E-Mail: ${form.email}`,
      `Telefon: ${form.phone}`,
      form.end ? `Vertragsende: ${form.end}` : null,
      ``,
    ];

    if (precheck) {
      lines.push(
        `VORAB-CHECK (Vorgangs-ID ${precheck.caseId}):`,
        `Ergebnis: ${precheck.verdict}`,
        ...precheck.answers.map((a) => `• ${a.question}: ${a.answer}`),
        ``,
      );
    }

    if (calculator) {
      lines.push(
        `ORIENTIERUNGSRECHNER:`,
        `Orientierungswert: ~${calculator.estimate.toLocaleString("de-DE")} EUR`,
        `Jahresdurchschnitt: ${calculator.avg.toLocaleString("de-DE")} EUR`,
        `Ausgleichsfähiger Anteil: ${calculator.share} %`,
        `Sparte: ${calculator.sparteLabel}`,
        `Gesetzliche Höchstgrenze (§ 89b Abs. 5 HGB): ${calculator.cap.toLocaleString("de-DE")} EUR`,
        ``,
      );
    }

    if (deadline) {
      const daysLabel =
        deadline.days > 1
          ? `noch ${deadline.days} Tage`
          : deadline.days === 1
            ? "noch 1 Tag"
            : deadline.days === 0
              ? "Die Frist endet heute."
              : "abgelaufen";
      lines.push(
        `FRISTRECHNER:`,
        `Vertragsende: ${deadline.endDateStr}`,
        `Ausschlussfrist: ${deadline.deadlineStr} (${daysLabel})`,
        ``,
      );
    }

    if (form.message.trim()) {
      lines.push(`IHRE SITUATION / NACHRICHT:`, form.message.trim(), ``);
    }

    lines.push(
      `--------------------------------------------------`,
      `Hinweis: Vertrauliche Anfrage gem. anwaltlicher Schweigepflicht.`,
    );

    return lines.filter((l) => l !== null).join("\n");
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (form.website) {
      // Honeypot: pretend success, send nothing
      setServerDelivered(false);
      setSent(true);
      return;
    }
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const id = precheck?.caseId || makeCaseId();
    setActiveCaseId(id);
    const summary = buildSummary(id);

    setSubmitting(true);
    setSubmissionError(false);

    const endpoint =
      import.meta.env.VITE_INQUIRY_ENDPOINT ||
      "https://europe-west3-versicherungsvertreter.cloudfunctions.net/submitInquiry";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          end: form.end || undefined,
          message: form.message.trim() || undefined,
          website: form.website,
          summary,
        }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const sid = data.id || id;
        setActiveCaseId(sid);
        setServerDelivered(true);
        setSent(true);
      } else {
        setSubmissionError(true);
        setServerDelivered(false);
        setSent(true);
      }
    } catch {
      setSubmissionError(true);
      setServerDelivered(false);
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getMailtoHref = () => {
    const subject = encodeURIComponent(
      `Anfrage Ausgleichsanspruch § 89b HGB – ${form.name} [${activeCaseId}]`,
    );
    const body = encodeURIComponent(buildSummary(activeCaseId));
    return `mailto:${PARTNER.email}?subject=${subject}&body=${body}`;
  };

  const copySummaryText = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary(activeCaseId));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavail */
    }
  };

  return (
    <section id="kontakt" className="gc-section bg-white" aria-labelledby="contact-title">
      <div className="gc-container grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="gc-eyebrow mb-3">Get in Touch</div>
          <h2 id="contact-title" className="mb-4">
            Erstgespräch mit {PARTNER.name}
          </h2>
          <p className="mb-8 text-[16px] leading-[26px] text-gc-muted">
            Schildern Sie uns kurz Ihre Situation. Wir melden uns zeitnah für ein unverbindliches
            Erstgespräch, in dem wir Ihren Fall einordnen und das weitere Vorgehen abstimmen. Ihre
            Angaben unterliegen der anwaltlichen Verschwiegenheitspflicht.
          </p>

          <div className="flex items-start gap-5 border border-gc-border-light p-5">
            <div className="w-20 shrink-0">
              <Portrait />
            </div>
            <div className="text-[14px] leading-[22px]">
              <div className="text-[16px] font-normal text-gc-black">{PARTNER.name}</div>
              <div className="text-gc-muted">
                {PARTNER.title} · {PARTNER.role}
              </div>
              <div className="mt-3 space-y-0.5">
                <a href={PARTNER.phoneHref} className="gc-link block">
                  {PARTNER.phone}
                </a>
                <a href={`mailto:${PARTNER.email}`} className="gc-link block break-all">
                  {PARTNER.email}
                </a>
              </div>
              <div className="mt-3 text-[13px] text-gc-soft">
                {SITE.legalName} · {SITE.registeredOffice}
              </div>
            </div>
          </div>

          <ul className="mt-8 space-y-3 text-[14px] leading-[22px] text-gc-body">
            <li className="flex gap-3">
              <span className="mt-[9px] h-[5px] w-[5px] shrink-0 bg-gc-burgundy" />
              Hilfreich für das Erstgespräch: Agenturvertrag, Kündigung bzw. Aufhebungsvereinbarung,
              letzte Provisionsabrechnungen.
            </li>
            <li className="flex gap-3">
              <span className="mt-[9px] h-[5px] w-[5px] shrink-0 bg-gc-burgundy" />
              Das Erstgespräch ist unverbindlich; eine Vergütung entsteht erst nach ausdrücklicher
              Vereinbarung.
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7">
          <div className="gc-card border-t-2 border-t-gc-burgundy">
            {sent ? (
              <div className="py-6" role="status">
                {submissionError ? (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-2 border-gc-burgundy bg-gc-rose text-[24px] text-gc-burgundy">
                      !
                    </div>
                    <h3 className="mb-2 text-[24px]">Anfrage nicht übermittelt</h3>
                    <p className="mx-auto mb-6 max-w-md text-[15px] leading-[25px] text-gc-muted">
                      Die Anfrage konnte nicht übermittelt werden. Bitte rufen Sie uns an oder senden Sie die vorbereitete E-Mail.
                    </p>
                  </div>
                ) : serverDelivered ? (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-2 border-emerald-600 bg-emerald-50 text-[24px] text-emerald-700">
                      ✓
                    </div>
                    <h3 className="mb-2 text-[24px]">Vielen Dank für Ihre Anfrage</h3>
                    <div className="mb-4 inline-block border border-gc-rose-border bg-gc-rose px-4 py-1.5 font-mono text-[13px] font-normal text-gc-burgundy">
                      Ihre Referenz: {activeCaseId}
                    </div>
                    <p className="mx-auto mb-6 max-w-md text-[15px] leading-[25px] text-gc-muted">
                      Ihre Angaben wurden strukturiert erfasst. {PARTNER.name} wird Ihren Fall prüfen
                      und sich zeitnah telefonisch oder per E-Mail bei Ihnen melden.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-2 border-gc-burgundy bg-gc-rose text-[24px] text-gc-burgundy">
                      ✉️
                    </div>
                    <h3 className="mb-2 text-[24px]">E-Mail vorbereitet</h3>
                    <p className="mx-auto mb-6 max-w-md text-[15px] leading-[25px] text-gc-muted">
                      Ihre Anfrage wurde noch nicht übermittelt. Bitte senden Sie die vorbereitete E-Mail ab oder rufen Sie uns an.
                    </p>
                  </div>
                )}

                <div className="border border-gc-border-light bg-gc-light p-5 my-6 space-y-3 text-[13px] leading-[20px] text-gc-body">
                  <div className="font-normal text-[14px] text-gc-black border-b border-gc-border-light pb-2">
                    Zusammenfassung Ihrer Angaben:
                  </div>
                  <div>
                    <span className="text-gc-muted">Name:</span> {form.name} ·{" "}
                    <span className="text-gc-muted">Telefon:</span> {form.phone} ·{" "}
                    <span className="text-gc-muted">E-Mail:</span> {form.email}
                  </div>
                  {precheck && (
                    <div>
                      <span className="text-gc-muted">Vorab-Check:</span> {precheck.verdict}
                    </div>
                  )}
                  {calculator && (
                    <div>
                      <span className="text-gc-muted">Orientierungsrechner:</span> ~
                      {calculator.estimate.toLocaleString("de-DE")} € ({calculator.sparteLabel})
                    </div>
                  )}
                  {deadline && (
                    <div>
                      <span className="text-gc-muted">Ausschlussfrist:</span> {deadline.deadlineStr}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <a
                    href={getMailtoHref()}
                    className="gc-btn-primary w-full text-center flex items-center justify-center gap-2"
                  >
                    <span>✉️</span> E-Mail-Entwurf direkt in Ihrem Mailprogramm öffnen
                  </a>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={copySummaryText}
                      className="gc-btn-secondary gc-btn-sm flex-1 cursor-pointer"
                    >
                      {copied ? "✓ In Zwischenablage kopiert" : "📋 Zusammenfassung kopieren"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="gc-btn-secondary gc-btn-sm flex-1 cursor-pointer"
                    >
                      Angaben bearbeiten
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field id="c-name" label="Name *" error={errors.name}>
                    <input
                      id="c-name"
                      autoComplete="name"
                      className={cn("gc-input", errors.name && "border-gc-burgundy")}
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Vor- und Nachname"
                    />
                  </Field>
                  <Field id="c-end" label="Vertragsende (falls bekannt)">
                    <input
                      id="c-end"
                      type="date"
                      className="gc-input"
                      value={form.end}
                      onChange={(e) => set("end", e.target.value)}
                    />
                  </Field>
                  <Field id="c-email" label="E-Mail *" error={errors.email}>
                    <input
                      id="c-email"
                      type="email"
                      autoComplete="email"
                      className={cn("gc-input", errors.email && "border-gc-burgundy")}
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="ihre.adresse@beispiel.de"
                    />
                  </Field>
                  <Field id="c-phone" label="Telefon für Rückruf *" error={errors.phone}>
                    <input
                      id="c-phone"
                      type="tel"
                      autoComplete="tel"
                      className={cn("gc-input", errors.phone && "border-gc-burgundy")}
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+49 …"
                    />
                  </Field>
                </div>

                <Field id="c-msg" label="Ihre Situation in Stichworten">
                  <textarea
                    id="c-msg"
                    rows={4}
                    className="gc-input resize-y"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="z. B. Gesellschaft, Vertragsdauer, Art der Beendigung, Sparten …"
                  />
                </Field>

                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="c-website">Website</label>
                  <input
                    id="c-website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                  />
                </div>

                {/* Pre-attached data badges */}
                {(precheck || calculator || deadline) && (
                  <div className="space-y-2 border border-gc-rose-border bg-gc-rose p-4 text-[13px] text-gc-burgundy">
                    <div className="font-normal uppercase tracking-[0.1em] text-[11px]">
                      Automatisch erfasste Daten für Ihr Erstgespräch:
                    </div>
                    {precheck && (
                      <div className="flex items-center justify-between">
                        <span>
                          Vorab-Check: <strong className="font-normal">{precheck.verdict}</strong>
                        </span>
                        <span className="font-mono text-[12px]">{precheck.caseId}</span>
                      </div>
                    )}
                    {calculator && (
                      <div>
                        Orientierungsrechner:{" "}
                        <strong className="font-normal">
                          ~{calculator.estimate.toLocaleString("de-DE")} €
                        </strong>{" "}
                        ({calculator.sparteLabel})
                      </div>
                    )}
                    {deadline && (
                      <div>
                        Ausschlussfrist:{" "}
                        <strong className="font-normal">{deadline.deadlineStr}</strong> (
                        {deadline.days > 1
                          ? `noch ${deadline.days} Tage`
                          : deadline.days === 1
                            ? "noch 1 Tag"
                            : deadline.days === 0
                              ? "Die Frist endet heute."
                              : "abgelaufen"}
                        )
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-[21px] text-gc-muted">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => set("consent", e.target.checked)}
                      className="mt-1 shrink-0 accent-gc-burgundy"
                      aria-invalid={Boolean(errors.consent)}
                    />
                    <span>
                      Ich willige ein, dass meine Angaben zur Bearbeitung meiner Anfrage verarbeitet
                      werden. Die Einwilligung kann ich jederzeit widerrufen. Weitere Informationen
                      in der{" "}
                      <a href={`${SITE.baseUrl}/privacy-policy/`} className="gc-link">
                        Datenschutzerklärung
                      </a>
                      . *
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="mt-1 pl-7 text-[12px] text-gc-burgundy">{errors.consent}</p>
                  )}
                </div>

                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={submitting}
                    aria-busy={submitting ? "true" : undefined}
                    className="gc-btn-primary"
                  >
                    {submitting ? "Wird gesendet..." : "Anfrage senden"}
                  </button>
                  <span className="text-[12px] text-gc-soft">* Pflichtfelder</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="gc-label">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[12px] text-gc-burgundy" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
