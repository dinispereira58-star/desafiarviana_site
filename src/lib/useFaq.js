import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useFaq() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    supabase
      .from("faq_items")
      .select("*")
      .eq("is_active", true)
      .order("position", { ascending: true })
      .then(({ data, error }) => {
        if (!active || error) return;
        setItems(data || []);
      });
    return () => { active = false; };
  }, []);

  return items;
}
