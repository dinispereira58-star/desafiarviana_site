import { motion } from "framer-motion";
import { ArrowRight, Calculator, ChevronDown } from "lucide-react";
import { useSiteSettings } from "../lib/useSiteSettings";

export default function Hero() {
  const s = useSiteSettings();

  return (
    <section
      id="topo"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 bg-canvas"
    >
      {/* Fundo claro com nódoas de cor vibrantes */}
      <div className="absolute inset-0 dot-grid opacity-60" />
      <motion.div
        className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-brand-orange/25 blur-[110px] animate-float-slow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-brand-teal/25 blur-[110px] animate-float-slower"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-brand-yellow/30 blur-[90px] animate-float-drift"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white border border-ink/10 shadow-sm text-sm font-semibold px-4 py-1.5 rounded-full mb-6 text-ink"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange" />
            </span>
            {s.hero_badge}
          </motion.span>

          <h1 className="font-display uppercase leading-[0.95] tracking-tight text-5xl sm:text-6xl md:text-7xl text-ink">
            {[s.hero_title_line1, s.hero_title_line2].filter(Boolean).map((word, i) => (
              <motion.span
                key={i}
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
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-brand-pink to-brand-orange animate-gradient-shift"
            >
              {s.hero_title_highlight}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-7 text-lg md:text-xl text-ink-soft max-w-xl mx-auto lg:mx-0"
          >
            {s.hero_subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.68 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <a
              href="#calculadora"
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-pink hover:brightness-110 transition-all hover:scale-[1.04] active:scale-[0.97] text-white font-semibold px-7 py-3.5 rounded-full text-base shadow-xl shadow-orange-500/30"
            >
              <Calculator size={20} />
              {s.hero_cta_primary}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#servicos"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-ink/5 border border-ink/15 transition-all hover:scale-[1.04] active:scale-[0.97] text-ink font-semibold px-7 py-3.5 rounded-full text-base shadow-sm"
            >
              {s.hero_cta_secondary}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-14 flex flex-wrap justify-center lg:justify-start gap-x-10 gap-y-4 text-ink-soft text-sm font-medium"
          >
            {[s.hero_stat_1, s.hero_stat_2, s.hero_stat_3].filter(Boolean).map((stat, i) => <span key={i}>{stat}</span>)}
          </motion.div>
        </div>

        {s.hero_bg_image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            className="hidden lg:block relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-900/20 border-8 border-white aspect-[4/5]"
          >
            <img src={s.hero_bg_image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.2, duration: 0.6 }, y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ink-soft"
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}
