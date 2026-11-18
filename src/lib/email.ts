import { Resend } from "resend";
import type { ContactData } from "@/lib/validation";

export function emailIsConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export async function sendProjectBrief(input: ContactData, reference: string, submissionId: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fields = [
    ["Reference", reference], ["Name", input.name], ["Email", input.email], ["Company", input.company || "Not supplied"], ["Service", input.service], ["Budget", input.budget || "Not supplied"],
  ];
  const text = `A new project brief for RERA WEB\n\n${fields.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nTHE IDEA\n${input.message}\n\nReply to this email to continue the conversation.`;
  const html = `<html><body style="margin:0;background:#efebe1;color:#0a0a0b;font-family:Arial,sans-serif;padding:40px 24px"><div style="max-width:640px;margin:auto"><p style="font-size:12px;letter-spacing:2px">RERA WEB / PROJECT BRIEF</p><h1 style="font-size:36px;font-weight:500;letter-spacing:-1px">An idea worth a conversation.</h1><table style="border-collapse:collapse;width:100%;margin:30px 0">${fields.map(([label, value]) => `<tr><td style="padding:12px 0;border-bottom:1px solid #d0ccc2;font-size:13px;color:#686258">${escapeHtml(label)}</td><td style="padding:12px 0;border-bottom:1px solid #d0ccc2;font-size:14px">${escapeHtml(value)}</td></tr>`).join("")}</table><p style="font-size:12px;letter-spacing:1px">THE IDEA</p><p style="font-size:16px;line-height:1.7;white-space:pre-wrap">${escapeHtml(input.message)}</p><p style="border-top:1px solid #d0ccc2;margin-top:36px;padding-top:20px;font-size:12px;color:#686258">Reply to this email to continue the conversation.</p></div></body></html>`;
  const { data, error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL!,
    to: process.env.CONTACT_TO_EMAIL!.split(",").map((email) => email.trim()).filter(Boolean),
    replyTo: input.email,
    subject: `[${reference}] ${input.service} — ${input.name.replace(/[\r\n]/g, " ")}`,
    text,
    html,
  }, { idempotencyKey: `rera-brief/${submissionId}` });
  if (error || !data?.id) return { ok: false as const };
  return { ok: true as const, providerId: data.id };
}
