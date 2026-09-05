/**
 * Zentrale Konfiguration der Unterseite.
 * Alle kanzlei- und personenbezogenen Angaben können hier angepasst werden.
 */

export const SITE_URL = "https://versicherungsvertreter.web.app";

export const SITE = {
  name: "gunnercooke",
  legalName: "gunnercooke GmbH",
  baseUrl: "https://gunnercookede.com",
  phone: "+49 30 220 131 000",
  phoneHref: "tel:+4930220131000",
  email: "centralservices@gunnercooke.de",
  registeredOffice: "Kurfürstendamm 15, 10719 Berlin",
  register: "AG Charlottenburg, HRB 224488 B",
};

export const PARTNER = {
  name: "Sebastian Foerste",
  role: "Partner",
  title: "Rechtsanwalt",
  practice: "Vertrieb, Handel & Logistik",
  location: "Berlin",
  email: "sebastian.foerste@gunnercooke.com",
  phone: "+49 30 220 131 000",
  phoneHref: "tel:+4930220131000",
  profileUrl: "https://gunnercookede.com/people/sebastian-foerste/",
  portraitSrc: "/portrait.webp",
  initials: "SF",
  bio: [
    "Sebastian Foerste berät und vertritt Handelsvertreter und Versicherungsvermittler bei der Durchsetzung ihrer Ausgleichs- und Provisionsansprüche sowie in Auseinandersetzungen um Buchauszüge, Stornohaftung und nachvertragliche Wettbewerbsverbote.",
    "Als Partner von gunnercooke betreut er seine Mandantinnen und Mandanten persönlich – vom Erstgespräch bis zur gerichtlichen Durchsetzung. Er verbindet juristische Präzision mit einem strukturierten, datengestützten Vorgehen.",
  ],
};

/** Hauptnavigation der Seite (Single-Tier direkt ansteuerbar) */
export const MAIN_NAV = [
  { label: "Überblick", href: "#ueberblick", id: "ueberblick" },
  { label: "Vorab-Check", href: "#vorab-check", id: "vorab-check" },
  { label: "Rechner", href: "#rechner", id: "rechner" },
  { label: "Buchauszug", href: "#buchauszug", id: "buchauszug" },
  { label: "Fristen", href: "#fristen", id: "fristen" },
  { label: "FAQ", href: "#faq", id: "faq" },
  { label: "Get in Touch", href: "#kontakt", id: "kontakt" },
];

/** Breadcrumb dieser Unterseite */
export const BREADCRUMB = [
  { label: "Home", href: `${SITE.baseUrl}/` },
  { label: "Sachverstand", href: `${SITE.baseUrl}/sachverstand/` },
  { label: "Commercial Law", href: `${SITE.baseUrl}/practice-area/commercial-law/` },
  { label: "Vertriebsrecht" },
  { label: "Ausgleichsanspruch Versicherungsvertreter (§ 89b HGB)" },
];

/** Sprungmarken innerhalb der Seite ("Auf dieser Seite") */
export const PAGE_SECTIONS = [
  { id: "ueberblick", label: "Überblick" },
  { id: "voraussetzungen", label: "Voraussetzungen" },
  { id: "vorab-check", label: "Vorab-Check" },
  { id: "rechner", label: "Orientierungsrechner" },
  { id: "buchauszug", label: "Buchauszug" },
  { id: "fristen", label: "Fristen" },
  { id: "vorgehen", label: "Unser Vorgehen" },
  { id: "faq", label: "FAQ" },
  { id: "kontakt", label: "Get in Touch" },
];

export const RELATED_EXPERTISE = [
  {
    title: "Vertrieb, Handel & Logistik",
    text: "Gestaltung und Beendigung von Vertriebsverträgen, Handelsvertreter- und Vertragshändlerrecht.",
    href: `${SITE.baseUrl}/sachverstand/`,
  },
  {
    title: "Vertragsrecht",
    text: "Prüfung, Verhandlung und Durchsetzung komplexer Vertragswerke im B2B-Bereich.",
    href: `${SITE.baseUrl}/sachverstand/`,
  },
  {
    title: "Prozessführung und Konfliktbewältigung",
    text: "Strategische Vertretung vor staatlichen Gerichten und Schiedsgerichten sowie in Mediationen.",
    href: `${SITE.baseUrl}/sachverstand/`,
  },
  {
    title: "Versicherung & Haftung",
    text: "Beratung an der Schnittstelle von Versicherungsvertrieb, Haftung und Regulierung.",
    href: `${SITE.baseUrl}/sachverstand/`,
  },
];
