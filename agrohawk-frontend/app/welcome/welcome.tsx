import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import OurServices from "./components/OurServices";
import RecentProjects from "./components/RecentProjects";
import VideoCarousel from "./components/VideoCarousel";

export function Welcome() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <OurServices />
      <RecentProjects />
      <VideoCarousel />
      {/* Aquí más secciones: Servicios, Acerca de, etc */}
    </>
  );
}
