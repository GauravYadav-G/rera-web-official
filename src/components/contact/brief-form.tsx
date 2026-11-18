"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ContactErrors } from "@/lib/validation";
import { getContactSchema } from "@/lib/client-validation";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { RegistrationMarks } from "@/components/ui";
import { Turnstile } from "./turnstile";

type FormValues = { name: string; email: string; company: string; service: string; budget: string; message: string; website: string };
type FormState = "idle" | "invalid" | "submitting" | "success" | "error" | "rate-limited";
const empty: FormValues = { name: "", email: "", company: "", service: "", budget: "", message: "", website: "" };

export function BriefForm({ initialService = "" }: { initialService?: string }) {
  const [values, setValues] = useState<FormValues>(() => ({ ...empty, service: initialService }));
  const latestValues = useRef(values);
  const busy = useRef(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [token, setToken] = useState("");
  const [challengeKey, setChallengeKey] = useState(0);
  const [retryAfter, setRetryAfter] = useState(0);
  const loadedAt = useRef(0);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const [privacy, setPrivacy] = useState(false);
  useEffect(() => {
    loadedAt.current = Date.now();
    const requested = new URLSearchParams(window.location.search).get("service");
    if (requested && [...services.map((service) => service.formName), "Other"].includes(requested)) {
      setValues((previous) => { const next = { ...previous, service: requested }; latestValues.current = next; return next; });
    }
  }, []);
  useEffect(() => { if (state === "success") successHeading.current?.focus({ preventScroll: true }); }, [state]);
  useEffect(() => {
    if (state !== "rate-limited" || retryAfter <= 0) return;
    const timer = setTimeout(() => { setState("idle"); setMessage(""); }, retryAfter * 1000);
    return () => clearTimeout(timer);
  }, [state, retryAfter]);
  function change(field: keyof FormValues, value: string) {
    latestValues.current = { ...latestValues.current, [field]: value };
    setValues(latestValues.current);
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }
  async function validateField(field: keyof FormValues) {
    const snapshot = latestValues.current[field];
    try {
      const schema = await getContactSchema();
      if (latestValues.current[field] !== snapshot || busy.current) return;
      const result = schema.shape[field].safeParse(snapshot);
      setErrors((previous) => ({ ...previous, [field]: result.success ? undefined : result.error.issues[0]?.message }));
    } catch { /* A failed validator download is reported on submission; typed text remains. */ }
  }
  function describedBy(field: keyof FormValues) { return errors[field] ? `brief-${field}-error` : undefined; }
  function fieldError(field: keyof FormValues) { return errors[field] ? <p className="field-error" id={`brief-${field}-error`}>{errors[field]}</p> : null; }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || state === "rate-limited") return;
    busy.current = true;
    setState("submitting"); setMessage("Checking your project brief…");
    try {
      const schema = await getContactSchema();
      const parsed = schema.safeParse({ ...latestValues.current, loadedAt: loadedAt.current, turnstileToken: token });
      if (!parsed.success) {
        const nextErrors: ContactErrors = {};
        parsed.error.issues.forEach((issue) => { const key = issue.path[0] as keyof ContactErrors; if (!nextErrors[key]) nextErrors[key] = issue.message; });
        setErrors(nextErrors); setState("invalid"); setMessage("Please check the highlighted fields before sending your idea.");
        requestAnimationFrame(() => document.getElementById(`brief-${Object.keys(nextErrors)[0]}`)?.focus());
        return;
      }
      if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token) { setState("error"); setMessage("Please complete the verification before sending your idea."); return; }
      setErrors({}); setMessage("Sending your project brief…");
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data), signal: AbortSignal.timeout(30000) });
      const result = await response.json() as { ok?: boolean; reference?: string; message?: string; fieldErrors?: ContactErrors; retryAfter?: number; code?: string };
      if (response.ok && result.ok && result.reference) { setReference(result.reference); setState("success"); setMessage("Your brief is on its way. The email provider has accepted it."); return; }
      setErrors(result.fieldErrors || {});
      setMessage(result.message || "We couldn’t confirm delivery. Your text is still here — please try again.");
      setState(response.status === 429 ? "rate-limited" : "error"); setRetryAfter(result.retryAfter || 60);
      if (result.code === "REVIEW_BRIEF") loadedAt.current = Date.now();
      setChallengeKey((previous) => previous + 1);
    } catch {
      setState("error"); setMessage("We couldn’t complete your submission. Please check your connection and try again. No delivery has been confirmed and your text is still here."); setChallengeKey((previous) => previous + 1);
    } finally { busy.current = false; }
  }
  return <div className="contact-empty-plate" id="brief"><RegistrationMarks/><div className="brief-header mono"><span><i className="code-caret" aria-hidden="true"/>{state === "success" ? "BRIEF RECEIVED" : "AWAITING BRIEF"}</span><span>YOUR NEXT BUILD / 001</span></div>
    {state === "success" ? <div className="form-success"><span className="success-mark" aria-hidden="true">↗</span><h3 tabIndex={-1} ref={successHeading}>An idea.<br/>A new beginning.</h3><p>Your project brief is on its way to {site.foundersLabel}. They’ll read through your idea and continue the conversation using the email you shared.</p><span className="success-reference mono">YOUR REFERENCE / {reference}</span><button type="button" className="text-link" onClick={() => { latestValues.current = { ...empty }; setValues({ ...empty }); setErrors({}); setState("idle"); setReference(""); setMessage(""); loadedAt.current = Date.now(); setChallengeKey((previous) => previous + 1); }}><span>Share another idea</span><span aria-hidden="true">↗</span></button></div> : <form action="/api/contact" method="post" onSubmit={submit} noValidate aria-label="Your project brief" aria-busy={state === "submitting"}>
      <fieldset disabled={state === "submitting"} className="brief-fieldset"><legend className="sr-only">Tell us about your project</legend><div className="honeypot" aria-hidden="true"><label htmlFor="brief-website">Leave this field empty</label><input id="brief-website" name="website" value={values.website} onChange={(event) => change("website", event.target.value)} autoComplete="off" tabIndex={-1}/></div>
        <div className="form-row"><div className="form-field"><label htmlFor="brief-name">Your name *</label><input id="brief-name" name="name" autoComplete="name" placeholder="What should we call you?" value={values.name} onChange={(event) => change("name", event.target.value)} onBlur={() => void validateField("name")} required minLength={2} maxLength={80} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")}/>{fieldError("name")}</div><div className="form-field"><label htmlFor="brief-email">Email address *</label><input id="brief-email" name="email" autoComplete="email" type="email" placeholder="you@company.com" value={values.email} onChange={(event) => change("email", event.target.value)} onBlur={() => void validateField("email")} required maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")}/>{fieldError("email")}</div></div>
        <div className="form-field"><label htmlFor="brief-company">Company / Organization <span>(optional)</span></label><input id="brief-company" name="company" autoComplete="organization" placeholder="Where are you building?" value={values.company} onChange={(event) => change("company", event.target.value)} onBlur={() => void validateField("company")} maxLength={120} aria-invalid={Boolean(errors.company)} aria-describedby={describedBy("company")}/>{fieldError("company")}</div>
        <div className="form-row"><div className="form-field"><label htmlFor="brief-service">Service of interest *</label><select id="brief-service" name="service" value={values.service} onChange={(event) => change("service", event.target.value)} onBlur={() => void validateField("service")} required aria-invalid={Boolean(errors.service)} aria-describedby={describedBy("service")}><option value="" disabled>Select a service</option>{services.map((service) => <option key={service.slug} value={service.formName}>{service.formName}</option>)}<option value="Other">Other / Let’s figure it out</option></select>{fieldError("service")}</div><div className="form-field"><label htmlFor="brief-budget">Estimated budget <span>(optional)</span></label><select id="brief-budget" name="budget" value={values.budget} onChange={(event) => change("budget", event.target.value)} aria-invalid={Boolean(errors.budget)} aria-describedby={describedBy("budget")}><option value="">A rough idea is fine</option>{site.budgetBands.map((band) => <option key={band} value={band}>{band}</option>)}</select>{fieldError("budget")}</div></div>
        <div className="form-field message-field"><label htmlFor="brief-message">Tell us about your idea *</label><textarea id="brief-message" name="message" placeholder="The challenge, the possibility, the thing you can’t stop thinking about…" value={values.message} onChange={(event) => change("message", event.target.value)} onBlur={() => void validateField("message")} required minLength={20} maxLength={2000} aria-invalid={Boolean(errors.message)} aria-describedby={[describedBy("message"), "brief-message-count"].filter(Boolean).join(" ")}/>{fieldError("message")}<p className="message-counter mono" id="brief-message-count">{values.message.length} / 2,000</p></div>
        <Turnstile onToken={setToken} resetKey={challengeKey}/><button type="submit" className="button form-submit" disabled={state === "submitting" || state === "rate-limited"}><span>{state === "submitting" ? "SENDING YOUR BRIEF…" : state === "rate-limited" ? "PLEASE TRY AGAIN LATER" : "SEND YOUR IDEA"}</span><span className="button-arrow" aria-hidden="true">{state === "submitting" ? "…" : "↗"}</span></button><p className="form-note">No perfect brief needed. Just a starting point.<br/>* A few details we need to continue the conversation.</p>
      </fieldset>
    </form>}
    <div className="form-status" aria-live="polite" aria-atomic="true">{(state === "error" || state === "rate-limited" || state === "invalid") && <div className="form-status-error"><strong>{state === "rate-limited" ? "A brief pause." : state === "invalid" ? "A couple of details need a look." : "Not sent yet."}</strong><p>{message}</p>{site.contactEmail && <a href={`mailto:${site.contactEmail}`}>Or email {site.contactEmail} ↗</a>}</div>}{state === "submitting" && <p className="form-note">{message}</p>}{state === "success" && <span className="sr-only">{message} Reference: {reference}</span>}</div>
    {state !== "success" && <div className="form-privacy"><span>Your details are used for this enquiry. No mailing lists.</span><a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="form-policy-link">Read our privacy policy ↗<span className="sr-only"> (opens in a new tab)</span></a><button type="button" aria-expanded={privacy} aria-controls="brief-privacy" onClick={() => setPrivacy(!privacy)}>How we use your details {privacy ? "−" : "+"}</button>{privacy && <p className="privacy-details" id="brief-privacy">Your name, email, and project details are used only to review and respond to your enquiry. When delivery is configured, the brief is sent through Resend and stored in our project inbox. Please don’t include passwords, payment details, or other sensitive information.</p>}</div>}
    <noscript><p className="form-note">Please enable JavaScript to validate and send the project brief.{site.contactEmail && <> You can also <a href={`mailto:${site.contactEmail}`}>email us directly</a>.</>}</p></noscript>
  </div>;
}
