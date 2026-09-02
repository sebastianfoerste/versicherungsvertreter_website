import { useState, type FormEvent } from "react";
import { PARTNER, SITE } from "../config";
import type { PreCheckResult } from "./PreCheck";
import { Portrait } from "./KeyContacts";
import { cn } from "../utils/cn";

interface Props {
  precheck: PreCheckResult | null;
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

export default function ContactForm({ precheck }: Props) {
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

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 3) e.name = "Bitte geben Sie Ihren vollständigen Namen an.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
    if (form.phone.trim().length < 6) e.phone = "Bitte geben Sie eine Telefonnummer für den Rückruf an.";
    if (!form.consent) e.consent = "Ohne Ihre Einwilligung können wir die Anfrage nicht bearbeiten.";
    return e;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (form.website) return; // Bot
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    // Hier Anbindung an das CRM / Formular-Backend von gunnercooke.de vornehmen.
    setSent(true);
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
            Schildern Sie uns kurz Ihre Situation. Wir melden uns zeitnah für ein unverbindliches Erstgespräch, in
            dem wir Ihren Fall einordnen und das weitere Vorgehen abstimmen. Ihre Angaben unterliegen der
            anwaltlichen Verschwiegenheitspflicht.
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
              Hilfreich für das Erstgespräch: Agenturvertrag, Kündigung bzw. Aufhebungsvereinbarung, letzte
              Provisionsabrechnungen.
            </li>
            <li className="flex gap-3">
              <span className="mt-[9px] h-[5px] w-[5px] shrink-0 bg-gc-burgundy" />
              Das Erstgespräch ist unverbindlich; eine Vergütung entsteht erst nach ausdrücklicher Vereinbarung.
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7">
          <div className="gc-card border-t-2 border-t-gc-burgundy">
            {sent ? (
              <div className="py-6 text-center" role="status">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-gc-burgundy text-[20px] text-gc-burgundy">
                  ✓
                </div>
                <h3 className="mb-3 text-[22px]">Vielen Dank für Ihre Anfrage</h3>
                <p className="mx-auto mb-5 max-w-md text-[15px] leading-[25px] text-gc-muted">
                  {PARTNER.name} wird Ihre Angaben sichten und sich in Kürze persönlich mit Ihnen in Verbindung
                  setzen.
                </p>
                {precheck && (
                  <div className="inline-block border border-gc-rose-border bg-gc-rose px-4 py-2 font-mono text-[13px] text-gc-burgundy">
                    Vorgangs-ID {precheck.caseId}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field id="c-name" label="Name *" error={errors.name}>
                    <input id="c-name" autoComplete="name" className={cn("gc-input", errors.name && "border-gc-burgundy")} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Vor- und Nachname" />
                  </Field>
                  <Field id="c-end" label="Vertragsende (falls bekannt)">
                    <input id="c-end" type="date" className="gc-input" value={form.end} onChange={(e) => set("end", e.target.value)} />
                  </Field>
                  <Field id="c-email" label="E-Mail *" error={errors.email}>
                    <input id="c-email" type="email" autoComplete="email" className={cn("gc-input", errors.email && "border-gc-burgundy")} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="ihre.adresse@beispiel.de" />
                  </Field>
                  <Field id="c-phone" label="Telefon für Rückruf *" error={errors.phone}>
                    <input id="c-phone" type="tel" autoComplete="tel" className={cn("gc-input", errors.phone && "border-gc-burgundy")} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+49 …" />
                  </Field>
                </div>

                <Field id="c-msg" label="Ihre Situation in Stichworten">
                  <textarea id="c-msg" rows={4} className="gc-input resize-y" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="z. B. Gesellschaft, Vertragsdauer, Art der Beendigung, Sparten …" />
                </Field>

                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="c-website">Website</label>
                  <input id="c-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
                </div>

                {precheck && (
                  <div className="flex flex-col gap-1 border border-gc-rose-border bg-gc-rose px-4 py-3 text-[13px] text-gc-burgundy sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      Ergebnis Ihres Vorab-Checks wird übermittelt: <span className="font-normal">{precheck.verdict}</span>
                    </span>
                    <span className="font-mono">{precheck.caseId}</span>
                  </div>
                )}

                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-[21px] text-gc-muted">
                    <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 shrink-0 accent-gc-burgundy" aria-invalid={Boolean(errors.consent)} />
                    <span>
                      Ich willige ein, dass meine Angaben zur Bearbeitung meiner Anfrage verarbeitet werden. Die
                      Einwilligung kann ich jederzeit widerrufen. Weitere Informationen in der{" "}
                      <a href={`${SITE.baseUrl}/datenschutz/`} className="gc-link">
                        Datenschutzerklärung
                      </a>
                      . *
                    </span>
                  </label>
                  {errors.consent && <p className="mt-1 pl-7 text-[12px] text-gc-burgundy">{errors.consent}</p>}
                </div>

                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <button type="submit" className="gc-btn-primary">
                    Anfrage senden
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

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
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
