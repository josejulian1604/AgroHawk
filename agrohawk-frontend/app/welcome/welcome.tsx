import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import OurServices from "./components/OurServices";
import RecentProjects from "./components/RecentProjects";
import VideoCarousel from "./components/VideoCarousel";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";

export function Welcome() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <OurServices />
      <RecentProjects />
      <VideoCarousel />
      <AboutUs />
      <ContactUs />
      <Footer />
    </>
  );
}
