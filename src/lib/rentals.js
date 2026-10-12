// Alugueres (atividade com calculatorType "rental"): cada item tem cartão e
// página própria. Os itens vêm do CRM (activities.items) e podem ter:
// category, size, description, details, features [{label, value}],
// extra_prices [{label, price}], photo_url e gallery.

export const RENTAL_CATEGORIES = [
  { key: "insuflavel", label: "Insufláveis", singular: "Insuflável", emoji: "🏰" },
  { key: "trampolim", label: "Trampolins", singular: "Trampolim", emoji: "🤸" },
];

// Itens antigos (sem categoria): trampolins/camas elásticas pelo nome, o resto insuflável.
export const itemCategory = (it) =>
  it.category || (/trampol|cama.*el[aá]stic/i.test(it.name || "") ? "trampolim" : "insuflavel");

export const rentalGroups = (items = []) =>
  RENTAL_CATEGORIES.map((c) => ({ ...c, items: items.filter((it) => itemCategory(it) === c.key) })).filter((g) => g.items.length > 0);

// Dois preços por item: meio dia (price_half) e dia inteiro (price). Se só
// houver um, serve para as duas durações.
export const RENTAL_DURATIONS = [
  { key: "meio", label: "Meio dia" },
  { key: "dia", label: "Dia inteiro" },
];
export const rentalPrice = (it, duration) =>
  duration === "meio" ? Number(it.price_half) || Number(it.price) || 0 : Number(it.price) || Number(it.price_half) || 0;

export const categoryLabel = (it) => RENTAL_CATEGORIES.find((c) => c.key === itemCategory(it))?.singular || "";
