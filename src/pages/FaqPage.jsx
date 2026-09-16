import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useFaq } from "../lib/useFaq";

function FaqItem({ item, index, open, onToggle }) {
  const isOpen = open === item.id;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`rounded-2xl border overflow-hidden transition-colors ${isOpen ? "border-brand-orange/40 bg-white shadow-md shadow-orange-900/5" : "border-ink/10 bg-white"}`}
    >
      <button
        onClick={() => onToggle(item.id)}
        className="w-full flex items-center gap-4 text-left px-5 py-4 md:px-6 md:py-5"
      >
        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold shrink-0 transition-colors ${isOpen ? "bg-gradient-to-br from-brand-orange to-brand-pink text-white" : "bg-canvas-alt text-ink-soft"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 font-semibold text-ink">{item.question}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 text-ink-soft">
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 md:px-6 pb-5 md:pb-6 pl-[3.75rem] md:pl-[4.25rem] text-ink-soft leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqPage() {
  const items = useFaq();
  const [open, setOpen] = useState(null);

  useEffect(() => {
    document.title = "Perguntas Frequentes — Desafiar Viana";
    window.scrollTo(0, 0);
  }, []);

  const toggle = (id) => setOpen((o) => (o === id ? null : id));

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <section className="relative pt-32 pb-24 px-5 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute -top-16 right-10 w-72 h-72 rounded-full bg-brand-teal/15 blur-[100px]" />
        <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-brand-yellow/20 blur-[100px]" />

        <div className="max-w-3xl mx-auto relative">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 bg-white border border-ink/10 shadow-sm text-sm font-semibold px-4 py-1.5 rounded-full mb-5 text-ink">
              <HelpCircle size={16} className="text-brand-orange" /> Ainda com dúvidas?
            </span>
            <h1 className="font-display uppercase text-4xl md:text-6xl text-ink">
              Perguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-brand-pink to-brand-orange">Frequentes</span>
            </h1>
            <p className="text-ink-soft mt-4 max-w-xl mx-auto">
              Tudo o que precisas de saber antes de reservares a tua atividade. Não encontraste resposta? Fala connosco diretamente.
            </p>
          </div>

          {items.length === 0 ? (
            <p className="text-center text-ink-soft italic">Ainda sem perguntas definidas.</p>
          ) : (
            <div className="space-y-3">
              {items.map((item, i) => (
                <FaqItem key={item.id} item={item} index={i} open={open} onToggle={toggle} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
