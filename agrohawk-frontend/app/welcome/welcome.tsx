import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import OurServices from "./components/OurServices";
import RecentProjects from "./components/RecentProjects";

export function Welcome() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <OurServices />
      <RecentProjects />
      {/* Aquí más secciones: Servicios, Acerca de, etc */}
    </>
  );
}
