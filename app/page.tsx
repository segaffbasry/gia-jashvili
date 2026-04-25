import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Quote from "./components/Quote";
import VideoSection from "./components/VideoSection";
import Biography from "./components/Biography";
import Gallery from "./components/Gallery";
import Teaching from "./components/Teaching";
import Events from "./components/Events";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Quote />
      <Biography />
      <VideoSection />
      <Gallery />
      <Teaching />
      <Events />
      <Contact />
      <Footer />
    </>
  );
}
