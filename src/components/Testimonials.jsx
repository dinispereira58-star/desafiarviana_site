import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useTestimonials } from "../lib/useTestimonials";

const AVATAR_COLORS = [
  "from-brand-orange to-brand-pink",
  "from-brand-teal to-brand-green",
  "from-brand-yellow to-brand-orange",
  "from-brand-pink to-brand-teal",
];

export default function Testimonials() {
  const testimonials = useTestimonials();
  if (!testimonials.length) return null;
  return (
    <section id="testemunhos" className="py-24 px-5 bg-canvas-alt">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-pink font-semibold text-sm tracking-widest uppercase"
          >
            Testemunhos
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display uppercase text-4xl md:text-6xl mt-3 text-ink"
          >
            Quem experimenta, recomenda
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative bg-white border border-ink/10 shadow-sm hover:shadow-xl hover:shadow-pink-900/5 rounded-2xl p-6 pt-8 transition-shadow"
            >
              <Quote className="absolute top-4 right-5 text-ink/5" size={40} fill="currentColor" strokeWidth={0} />
              <div className="flex gap-1 text-brand-yellow mb-3">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="relative text-ink/80 text-sm leading-relaxed mb-5">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                >
                  {t.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-soft">{t.activity}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
