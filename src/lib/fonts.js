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

// clamp(mínimo, preferido-em-vw, máximo) — mesmo com um tamanho
// "grande"/"muito grande" escolhido no CRM, o texto nunca ultrapassa o
// que cabe no ecrã (o mínimo garante que também não fica ilegível
// num telemóvel pequeno).
export const TEXT_SIZES = {
  title: { sm: "clamp(1.75rem, 6vw, 2.5rem)", md: "", lg: "clamp(2.5rem, 9vw, 5.5rem)", xl: "clamp(2.75rem, 10vw, 6.5rem)" }, // "" = tamanho responsivo por omissão (classe Tailwind)
  subtitle: { sm: "clamp(0.85rem, 3vw, 0.95rem)", md: "", lg: "clamp(1.05rem, 3.5vw, 1.35rem)", xl: "clamp(1.15rem, 4vw, 1.6rem)" },
};
