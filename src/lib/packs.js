// Atividades com preço por pack (calculatorType "packs", ex.: festas de
// aniversário). Vêm do CRM em activities.items:
//   { kind: "pack",  id, name, price, includes: ["…"] }  — preço fixo por festa
//   { kind: "extra", id, name, price, per: "crianca" | "festa" }
export const packsOf = (service) => (service?.items || []).filter((it) => it.kind !== "extra");
export const extrasOf = (service) => (service?.items || []).filter((it) => it.kind === "extra");
export const perLabel = (x) => (x.per === "crianca" ? "/criança" : "");
