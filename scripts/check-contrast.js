function hexToRgb(hex) {
  const m = hex.replace("#", "").match(/.{1,2}/g);
  return m.map((x) => parseInt(x, 16));
}

function relativeLuminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const white = "#ffffff";
const bgLight = "#f9f9f9";

const tokens = {
  "--color-gc-gold": "#97692b",
  "--color-gc-gold-text": "#97692b",
  "--color-gc-soft": "#6f7379",
  "--color-gc-muted (unchanged)": "#5c636b",
};

console.log("WCAG AA Contrast Check (Threshold >= 4.5:1 for normal text):");
console.log("------------------------------------------------------------");

let allPassed = true;
for (const [token, hex] of Object.entries(tokens)) {
  const onWhite = contrastRatio(hex, white);
  const onBgLight = contrastRatio(hex, bgLight);
  const passWhite = onWhite >= 4.5 ? "PASS" : "FAIL";
  const passBgLight = onBgLight >= 4.5 ? "PASS" : "FAIL";
  
  if (passWhite === "FAIL" || passBgLight === "FAIL") {
    allPassed = false;
  }

  console.log(`${token}: ${hex}`);
  console.log(`  on #ffffff: ${onWhite.toFixed(2)}:1 [${passWhite}]`);
  console.log(`  on #f9f9f9: ${onBgLight.toFixed(2)}:1 [${passBgLight}]`);
}

console.log("------------------------------------------------------------");
if (!allPassed) {
  console.error("FAILED: One or more tokens failed WCAG AA threshold.");
  process.exit(1);
} else {
  console.log("SUCCESS: All tokens meet or exceed WCAG AA 4.5:1 ratio.");
}
