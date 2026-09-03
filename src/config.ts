/**
 * Zentrale Konfiguration der Unterseite.
 * Alle kanzlei- und personenbezogenen Angaben können hier angepasst werden.
 */

export const SITE = {
  name: "gunnercooke",
  legalName: "gunnercooke GmbH",
  baseUrl: "https://www.gunnercooke.de",
  pagePath:
    "/expertise/commercial/vertrieb-handel-logistik/ausgleichsanspruch-versicherungsvertreter/",
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
  profileUrl: "https://www.gunnercooke.de/people/sebastian-foerste/",
  portraitSrc: "/portrait.webp",
  initials: "SF",
  bio: [
    "Sebastian Foerste berät und vertritt Handelsvertreter und Versicherungsvermittler bei der Durchsetzung ihrer Ausgleichs- und Provisionsansprüche sowie in Auseinandersetzungen um Buchauszüge, Stornohaftung und nachvertragliche Wettbewerbsverbote.",
    "Als Partner von gunnercooke betreut er seine Mandantinnen und Mandanten persönlich – vom Erstgespräch bis zur gerichtlichen Durchsetzung. Er verbindet juristische Präzision mit einem strukturierten, datengestützten Vorgehen.",
  ],
};

/** Hauptnavigation gunnercooke.de (Labels wie auf der Hauptseite) */
export const MAIN_NAV = [
  { label: "Expertise", href: `${SITE.baseUrl}/expertise/`, current: true },
  { label: "Our Approach", href: `${SITE.baseUrl}/our-approach/` },
  { label: "Consulting", href: `${SITE.baseUrl}/consulting/` },
  { label: "News & Insights", href: `${SITE.baseUrl}/news-insights/` },
  { label: "Join Us", href: `${SITE.baseUrl}/join-us/` },
  { label: "Get in Touch", href: `${SITE.baseUrl}/get-in-touch/` },
];

/** Breadcrumb dieser Unterseite */
export const BREADCRUMB = [
  { label: "Home", href: `${SITE.baseUrl}/` },
  { label: "Expertise", href: `${SITE.baseUrl}/expertise/` },
  { label: "Commercial", href: `${SITE.baseUrl}/expertise/commercial/` },
  {
    label: "Vertrieb, Handel & Logistik",
    href: `${SITE.baseUrl}/expertise/commercial/vertrieb-handel-logistik/`,
  },
  { label: "Ausgleichsanspruch Versicherungsvertreter" },
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

export const OFFICES = [
  { city: "Berlin", lines: ["gunnercooke GmbH", "Kurfürstendamm 15", "10719 Berlin"] },
  { city: "Düsseldorf", lines: ["gunnercooke GmbH", "Königsallee 27", "40212 Düsseldorf"] },
  { city: "Frankfurt", lines: ["gunnercooke GmbH", "Opernplatz 14", "60313 Frankfurt am Main"] },
  { city: "Hamburg", lines: ["gunnercooke GmbH", "Neuer Wall 44", "20354 Hamburg"] },
  { city: "München", lines: ["gunnercooke GmbH", "Ludwigpalais, Ludwigstraße 8", "80539 München"] },
  { city: "Zürich", lines: ["gunnercooke GmbH", "Bahnhofstrasse 10", "8001 Zürich"] },
  { city: "Innsbruck", lines: ["gunnercooke GmbH", "Niederlassung Österreich", "Salurnerstraße 1/DG, 6020 Innsbruck"] },
  { city: "Wien", lines: ["gunnercooke GmbH", "Sprechstelle Wien", "Fleischmarkt 1, 1010 Wien"] },
];

export const FOOTER_LINKS = {
  expertise: [
    { label: "Commercial Law", href: `${SITE.baseUrl}/expertise/commercial/` },
    { label: "Vertrieb, Handel & Logistik", href: `${SITE.baseUrl}/expertise/commercial/vertrieb-handel-logistik/` },
    { label: "Vertragsrecht", href: `${SITE.baseUrl}/expertise/commercial/vertragsrecht/` },
    { label: "Dispute Resolution", href: `${SITE.baseUrl}/expertise/dispute-resolution/` },
    { label: "Versicherung & Haftung", href: `${SITE.baseUrl}/expertise/dispute-resolution/versicherung-haftung/` },
  ],
  firm: [
    { label: "Our Approach", href: `${SITE.baseUrl}/our-approach/` },
    { label: "People", href: `${SITE.baseUrl}/people/` },
    { label: "News & Insights", href: `${SITE.baseUrl}/news-insights/` },
    { label: "Join Us", href: `${SITE.baseUrl}/join-us/` },
    { label: "Get in Touch", href: `${SITE.baseUrl}/get-in-touch/` },
  ],
  legal: [
    { label: "Impressum", href: `${SITE.baseUrl}/impressum/` },
    { label: "Datenschutz", href: `${SITE.baseUrl}/datenschutz/` },
    { label: "Mandatsbedingungen", href: `${SITE.baseUrl}/mandatsbedingungen/` },
    { label: "Cookie-Einstellungen", href: "#cookie-einstellungen" },
  ],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/gunnercooke/" },
    { label: "Instagram", href: "https://www.instagram.com/gunnercooke/" },
    { label: "YouTube", href: "https://www.youtube.com/@gunnercooke" },
  ],
};

export const RELATED_EXPERTISE = [
  {
    title: "Vertrieb, Handel & Logistik",
    text: "Gestaltung und Beendigung von Vertriebsverträgen, Handelsvertreter- und Vertragshändlerrecht.",
    href: `${SITE.baseUrl}/expertise/commercial/vertrieb-handel-logistik/`,
  },
  {
    title: "Vertragsrecht",
    text: "Prüfung, Verhandlung und Durchsetzung komplexer Vertragswerke im B2B-Bereich.",
    href: `${SITE.baseUrl}/expertise/commercial/vertragsrecht/`,
  },
  {
    title: "Prozessführung und Konfliktbewältigung",
    text: "Strategische Vertretung vor staatlichen Gerichten und Schiedsgerichten sowie in Mediationen.",
    href: `${SITE.baseUrl}/expertise/dispute-resolution/prozessfuehrung-und-konfliktbewaeltigung/`,
  },
  {
    title: "Versicherung & Haftung",
    text: "Beratung an der Schnittstelle von Versicherungsvertrieb, Haftung und Regulierung.",
    href: `${SITE.baseUrl}/expertise/dispute-resolution/versicherung-haftung/`,
  },
];
