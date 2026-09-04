"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitInquiry = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
admin.initializeApp();
const db = admin.firestore();
const SMTP_HOST = (0, params_1.defineSecret)("SMTP_HOST");
const SMTP_PORT = (0, params_1.defineSecret)("SMTP_PORT");
const SMTP_USER = (0, params_1.defineSecret)("SMTP_USER");
const SMTP_PASS = (0, params_1.defineSecret)("SMTP_PASS");
const INQUIRY_TO = (0, params_1.defineSecret)("INQUIRY_TO");
function sha256(val) {
    return crypto.createHash("sha256").update(val).digest("hex");
}
function generateServerId() {
    const t = Date.now().toString(36).toUpperCase().slice(-4);
    const r = crypto.randomBytes(2).toString("hex").toUpperCase().slice(0, 3);
    return `GC-89B-${t}${r}`;
}
exports.submitInquiry = (0, https_1.onRequest)({
    region: "europe-west3",
    maxInstances: 3,
    timeoutSeconds: 30,
    memory: "256MiB",
    cors: ["https://versicherungsvertreter.web.app", "http://localhost:5173", "http://localhost:4173"],
    secrets: [SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, INQUIRY_TO],
}, async (req, res) => {
    // 1. Method check
    if (req.method !== "POST") {
        res.status(405).json({ error: "method_not_allowed" });
        return;
    }
    const body = (req.body || {});
    // 2. Honeypot check
    if (body.website && typeof body.website === "string" && body.website.trim().length > 0) {
        // Return 200 fake success, send nothing
        res.status(200).json({ id: generateServerId() });
        return;
    }
    // 3. Payload validation
    const invalidFields = [];
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
    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown-ip";
    const ipStr = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(",")[0].trim();
    const ipHash = sha256(`ip:${ipStr}`);
    const emailHash = sha256(`email:${email}`);
    const now = Date.now();
    const tenMinWindow = 10 * 60 * 1000;
    const oneHourWindow = 60 * 60 * 1000;
    try {
        // Check IP rate limit
        const ipLimitRef = db.collection("ratelimits").doc(`ip_${ipHash}`);
        const ipLimitDoc = await ipLimitRef.get();
        if (ipLimitDoc.exists) {
            const data = ipLimitDoc.data();
            if (now - data.windowStart < tenMinWindow) {
                if (data.count >= 5) {
                    res.status(429).json({ error: "rate_limited", message: "Too many requests from this IP" });
                    return;
                }
                await ipLimitRef.update({ count: admin.firestore.FieldValue.increment(1) });
            }
            else {
                await ipLimitRef.set({ windowStart: now, count: 1 });
            }
        }
        else {
            await ipLimitRef.set({ windowStart: now, count: 1 });
        }
        // Check Email rate limit
        const emailLimitRef = db.collection("ratelimits").doc(`email_${emailHash}`);
        const emailLimitDoc = await emailLimitRef.get();
        if (emailLimitDoc.exists) {
            const data = emailLimitDoc.data();
            if (now - data.windowStart < oneHourWindow) {
                if (data.count >= 3) {
                    res.status(429).json({ error: "rate_limited", message: "Too many requests for this email" });
                    return;
                }
                await emailLimitRef.update({ count: admin.firestore.FieldValue.increment(1) });
            }
            else {
                await emailLimitRef.set({ windowStart: now, count: 1 });
            }
        }
        else {
            await emailLimitRef.set({ windowStart: now, count: 1 });
        }
    }
    catch (err) {
        console.error("Rate limit check failed", err);
        // Continue if rate limit storage fails
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
    }
    catch (mailErr) {
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
            deliveredAt: new Date().toISOString(),
            status: "delivered",
            messageBytes,
            hasMessage: message.length > 0,
        });
    }
    catch (logErr) {
        console.error("Failed to write to inquiry_log", logErr);
        // Mail already sent successfully
    }
    // 8. Return success with server id
    res.status(200).json({ id: serverId });
});
//# sourceMappingURL=index.js.map