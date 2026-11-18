import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { contactSchema } from "@/lib/validation";
import { checkContactRateLimit } from "@/lib/rate-limit";
import { emailIsConfigured, sendProjectBrief } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function error(message: string, status: number, code: string, extra: Record<string, unknown> = {}, headers: Record<string, string> = {}) {
  return Response.json({ ok: false, message, code, ...extra }, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return error("Please send your brief from the RERA WEB website.", 403, "ORIGIN");
  if (!request.headers.get("content-type")?.includes("application/json")) return error("Please use the project brief form to send your idea.", 415, "CONTENT_TYPE");
  if (Number(request.headers.get("content-length") || 0) > 16000) return error("This brief is too large. Please keep your idea under 2,000 characters.", 413, "TOO_LARGE");
  try {
    const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim().slice(0, 100);
    const limit = await checkContactRateLimit(ip);
    if (!limit.allowed) return error("There have been a few attempts from your connection. Please take a short break, then try again. Your text is still here.", 429, "RATE_LIMITED", { retryAfter: limit.retryAfter }, { "Retry-After": String(limit.retryAfter) });
    const raw = await request.text();
    if (raw.length > 16000) return error("This brief is too large.", 413, "TOO_LARGE");
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return error("We couldn’t read that brief. Please try again.", 400, "INVALID_JSON"); }
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => { const key = String(issue.path[0]); if (!fieldErrors[key]) fieldErrors[key] = issue.message; });
      return error("Please check the highlighted fields.", 422, "VALIDATION", { fieldErrors });
    }
    const input = result.data;
    if (input.website) return error("We couldn’t verify this submission. Please try again.", 400, "VERIFICATION");
    const elapsed = Date.now() - input.loadedAt;
    if (elapsed < 2500 || elapsed > 48 * 60 * 60 * 1000) return error("Please take a moment to review your brief, then send it again.", 400, "REVIEW_BRIEF");
    if (!emailIsConfigured()) return error("Email delivery isn’t configured yet. Your idea has not been sent. Please try again later.", 503, "DELIVERY_NOT_CONFIGURED");
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (Boolean(turnstileSecret) !== Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)) return error("Form verification is not configured correctly. Your idea has not been sent.", 503, "VERIFICATION_NOT_CONFIGURED");
    if (turnstileSecret) {
      if (!input.turnstileToken) return error("Please complete the verification before sending your idea.", 400, "VERIFICATION_REQUIRED");
      const verifyResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret: turnstileSecret, response: input.turnstileToken, ...(ip !== "unknown" ? { remoteip: ip } : {}), idempotency_key: randomUUID() }), signal: AbortSignal.timeout(8000) });
      const verification = await verifyResponse.json() as { success?: boolean; action?: string };
      if (!verifyResponse.ok || !verification.success || verification.action !== "contact") return error("Verification expired or could not be confirmed. Please complete the new check and try again.", 400, "VERIFICATION_FAILED");
    }
    const id = randomUUID();
    const reference = `RW-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${id.slice(0, 8).toUpperCase()}`;
    await db.insert(contactSubmissions).values({ id, reference, name: input.name, email: input.email, company: input.company, service: input.service, budget: input.budget, message: input.message, status: "pending" });
    let delivery: Awaited<ReturnType<typeof sendProjectBrief>>;
    try { delivery = await sendProjectBrief(input, reference, id); }
    catch { await db.update(contactSubmissions).set({ status: "failed" }).where(eq(contactSubmissions.id, id)); return error("We couldn’t confirm email delivery. Your idea has not been confirmed as sent. Please try again.", 502, "DELIVERY_FAILED"); }
    if (!delivery.ok) { await db.update(contactSubmissions).set({ status: "failed" }).where(eq(contactSubmissions.id, id)); return error("The email service did not accept your brief. Your text is still here — please try again.", 502, "DELIVERY_FAILED"); }
    try { await db.update(contactSubmissions).set({ status: "accepted", providerId: delivery.providerId }).where(eq(contactSubmissions.id, id)); }
    catch { console.error("Brief accepted by email provider; database status update needs reconciliation.", reference); }
    return Response.json({ ok: true, reference, message: "Your brief has been accepted by our email provider." }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Contact submission could not be processed.");
    return error("We couldn’t send your idea right now. Your text is still here. Please try again later.", 503, "TEMPORARILY_UNAVAILABLE");
  }
}
