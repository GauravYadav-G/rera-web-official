export type FilmCredit = { name: string; href: string; kind: "Footage" | "Studio lighting" };
export type Film = {
  id: string; number: string; title: string; discipline: string; category: string;
  description: string; duration: string; file: string; poster: string;
  transcript: string; credits?: readonly FilmCredit[];
};

export const films = [
  {
    id: "interface-study", number: "01", title: "From wireframe to interface", discipline: "Product design", category: "ORIGINAL INTERFACE STUDY",
    description: "Structure first, then the details. Follow the Workspace concept from a wireframe to a clear, usable interface.",
    duration: "0:12", file: "/media/interface-study.mp4", poster: "/images/interface-study.webp",
    transcript: "In the first shot, a wireframe lays out a sidebar, summary blocks, and project rows. A second shot reveals the finished illustrative Workspace interface. The final shot moves in on the project overview and the ember action. Three title cards mark the sequence: Wireframe, Interface, Detail. The film is silent.",
  },
  {
    id: "terminal-study", number: "02", title: "Under the interface", discipline: "Engineering", category: "LICENSED FOOTAGE / DEMO EDIT",
    description: "Three close-up shots of the groundwork behind software: run the toolchain, resolve its dependencies, and inspect what comes out.",
    duration: "0:15", file: "/media/terminal-study.mp4", poster: "/images/terminal-study.webp",
    transcript: "The film cuts between three software screens. A command window runs development and build commands over an editor. An installation log lists the dependencies being prepared. The final shot shows output accumulating in a terminal beside the code editor. This is licensed illustrative footage, not a recording of a RERA WEB client build. The film is silent.",
    credits: [
      { name: "cottonbro studio / Pexels — terminal", href: "https://www.pexels.com/video/a-computer-code-running-on-screen-6804117/", kind: "Footage" },
      { name: "Shutter Break / Pexels — dependencies", href: "https://www.pexels.com/video/programming-code-installation-on-computer-monitor-35475328/", kind: "Footage" },
      { name: "cottonbro studio / Pexels — editor", href: "https://www.pexels.com/video/running-codes-on-a-computer-6804121/", kind: "Footage" },
    ],
  },
  {
    id: "patch-studio", number: "03", title: "Patch, in the studio", discipline: "3D character", category: "ORIGINAL CHARACTER STUDY",
    description: "A closer look at the desk guide: soft ceramic, smoked glass, machined joints, and a single ember key.",
    duration: "0:06", file: "/media/patch-studio.mp4", poster: "/images/patch/studio.webp",
    transcript: "Patch, RERA WEB’s original desktop robot, turns slowly on a graphite display plinth. The camera shows its front display, ceramic housing, articulated arm, and ember-colored keypad. The film is silent.",
    credits: [
      { name: "Studio Small 08 / Sergej Majboroda, Poly Haven (CC0)", href: "https://polyhaven.com/a/studio_small_08", kind: "Studio lighting" },
    ],
  },
] as const satisfies readonly Film[];
