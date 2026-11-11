import Loader from '@/components/Loader';
import HeroCarousel from '@/components/HeroCarousel';
import EnvironmentCards from '@/components/EnvironmentCards';
import CatalogSection from '@/components/CatalogSection';
import Production from '@/components/Production';
import Advantages from '@/components/Advantages';
import Applications from '@/components/Applications';
import About from '@/components/About';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <>
      <Loader />
      <HeroCarousel />
      <EnvironmentCards />
      <CatalogSection />
      <Production />
      <Advantages />
      <Applications />
      <About />
      <Contact />
    </>
  );
}
