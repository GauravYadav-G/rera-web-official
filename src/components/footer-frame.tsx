"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
export function FooterFrame({ children }: { children: ReactNode }) {
  return <footer className={`site-footer ${usePathname() === "/" ? "" : "footer-compact"}`}>{children}</footer>;
}
