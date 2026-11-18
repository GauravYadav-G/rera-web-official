import { ImageResponse } from "next/og";
import { logoDataUri } from "@/data/logo-base64";

export const alt =
  "RERA WEB — Web Development, Custom Software, AI Automation, Web3 & Cloud Engineering. Independent technology startup founded by Gaurav & Abhijeet in India.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const services = [
    { num: "01", name: "Web Development", tech: "React / Next.js", desc: "High-performance websites & digital experiences" },
    { num: "02", name: "Custom Software", tech: "TypeScript / APIs", desc: "Tailored SaaS, CRM & business workflow engines" },
    { num: "03", name: "AI & Automation", tech: "Intelligent Workflows", desc: "AI assistants, API integrations & data pipelines" },
    { num: "04", name: "Web3 & Blockchain", tech: "Smart Contracts", desc: "Decentralized applications & digital verification" },
    { num: "05", name: "UI/UX Product Design", tech: "Design Systems", desc: "Thoughtful interfaces, prototypes & interaction craft" },
    { num: "06", name: "Backend & Cloud", tech: "Node / PostgreSQL", desc: "Scalable databases, microservices & resilient cloud" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0A0A0B",
          color: "#F3EFE6",
          display: "flex",
          flexDirection: "column",
          padding: "44px 56px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top ember brand stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "#FF5A1F",
          }}
        />

        {/* Top Header Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoDataUri} alt="" width={42} height={42} style={{ display: "flex" }} />
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>RERA WEB</span>
            <span style={{ color: "rgba(243, 239, 230, 0.3)", fontSize: 20 }}>/</span>
            <span style={{ fontSize: 13, color: "#A8A49A", letterSpacing: 1.5, fontFamily: "monospace" }}>
              INDEPENDENT TECHNOLOGY STARTUP · INDIA
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontFamily: "monospace",
              color: "#F3EFE6",
              letterSpacing: 1.5,
              background: "rgba(243, 239, 230, 0.05)",
              padding: "7px 16px",
              border: "1px solid rgba(243, 239, 230, 0.15)",
              borderRadius: 2,
            }}
          >
            FOUNDED BY GAURAV & ABHIJEET
          </div>
        </div>

        {/* Hero Section: Headline + Objective */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              fontSize: 54,
              lineHeight: 1,
              letterSpacing: -2.5,
              fontWeight: 600,
            }}
          >
            <span>Ideas deserve</span>
            <span style={{ fontFamily: "serif", fontStyle: "italic", fontSize: 62, color: "#FF5A1F" }}>
              well-built
            </span>
            <span>software.</span>
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 15,
              lineHeight: 1.45,
              color: "#A8A49A",
              maxWidth: 960,
              letterSpacing: -0.2,
            }}
          >
            Our objective is to bridge the gap between imagination and execution—engineering intelligent digital products, robust cloud systems, and scalable software built to last.
          </div>
        </div>

        {/* 6 Core Services Grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 24,
          }}
        >
          {services.map((s) => (
            <div
              key={s.num}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "354px",
                padding: "14px 18px",
                background: "rgba(18, 18, 20, 0.9)",
                border: "1px solid rgba(243, 239, 230, 0.1)",
                borderRadius: 3,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#F3EFE6", letterSpacing: -0.3 }}>
                  <span style={{ color: "#FF5A1F", marginRight: 7, fontFamily: "monospace", fontSize: 12 }}>
                    [{s.num}]
                  </span>
                  {s.name}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    color: "#A8A49A",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {s.tech}
                </span>
              </div>
              <span style={{ marginTop: 5, fontSize: 12, color: "#85817A", lineHeight: 1.35 }}>
                {s.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Status Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: 18,
            borderTop: "1px solid rgba(243, 239, 230, 0.12)",
            color: "#A8A49A",
            fontSize: 11,
            letterSpacing: 1.5,
            fontFamily: "monospace",
          }}
        >
          <span>BUILT ON CURIOSITY · ENGINEERED WITH PURPOSE</span>
          <span style={{ color: "#FF5A1F" }}>RERAWEB.VERCEL.APP ↗</span>
        </div>
      </div>
    ),
    size
  );
}
