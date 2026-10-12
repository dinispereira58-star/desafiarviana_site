import { Link } from "react-router-dom";
import { itemCategory, comboParts, comboName } from "../lib/rentals";
import { discountOf, withDiscount, fmtEuro } from "../lib/discount";
import { imgPos } from "../lib/imagePos";

// Dois preços de uma conjugação (meio dia / dia inteiro), com desconto se houver.
function ComboPrices({ combo, pct, compact }) {
  const rows = [["Meio dia", combo.price_half], ["Dia inteiro", combo.price]].filter(([, v]) => Number(v) > 0);
  if (!rows.length) return <span className="text-xs text-ink-soft">Sob consulta</span>;
  return (
    <div className={compact ? "space-y-0.5" : "space-y-1"}>
      {rows.map(([label, v]) => (
        <p key={label} className="flex items-baseline justify-center gap-1.5 text-sm whitespace-nowrap">
          <span className="text-ink-soft text-xs">{label}</span>
          {pct > 0 && <span className="text-xs text-ink-soft line-through">{fmtEuro(v)}€</span>}
          <span className={`font-bold ${pct > 0 ? "text-brand-pink" : "text-ink"}`}>{fmtEuro(withDiscount(v, pct))}€</span>
        </p>
      ))}
    </div>
  );
}

const PartLink = ({ service, it }) => (
  <Link to={`/atividades/${service.id}/${it.id}`} className="inline-flex items-center gap-1.5 font-semibold text-ink hover:text-brand-orange transition-colors">
    {it.photo_url ? <img {...imgPos(it.photo_url)} alt="" className="w-8 h-8 rounded-lg object-cover" /> : <span className="text-xl">{it.emoji}</span>}
    {it.name}
  </Link>
);

// Conjugações de equipamentos (ex.: insuflável + cama elástica) com preço próprio.
// Quando todas são "1 insuflável + 1 trampolim", mostra uma tabela (linhas =
// insufláveis, colunas = trampolins); senão, uma lista.
export default function RentalCombos({ service }) {
  const combos = service.combos || [];
  const items = service.items || [];
  const pct = discountOf(service);
  if (combos.length === 0) return null;

  const pairOf = (c) => {
    const parts = comboParts(c, items);
    if (parts.length !== 2) return null;
    const ins = parts.find((p) => itemCategory(p) === "insuflavel");
    const tra = parts.find((p) => itemCategory(p) === "trampolim");
    return ins && tra ? { ins, tra } : null;
  };
  const pairs = combos.map((c) => ({ c, pair: pairOf(c) }));
  const asMatrix = pairs.every((x) => x.pair);
  const rows = asMatrix ? items.filter((it) => pairs.some((x) => x.pair.ins.id === it.id)) : [];
  const cols = asMatrix ? items.filter((it) => pairs.some((x) => x.pair.tra.id === it.id)) : [];
  const cell = (ins, tra) => pairs.find((x) => x.pair.ins.id === ins.id && x.pair.tra.id === tra.id)?.c;

  return (
    <section id="conjugacoes" className="max-w-6xl mx-auto px-5 pb-16">
      <h2 className="font-display uppercase text-3xl md:text-4xl text-ink flex items-center gap-3 mb-2">
        <span className="text-3xl">🎁</span> Conjugações
      </h2>
      <p className="text-ink-soft mb-6">Junta equipamentos e paga menos — preços para meio dia e dia inteiro.</p>

      {asMatrix && (
        // Telemóvel: um bloco por insuflável, com as conjugações por baixo.
        <div className="sm:hidden space-y-3">
          {rows.map((ins) => (
            <div key={ins.id} className="rounded-2xl border border-ink/10 bg-white shadow-sm p-4">
              <PartLink service={service} it={ins} />
              <div className="mt-3 space-y-2.5">
                {cols.map((t) => {
                  const c = cell(ins, t);
                  return c ? (
                    <div key={t.id} className="flex items-center justify-between gap-3 rounded-xl bg-canvas-alt px-3 py-2">
                      <span className="text-sm text-ink-soft">+ {t.name}</span>
                      <ComboPrices combo={c} pct={pct} compact />
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {asMatrix ? (
        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="bg-canvas-alt">
                <th className="text-left px-4 py-3 font-semibold text-ink-soft">Insuflável</th>
                {cols.map((t) => (
                  <th key={t.id} className="px-4 py-3 text-center">
                    <span className="text-ink-soft font-normal text-xs block">com</span>
                    <PartLink service={service} it={t} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {rows.map((ins) => (
                <tr key={ins.id}>
                  <td className="px-4 py-3"><PartLink service={service} it={ins} /></td>
                  {cols.map((t) => {
                    const c = cell(ins, t);
                    return (
                      <td key={t.id} className="px-4 py-3 text-center">
                        {c ? <ComboPrices combo={c} pct={pct} compact /> : <span className="text-ink-soft/50">—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {combos.map((c) => (
            <div key={c.id} className="rounded-2xl bg-white border border-ink/10 shadow-sm p-5 flex flex-col gap-3">
              <p className="font-bold text-ink">{comboName(c, items)}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                {comboParts(c, items).map((it) => <PartLink key={it.id} service={service} it={it} />)}
              </div>
              <div className="mt-auto pt-2 border-t border-ink/10"><ComboPrices combo={c} pct={pct} /></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
