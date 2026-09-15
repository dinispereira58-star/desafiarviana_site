import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const DEFAULTS = {
  contact_phone: "926 150 134 / 967 543 491",
  contact_phone_link: "351926150134",
  contact_email: "desafiarviana@hotmail.com",
  whatsapp_number: "351926150134",
};

export function useSiteSettings() {
  const [dbSettings, setDbSettings] = useState(DEFAULTS);
  const [liveSettings, setLiveSettings] = useState(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_settings")
      .select("*")
      .then(({ data, error }) => {
        if (!active || error || !data) return;
        setDbSettings((prev) => ({ ...prev, ...Object.fromEntries(data.map((s) => [s.key, s.value])) }));
      });
    return () => { active = false; };
  }, []);

  // Mesmo mecanismo de pré-visualização em tempo real do useActivities.
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "DESAFIAR_VIANA_PREVIEW_UPDATE" && event.data.settings) {
        setLiveSettings((prev) => ({ ...DEFAULTS, ...prev, ...event.data.settings }));
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return liveSettings || dbSettings;
}
