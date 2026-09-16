import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/#calculadora", label: "Orçamento" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#testemunhos", label: "Testemunhos" },
  { href: "/#contacto", label: "Contactos" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-canvas/90 backdrop-blur-md shadow-lg shadow-ink/5 border-b border-ink/5" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
        <Link to="/#topo" className="flex items-center gap-2 font-display uppercase text-xl tracking-tight text-ink">
          <motion.span
            className="text-2xl"
            animate={{ rotate: [0, -10, 10, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
          >
            ⚡
          </motion.span>
          <span>
            Desafiar<span className="text-brand-orange">Viana</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-soft">
          {links.map((l) => (
            <Link key={l.href} to={l.href} className="relative group hover:text-ink transition-colors">
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full bg-gradient-to-r from-brand-orange to-brand-pink group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <Link
          to="/#contacto"
          className="hidden md:inline-flex bg-gradient-to-r from-brand-orange to-brand-pink hover:brightness-110 transition-all hover:scale-105 active:scale-95 text-white font-semibold px-5 py-2 rounded-full text-sm shadow-md shadow-orange-500/25"
        >
          Pedir Orçamento
        </Link>

        <button className="md:hidden text-ink" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-canvas border-t border-ink/10 overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-4">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={l.href} onClick={() => setOpen(false)} className="text-ink-soft hover:text-brand-orange font-medium">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                to="/#contacto"
                onClick={() => setOpen(false)}
                className="bg-gradient-to-r from-brand-orange to-brand-pink text-white font-semibold px-5 py-2 rounded-full text-center"
              >
                Pedir Orçamento
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
