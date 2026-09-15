import { useEffect, useState } from "react";
import { supabase } from "./supabase";

// Mesmo mecanismo de useActivities: base de dados + pré-visualização em
// tempo real via postMessage do editor no CRM.
export function useTestimonials() {
  const [dbTestimonials, setDbTestimonials] = useState([]);
  const [liveTestimonials, setLiveTestimonials] = useState(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("position", { ascending: true })
      .then(({ data, error }) => {
        if (!active || error) return;
        setDbTestimonials(data || []);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "DESAFIAR_VIANA_PREVIEW_UPDATE" && event.data.testimonials) {
        setLiveTestimonials(event.data.testimonials.filter((t) => t.is_active));
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return liveTestimonials || dbTestimonials;
}
