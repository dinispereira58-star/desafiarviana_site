import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MessageCircle, ShieldCheck, Images, Euro } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useActivities } from "../lib/useActivities";
import { useSiteSettings } from "../lib/useSiteSettings";

function PricingSummary({ service }) {
  if (service.calculatorType === "paintball" && service.ballPackages?.length > 0) {
    return (
      <div className="space-y-2">
        {service.ballPackages.map((p) => (
          <div key={p.id} className="flex items-center justify-between text-sm">
            <span className="text-ink-soft">{p.label}</span>
            <span className="font-bold text-ink">{p.pricePerPerson}€ /pessoa</span>
          </div>
        ))}
      </div>
    );
  }
  if (service.calculatorType === "rental" && service.items?.length > 0) {
    return (
      <div className="space-y-2">
        {service.items.map((it) => (
          <div key={it.id} className="flex items-center justify-between text-sm">
            <span className="text-ink-soft">{it.emoji} {it.name}</span>
            <span className="font-bold text-ink">{it.price}€ /dia</span>
          </div>
        ))}
      </div>
    );
  }
  if (service.pricePerPerson) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-soft">Por pessoa {service.minPeople ? `(mín. ${service.minPeople})` : ""}</span>
        <span className="font-bold text-ink">{service.pricePerPerson}€</span>
      </div>
    );
  }
  return <p className="text-sm text-ink-soft">Preço sob consulta.</p>;
}

export default function ActivityPage() {
  const { id } = useParams();
  const { services, loading } = useActivities();
  const settings = useSiteSettings();
  const service = services.find((s) => s.id === id);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  useEffect(() => {
    document.title = service ? `${service.name} — Desafiar Viana` : "Desafiar Viana";
  }, [service]);

  if (loading) {
    return <div className="min-h-screen bg-canvas flex items-center justify-center text-ink-soft">A carregar...</div>;
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 text-center pt-24">
          <p className="font-display uppercase text-3xl text-ink">Atividade não encontrada</p>
          <Link to="/" className="text-brand-orange font-semibold hover:underline">Voltar à página inicial</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse em saber mais sobre ${service.name}.`);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <section className="relative pt-28 pb-10 px-5 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div className={`absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br ${service.color} opacity-20 blur-[100px]`} />
        <div className="max-w-4xl mx-auto relative">
          <Link to="/#servicos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-brand-orange transition-colors mb-6">
            <ArrowLeft size={16} /> Todas as atividades
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{service.emoji}</span>
            <div>
              <h1 className="font-display uppercase text-4xl md:text-5xl text-ink leading-none">{service.name}</h1>
              <p className="text-brand-orange font-semibold mt-1.5">{service.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      {service.photoUrl && (
        <div className="max-w-5xl mx-auto px-5 mb-12">
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            src={service.photoUrl}
            alt={service.name}
            className="w-full h-[280px] md:h-[420px] object-cover object-top rounded-3xl shadow-xl shadow-orange-900/10"
          />
        </div>
      )}

      <section className="max-w-4xl mx-auto px-5 grid md:grid-cols-[1.4fr_1fr] gap-10 pb-20 items-start">
        <div className="space-y-10">
          {(service.longDescription || service.description) && (
            <div>
              <h2 className="font-display uppercase text-2xl text-ink mb-3">Sobre a atividade</h2>
              <p className="text-ink-soft leading-relaxed whitespace-pre-line">
                {service.longDescription || service.description}
              </p>
            </div>
          )}

          {service.safetyRules?.length > 0 && (
            <div>
              <h2 className="font-display uppercase text-2xl text-ink mb-3 flex items-center gap-2">
                <ShieldCheck className="text-brand-teal" size={22} /> Segurança
              </h2>
              <ul className="space-y-2.5">
                {service.safetyRules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-ink-soft text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-2 shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.gallery?.length > 0 && (
            <div>
              <h2 className="font-display uppercase text-2xl text-ink mb-3 flex items-center gap-2">
                <Images className="text-brand-pink" size={22} /> Galeria
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {service.gallery.map((url, i) => (
                  <motion.img
                    key={i}
                    whileHover={{ scale: 1.04 }}
                    src={url}
                    alt=""
                    className="w-full aspect-square object-cover rounded-2xl border border-ink/10 shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4 md:sticky md:top-28">
          <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-display uppercase text-lg text-ink mb-4 flex items-center gap-2">
              <Euro className="text-brand-orange" size={18} /> Preços
            </h3>
            <PricingSummary service={service} />
            {service.priceNote && (
              <p className="text-xs text-ink-soft mt-3 pt-3 border-t border-ink/10">{service.priceNote}</p>
            )}
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-sm space-y-3">
            <Link
              to="/#calculadora"
              className="flex items-center justify-center gap-2 w-full font-semibold px-5 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-pink text-white shadow-lg shadow-orange-500/25 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Simular orçamento <ArrowRight size={16} />
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp_number}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full font-semibold px-5 py-3 rounded-full bg-[#25D366] text-white hover:brightness-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MessageCircle size={18} /> Falar no WhatsApp
            </a>
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  );
}
