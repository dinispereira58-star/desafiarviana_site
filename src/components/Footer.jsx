import { useSiteSettings } from "../lib/useSiteSettings";

export default function Footer() {
  const s = useSiteSettings();
  return (
    <footer className="py-8 px-5 border-t border-ink/10 bg-canvas-alt text-center text-ink-soft text-sm">
      <p>© {new Date().getFullYear()} Desafiar Viana — {s.footer_text}</p>
    </footer>
  );
}
