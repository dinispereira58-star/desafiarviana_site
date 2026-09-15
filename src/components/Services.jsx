import { motion } from "framer-motion";

export default function Services({ services = [] }) {
  return (
    <section id="servicos" className="relative py-28 px-5 bg-canvas-alt overflow-hidden">
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-brand-teal/15 blur-[90px]" />
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-orange font-semibold text-sm tracking-widest uppercase"
          >
            As nossas atividades
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display uppercase text-4xl md:text-6xl mt-3 text-ink"
          >
            Escolhe a tua aventura
          </motion.h2>
          <p className="text-ink-soft mt-4">
            Do paintball radical às festas em família — temos uma atividade para
            cada ocasião.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl bg-white border border-ink/10 shadow-sm hover:shadow-xl hover:shadow-orange-900/10 transition-shadow overflow-hidden"
            >
              <div className="relative h-40 overflow-hidden">
                {s.photoUrl ? (
                  <img
                    src={s.photoUrl}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                    <span className="text-5xl drop-shadow-md">{s.emoji}</span>
                  </div>
                )}
                <motion.div
                  className={`absolute -bottom-6 left-5 w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} shadow-lg flex items-center justify-center text-2xl border-4 border-white`}
                  whileHover={{ scale: 1.15, rotate: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {s.emoji}
                </motion.div>
              </div>
              <div className="pt-9 pb-6 px-6">
                <h3 className="text-xl font-bold mb-1 text-ink">{s.name}</h3>
                <p className="text-brand-orange text-sm font-semibold mb-3">
                  {s.tagline}
                </p>
                <p className="text-ink-soft text-sm leading-relaxed">
                  {s.description}
                </p>
                <a
                  href="#calculadora"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-brand-orange transition-colors"
                >
                  Simular preço
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
