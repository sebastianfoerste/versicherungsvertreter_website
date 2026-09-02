export type Signal = "positive" | "neutral" | "negative";

export interface WizardOption {
  label: string;
  signal: Signal;
  note: string;
}

export interface WizardQuestion {
  id: string;
  title: string;
  help: string;
  options: WizardOption[];
}

export const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: "ende",
    title: "Ist Ihr Agenturvertrag bereits beendet?",
    help: "Der Ausgleichsanspruch entsteht erst mit der rechtlichen Beendigung des Vertragsverhältnisses (§ 89b Abs. 1 HGB).",
    options: [
      { label: "Ja, der Vertrag ist beendet", signal: "positive", note: "Der Anspruch ist dem Grunde nach entstanden; die Jahresfrist läuft." },
      { label: "Nein, aber die Kündigung liegt vor", signal: "neutral", note: "Der Anspruch entsteht mit Ablauf der Kündigungsfrist. Jetzt ist der richtige Zeitpunkt, den Buchauszug vorzubereiten." },
      { label: "Nein, der Vertrag läuft weiter", signal: "neutral", note: "Eine vorausschauende Prüfung der Vertragsklauseln ist sinnvoll, insbesondere bei Aufhebungsangeboten." },
    ],
  },
  {
    id: "wer",
    title: "Wer hat das Vertragsverhältnis beendet?",
    help: "§ 89b Abs. 3 HGB schließt den Anspruch bei einer Eigenkündigung des Vertreters grundsätzlich aus – mit wichtigen Ausnahmen.",
    options: [
      { label: "Der Versicherer / die Gesellschaft", signal: "positive", note: "Die ordentliche Kündigung durch den Unternehmer lässt den Anspruch unberührt." },
      { label: "Ich selbst – aus Anlass durch den Versicherer (z. B. Provisionskürzung, Gebietsentzug)", signal: "neutral", note: "Ein vom Unternehmer gesetzter begründeter Anlass erhält den Anspruch (§ 89b Abs. 3 Nr. 1 HGB). Die Dokumentation des Anlasses ist entscheidend." },
      { label: "Ich selbst – aus Alters- oder Gesundheitsgründen", signal: "positive", note: "Alter oder Krankheit, die eine Fortsetzung unzumutbar machen, erhalten den Anspruch (§ 89b Abs. 3 Nr. 1 HGB)." },
      { label: "Ich selbst – ohne besonderen Anlass", signal: "negative", note: "Hier ist der Anspruch in der Regel ausgeschlossen. Eine Einzelfallprüfung kann sich dennoch lohnen." },
      { label: "Einvernehmlich (Aufhebungsvertrag)", signal: "neutral", note: "Maßgeblich ist, von wem die Initiative ausging und was zur Ausgleichsfrage vereinbart wurde." },
    ],
  },
  {
    id: "klausel",
    title: "Enthält Ihr Vertrag oder eine Aufhebungsvereinbarung eine Abgeltungs- oder Verzichtsklausel?",
    help: "Nach § 89b Abs. 4 Satz 1 HGB kann der Anspruch nicht im Voraus ausgeschlossen werden.",
    options: [
      { label: "Nein", signal: "positive", note: "Keine vertraglichen Hindernisse erkennbar." },
      { label: "Ja, im ursprünglichen Agenturvertrag", signal: "positive", note: "Ein Ausschluss im Voraus ist unwirksam. Die Klausel steht dem Anspruch regelmäßig nicht entgegen." },
      { label: "Ja, in einer Vereinbarung nach Vertragsende", signal: "neutral", note: "Ein nachträglicher Verzicht kann wirksam sein. Wortlaut, Zeitpunkt und Gegenleistung sind sorgfältig zu prüfen." },
      { label: "Ich bin mir nicht sicher", signal: "neutral", note: "Wir prüfen Ihre Vertragsunterlagen im Rahmen der Ersteinschätzung." },
    ],
  },
  {
    id: "beruf",
    title: "Wie haben Sie Ihre Vermittlertätigkeit tatsächlich ausgeübt?",
    help: "§ 92b HGB nimmt nebenberufliche Versicherungsvertreter vom Ausgleichsanspruch aus. Entscheidend ist die tatsächliche Ausgestaltung, nicht die Bezeichnung im Vertrag.",
    options: [
      { label: "Hauptberuflich – überwiegender Teil der Arbeitszeit und des Einkommens", signal: "positive", note: "Die Voraussetzungen des § 92b HGB sprechen für eine hauptberufliche Tätigkeit." },
      { label: "Vertraglich als „nebenberuflich“ bezeichnet, tatsächlich aber hauptberuflich", signal: "neutral", note: "Die Bezeichnung ist nicht maßgeblich. Nachweise zu Arbeitszeit und Einkommen sind zusammenzustellen." },
      { label: "Tatsächlich nebenberuflich", signal: "negative", note: "Der Ausgleichsanspruch ist nach § 92b Abs. 2 HGB in der Regel ausgeschlossen." },
    ],
  },
  {
    id: "buchauszug",
    title: "Liegt Ihnen ein Buchauszug nach § 87c Abs. 2 HGB vor?",
    help: "Der Buchauszug ist die Datengrundlage für jede belastbare Berechnung.",
    options: [
      { label: "Ja, vollständig", signal: "positive", note: "Die Bezifferung kann unmittelbar vorbereitet werden." },
      { label: "Nur Provisionsabrechnungen", signal: "neutral", note: "Provisionsabrechnungen ersetzen den Buchauszug nicht. Wir empfehlen die Anforderung mit unserem Muster." },
      { label: "Nein", signal: "neutral", note: "Der Anspruch auf Buchauszug ist unabdingbar (§ 87c Abs. 5 HGB) und sollte umgehend geltend gemacht werden." },
    ],
  },
];

export const REQUIREMENTS = [
  {
    no: "01",
    title: "Beendigung des Vertragsverhältnisses",
    text: "Der Anspruch entsteht mit der rechtlichen Beendigung des Agenturvertrags – unabhängig davon, ob durch Kündigung, Zeitablauf oder Aufhebungsvertrag.",
    ref: "§ 89b Abs. 1 Satz 1 HGB",
  },
  {
    no: "02",
    title: "Erhebliche Unternehmervorteile",
    text: "Der Versicherer muss aus den von Ihnen vermittelten Verträgen auch nach Vertragsende erhebliche Vorteile ziehen, etwa fortlaufende Prämien aus Ihrem Bestand.",
    ref: "§ 89b Abs. 1 Nr. 1, Abs. 5 HGB",
  },
  {
    no: "03",
    title: "Billigkeit",
    text: "Die Zahlung muss unter Berücksichtigung aller Umstände der Billigkeit entsprechen – insbesondere der entgangenen Provisionen und etwaiger Altersversorgungsleistungen.",
    ref: "§ 89b Abs. 1 Nr. 2 HGB",
  },
  {
    no: "04",
    title: "Kein Ausschlussgrund",
    text: "Eigenkündigung ohne begründeten Anlass, Kündigung aus wichtigem Grund wegen schuldhaften Verhaltens oder Nebenberuflichkeit können den Anspruch ausschließen.",
    ref: "§ 89b Abs. 3, § 92b HGB",
  },
];

export const SERVICES = [
  "Prüfung des Agenturvertrags, der Beendigungsumstände sowie etwaiger Aufhebungs-, Verzichts- oder Abgeltungsklauseln",
  "Fristwahrende Geltendmachung des Ausgleichsanspruchs gegenüber dem Versicherer (§ 89b Abs. 4 Satz 2 HGB)",
  "Durchsetzung des Buchauszugs- und Auskunftsanspruchs nach § 87c HGB – außergerichtlich und im Wege der Stufenklage",
  "Bezifferung des Anspruchs nach den „Grundsätzen“ der Versicherungswirtschaft und der Rechtsprechung des BGH",
  "Verhandlung mit den Rechtsabteilungen der Versicherer und Gestaltung von Vergleichs- und Bestandsübertragungsvereinbarungen",
  "Gerichtliche Vertretung in Ausgleichs-, Provisions- und Stornohaftungsstreitigkeiten",
];

export const PROCESS_STEPS = [
  {
    no: "01",
    title: "Einordnung & Fristwahrung",
    text: "Wir prüfen Ihren Agenturvertrag, den Beendigungstatbestand und etwaige Verzichtsklauseln. Parallel machen wir den Anspruch fristwahrend gegenüber der Gesellschaft geltend.",
  },
  {
    no: "02",
    title: "Buchauszug & Bezifferung",
    text: "Wir setzen den Buchauszug nach § 87c HGB durch, werten Bestands- und Provisionsdaten aus und beziffern den Anspruch nachvollziehbar nach den anerkannten Berechnungsgrundsätzen.",
  },
  {
    no: "03",
    title: "Verhandlung & Durchsetzung",
    text: "Wir verhandeln auf Augenhöhe mit den Rechtsabteilungen der Versicherer. Führt dies nicht zu einem angemessenen Ergebnis, vertreten wir Sie konsequent vor Gericht.",
  },
];

export const FAQ_ITEMS = [
  {
    q: "Was kostet die erste Einschätzung?",
    a: "Das Erstgespräch zur Einordnung Ihres Falls ist unverbindlich und kostenfrei. Eine Vergütung entsteht erst, wenn wir gemeinsam entscheiden, den Anspruch zu verfolgen. Die Grundlage der Vergütung halten wir vorher schriftlich fest.",
  },
  {
    q: "Ich habe eine Aufhebungsvereinbarung unterschrieben. Ist damit alles erledigt?",
    a: "Nicht zwingend. Nach § 89b Abs. 4 Satz 1 HGB kann der Ausgleichsanspruch im Voraus nicht ausgeschlossen werden. Entscheidend sind Wortlaut und Zeitpunkt der Vereinbarung sowie die Frage, ob eine angemessene Gegenleistung vereinbart wurde.",
  },
  {
    q: "In meinem Vertrag steht „nebenberuflich“. Verliere ich den Anspruch?",
    a: "§ 92b HGB knüpft an die tatsächliche Ausgestaltung der Tätigkeit an, nicht an die Bezeichnung im Vertrag. Wer den überwiegenden Teil seiner Arbeitszeit für die Agentur aufwendet und daraus den wesentlichen Teil seines Einkommens erzielt, wird regelmäßig als hauptberuflich behandelt.",
  },
  {
    q: "Wozu brauche ich einen Buchauszug?",
    a: "Der Buchauszug nach § 87c Abs. 2 HGB ist die Datengrundlage für die Berechnung. Ohne die darin enthaltenen Angaben zu vermittelten Verträgen, Provisionen und Stornierungen bleibt jede Bezifferung eine Schätzung, die in der Verhandlung wenig Gewicht hat.",
  },
  {
    q: "Wie lange habe ich Zeit?",
    a: "Der Anspruch ist innerhalb eines Jahres nach Beendigung des Vertragsverhältnisses gegenüber dem Versicherer geltend zu machen (§ 89b Abs. 4 Satz 2 HGB). Es handelt sich um eine Ausschlussfrist – nach ihrem Ablauf erlischt der Anspruch.",
  },
  {
    q: "Wie hoch kann der Ausgleich für Versicherungsvertreter maximal sein?",
    a: "Für Versicherungsvertreter gilt eine besondere Höchstgrenze: Der Ausgleich beträgt höchstens drei Jahresprovisionen oder Jahresvergütungen, berechnet nach dem Durchschnitt der letzten fünf Jahre (§ 89b Abs. 5 Satz 2 HGB).",
  },
];

export const LETTER_ITEMS = [
  "Sämtliche von mir vermittelten bzw. betreuten Versicherungsverträge mit Versicherungsnehmer, Vertragsnummer, Sparte, Tarif und Antragsdatum",
  "Beginn, Laufzeit und Beendigung jedes Vertrages sowie Datum und Grund etwaiger Stornierungen oder Beitragsfreistellungen",
  "Beitragshöhe, Zahlungsweise und Bewertungssumme jedes Vertrages",
  "Provisionssatz, Provisionsart (Abschluss-, Bestands-, Dynamik-, Folgeprovision) sowie Höhe der jeweils verdienten Provision",
  "Stand der Stornohaftungszeit sowie Höhe und Zeitpunkt etwaiger Provisionsrückbelastungen",
  "Angaben zu Nachbearbeitungsmaßnahmen bei notleidenden Verträgen (§ 87a Abs. 3 HGB)",
  "Vertragsänderungen, Erhöhungen und Dynamiken mit Auswirkung auf die Provision",
  "Stand der Provisionskonten einschließlich Vorschüssen, Rückstellungen und Stornoreserven",
];

export const LETTER_PRELUDE_OPTIONS = [
  "Erste Aufforderung",
  "Erneute Aufforderung (bereits schriftlich angefordert)",
  "Letzte Aufforderung mit Fristsetzung vor Klage",
];
