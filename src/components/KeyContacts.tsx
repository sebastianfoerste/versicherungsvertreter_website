import { useState } from "react";
import { PARTNER } from "../config";
import { cn } from "../utils/cn";

export function Portrait({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex aspect-[3/4] w-full items-center justify-center bg-gc-black text-white",
          className,
        )}
        role="img"
        aria-label={`Portrait ${PARTNER.name}`}
      >
        <span className="text-[44px] font-light tracking-[0.1em]">{PARTNER.initials}</span>
      </div>
    );
  }

  return (
    <img
      src={PARTNER.portraitSrc}
      alt={`${PARTNER.name}, ${PARTNER.title} und ${PARTNER.role} bei gunnercooke`}
      className={cn("aspect-[3/4] w-full object-cover", className)}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function KeyContacts() {
  return (
    <section className="gc-section bg-white" aria-labelledby="key-contacts-title">
      <div className="gc-container">
        <div className="mb-8 flex items-end justify-between border-b border-gc-border-light pb-4">
          <h2 id="key-contacts-title" className="text-[20px] text-gc-black">
            Key contacts
          </h2>
          <a href="#kontakt" className="gc-link text-[13px] uppercase tracking-[0.15em]">
            Get in touch →
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3 lg:col-span-2">
            <Portrait className="border border-gc-border-light" />
          </div>
          <div className="md:col-span-9 lg:col-span-10 lg:flex lg:items-start lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <h3 className="text-[24px] leading-[32px] text-gc-burgundy">{PARTNER.name}</h3>
              <div className="mt-1 text-[15px] text-gc-body">
                {PARTNER.role} · {PARTNER.title}
              </div>
              <div className="text-[14px] text-gc-muted">
                {PARTNER.practice} · {PARTNER.location}
              </div>
              <p className="mt-4 text-[15px] leading-[25px] text-gc-muted">{PARTNER.bio[0]}</p>
            </div>
            <div className="mt-6 shrink-0 border-t border-gc-border-light pt-6 text-[14px] lg:mt-0 lg:min-w-[260px] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <dl className="space-y-3">
                <div>
                  <dt className="gc-eyebrow text-[11px]">Telefon</dt>
                  <dd>
                    <a href={PARTNER.phoneHref} className="gc-link">
                      {PARTNER.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="gc-eyebrow text-[11px]">E-Mail</dt>
                  <dd>
                    <a href={`mailto:${PARTNER.email}`} className="gc-link break-all">
                      {PARTNER.email}
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="pt-4">
                <a href={PARTNER.profileUrl} className="gc-btn-secondary gc-btn-sm">
                  Zum Profil
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
