import Navbar from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { PhoneShowcase } from "@/components/PhoneShowcase";
import { AppGallery } from "@/components/AppGallery";
import { Stats } from "@/components/Stats";
import { Pricing } from "@/components/Pricing";
import { CTAFooter } from "@/components/CTAFooter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <PhoneShowcase />
        <AppGallery />
        <Stats />
        <Pricing />
        <CTAFooter />
      </main>
    </>
  );
}
