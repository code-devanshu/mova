import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Services } from "@/components/home/Services";
import { OurWorld } from "@/components/home/OurWorld";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Process } from "@/components/home/Process";
import { SocialMedia } from "@/components/home/SocialMedia";
import { WhyMova } from "@/components/home/WhyMova";
import { About } from "@/components/home/About";
import { Locations } from "@/components/home/Locations";
import { SocialFeed } from "@/components/home/SocialFeed";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Services />
      <OurWorld />
      <SelectedWork />
      <Process />
      <SocialMedia />
      <WhyMova />
      <About />
      <Locations />
      <SocialFeed />
      <FinalCta />
    </>
  );
}
