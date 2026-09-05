import { describe, it, expect } from "vitest";
import {
  computeAusschlussfrist,
  computeVerjaehrung,
  formatIcsDate,
  formatDaysLabel,
  isWeekend,
} from "../src/utils/deadlines";

describe("Deadlines & Ausschlussfrist calculations", () => {
  it("computes Ausschlussfrist with leap-year handling (2024-02-29 -> 2025-02-28)", () => {
    const end = new Date(2024, 1, 29); // Feb 29, 2024
    const deadline = computeAusschlussfrist(end);
    expect(deadline.getFullYear()).toBe(2025);
    expect(deadline.getMonth()).toBe(1); // February
    expect(deadline.getDate()).toBe(28);
  });

  it("computes Ausschlussfrist for year-end (2025-12-31 -> 2026-12-31)", () => {
    const end = new Date(2025, 11, 31); // Dec 31, 2025
    const deadline = computeAusschlussfrist(end);
    expect(deadline.getFullYear()).toBe(2026);
    expect(deadline.getMonth()).toBe(11);
    expect(deadline.getDate()).toBe(31);
  });

  it("computes Ausschlussfrist for mid-year (2025-06-15 -> 2026-06-15)", () => {
    const end = new Date(2025, 5, 15); // Jun 15, 2025
    const deadline = computeAusschlussfrist(end);
    expect(deadline.getFullYear()).toBe(2026);
    expect(deadline.getMonth()).toBe(5);
    expect(deadline.getDate()).toBe(15);
  });

  it("computes Ausschlussfrist non-leap to leap (2023-02-28 -> 2024-02-28)", () => {
    const end = new Date(2023, 1, 28); // Feb 28, 2023
    const deadline = computeAusschlussfrist(end);
    expect(deadline.getFullYear()).toBe(2024);
    expect(deadline.getMonth()).toBe(1);
    expect(deadline.getDate()).toBe(28);
  });

  it("formats ICS DTSTART to match local date components without UTC shift under Europe/Berlin", () => {
    const dates = [
      { input: new Date(2024, 1, 29), expectedIcs: "20250228" },
      { input: new Date(2025, 11, 31), expectedIcs: "20261231" },
      { input: new Date(2025, 5, 15), expectedIcs: "20260615" },
      { input: new Date(2023, 1, 28), expectedIcs: "20240228" },
    ];

    for (const { input, expectedIcs } of dates) {
      const deadline = computeAusschlussfrist(input);
      expect(formatIcsDate(deadline)).toBe(expectedIcs);
    }
  });

  it("formats day labels for 2, 1, 0, and -1", () => {
    expect(formatDaysLabel(2)).toBe("noch 2 Tage");
    expect(formatDaysLabel(1)).toBe("noch 1 Tag");
    expect(formatDaysLabel(0)).toBe("Die Frist endet heute.");
    expect(formatDaysLabel(-1)).toBe("abgelaufen");
  });

  it("computes regelmäßige Verjährung correctly (31.12. of end-year + 3)", () => {
    const end = new Date(2025, 4, 1);
    const verjaehrung = computeVerjaehrung(end);
    expect(verjaehrung.getFullYear()).toBe(2028);
    expect(verjaehrung.getMonth()).toBe(11); // December
    expect(verjaehrung.getDate()).toBe(31);
  });

  it("detects weekends correctly for § 193 BGB warning", () => {
    // 2026-06-13 is Saturday, 2026-06-14 is Sunday, 2026-06-15 is Monday
    expect(isWeekend(new Date(2026, 5, 13))).toBe(true);
    expect(isWeekend(new Date(2026, 5, 14))).toBe(true);
    expect(isWeekend(new Date(2026, 5, 15))).toBe(false);
  });
});
