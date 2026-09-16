import { useEffect, useState } from "react";
import { supabase } from "./supabase";

function mapPopup(p) {
  return {
    id: p.id,
    kind: p.kind,
    position: p.position,
    contentType: p.content_type,
    title: p.title,
    message: p.message,
    imageUrl: p.image_url,
    linkUrl: p.link_url,
    linkLabel: p.link_label,
    bgColor: p.bg_color,
    textColor: p.text_color,
    accentColor: p.accent_color,
    fontFamily: p.font_family,
    textSize: p.text_size,
    barSize: p.bar_size,
    cornerWidth: p.corner_width,
    closeMode: p.close_mode,
    autoCloseSeconds: p.auto_close_seconds,
    animation: p.animation,
    displayOrder: p.display_order,
  };
}

// Só um popup por "slot" (kind + position) fica visível em simultâneo —
// evita dois avisos a sobreporem-se no mesmo canto/barra. O de menor
// display_order ganha.
function dedupeBySlot(popups) {
  const bySlot = new Map();
  for (const p of popups) {
    const slot = `${p.kind}:${p.kind === "modal" ? "center" : p.position}`;
    const current = bySlot.get(slot);
    if (!current || p.displayOrder < current.displayOrder) bySlot.set(slot, p);
  }
  return [...bySlot.values()];
}

export function usePopups() {
  const [popups, setPopups] = useState([]);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_popups")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (!active || error) return;
        setPopups(dedupeBySlot((data || []).map(mapPopup)));
      });
    return () => { active = false; };
  }, []);

  return popups;
}
