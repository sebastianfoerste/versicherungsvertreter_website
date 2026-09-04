import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import KeyContacts from "./components/KeyContacts";
import Overview from "./components/Overview";
import PreCheck, { type PreCheckResult } from "./components/PreCheck";
import Calculator, { type CalculatorResult } from "./components/Calculator";
import LetterGenerator from "./components/LetterGenerator";
import Deadlines, { type DeadlineResult } from "./components/Deadlines";
import { Approach, FAQ, RelatedExpertise, Disclaimer } from "./components/Sections";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

export default function App() {
  const [precheck, setPrecheck] = useState<PreCheckResult | null>(null);
  const [calculator, setCalculator] = useState<CalculatorResult | null>(null);
  const [deadline, setDeadline] = useState<DeadlineResult | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-gc-burgundy focus:px-4 focus:py-2 focus:text-white"
      >
        Zum Inhalt springen
      </a>

      <Header />

      <main id="main" style={{ paddingTop: "var(--gc-header-height)" }}>
        <Hero />
        <KeyContacts />
        <Overview />
        <PreCheck onComplete={setPrecheck} />
        <Calculator onCalculate={setCalculator} />
        <LetterGenerator />
        <Deadlines onDeadlineChange={setDeadline} />
        <Approach />
        <FAQ />
        <ContactForm precheck={precheck} calculator={calculator} deadline={deadline} />
        <RelatedExpertise />
        <Disclaimer />
      </main>

      <Footer />
    </div>
  );
}
