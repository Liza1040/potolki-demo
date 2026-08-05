import { content } from "@/content";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { QuizSection } from "@/components/sections/QuizSection";
import { WhyUs } from "@/components/sections/WhyUs";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { Reviews } from "@/components/sections/Reviews";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";

export default function Home() {
  return (
    <>
      <LocalBusinessJsonLd />
      <SiteHeader content={content.header} />

      <main id="top">
        <Hero content={content.hero} />
        <QuizSection content={content.quiz} legal={content.legal} />
        <WhyUs content={content.whyUs} />
        <HowItWorks content={content.howItWorks} />
        <Pricing content={content.pricing} />
        <Reviews content={content.reviews} />
        <Faq content={content.faq} />
        <FinalCta content={content.finalCta} legal={content.legal} />
      </main>

      <SiteFooter content={content.footer} />
    </>
  );
}
