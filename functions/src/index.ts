import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import * as crypto from "crypto";

admin.initializeApp();
const db = admin.firestore();

const SMTP_HOST = defineSecret("SMTP_HOST");
const SMTP_PORT = defineSecret("SMTP_PORT");
const SMTP_USER = defineSecret("SMTP_USER");
const SMTP_PASS = defineSecret("SMTP_PASS");
const INQUIRY_TO = defineSecret("INQUIRY_TO");

function sha256(val: string): string {
  return crypto.createHash("sha256").update(val).digest("hex");
}

function generateServerId(): string {
  const t = Date.now().toString(36).toUpperCase().slice(-4);
  const r = crypto.randomBytes(2).toString("hex").toUpperCase().slice(0, 3);
  return `GC-89B-${t}${r}`;
}

interface InquiryPayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  end?: unknown;
  website?: unknown;
  summary?: unknown;
}

export const submitInquiry = onRequest(
  {
    region: "europe-west3",
    maxInstances: 3,
    timeoutSeconds: 30,
    memory: "256MiB",
    cors: ["https://versicherungsvertreter.web.app"],
    secrets: [SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, INQUIRY_TO],
  },
  async (req, res) => {
    // 1. Method check
    if (req.method !== "POST") {
      res.status(405).json({ error: "method_not_allowed" });
      return;
    }

    const body = (req.body || {}) as InquiryPayload;

    // 2. Honeypot check
    if (body.website && typeof body.website === "string" && body.website.trim().length > 0) {
      // Return 200 fake success, send nothing
      res.status(200).json({ id: generateServerId() });
      return;
    }

    // 3. Payload validation
    const invalidFields: string[] = [];
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (name.length < 2 || name.length > 120) {
      invalidFields.push("name");
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || email.length > 254 || !emailRegex.test(email)) {
      invalidFields.push("email");
    }

    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    if (phone.length < 4 || phone.length > 40) {
      invalidFields.push("phone");
    }

    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (message.length > 5000) {
      invalidFields.push("message");
    }

    const end = typeof body.end === "string" ? body.end.trim() : "";
    if (end && !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
      invalidFields.push("end");
    }

    if (invalidFields.length > 0) {
      res.status(400).json({ error: "validation_failed", fields: invalidFields });
      return;
    }

    // 4. Rate limiting: 5 req / 10 min per IP, 3 req / hour per email
    // Google Front End appends the real client address as the LAST entry of
    // x-forwarded-for; anything before it is client-supplied and spoofable.
    const rawXff = req.headers["x-forwarded-for"];
    const xff = Array.isArray(rawXff) ? rawXff.join(",") : rawXff || "";
    const xffParts = xff.split(",").map((part) => part.trim()).filter(Boolean);
    const ipStr = xffParts.length ? xffParts[xffParts.length - 1] : req.socket.remoteAddress || "unknown-ip";
    const ipHash = sha256(`ip:${ipStr}`);
    const emailHash = sha256(`email:${email}`);

    const now = Date.now();
    const tenMinWindow = 10 * 60 * 1000;
    const oneHourWindow = 60 * 60 * 1000;
    // Firestore TTL deletes a document once the named Timestamp field lies in
    // the past. It adds no retention period itself, so the expiry is written here.
    // Delivery logs keep 90 days; rate-limit counters are useless once their
    // window has closed, so they go after 7.
    const LOG_RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
    const LIMIT_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
    const logExpiresAt = admin.firestore.Timestamp.fromMillis(now + LOG_RETENTION_MS);
    const limitExpiresAt = admin.firestore.Timestamp.fromMillis(now + LIMIT_RETENTION_MS);

    // Read and write share one transaction, so two concurrent requests cannot
    // both observe count = limit - 1 and both pass.
    const consume = async (docId: string, windowMs: number, limit: number): Promise<boolean> => {
      const ref = db.collection("ratelimits").doc(docId);
      return db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const data = snap.exists ? snap.data()! : null;
        if (data && now - data.windowStart < windowMs) {
          if (data.count >= limit) return false;
          tx.update(ref, { count: admin.firestore.FieldValue.increment(1), expiresAt: limitExpiresAt });
          return true;
        }
        tx.set(ref, { windowStart: now, count: 1, expiresAt: limitExpiresAt });
        return true;
      });
    };

    try {
      if (!(await consume(`ip_${ipHash}`, tenMinWindow, 5))) {
        res.status(429).json({ error: "rate_limited", message: "Too many requests from this IP" });
        return;
      }
      if (!(await consume(`email_${emailHash}`, oneHourWindow, 3))) {
        res.status(429).json({ error: "rate_limited", message: "Too many requests for this email" });
        return;
      }
    } catch (err) {
      console.error("Rate limit check failed", err);
      // Fail open: availability of the intake path outranks exact limiting
    }

    // 5. Verify secrets exist
    const host = SMTP_HOST.value();
    const portStr = SMTP_PORT.value();
    const user = SMTP_USER.value();
    const pass = SMTP_PASS.value();
    const inquiryTo = INQUIRY_TO.value();

    if (!host || !portStr || !user || !pass || !inquiryTo) {
      console.error("Missing SMTP secret configuration", {
        hasHost: Boolean(host),
        hasPort: Boolean(portStr),
        hasUser: Boolean(user),
        hasPass: Boolean(pass),
        hasInquiryTo: Boolean(inquiryTo),
      });
      res.status(503).json({ error: "delivery_failed", reason: "smtp_configuration_missing" });
      return;
    }

    const port = parseInt(portStr, 10) || 587;
    const serverId = generateServerId();

    // Prepare email
    const subject = `[${serverId}] Neue Anfrage Ausgleichsanspruch § 89b HGB: ${name}`;
    const summaryText = typeof body.summary === "string" && body.summary.trim() ? body.summary.trim() : "";
    const emailBody = [
      `Neue Anfrage über versicherungsvertreter.web.app`,
      `Referenz-ID: ${serverId}`,
      `Zeitpunkt: ${new Date().toISOString()}`,
      ``,
      `--- KONTAKTDATEN ---`,
      `Name: ${name}`,
      `E-Mail: ${email}`,
      `Telefon: ${phone}`,
      end ? `Vertragsende: ${end}` : null,
      ``,
      summaryText ? `--- FALLZUSAMMENFASSUNG ---\n${summaryText}\n` : null,
      message ? `--- NACHRICHT ---\n${message}\n` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    try {
      await transporter.sendMail({
        from: `"gunnercooke Intake" <${user}>`,
        to: inquiryTo,
        replyTo: `"${name}" <${email}>`,
        subject,
        text: emailBody,
      });
    } catch (mailErr) {
      console.error("SMTP delivery failed", mailErr);
      res.status(503).json({ error: "delivery_failed" });
      return;
    }

    // 6. Write delivery record with NO personal data to Firestore inquiry_log
    const messageBytes = Buffer.byteLength(emailBody, "utf8");
    try {
      await db.collection("inquiry_log").doc(serverId).set({
        id: serverId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: logExpiresAt,
        deliveredAt: new Date().toISOString(),
        status: "delivered",
        messageBytes,
        hasMessage: message.length > 0,
      });
    } catch (logErr) {
      console.error("Failed to write to inquiry_log", logErr);
      // Mail already sent successfully
    }

    // 8. Return success with server id
    res.status(200).json({ id: serverId });
  }
);
