import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSiteSettings } from "../lib/useSiteSettings";

// Página genérica para textos legais (Termos, Privacidade, Cookies) — o
// conteúdo vem de uma chave de site_settings, editável no CRM. Blocos que
// começam por "1. ", "2. " etc. são tratados como títulos de secção.
export default function LegalPage({ title, contentKey }) {
  const settings = useSiteSettings();
  const content = settings[contentKey] || "";
  const blocks = content.split(/\n\n+/).filter(Boolean);

  useEffect(() => {
    document.title = `${title} — Desafiar Viana`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <section className="relative pt-32 pb-20 px-5 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="max-w-3xl mx-auto relative">
          <span className="text-brand-orange font-semibold text-sm tracking-widest uppercase">Desafiar Viana</span>
          <h1 className="font-display uppercase text-4xl md:text-5xl text-ink mt-2 mb-10">{title}</h1>

          <div className="bg-white border border-ink/10 rounded-3xl shadow-sm p-6 md:p-10 space-y-5">
            {blocks.length === 0 ? (
              <p className="text-ink-soft italic">Conteúdo ainda não definido.</p>
            ) : (
              blocks.map((block, i) => {
                const isHeading = /^\d+\.\s/.test(block.trim());
                return isHeading ? (
                  <h2 key={i} className="font-display uppercase text-xl text-ink pt-3 first:pt-0">{block.trim()}</h2>
                ) : (
                  <p key={i} className="text-ink-soft leading-relaxed whitespace-pre-line">{block.trim()}</p>
                );
              })
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
