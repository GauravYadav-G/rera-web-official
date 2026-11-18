import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/data/site";

export function Logo() {
  return <Link prefetch={false} href="/" className="brand" aria-label="RERA WEB, home">{site.logomark && <span className="brand-mark" aria-hidden="true"><i/></span>}<span>RERA WEB</span></Link>;
}
export function SectionLabel({ number, children, suffix }: { number?: string; children: ReactNode; suffix?: string }) {
  return <div className="section-label"><span>{number && <span className="section-number">[{number}] </span>}{children}</span><span className="section-label-rule"/>{suffix && <span className="label-suffix">{suffix}</span>}</div>;
}
export function TextLink({ href, children, down = false, className = "" }: { href: string; children: ReactNode; down?: boolean; className?: string }) {
  return <Link prefetch={false} href={href} className={`text-link ${className}`}><span>{children}</span><span aria-hidden="true">{down ? "↓" : "↗"}</span></Link>;
}
export function RegistrationMarks() {
  return <span className="registration-marks" aria-hidden="true"><i/><i/><i/><i/></span>;
}
export function IllustrationLabel({ children = "ILLUSTRATIVE" }: { children?: ReactNode }) {
  return <span className="illustration-label">{children}</span>;
}
