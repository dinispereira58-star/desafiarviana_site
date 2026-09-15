import { motion } from "framer-motion";

// Placeholders de cor — SUBSTITUIR por fotos/vídeos reais das atividades
export default function Gallery({ services = [] }) {
  return (
    <section id="galeria" className="py-28 px-5 bg-brand-dark-2/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-orange font-semibold text-sm tracking-widest uppercase"
          >
            Galeria
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display uppercase text-4xl md:text-6xl mt-3"
          >
            Momentos que ficam
          </motion.h2>
          <p className="text-white/60 mt-4">
            Espaço reservado para fotos e vídeos reais das atividades — a
            substituir pelas imagens da empresa.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03 }}
              className={`relative aspect-square rounded-2xl overflow-hidden group cursor-pointer ${s.photoUrl ? '' : `bg-gradient-to-br ${s.color} flex items-center justify-center text-5xl`}`}
            >
              {s.photoUrl ? (
                <img src={s.photoUrl} alt={s.name} className="w-full h-full object-cover" />
              ) : (
                <motion.span
                  className="drop-shadow-lg"
                  whileHover={{ scale: 1.2, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 260 }}
                >
                  {s.emoji}
                </motion.span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-semibold text-sm translate-y-1 group-hover:translate-y-0 transition-transform">{s.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
