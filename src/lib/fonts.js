// Fontes disponíveis para personalizar os textos do Hero e dos popups —
// pré-carregadas em index.css. A chave "" significa "usar a fonte do
// tema" (Anton no título, Inter no resto).
export const FONT_OPTIONS = [
  { key: "", label: "Fonte do tema", family: "" },
  { key: "poppins", label: "Poppins (arredondada)", family: "'Poppins', sans-serif" },
  { key: "bebas", label: "Bebas Neue (alta e fina)", family: "'Bebas Neue', sans-serif" },
  { key: "fredoka", label: "Fredoka (divertida)", family: "'Fredoka', sans-serif" },
  { key: "oswald", label: "Oswald (desportiva)", family: "'Oswald', sans-serif" },
  { key: "montserrat", label: "Montserrat (versátil)", family: "'Montserrat', sans-serif" },
];

export function fontFamilyFor(key) {
  return FONT_OPTIONS.find((f) => f.key === key)?.family || "";
}

export const TEXT_SIZES = {
  title: { sm: "2.5rem", md: "", lg: "5.5rem", xl: "6.5rem" }, // "" = tamanho responsivo por omissão (classe Tailwind)
  subtitle: { sm: "0.95rem", md: "", lg: "1.35rem", xl: "1.6rem" },
};
