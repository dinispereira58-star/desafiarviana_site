import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MessageCircle, ShieldCheck, Images, Euro, Ruler, ListChecks } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useActivities } from "../lib/useActivities";
import { useSiteSettings } from "../lib/useSiteSettings";
import { discountOf, withDiscount, fmtEuro } from "../lib/discount";
import { categoryLabel } from "../lib/rentals";

function Price({ value, pct, unit }) {
  if (!pct) return <span className="font-bold text-ink">{fmtEuro(value)}€{unit}</span>;
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-xs text-ink-soft line-through">{fmtEuro(value)}€</span>
      <span className="font-bold text-brand-pink">{fmtEuro(withDiscount(value, pct))}€{unit}</span>
    </span>
  );
}

// Página de um item de aluguer (insuflável ou trampolim): tamanho, preços,
// características, segurança (as regras da atividade, iguais para todos) e galeria.
export default function RentalItemPage() {
  const { id, itemId } = useParams();
  const { services, loading } = useActivities();
  const settings = useSiteSettings();
  const service = services.find((s) => s.id === id);
  const item = service?.items?.find((it) => String(it.id) === itemId);
  const [photo, setPhoto] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); setPhoto(null); }, [itemId]);
  useEffect(() => {
    document.title = item ? `${item.name} — Desafiar Viana` : "Desafiar Viana";
  }, [item]);

  if (loading) {
    return <div className="min-h-screen bg-canvas flex items-center justify-center text-ink-soft">A carregar...</div>;
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 text-center pt-24">
          <p className="font-display uppercase text-3xl text-ink">Aluguer não encontrado</p>
          <Link to={service ? `/atividades/${service.id}` : "/"} className="text-brand-orange font-semibold hover:underline">
            {service ? "Ver todos os alugueres" : "Voltar à página inicial"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const pct = discountOf(service);
  const features = (item.features || []).filter((f) => f.label || f.value);
  const extraPrices = (item.extra_prices || []).filter((p) => p.label);
  const gallery = [item.photo_url, ...(item.gallery || [])].filter(Boolean);
  const mainPhoto = photo || gallery[0];
  const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse no aluguer de: ${item.name}.`);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <section className="relative pt-28 pb-8 px-5 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div className={`absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br ${service.color} opacity-20 blur-[100px]`} />
        <div className="max-w-5xl mx-auto relative">
          <Link to={`/atividades/${service.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-brand-orange transition-colors mb-6">
            <ArrowLeft size={16} /> Todos os alugueres
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{item.emoji}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">{categoryLabel(item)}</p>
              <h1 className="font-display uppercase text-4xl md:text-5xl text-ink leading-none mt-1">{item.name}</h1>
            </div>
          </div>
          {item.size && (
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white border border-ink/10 shadow-sm px-4 py-1.5 text-sm font-bold text-ink">
              <Ruler size={16} className="text-brand-orange" /> {item.size}
            </span>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-5 mb-12">
        {mainPhoto ? (
          <motion.img
            key={mainPhoto}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            src={mainPhoto}
            alt={item.name}
            className="w-full h-[280px] md:h-[440px] object-cover rounded-3xl shadow-xl shadow-orange-900/10"
          />
        ) : (
          <div className={`w-full h-[220px] md:h-[320px] rounded-3xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-xl shadow-orange-900/10`}>
            <span className="text-8xl drop-shadow-md">{item.emoji}</span>
          </div>
        )}
      </div>

      <section className="max-w-5xl mx-auto px-5 grid md:grid-cols-[1.4fr_1fr] gap-10 pb-20 items-start">
        <div className="space-y-10">
          {(item.details || item.description) && (
            <div>
              <h2 className="font-display uppercase text-2xl text-ink mb-3">Sobre este {categoryLabel(item).toLowerCase()}</h2>
              <p className="text-ink-soft leading-relaxed whitespace-pre-line">{item.details || item.description}</p>
            </div>
          )}

          {(item.size || features.length > 0) && (
            <div>
              <h2 className="font-display uppercase text-2xl text-ink mb-3 flex items-center gap-2">
                <ListChecks className="text-brand-orange" size={22} /> Características
              </h2>
              <dl className="rounded-2xl bg-white border border-ink/10 divide-y divide-ink/10 overflow-hidden">
                {item.size && (
                  <div className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                    <dt className="text-ink-soft">Tamanho</dt>
                    <dd className="font-semibold text-ink text-right">{item.size}</dd>
                  </div>
                )}
                {features.map((f, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                    <dt className="text-ink-soft">{f.label}</dt>
                    <dd className="font-semibold text-ink text-right">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {service.safetyRules?.length > 0 && (
            <div>
              <h2 className="font-display uppercase text-2xl text-ink mb-3 flex items-center gap-2">
                <ShieldCheck className="text-brand-teal" size={22} /> Regras de segurança
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

          {gallery.length > 1 && (
            <div>
              <h2 className="font-display uppercase text-2xl text-ink mb-3 flex items-center gap-2">
                <Images className="text-brand-pink" size={22} /> Galeria
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {gallery.map((url, i) => (
                  <button key={i} type="button" onClick={() => { setPhoto(url); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`rounded-2xl overflow-hidden border-2 transition-colors ${url === mainPhoto ? "border-brand-orange" : "border-transparent hover:border-ink/20"}`}>
                    <img src={url} alt="" className="w-full aspect-square object-cover" />
                  </button>
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
            {pct > 0 && (
              <div className="mb-4 -mt-1 flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-orange to-brand-pink px-3 py-2 text-white">
                <span className="font-display text-xl leading-none">-{fmtEuro(pct)}%</span>
                <span className="text-xs font-semibold leading-tight">{service.discountLabel || "Desconto em todos os alugueres"}</span>
              </div>
            )}
            <div className="space-y-2">
              {Number(item.price) > 0 ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft">Aluguer (dia)</span>
                  <Price value={item.price} pct={pct} unit="" />
                </div>
              ) : (
                <p className="text-sm text-ink-soft">Preço sob consulta.</p>
              )}
              {extraPrices.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft">{p.label}</span>
                  {Number(p.price) > 0 ? <Price value={p.price} pct={pct} unit="" /> : <span className="text-ink-soft">sob consulta</span>}
                </div>
              ))}
            </div>
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
