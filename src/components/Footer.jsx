import { Link } from "react-router-dom";
import { useSiteSettings } from "../lib/useSiteSettings";

const LEGAL_LINKS = [
  { to: "/faq", label: "FAQ" },
  { to: "/termos-condicoes", label: "Termos e Condições" },
  { to: "/politica-privacidade", label: "Política de Privacidade" },
  { to: "/politica-cookies", label: "Política de Cookies" },
];

export default function Footer() {
  const s = useSiteSettings();
  return (
    <footer className="py-8 px-5 border-t border-ink/10 bg-canvas-alt text-center text-ink-soft text-sm">
      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4">
        {LEGAL_LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="text-xs font-medium text-ink-soft hover:text-brand-orange transition-colors">
            {l.label}
          </Link>
        ))}
      </nav>
      <p>© {new Date().getFullYear()} Desafiar Viana — {s.footer_text}</p>
    </footer>
  );
}
