import { motion } from "framer-motion";

export default function Services({ services = [] }) {
  return (
    <section id="servicos" className="relative py-28 px-5 bg-brand-dark-2/50 overflow-hidden">
      <div className="max-w-6xl mx-auto">
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
            className="font-display uppercase text-4xl md:text-6xl mt-3"
          >
            Escolhe a tua aventura
          </motion.h2>
          <p className="text-white/60 mt-4">
            Do paintball radical às festas em família — temos uma atividade para
            cada ocasião.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 40, rotateX: -8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              style={{ perspective: 800 }}
              className="group relative rounded-2xl p-7 bg-white/5 border border-white/10 hover:border-white/25 transition-colors overflow-hidden"
            >
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl group-hover:opacity-40 group-hover:scale-125 transition-all duration-500`}
              />
              <motion.div
                className="relative text-4xl mb-4 w-fit"
                whileHover={{ scale: 1.15, rotate: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {s.emoji}
              </motion.div>
              <h3 className="relative text-xl font-bold mb-1">{s.name}</h3>
              <p className="relative text-brand-orange text-sm font-medium mb-3">
                {s.tagline}
              </p>
              <p className="relative text-white/60 text-sm leading-relaxed">
                {s.description}
              </p>
              <a
                href="#calculadora"
                className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 group-hover:text-brand-orange transition-colors"
              >
                Simular preço
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
