import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTestimonials } from "../lib/useTestimonials";

export default function Testimonials() {
  const testimonials = useTestimonials();
  if (!testimonials.length) return null;
  return (
    <section id="testemunhos" className="py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-orange font-semibold text-sm tracking-widest uppercase"
          >
            Testemunhos
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display uppercase text-4xl md:text-6xl mt-3"
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
              whileHover={{ y: -4 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-colors"
            >
              <div className="flex gap-1 text-brand-orange mb-3">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                "{t.text}"
              </p>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-white/40">{t.activity}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
