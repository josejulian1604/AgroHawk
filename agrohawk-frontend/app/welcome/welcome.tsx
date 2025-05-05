import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import OurServices from "./components/OurServices";
import RecentProjects from "./components/RecentProjects";
import VideoCarousel from "./components/VideoCarousel";
import AboutUs from "./components/AboutUs";

export function Welcome() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <OurServices />
      <RecentProjects />
      <VideoCarousel />
      <AboutUs />
      {/* Aquí más secciones: Servicios, Acerca de, etc */}
    </>
  );
}
