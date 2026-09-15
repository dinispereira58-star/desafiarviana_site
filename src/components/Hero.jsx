import { motion } from "framer-motion";
import { ArrowRight, Calculator, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="topo"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
    >
      {/* Fundo em camadas */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark-2 via-brand-dark to-black" />
      <motion.div
        className="absolute -top-20 -left-20 w-[32rem] h-[32rem] rounded-full bg-brand-orange/25 blur-[100px] animate-float-slow"
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-brand-green/25 blur-[100px] animate-float-slower"
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmZmZmYxMCIvPjwvc3ZnPg==')] opacity-40" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange" />
          </span>
          Viana do Castelo &amp; arredores
        </motion.span>

        <h1 className="font-display uppercase leading-[0.95] tracking-tight text-6xl sm:text-7xl md:text-8xl">
          {["Adrenalina,", "diversão", "e"].map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block mr-4"
            >
              {word}
            </motion.span>
          ))}
          <br />
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-400 to-brand-orange"
          >
            momentos inesquecíveis
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-7 text-lg md:text-xl text-white/60 max-w-2xl mx-auto"
        >
          Paintball, Bubble Soccer, insufláveis e festas de aniversário. Organizamos
          a tua atividade de A a Z — tu só tens de aparecer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.68 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#calculadora"
            className="group inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark transition-all hover:scale-[1.03] active:scale-[0.98] text-white font-semibold px-7 py-3.5 rounded-full text-base shadow-lg shadow-orange-900/40"
          >
            <Calculator size={20} />
            Simular Orçamento
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#servicos"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-[1.03] active:scale-[0.98] text-white font-semibold px-7 py-3.5 rounded-full text-base backdrop-blur-sm"
          >
            Ver Atividades
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-4 text-white/60 text-sm"
        >
          <span>⭐ +9 anos de experiência</span>
          <span>🎯 6 atividades diferentes</span>
          <span>👨‍👩‍👧‍👦 Para todas as idades</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.2, duration: 0.6 }, y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}
