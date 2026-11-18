import { ImageResponse } from "next/og";
import { logoDataUri } from "@/data/logo-base64";

export const alt = "RERA WEB — Ideas deserve well-built software. An independent technology startup from India.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          padding: "54px 64px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top subtle ember accent line */}
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: -0.5,
          }}
        >
          <span style={{ display: "flex", gap: 14, alignItems: "center", fontWeight: 700 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoDataUri} alt="" width={44} height={44} style={{ display: "flex" }} />
            <span>RERA WEB</span>
          </span>
          <span
            style={{
              fontSize: 11,
              color: "#A8A49A",
              letterSpacing: 2,
              fontFamily: "monospace",
              background: "rgba(243, 239, 230, 0.05)",
              padding: "6px 14px",
              border: "1px solid rgba(243, 239, 230, 0.12)",
              borderRadius: 2,
            }}
          >
            INDEPENDENT TECHNOLOGY STARTUP · INDIA
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 50,
            fontSize: 82,
            lineHeight: 0.98,
            letterSpacing: -4,
          }}
        >
          <span>Ideas deserve</span>
          <span style={{ fontFamily: "serif", fontStyle: "italic", fontSize: 94, color: "#F3EFE6" }}>
            well-built
          </span>
          <span>software.</span>
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 20,
            lineHeight: 1.5,
            color: "#A8A49A",
            maxWidth: 780,
            letterSpacing: -0.2,
          }}
        >
          Engineering intelligent web platforms, bespoke software, and AI automation for teams that value craftsmanship and precision.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: 24,
            borderTop: "1px solid rgba(243, 239, 230, 0.12)",
            color: "#A8A49A",
            fontSize: 11,
            letterSpacing: 1.5,
            fontFamily: "monospace",
          }}
        >
          <span>FOUNDED BY GAURAV & ABHIJEET</span>
          <span>WEB · SOFTWARE · AI · CLOUD · DESIGN</span>
        </div>
      </div>
    ),
    size
  );
}
