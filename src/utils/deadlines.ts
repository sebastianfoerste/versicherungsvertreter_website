/**
 * Berechnungen für Fristen und Verjährung nach § 89b Abs. 4 Satz 2 HGB und §§ 195, 199 BGB.
 */

/**
 * Berechnet das Fristende der einjährigen Ausschlussfrist nach § 89b Abs. 4 S. 2 HGB
 * unter Berücksichtigung von § 188 Abs. 3 BGB (Schaltjahr-Regelung).
 */
export function computeAusschlussfrist(endDate: Date): Date {
  const targetYear = endDate.getFullYear() + 1;
  const targetMonth = endDate.getMonth();
  const targetDay = endDate.getDate();

  // Letzter Tag des Zielmonats im Zieljahr
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const day = Math.min(targetDay, daysInMonth);

  return new Date(targetYear, targetMonth, day, 0, 0, 0, 0);
}

/**
 * Berechnet das Ende der regelmäßigen Verjährungsfrist (§§ 195, 199 Abs. 1 BGB):
 * 31. Dezember des Jahres, das 3 Jahre nach der Beendigung liegt.
 */
export function computeVerjaehrung(endDate: Date): Date {
  return new Date(endDate.getFullYear() + 3, 11, 31, 0, 0, 0, 0);
}

/**
 * Formatiert ein Datum für iCalendar (YYYYMMDD) anhand lokaler Datumskomponenten,
 * um Zeitzonenverschiebungen durch toISOString() in CET/CEST zu verhindern.
 */
export function formatIcsDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

/**
 * Prüft, ob ein Datum auf ein Wochenende (Samstag oder Sonntag) fällt.
 */
export function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

/**
 * Formatiert die verbleibenden Tage für die Anzeige.
 */
export function formatDaysLabel(days: number): string {
  if (days > 1) return `noch ${days} Tage`;
  if (days === 1) return "noch 1 Tag";
  if (days === 0) return "Die Frist endet heute.";
  return "abgelaufen";
}
