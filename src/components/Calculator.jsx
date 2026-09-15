import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
      <section id="calculadora" className="py-24 px-5">
        <div className="max-w-4xl mx-auto text-center text-white/40">A carregar atividades...</div>
      </section>
    );
  }

  return (
    <section id="calculadora" className="py-24 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-orange font-semibold text-sm tracking-wide uppercase">
            Simulador
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-3">
            Calcula o teu orçamento
          </h2>
          <p className="text-white/60 mt-4">
            Uma estimativa rápida e sem compromisso. O valor final e a
            disponibilidade são sempre confirmados por nós.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 grid md:grid-cols-2 gap-10"
        >
          {/* Controls */}
          <div className="space-y-7">
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-3">
                Atividade
              </label>
              <div className="grid grid-cols-2 gap-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setServiceId(s.id)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      serviceId === s.id
                        ? "bg-brand-orange border-brand-orange text-white"
                        : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                    }`}
                  >
                    <span className="mr-1.5">{s.emoji}</span>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {service.calculatorType === "paintball" && (
              <>
                <div>
                  <label className="flex justify-between text-sm font-semibold text-white/80 mb-3">
                    <span>Número de pessoas</span>
                    <span className="text-brand-orange">{people}</span>
                  </label>
                  <input
                    type="range"
                    min={service.minPeople}
                    max={60}
                    value={people}
                    onChange={(e) => setPeople(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    Mínimo recomendado: {service.minPeople} pessoas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-3">
                    Pacote de bolas
                  </label>
                  <div className="space-y-2">
                    {(service.ballPackages ?? []).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPackageId(p.id)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          packageId === p.id
                            ? "bg-brand-orange border-brand-orange text-white"
                            : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                        }`}
                      >
                        <span>{p.label}</span>
                        <span>{p.pricePerPerson}€ /pessoa</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {service.calculatorType === "people" && (
              <div>
                <label className="flex justify-between text-sm font-semibold text-white/80 mb-3">
                  <span>Número de pessoas</span>
                  <span className="text-brand-orange">{people}</span>
                </label>
                <input
                  type="range"
                  min={service.minPeople}
                  max={60}
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <p className="text-xs text-white/40 mt-1">
                  Mínimo recomendado: {service.minPeople} pessoas
                </p>
              </div>
            )}

            {service.calculatorType === "rental" && (
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3">
                  Escolhe os itens (podes combinar vários)
                </label>
                <div className="space-y-2">
                  {(service.items ?? []).map((item) => {
                    const qty = quantities[item.id] ?? 0;
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${
                          qty > 0
                            ? "bg-brand-orange/15 border-brand-orange/60"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span>{item.emoji}</span>
                          <div>
                            <p className="font-medium text-white/90">{item.name}</p>
                            <p className="text-white/40 text-xs">{item.price}€ /dia</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setQty(item.id, qty - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80"
                            aria-label={`Diminuir ${item.name}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-5 text-center font-semibold">{qty}</span>
                          <button
                            onClick={() => setQty(item.id, qty + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-orange hover:bg-brand-orange-dark text-white"
                            aria-label={`Aumentar ${item.name}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-3">
                Data pretendida (opcional)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/90 focus:outline-none focus:border-brand-orange"
              />
            </div>

            {service.calculatorType !== "rental" && (
              <label className="flex items-center gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={extraEquip}
                  onChange={(e) => setExtraEquip(e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                Equipamento/animação extra (+25€)
              </label>
            )}

            <div className="space-y-3 pt-2 border-t border-white/10">
              <p className="text-sm font-semibold text-white/80">Os teus dados, para te contactarmos</p>
              <input
                type="text"
                placeholder="Nome"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-brand-orange"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="tel"
                  placeholder="Telemóvel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-brand-orange"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-brand-orange"
                />
              </div>
              <p className="text-xs text-white/35">Preenche o nome e pelo menos um contacto (telemóvel ou email)</p>
            </div>
          </div>

          {/* Result */}
          <div className="flex flex-col justify-between">
            <div className="bg-gradient-to-br from-brand-orange/20 to-transparent border border-brand-orange/30 rounded-2xl p-6 text-center">
              <p className="text-white/60 text-sm mb-1">Valor estimado</p>
              <p className="text-5xl font-extrabold text-brand-orange">
                {estimate}€
              </p>
              <div className="mt-3 text-white/50 text-xs space-y-0.5">
                {detailLines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-3 flex items-center justify-center gap-1">
                <Info size={13} />
                Preço de exemplo, sujeito a confirmação
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {submitState === "sent" ? (
                <div className="flex items-center justify-center gap-2 w-full font-semibold px-6 py-3.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
                  <CheckCircle2 size={20} />
                  Pedido enviado! Vamos confirmar em breve.
                </div>
              ) : (
                <button
                  onClick={handleSubmitRequest}
                  disabled={!canSubmit || submitState === "sending"}
                  className={`flex items-center justify-center gap-2 w-full font-semibold px-6 py-3.5 rounded-full transition-all ${
                    canSubmit
                      ? "bg-brand-orange hover:bg-brand-orange-dark text-white"
                      : "bg-white/10 text-white/40 cursor-not-allowed"
                  }`}
                >
                  {submitState === "sending" ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  Enviar Pedido de Marcação
                </button>
              )}
              {submitState === "error" && (
                <p className="text-center text-rose-400 text-xs">Não foi possível enviar — tenta por WhatsApp ou email abaixo.</p>
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
                className={`flex items-center justify-center gap-2 w-full font-semibold px-6 py-3.5 rounded-full transition-all ${
                  canRequest
                    ? "bg-[#25D366] hover:brightness-95 text-white"
                    : "bg-white/10 text-white/40 pointer-events-none"
                }`}
              >
                <MessageCircle size={20} />
                Pedir orçamento via WhatsApp
              </a>
              <a
                href={canRequest ? mailtoHref : undefined}
                aria-disabled={!canRequest}
                className={`flex items-center justify-center gap-2 w-full font-semibold px-6 py-3.5 rounded-full border transition-all ${
                  canRequest
                    ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                    : "bg-white/5 border-white/10 text-white/40 pointer-events-none"
                }`}
              >
                <Mail size={20} />
                Pedir por email
              </a>
              <p className="text-center text-white/35 text-xs pt-1">
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
