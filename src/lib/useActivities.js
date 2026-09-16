import { useEffect, useState } from "react";
import { supabase } from "./supabase";

function mapActivity(a) {
  return {
    id: a.id,
    name: a.name,
    tagline: a.tagline,
    emoji: a.emoji,
    color: a.color,
    photoUrl: a.photo_url || null,
    description: a.description,
    calculatorType: a.calculator_type,
    minPeople: a.min_people,
    pricePerPerson: a.price_per_person,
    ballPackages: a.ball_packages || [],
    items: a.items || [],
    longDescription: a.long_description || "",
    safetyRules: a.safety_rules || [],
    gallery: a.gallery || [],
    priceNote: a.price_note || "",
  };
}

// Busca as atividades geridas no CRM (tabela `activities`, só as visíveis)
// e traduz para as mesmas chaves em camelCase que os componentes já usavam
// quando os dados vinham do ficheiro estático data/services.js.
//
// Também escuta mensagens `postMessage` do editor do CRM (quando o site é
// mostrado dentro de um <iframe> de pré-visualização), para refletir
// alterações ainda não guardadas instantaneamente — mesmo mecanismo usado
// no site da imobiliária (useEditorConfig).
export function useActivities() {
  const [dbServices, setDbServices] = useState([]);
  const [liveServices, setLiveServices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("activities")
      .select("*")
      .eq("is_active", true)
      .order("position", { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) { console.error("Erro a carregar atividades:", error); setLoading(false); return; }
        setDbServices((data || []).map(mapActivity));
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "DESAFIAR_VIANA_PREVIEW_UPDATE" && event.data.activities) {
        setLiveServices(event.data.activities.filter((a) => a.is_active).map(mapActivity));
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return { services: liveServices || dbServices, loading: !liveServices && loading, isLivePreview: !!liveServices };
}
