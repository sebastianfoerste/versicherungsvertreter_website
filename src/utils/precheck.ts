import { WIZARD_QUESTIONS, type Signal, type WizardQuestion, type WizardOption } from "../data/content";

export interface PreCheckEvaluation {
  list: { question: WizardQuestion; opt: WizardOption }[];
  verdict: string;
  tone: Signal;
  text: string;
}

export function evaluatePreCheck(answers: Record<string, number>): PreCheckEvaluation {
  const list = WIZARD_QUESTIONS.map((question) => {
    const idx = answers[question.id];
    const opt = idx !== undefined ? question.options[idx] : undefined;
    return { question, opt };
  }).filter((x): x is { question: WizardQuestion; opt: WizardOption } => Boolean(x.opt));

  const getOpt = (qid: string) => {
    const idx = answers[qid];
    const q = WIZARD_QUESTIONS.find((item) => item.id === qid);
    return idx !== undefined && q ? q.options[idx] : undefined;
  };

  const optEnde = getOpt("ende");
  const optWer = getOpt("wer");
  const optBeruf = getOpt("beruf");

  const hasNegativeWerOrBeruf =
    (optWer && optWer.signal === "negative") ||
    (optBeruf && optBeruf.signal === "negative");

  const neutralsCount = list.filter((x) => x.opt.signal === "neutral").length;

  // 1. ende = "Nein, der Vertrag läuft weiter"
  if (optEnde?.label === "Nein, der Vertrag läuft weiter") {
    return {
      list,
      verdict: "Noch kein Anspruch entstanden",
      tone: "neutral",
      text: "Der Ausgleichsanspruch entsteht erst mit der rechtlichen Beendigung des Vertragsverhältnisses. Eine Frist läuft noch nicht. Sinnvoll ist jetzt die Prüfung des Agenturvertrags, insbesondere von Aufhebungsangeboten und Abgeltungsklauseln.",
    };
  }

  // 2. ende = "Nein, aber die Kündigung liegt vor"
  if (optEnde?.label === "Nein, aber die Kündigung liegt vor") {
    let subText = "";
    if (hasNegativeWerOrBeruf) {
      subText =
        "Mindestens ein gesetzlicher Ausschlussgrund kommt nach Ihren Angaben in Betracht. Ausnahmen (begründeter Anlass, tatsächliche Hauptberuflichkeit, unwirksame fristlose Kündigung) werden in der Praxis häufig übersehen. Eine Einzelfallprüfung ist sinnvoll.";
    } else if (neutralsCount >= 2) {
      subText =
        "Mehrere Punkte bedürfen einer näheren rechtlichen Bewertung. Bitte halten Sie Agenturvertrag, Kündigungsschreiben und etwaige Aufhebungsvereinbarungen für das Erstgespräch bereit.";
    } else {
      subText =
        "Nach Ihren Angaben sprechen die wesentlichen Voraussetzungen für einen Ausgleichsanspruch. Entscheidend sind nun Fristwahrung und eine belastbare Datengrundlage.";
    }

    return {
      list,
      verdict: "Anspruch entsteht mit Vertragsende",
      tone: "neutral",
      text: `Mit Ablauf der Kündigungsfrist entsteht der Anspruch, und die einjährige Ausschlussfrist beginnt. Bereiten Sie jetzt die Anforderung des Buchauszugs vor und dokumentieren Sie den Kündigungsanlass. Vorläufige Einordnung der übrigen Angaben: ${subText}`,
    };
  }

  // 3. Any negative in wer or beruf
  if (hasNegativeWerOrBeruf) {
    return {
      list,
      verdict: "Anspruch voraussichtlich ausgeschlossen",
      tone: "negative",
      text: "Mindestens ein gesetzlicher Ausschlussgrund kommt nach Ihren Angaben in Betracht. Ausnahmen (begründeter Anlass, tatsächliche Hauptberuflichkeit, unwirksame fristlose Kündigung) werden in der Praxis häufig übersehen. Eine Einzelfallprüfung ist sinnvoll.",
    };
  }

  // 4. neutrals >= 2
  if (neutralsCount >= 2) {
    return {
      list,
      verdict: "Anwaltliche Prüfung empfohlen",
      tone: "neutral",
      text: "Mehrere Punkte bedürfen einer näheren rechtlichen Bewertung. Bitte halten Sie Agenturvertrag, Kündigungsschreiben und etwaige Aufhebungsvereinbarungen für das Erstgespräch bereit.",
    };
  }

  // 5. Otherwise
  return {
    list,
    verdict: "Gute Ausgangslage",
    tone: "positive",
    text: "Nach Ihren Angaben sprechen die wesentlichen Voraussetzungen für einen Ausgleichsanspruch. Entscheidend sind nun Fristwahrung und eine belastbare Datengrundlage.",
  };
}
