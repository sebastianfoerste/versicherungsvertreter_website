import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const distHtmlPath = path.join(rootDir, "dist", "index.html");
if (!fs.existsSync(distHtmlPath)) {
  console.error("dist/index.html not found. Run build first.");
  process.exit(1);
}

const html = fs.readFileSync(distHtmlPath, "utf8");

// Extract script contents and compute SHA-256 hashes
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
const scriptHashes = [];
let match;

while ((match = scriptRegex.exec(html)) !== null) {
  const content = match[1];
  const hash = crypto.createHash("sha256").update(Buffer.from(content, "utf8")).digest("base64");
  scriptHashes.push(`'sha256-${hash}'`);
}

// Build Content-Security-Policy
// Note on style-src: React dynamically applies style attributes (e.g. style={{ paddingTop: ... }}),
// which require 'unsafe-inline' under CSP standards as per task P2-16 specification.
const csp = [
  "default-src 'self'",
  `script-src 'self' ${scriptHashes.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://europe-west3-versicherungsvertreter.cloudfunctions.net",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const firebaseJsonPath = path.join(rootDir, "firebase.json");
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseJsonPath, "utf8"));

const headers = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Content-Security-Policy",
    value: csp,
  },
];

firebaseConfig.hosting = firebaseConfig.hosting || {};
firebaseConfig.hosting.headers = [
  {
    source: "**",
    headers,
  },
];

fs.writeFileSync(firebaseJsonPath, JSON.stringify(firebaseConfig, null, 2) + "\n", "utf8");
console.log("Successfully updated firebase.json with security headers and CSP.");
console.log("Script hashes:", scriptHashes.length);
console.log("CSP:", csp);
