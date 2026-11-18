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
          padding: "50px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            letterSpacing: -0.5,
          }}
        >
          <span style={{ display: "flex", gap: 14, alignItems: "center", fontWeight: 700 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoDataUri} alt="" width={38} height={38} style={{ display: "flex" }} />
            RERA WEB
          </span>
          <span style={{ fontSize: 11, color: "#A8A49A", letterSpacing: 2 }}>
            INDEPENDENT TECHNOLOGY STARTUP · INDIA
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 66,
            fontSize: 88,
            lineHeight: 0.98,
            letterSpacing: -5,
          }}
        >
          <span>Ideas deserve</span>
          <span style={{ fontFamily: "serif", fontStyle: "italic", fontSize: 100 }}>well-built</span>
          <span>software.</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 25,
            borderTop: "1px solid #33312D",
            color: "#A8A49A",
            fontSize: 10,
            letterSpacing: 1.5,
          }}
        >
          <span>WEB · SOFTWARE · AI · WEB3 · DESIGN · CLOUD</span>
          <span>BUILT ON CURIOSITY. ENGINEERED WITH PURPOSE.</span>
        </div>
      </div>
    ),
    size
  );
}
