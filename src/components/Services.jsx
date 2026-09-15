import { motion } from "framer-motion";

export default function Services({ services = [] }) {
  return (
    <section id="servicos" className="py-24 px-5 bg-brand-dark-2/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-orange font-semibold text-sm tracking-wide uppercase">
            As nossas atividades
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-3">
            Escolhe a tua aventura
          </h2>
          <p className="text-white/60 mt-4">
            Do paintball radical às festas em família — temos uma atividade para
            cada ocasião.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative rounded-2xl p-7 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all overflow-hidden"
            >
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}
              />
              <div className="relative text-4xl mb-4">{s.emoji}</div>
              <h3 className="relative text-xl font-bold mb-1">{s.name}</h3>
              <p className="relative text-brand-orange text-sm font-medium mb-3">
                {s.tagline}
              </p>
              <p className="relative text-white/60 text-sm leading-relaxed">
                {s.description}
              </p>
              <a
                href="#calculadora"
                className="relative mt-5 inline-block text-sm font-semibold text-white/90 hover:text-brand-orange transition-colors"
              >
                Simular preço →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
