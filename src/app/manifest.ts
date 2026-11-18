import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RERA WEB",
    short_name: "RERA WEB",
    description: "An independent technology startup from India building thoughtful digital experiences, custom software, and intelligent AI automation.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0B",
    theme_color: "#FF5A1F",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
