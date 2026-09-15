import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#servicos", label: "Serviços" },
  { href: "#calculadora", label: "Orçamento" },
  { href: "#galeria", label: "Galeria" },
  { href: "#testemunhos", label: "Testemunhos" },
  { href: "#contacto", label: "Contactos" },
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-brand-dark/90 backdrop-blur-md shadow-lg shadow-black/30" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
        <a href="#topo" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
          <span className="text-2xl">⚡</span>
          <span>
            Desafiar<span className="text-brand-orange">Viana</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-brand-orange transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#contacto"
          className="hidden md:inline-flex bg-brand-orange hover:bg-brand-orange-dark transition-colors text-white font-semibold px-5 py-2 rounded-full text-sm"
        >
          Pedir Orçamento
        </a>

        <button className="md:hidden text-white" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-brand-dark-2 border-t border-white/10 px-5 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-brand-orange font-medium"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className="bg-brand-orange text-white font-semibold px-5 py-2 rounded-full text-center"
          >
            Pedir Orçamento
          </a>
        </div>
      )}
    </header>
  );
}
