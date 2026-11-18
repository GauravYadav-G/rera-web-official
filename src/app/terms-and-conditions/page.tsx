import { terms } from "@/data/legal";
import { LegalDocument } from "@/components/pages/legal-document";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Terms & conditions", "Terms for using the RERA WEB website, its illustrative materials, and the project enquiry form.", "/terms-and-conditions");
export default function TermsPage() { return <LegalDocument document={terms} kind="terms"/>; }
