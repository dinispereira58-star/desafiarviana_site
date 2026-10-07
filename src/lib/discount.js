// Desconto por atividade (percentagem configurada no CRM).
export const discountOf = (service) => Math.min(90, Math.max(0, Number(service?.discountPct) || 0));

// Preço com desconto, arredondado ao cêntimo.
export const withDiscount = (price, pct) => Math.round(Number(price) * (1 - pct / 100) * 100) / 100;

// 12 → "12", 10.8 → "10,80"
export const fmtEuro = (v) => {
  const n = Math.round(Number(v) * 100) / 100;
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ",");
};
