import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Ruler } from "lucide-react";
import { rentalGroups } from "../lib/rentals";
import { discountOf, withDiscount, fmtEuro } from "../lib/discount";

const MotionLink = motion(Link);

// Página dos alugueres: um cartão por item, agrupados (insufláveis e depois
// trampolins). Cada cartão abre a página do item.
export default function RentalCatalog({ service }) {
  const groups = rentalGroups(service.items);
  const pct = discountOf(service);
  if (groups.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-5 pb-16 space-y-14">
      {groups.map((g) => (
        <div key={g.key} id={g.key}>
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="font-display uppercase text-3xl md:text-4xl text-ink flex items-center gap-3">
              <span className="text-3xl">{g.emoji}</span> {g.label}
            </h2>
            <span className="text-sm text-ink-soft shrink-0">{g.items.length} {g.items.length === 1 ? "disponível" : "disponíveis"}</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {g.items.map((it, i) => (
              <MotionLink
                key={it.id}
                to={`/atividades/${service.id}/${it.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl bg-white border border-ink/10 shadow-sm hover:shadow-xl hover:shadow-orange-900/10 transition-shadow overflow-hidden block"
              >
                <div className="relative h-52 overflow-hidden bg-canvas-alt">
                  {it.photo_url ? (
                    <img src={it.photo_url} alt={it.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                      <span className="text-7xl drop-shadow-md group-hover:scale-110 transition-transform duration-500">{it.emoji}</span>
                    </div>
                  )}
                  {it.size && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow">
                      <Ruler size={13} className="text-brand-orange" /> {it.size}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-ink leading-snug">{it.name}</h3>
                  {it.description && <p className="text-ink-soft text-sm leading-relaxed mt-1.5 line-clamp-2">{it.description}</p>}
                  <div className="mt-4 flex items-center justify-between">
                    {Number(it.price) > 0 ? (
                      <span className="flex items-baseline gap-1.5">
                        {pct > 0 && <span className="text-xs text-ink-soft line-through">{fmtEuro(it.price)}€</span>}
                        <span className={`font-bold text-lg ${pct > 0 ? "text-brand-pink" : "text-ink"}`}>{fmtEuro(withDiscount(it.price, pct))}€</span>
                        <span className="text-xs text-ink-soft">/dia</span>
                      </span>
                    ) : (
                      <span className="text-sm text-ink-soft">Preço sob consulta</span>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink group-hover:text-brand-orange transition-colors">
                      Ver detalhes <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </MotionLink>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
