import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Calculator from "../components/Calculator";
import Gallery from "../components/Gallery";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { useActivities } from "../lib/useActivities";

export default function Home() {
  const { services } = useActivities();
  const { hash } = useLocation();

  // Ao chegar a "/" vindo de outra página (ex: /atividades/paintball) com
  // uma âncora tipo "#calculadora", faz scroll assim que o conteúdo
  // estiver montado — o React Router não faz isto sozinho.
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 80);
  }, [hash]);

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
