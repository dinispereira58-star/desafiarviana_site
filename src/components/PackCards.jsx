import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { packsOf, extrasOf, perLabel } from "../lib/packs";
import { discountOf, withDiscount, fmtEuro } from "../lib/discount";

// Packs de uma atividade (ex.: festas de aniversário): um cartão por pack com
// tudo o que inclui e o preço, e os extras por baixo.
export default function PackCards({ service }) {
  const packs = packsOf(service);
  const extras = extrasOf(service);
  const pct = discountOf(service);
  if (packs.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-5 pb-14">
      <h2 className="font-display uppercase text-3xl md:text-4xl text-ink mb-6">Os nossos packs</h2>
      <div className={`grid gap-6 ${packs.length > 1 ? "md:grid-cols-2" : ""}`}>
        {packs.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl bg-white border border-ink/10 shadow-sm hover:shadow-xl hover:shadow-orange-900/10 transition-shadow overflow-hidden flex flex-col"
          >
            <div className={`bg-gradient-to-br ${service.color} px-6 py-5 text-white`}>
              <p className="font-display uppercase text-2xl leading-none">{p.name}</p>
              <p className="mt-3 flex items-baseline gap-2">
                {pct > 0 && <span className="text-sm line-through opacity-75">{fmtEuro(p.price)}€</span>}
                <span className="font-display text-5xl leading-none">{fmtEuro(withDiscount(p.price, pct))}€</span>
                <span className="text-sm opacity-90">por festa</span>
              </p>
            </div>
            <ul className="px-6 py-5 space-y-2.5 flex-1">
              {(p.includes || []).filter(Boolean).map((line, j) => (
                <li key={j} className="flex items-start gap-2.5 text-sm text-ink">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-teal/15 text-brand-teal flex items-center justify-center shrink-0"><Check size={13} strokeWidth={3} /></span>
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {extras.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white border border-ink/10 p-5">
          <p className="font-display uppercase text-lg text-ink mb-3 flex items-center gap-2"><Plus className="text-brand-orange" size={18} /> Extras</p>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {extras.map((x) => (
              <div key={x.id} className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">{x.name}</span>
                <span className="font-bold text-ink">+{fmtEuro(withDiscount(x.price, pct))}€{perLabel(x)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
