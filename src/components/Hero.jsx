import { motion } from "framer-motion";
import { ArrowRight, Calculator } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="topo"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark-2 via-brand-dark to-black" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#ff6a00_0%,transparent_35%),radial-gradient(circle_at_80%_60%,#1a7a3e_0%,transparent_40%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmZmZmYxMCIvPjwvc3ZnPg==')] opacity-40" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block bg-white/10 border border-white/20 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm"
        >
          🌲 Viana do Castelo &amp; arredores
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight"
        >
          Adrenalina, diversão
          <br />
          e <span className="text-brand-orange">momentos inesquecíveis</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto"
        >
          Paintball, Bubble Soccer, insufláveis e festas de aniversário. Organizamos
          a tua atividade de A a Z — tu só tens de aparecer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#calculadora"
            className="group inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark transition-colors text-white font-semibold px-7 py-3.5 rounded-full text-base shadow-lg shadow-orange-900/40"
          >
            <Calculator size={20} />
            Simular Orçamento
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#servicos"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-white font-semibold px-7 py-3.5 rounded-full text-base backdrop-blur-sm"
          >
            Ver Atividades
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-4 text-white/60 text-sm"
        >
          <span>⭐ +9 anos de experiência</span>
          <span>🎯 6 atividades diferentes</span>
          <span>👨‍👩‍👧‍👦 Para todas as idades</span>
        </motion.div>
      </div>
    </section>
  );
}
