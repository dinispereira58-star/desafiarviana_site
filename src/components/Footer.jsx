export default function Footer() {
  return (
    <footer className="py-8 px-5 border-t border-white/10 text-center text-white/40 text-sm">
      <p>© {new Date().getFullYear()} Desafiar Viana — Todos os direitos reservados.</p>
      <p className="mt-1">Site em fase de teste — conteúdos e preços a confirmar.</p>
    </footer>
  );
}
