import { privacy } from "@/data/legal";
import { LegalDocument } from "@/components/pages/legal-document";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Privacy policy", "How RERA WEB handles project enquiries, technical information, email delivery, and privacy requests.", "/privacy-policy");
export default function PrivacyPage() { return <LegalDocument document={privacy} kind="privacy"/>; }
