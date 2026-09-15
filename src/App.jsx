import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Calculator from "./components/Calculator";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useActivities } from "./lib/useActivities";

function App() {
  const { services } = useActivities();

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Navbar />
      <Hero />
      <Services services={services} />
      <Calculator services={services} />
      <Gallery services={services} />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
