import { describe, it, expect } from "vitest";
import { parseNum, computeOrientierung } from "../src/utils/calculator";

describe("parseNum", () => {
  it("parses 120.000 as 120000", () => {
    expect(parseNum("120.000")).toBe(120000);
  });

  it("parses 120.000,50 as 120000.5", () => {
    expect(parseNum("120.000,50")).toBe(120000.5);
  });

  it("parses 120000.50 as 120000.5", () => {
    expect(parseNum("120000.50")).toBe(120000.5);
  });

  it("parses 1.5 as 1.5", () => {
    expect(parseNum("1.5")).toBe(1.5);
  });

  it("parses -3 as 0", () => {
    expect(parseNum("-3")).toBe(0);
  });

  it("parses abc as 0", () => {
    expect(parseNum("abc")).toBe(0);
  });

  it("handles multi-group thousands separators", () => {
    expect(parseNum("1.000.000")).toBe(1000000);
    expect(parseNum("1.250.000,75")).toBe(1250000.75);
  });
});

describe("computeOrientierung", () => {
  it("distinguishes empty from zero in year inputs", () => {
    // 4 years filled: 100k, 100k, 100k, 100k, 1 empty -> average of 4 years = 100k
    const resWithoutZero = computeOrientierung({
      years: ["100000", "100000", "100000", "100000", ""],
      share: 70,
      factor: 1.5,
    });
    expect(resWithoutZero.count).toBe(4);
    expect(resWithoutZero.avg).toBe(100000);

    // 5 years filled with one explicit zero -> average of 5 years = 80k
    const resWithZero = computeOrientierung({
      years: ["100000", "100000", "100000", "100000", "0"],
      share: 70,
      factor: 1.5,
    });
    expect(resWithZero.count).toBe(5);
    expect(resWithZero.avg).toBe(80000);
  });

  it("computes cap as 3 * avg and bounds estimate range correctly", () => {
    const res = computeOrientierung({
      years: ["100000", "100000", "100000", "100000", "100000"],
      share: 70,
      factor: 1.5,
    });
    // avg = 100000
    // cap = 300000
    // lower = 100000 * 0.7 * 1.0 = 70000
    // upper = 100000 * 0.7 * 1.5 = 105000
    expect(res.avg).toBe(100000);
    expect(res.cap).toBe(300000);
    expect(res.lowerEstimate).toBe(70000);
    expect(res.upperEstimate).toBe(105000);
    expect(res.capped).toBe(false);
  });

  it("caps range at Höchstgrenze when raw estimate exceeds 3 * avg", () => {
    // If share is 100% and factor is 3.5, rawUpper = 350k > cap 300k
    const res = computeOrientierung({
      years: ["100000", "100000", "100000", "100000", "100000"],
      share: 100,
      factor: 3.5,
    });
    expect(res.cap).toBe(300000);
    expect(res.upperEstimate).toBe(300000);
    expect(res.capped).toBe(true);
  });
});
