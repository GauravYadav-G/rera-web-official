import { Hero } from "@/components/hero/hero";
import { Beginning } from "@/components/story/beginning";
import { Vision } from "@/components/story/vision";
import { ServiceIndex } from "@/components/services/service-index";
import { WorkShowcase } from "@/components/work/showcase";
import { Process } from "@/components/process/process";
import { Principles } from "@/components/principles";
import { Founder } from "@/components/founder/founder";
import { Contact } from "@/components/contact/contact";
import { GuideFeature } from "@/components/guide/guide-feature";
import { BuildFilms } from "@/components/films/build-films";

export default function HomePage() {
  return <main id="main-content"><Hero /><GuideFeature /><Beginning /><Vision /><ServiceIndex /><WorkShowcase /><BuildFilms variant="home" /><Process /><Principles /><Founder /><Contact /></main>;
}
