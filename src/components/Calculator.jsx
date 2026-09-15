import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Mail, Info, Minus, Plus, Send, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useSiteSettings } from "../lib/useSiteSettings";

export default function Calculator({ services = [] }) {
  const settings = useSiteSettings();
  const [serviceId, setServiceId] = useState(null);

  // As atividades chegam de forma assíncrona (Supabase) — assim que
  // estiverem disponíveis, seleciona a primeira por omissão.
  useEffect(() => {
    if (services.length && !services.some((s) => s.id === serviceId)) {
      setServiceId(services[0].id);
    }
  }, [services]); // eslint-disable-line react-hooks/exhaustive-deps

  const service = services.find((s) => s.id === serviceId);

  // --- estado específico por tipo de calculadora ---
  const [people, setPeople] = useState(10);
  const [packageId, setPackageId] = useState(undefined);
  const [quantities, setQuantities] = useState({}); // rental: { itemId: qty }
  const [date, setDate] = useState("");
  const [extraEquip, setExtraEquip] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [submitState, setSubmitState] = useState("idle"); // idle | sending | sent | error

  // reset ao trocar de atividade
  useEffect(() => {
    if (!service) return;
    setPeople(service.minPeople ?? 10);
    setPackageId(service.ballPackages?.[0]?.id);
    setQuantities({});
    setExtraEquip(false);
    setSubmitState("idle");
  }, [serviceId]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedPackage = service?.ballPackages?.find((p) => p.id === packageId);

  const selectedItems = useMemo(
    () =>
      (service?.items ?? [])
        .map((item) => ({ ...item, qty: quantities[item.id] ?? 0 }))
        .filter((item) => item.qty > 0),
    [service, quantities]
  );

  const setQty = (itemId, qty) =>
    setQuantities((q) => ({ ...q, [itemId]: Math.max(0, qty) }));

  const estimate = useMemo(() => {
    if (!service) return 0;
    const extra = extraEquip ? 25 : 0;
    if (service.calculatorType === "paintball") {
      if (!selectedPackage) return 0;
      return people * selectedPackage.pricePerPerson + extra;
    }
    if (service.calculatorType === "rental") {
      return selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0) + extra;
    }
    // people
    return service.pricePerPerson * Math.max(people, service.minPeople) + extra;
  }, [service, people, selectedPackage, selectedItems, extraEquip]);

  const detailLines = useMemo(() => {
    if (!service) return [];
    if (service.calculatorType === "paintball") {
      return [`Nº de pessoas: ${people}`, `Pacote: ${selectedPackage?.label ?? "-"}`];
    }
    if (service.calculatorType === "rental") {
      if (selectedItems.length === 0) return ["Nenhum item selecionado ainda"];
      return selectedItems.map((item) => `${item.name} x${item.qty} (${item.price}€/un.)`);
    }
    return [`Nº de pessoas: ${people}`];
  }, [service, people, selectedPackage, selectedItems]);

  const whatsappMessage = encodeURIComponent(
    `Olá! Gostaria de pedir um orçamento:\n` +
      `- Atividade: ${service?.name}\n` +
      detailLines.map((l) => `- ${l}`).join("\n") +
      `\n- Data pretendida: ${date || "a combinar"}\n` +
      `- Valor estimado no site: ~${estimate}€ (sujeito a confirmação)\n\n` +
      `Podem confirmar disponibilidade?`
  );

  const mailtoHref = `mailto:${settings.contact_email}?subject=${encodeURIComponent(
    "Pedido de orçamento - " + (service?.name ?? "")
  )}&body=${whatsappMessage}`;

  const canRequest = service && (service.calculatorType !== "rental" || selectedItems.length > 0);
  const canSubmit = canRequest && clientName.trim() && (clientPhone.trim() || clientEmail.trim());

  const handleSubmitRequest = async () => {
    if (!canSubmit || submitState === "sending" || !service) return;
    setSubmitState("sending");
    const { error } = await supabase.from("booking_requests").insert({
      activity_id: service.id,
      activity_name: service.name,
      name: clientName.trim(),
      phone: clientPhone.trim() || null,
      email: clientEmail.trim() || null,
      preferred_date: date || null,
      people_count: service.calculatorType === "rental" ? null : people,
      message: `${detailLines.join(" · ")} — valor estimado ~${estimate}€${extraEquip ? " (com equipamento extra)" : ""}`,
    });
    setSubmitState(error ? "error" : "sent");
  };

  if (!service) {
    return (
      <section id="calculadora" className="py-24 px-5 bg-canvas">
        <div className="max-w-4xl mx-auto text-center text-ink-soft">A carregar atividades...</div>
      </section>
    );
  }

  return (
    <section id="calculadora" className="py-24 px-5 bg-canvas">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-teal font-semibold text-sm tracking-widest uppercase">
            Simulador
          </span>
          <h2 className="font-display uppercase text-4xl md:text-6xl mt-3 text-ink">
            Calcula o teu orçamento
          </h2>
          <p className="text-ink-soft mt-4">
            Uma estimativa rápida e sem compromisso. O valor final e a
            disponibilidade são sempre confirmados por nós.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-ink/10 shadow-xl shadow-orange-900/5 rounded-3xl p-6 md:p-10 grid md:grid-cols-2 gap-10"
        >
          {/* Controls */}
          <div className="space-y-7">
            <div>
              <label className="block text-sm font-semibold text-ink mb-3">
                Atividade
              </label>
              <div className="grid grid-cols-2 gap-2">
                {services.map((s) => {
                  const active = serviceId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setServiceId(s.id)}
                      className={`relative overflow-hidden text-left px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        active ? "border-transparent text-white" : "bg-canvas-alt border-ink/10 text-ink-soft hover:border-ink/30"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="activity-pill"
                          className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-pink"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">
                        <span className="mr-1.5">{s.emoji}</span>
                        {s.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {service.calculatorType === "paintball" && (
              <>
                <div>
                  <label className="flex justify-between text-sm font-semibold text-ink mb-3">
                    <span>Número de pessoas</span>
                    <motion.span key={people} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-brand-orange">
                      {people}
                    </motion.span>
                  </label>
                  <input
                    type="range"
                    min={service.minPeople}
                    max={60}
                    value={people}
                    onChange={(e) => setPeople(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                  <p className="text-xs text-ink-soft mt-1">
                    Mínimo recomendado: {service.minPeople} pessoas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-3">
                    Pacote de bolas
                  </label>
                  <div className="space-y-2">
                    {(service.ballPackages ?? []).map((p) => {
                      const active = packageId === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setPackageId(p.id)}
                          className={`relative overflow-hidden w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                            active ? "border-transparent text-white" : "bg-canvas-alt border-ink/10 text-ink-soft hover:border-ink/30"
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="package-pill"
                              className="absolute inset-0 bg-gradient-to-r from-brand-teal to-brand-teal-dark"
                              transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            />
                          )}
                          <span className="relative">{p.label}</span>
                          <span className="relative">{p.pricePerPerson}€ /pessoa</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {service.calculatorType === "people" && (
              <div>
                <label className="flex justify-between text-sm font-semibold text-ink mb-3">
                  <span>Número de pessoas</span>
                  <motion.span key={people} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-brand-orange">
                    {people}
                  </motion.span>
                </label>
                <input
                  type="range"
                  min={service.minPeople}
                  max={60}
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <p className="text-xs text-ink-soft mt-1">
                  Mínimo recomendado: {service.minPeople} pessoas
                </p>
              </div>
            )}

            {service.calculatorType === "rental" && (
              <div>
                <label className="block text-sm font-semibold text-ink mb-3">
                  Escolhe os itens (podes combinar vários)
                </label>
                <div className="space-y-2">
                  {(service.items ?? []).map((item) => {
                    const qty = quantities[item.id] ?? 0;
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition-colors ${
                          qty > 0
                            ? "bg-brand-orange/10 border-brand-orange/50"
                            : "bg-canvas-alt border-ink/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span>{item.emoji}</span>
                          <div>
                            <p className="font-medium text-ink">{item.name}</p>
                            <p className="text-ink-soft text-xs">{item.price}€ /dia</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => setQty(item.id, qty - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-ink/10 hover:bg-ink/15 text-ink/80"
                            aria-label={`Diminuir ${item.name}`}
                          >
                            <Minus size={14} />
                          </motion.button>
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={qty}
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.5, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="w-5 text-center font-semibold text-ink inline-block"
                            >
                              {qty}
                            </motion.span>
                          </AnimatePresence>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => setQty(item.id, qty + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-brand-pink text-white"
                            aria-label={`Aumentar ${item.name}`}
                          >
                            <Plus size={14} />
                          </motion.button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-ink mb-3">
                Data pretendida (opcional)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-canvas-alt border border-ink/10 rounded-xl px-4 py-2.5 text-ink focus:outline-none focus:border-brand-orange"
              />
            </div>

            {service.calculatorType !== "rental" && (
              <label className="flex items-center gap-3 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={extraEquip}
                  onChange={(e) => setExtraEquip(e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                Equipamento/animação extra (+25€)
              </label>
            )}

            <div className="space-y-3 pt-2 border-t border-ink/10">
              <p className="text-sm font-semibold text-ink">Os teus dados, para te contactarmos</p>
              <input
                type="text"
                placeholder="Nome"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-canvas-alt border border-ink/10 rounded-xl px-4 py-2.5 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-brand-orange"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="tel"
                  placeholder="Telemóvel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-canvas-alt border border-ink/10 rounded-xl px-4 py-2.5 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-brand-orange"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-canvas-alt border border-ink/10 rounded-xl px-4 py-2.5 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-brand-orange"
                />
              </div>
              <p className="text-xs text-ink-soft/70">Preenche o nome e pelo menos um contacto (telemóvel ou email)</p>
            </div>
          </div>

          {/* Result */}
          <div className="flex flex-col justify-between">
            <div className="bg-gradient-to-br from-brand-orange/10 via-brand-pink/5 to-transparent border border-brand-orange/25 rounded-2xl p-6 text-center">
              <p className="text-ink-soft text-sm mb-1">Valor estimado</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={estimate}
                  initial={{ opacity: 0, y: -8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-pink"
                >
                  {estimate}€
                </motion.p>
              </AnimatePresence>
              <div className="mt-3 text-ink-soft text-xs space-y-0.5">
                {detailLines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
              <p className="text-ink-soft/70 text-xs mt-3 flex items-center justify-center gap-1">
                <Info size={13} />
                Preço de exemplo, sujeito a confirmação
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {submitState === "sent" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 w-full font-semibold px-6 py-3.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600"
                >
                  <CheckCircle2 size={20} />
                  Pedido enviado! Vamos confirmar em breve.
                </motion.div>
              ) : (
                <motion.button
                  whileHover={canSubmit ? { scale: 1.02 } : {}}
                  whileTap={canSubmit ? { scale: 0.98 } : {}}
                  onClick={handleSubmitRequest}
                  disabled={!canSubmit || submitState === "sending"}
                  className={`flex items-center justify-center gap-2 w-full font-semibold px-6 py-3.5 rounded-full transition-all ${
                    canSubmit
                      ? "bg-gradient-to-r from-brand-orange to-brand-pink text-white shadow-lg shadow-orange-500/25"
                      : "bg-ink/10 text-ink-soft cursor-not-allowed"
                  }`}
                >
                  {submitState === "sending" ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  Enviar Pedido de Marcação
                </motion.button>
              )}
              {submitState === "error" && (
                <p className="text-center text-rose-500 text-xs">Não foi possível enviar — tenta por WhatsApp ou email abaixo.</p>
              )}
              <a
                href={
                  canRequest
                    ? `https://wa.me/${settings.whatsapp_number}?text=${whatsappMessage}`
                    : undefined
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!canRequest}
                className={`flex items-center justify-center gap-2 w-full font-semibold px-6 py-3.5 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  canRequest
                    ? "bg-[#25D366] hover:brightness-95 text-white"
                    : "bg-ink/10 text-ink-soft pointer-events-none"
                }`}
              >
                <MessageCircle size={20} />
                Pedir orçamento via WhatsApp
              </a>
              <a
                href={canRequest ? mailtoHref : undefined}
                aria-disabled={!canRequest}
                className={`flex items-center justify-center gap-2 w-full font-semibold px-6 py-3.5 rounded-full border transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  canRequest
                    ? "bg-canvas-alt hover:bg-ink/5 border-ink/15 text-ink"
                    : "bg-canvas-alt border-ink/10 text-ink-soft pointer-events-none"
                }`}
              >
                <Mail size={20} />
                Pedir por email
              </a>
              <p className="text-center text-ink-soft/70 text-xs pt-1">
                Este pedido não confirma a reserva — respondemos com a
                disponibilidade real em breve.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
