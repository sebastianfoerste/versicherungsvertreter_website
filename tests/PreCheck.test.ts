import { describe, it, expect } from "vitest";
import { evaluatePreCheck } from "../src/utils/precheck";

describe("evaluatePreCheck", () => {
  it("verdict 1: running contract with all other answers positive yields 'Noch kein Anspruch entstanden'", () => {
    const res = evaluatePreCheck({
      ende: 2, // "Nein, der Vertrag läuft weiter"
      wer: 0, // "Der Versicherer – ordentliche Kündigung oder Zeitablauf"
      klausel: 0, // "Nein"
      beruf: 0, // "Hauptberuflich..."
      buchauszug: 0, // "Ja, vollständig"
    });

    expect(res.verdict).toBe("Noch kein Anspruch entstanden");
    expect(res.tone).toBe("neutral");
    expect(res.text).toContain("Der Ausgleichsanspruch entsteht erst mit der rechtlichen Beendigung");
  });

  it("verdict 2: notice given with all other answers positive yields 'Anspruch entsteht mit Vertragsende' and never 'Gute Ausgangslage'", () => {
    const res = evaluatePreCheck({
      ende: 1, // "Nein, aber die Kündigung liegt vor"
      wer: 0, // "Der Versicherer – ordentliche Kündigung oder Zeitablauf"
      klausel: 0, // "Nein"
      beruf: 0, // "Hauptberuflich..."
      buchauszug: 0, // "Ja, vollständig"
    });

    expect(res.verdict).toBe("Anspruch entsteht mit Vertragsende");
    expect(res.verdict).not.toBe("Gute Ausgangslage");
    expect(res.tone).toBe("neutral");
    expect(res.text).toContain("Mit Ablauf der Kündigungsfrist entsteht der Anspruch");
    expect(res.text).toContain("Vorläufige Einordnung der übrigen Angaben:");
  });

  it("verdict 3: ended + Eigenkündigung ohne Anlass yields 'Anspruch voraussichtlich ausgeschlossen'", () => {
    const res = evaluatePreCheck({
      ende: 0, // "Ja, der Vertrag ist beendet"
      wer: 4, // "Ich selbst – ohne besonderen Anlass"
      klausel: 0,
      beruf: 0,
      buchauszug: 0,
    });

    expect(res.verdict).toBe("Anspruch voraussichtlich ausgeschlossen");
    expect(res.tone).toBe("negative");
    expect(res.text).toContain("Mindestens ein gesetzlicher Ausschlussgrund");
  });

  it("verdict 3: ended + fristlose Kündigung yields 'Anspruch voraussichtlich ausgeschlossen'", () => {
    const res = evaluatePreCheck({
      ende: 0, // "Ja, der Vertrag ist beendet"
      wer: 1, // "Der Versicherer – fristlose Kündigung wegen eines mir vorgeworfenen Verhaltens"
      klausel: 0,
      beruf: 0,
      buchauszug: 0,
    });

    expect(res.verdict).toBe("Anspruch voraussichtlich ausgeschlossen");
    expect(res.tone).toBe("negative");
  });

  it("verdict 3: ended + Nachfolger yields 'Anspruch voraussichtlich ausgeschlossen'", () => {
    const res = evaluatePreCheck({
      ende: 0, // "Ja, der Vertrag ist beendet"
      wer: 6, // "Ein Nachfolger hat meine Agentur auf Grundlage einer Vereinbarung mit mir übernommen"
      klausel: 0,
      beruf: 0,
      buchauszug: 0,
    });

    expect(res.verdict).toBe("Anspruch voraussichtlich ausgeschlossen");
    expect(res.tone).toBe("negative");
  });

  it("verdict 5: ended + ordentliche Kündigung + no clause + hauptberuflich + Buchauszug vorhanden yields 'Gute Ausgangslage'", () => {
    const res = evaluatePreCheck({
      ende: 0, // "Ja, der Vertrag ist beendet"
      wer: 0, // "Der Versicherer – ordentliche Kündigung oder Zeitablauf"
      klausel: 0, // "Nein"
      beruf: 0, // "Hauptberuflich..."
      buchauszug: 0, // "Ja, vollständig"
    });

    expect(res.verdict).toBe("Gute Ausgangslage");
    expect(res.tone).toBe("positive");
    expect(res.text).toBe(
      "Nach Ihren Angaben sprechen die wesentlichen Voraussetzungen für einen Ausgleichsanspruch. Entscheidend sind nun Fristwahrung und eine belastbare Datengrundlage."
    );
  });
});
