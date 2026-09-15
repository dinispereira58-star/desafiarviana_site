import { useEffect, useState } from "react";
import { supabase } from "./supabase";

// Busca as atividades geridas no CRM (tabela `activities`, só as visíveis)
// e traduz para as mesmas chaves em camelCase que os componentes já usavam
// quando os dados vinham do ficheiro estático data/services.js.
export function useActivities() {
  const [services, setServices] = useState([]);
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
        setServices(
          (data || []).map((a) => ({
            id: a.id,
            name: a.name,
            tagline: a.tagline,
            emoji: a.emoji,
            color: a.color,
            description: a.description,
            calculatorType: a.calculator_type,
            minPeople: a.min_people,
            pricePerPerson: a.price_per_person,
            ballPackages: a.ball_packages || [],
            items: a.items || [],
          }))
        );
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { services, loading };
}
