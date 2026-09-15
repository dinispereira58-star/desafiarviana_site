import { motion } from "framer-motion";

// Placeholders de cor — SUBSTITUIR por fotos/vídeos reais das atividades
export default function Gallery({ services = [] }) {
  return (
    <section id="galeria" className="py-24 px-5 bg-brand-dark-2/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-brand-orange font-semibold text-sm tracking-wide uppercase">
            Galeria
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-3">
            Momentos que ficam
          </h2>
          <p className="text-white/60 mt-4">
            Espaço reservado para fotos e vídeos reais das atividades — a
            substituir pelas imagens da empresa.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`relative aspect-square rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-5xl overflow-hidden group cursor-pointer`}
            >
              <span className="group-hover:scale-110 transition-transform duration-300">
                {s.emoji}
              </span>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-semibold text-sm">{s.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
