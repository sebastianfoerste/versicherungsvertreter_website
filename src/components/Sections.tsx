import { useState } from "react";
import { RELATED_EXPERTISE } from "../config";
import { FAQ_ITEMS, PROCESS_STEPS } from "../data/content";
import { cn } from "../utils/cn";

export function Approach() {
  return (
    <section id="vorgehen" className="gc-section bg-white" aria-labelledby="approach-title">
      <div className="gc-container">
        <div className="mb-10 max-w-3xl">
          <div className="gc-eyebrow mb-3">Anwaltliche Vertretung</div>
          <h2 id="approach-title" className="mb-4">
            Unser Vorgehen: Persönlich, strukturiert, auf Augenhöhe mit dem Versicherer
          </h2>
          <p className="text-[16px] leading-[26px] text-gc-muted">
            Unsere Partner betreuen ihre Mandantinnen und Mandanten persönlich – ohne Weiterdelegation. Sie bringen
            langjährige Erfahrung aus Wirtschaftskanzleien und Unternehmen mit und verbinden juristische Präzision mit
            unternehmerischem Verständnis für Ihre Situation.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-px bg-gc-border-light md:grid-cols-3">
          {PROCESS_STEPS.map((s) => (
            <li key={s.no} className="bg-white p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[28px] font-light text-gc-burgundy">{s.no}</span>
                <span className="h-px flex-1 bg-gc-border-light" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-[19px] leading-[28px]">{s.title}</h3>
              <p className="text-[14px] leading-[23px] text-gc-muted">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-gc-border-light pt-8 md:grid-cols-3">
          {[
            { k: "Trusted Advisor", v: "Persönliche Betreuung durch einen Partner – vom Erstgespräch bis zum Abschluss." },
            { k: "Transparente Vergütung", v: "Klare Vereinbarung vor Mandatsbeginn; das Erstgespräch ist unverbindlich." },
            { k: "Bundesweit", v: "Vertretung gegenüber allen Versicherern und vor allen deutschen Gerichten." },
          ].map((i) => (
            <div key={i.k}>
              <div className="mb-1 text-[15px] font-normal text-gc-black">{i.k}</div>
              <div className="text-[14px] leading-[22px] text-gc-muted">{i.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="faq" className="gc-section bg-gc-light" aria-labelledby="faq-title">
      <div className="gc-container grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="gc-eyebrow mb-3">Häufige Fragen</div>
          <h2 id="faq-title" className="mb-4">
            Fragen zum Ausgleichsanspruch nach § 89b HGB
          </h2>
          <p className="text-[15px] leading-[25px] text-gc-muted">
            Die wichtigsten Antworten für Versicherungsvertreterinnen und -vertreter im Überblick. Ihre Frage ist nicht
            dabei?{" "}
            <a href="#kontakt" className="gc-link">
              Sprechen Sie uns an.
            </a>
          </p>
        </div>
        <div className="lg:col-span-8">
          <div className="divide-y divide-gc-border-light border-y border-gc-border-light">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q}>
                  <h3 className="text-[17px] leading-[26px]">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-btn-${i}`}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left text-gc-black transition-colors hover:text-gc-burgundy"
                    >
                      <span>{item.q}</span>
                      <span
                        className={cn(
                          "relative h-4 w-4 shrink-0 text-gc-burgundy transition-transform duration-200",
                          isOpen && "rotate-45",
                        )}
                        aria-hidden="true"
                      >
                        <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 bg-current" />
                        <span className="absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 bg-current" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    className={cn("grid transition-[grid-template-rows] duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 text-[15px] leading-[25px] text-gc-muted">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function RelatedExpertise() {
  return (
    <section className="gc-section bg-white" aria-labelledby="related-title">
      <div className="gc-container">
        <div className="mb-8 flex items-end justify-between border-b border-gc-border-light pb-4">
          <h2 id="related-title" className="text-[20px] text-gc-black">
            Weitere Expertise
          </h2>
          <a href="https://www.gunnercooke.de/expertise/" className="gc-link text-[13px] uppercase tracking-[0.15em]">
            Alle Rechtsgebiete →
          </a>
        </div>
        <div className="grid grid-cols-1 gap-px bg-gc-border-light sm:grid-cols-2 lg:grid-cols-4">
          {RELATED_EXPERTISE.map((r) => (
            <a key={r.title} href={r.href} className="group flex flex-col bg-white p-6 transition-colors hover:bg-gc-light">
              <h3 className="mb-2 text-[17px] leading-[26px] group-hover:text-gc-burgundy">{r.title}</h3>
              <p className="flex-1 text-[14px] leading-[22px] text-gc-muted">{r.text}</p>
              <span className="mt-4 text-[12px] uppercase tracking-[0.15em] text-gc-burgundy">Mehr erfahren →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Disclaimer() {
  return (
    <section className="border-t border-gc-border-light bg-gc-light py-8" aria-label="Rechtlicher Hinweis">
      <div className="gc-container max-w-4xl text-center text-[13px] leading-[21px] text-gc-muted">
        <p>
          <strong className="font-normal text-gc-black">Hinweis: </strong>
          Die auf dieser Seite bereitgestellten Informationen, Prüfassistenten, Rechner und Muster dienen der
          unverbindlichen Erstorientierung und stellen keine Rechtsberatung dar. Sie ersetzen nicht die Prüfung des
          Einzelfalls. Ein Mandatsverhältnis kommt erst durch ausdrückliche Annahme des Mandats durch die gunnercooke
          GmbH zustande.
        </p>
      </div>
    </section>
  );
}
