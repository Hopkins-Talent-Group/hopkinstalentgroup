import ApproachSection from '@/components/ApproachSection';
import ContactSection from '@/components/ContactSection';
import GallerySection from '@/components/GallerySection';
import Hero from '@/components/Hero';
import QuoteSection from '@/components/QuoteSection';
import ServicesSection from '@/components/ServicesSection';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import TalentSection from '@/components/TalentSection';
import TrustBar from '@/components/TrustBar';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TrustBar />
        <ServicesSection />
        <ApproachSection />
        <TalentSection />
        <GallerySection />
        <QuoteSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
