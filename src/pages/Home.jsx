import { useEffect, useRef } from "react";
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
  const { hash, key } = useLocation();
  const firstRun = useRef(true);

  // Âncoras do menu (#calculadora, #galeria, …) — o React Router não faz scroll sozinho.
  // Vindo de outra página, as atividades e as imagens ainda estão a carregar e
  // empurram as secções para baixo: o scroll volta a acertar algumas vezes até a
  // página assentar (pára se a pessoa mexer no ecrã). Na própria página é um
  // scroll suave. `key` faz voltar a funcionar ao carregar duas vezes no mesmo botão.
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const initial = firstRun.current;
    firstRun.current = false;
    let userMoved = false;
    const stop = () => { userMoved = true; };
    const events = ["wheel", "touchstart", "keydown"];
    const go = (behavior) => { if (!userMoved) document.getElementById(id)?.scrollIntoView({ behavior, block: "start" }); };
    const offTarget = () => Math.abs(document.getElementById(id)?.getBoundingClientRect().top ?? 0) > 40;
    const timers = initial
      ? [60, 300, 700, 1200, 2000, 3000].map((t) => setTimeout(() => offTarget() && go("instant"), t))
      : [setTimeout(() => go("smooth"), 20), setTimeout(() => offTarget() && go("instant"), 1300)];
    const add = setTimeout(() => events.forEach((e) => window.addEventListener(e, stop, { passive: true })), 30);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(add);
      events.forEach((e) => window.removeEventListener(e, stop));
    };
  }, [hash, key]);

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
