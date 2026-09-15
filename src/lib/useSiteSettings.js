import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const DEFAULTS = {
  contact_phone: "926 150 134 / 967 543 491",
  contact_phone_link: "351926150134",
  contact_email: "desafiarviana@hotmail.com",
  whatsapp_number: "351926150134",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_settings")
      .select("*")
      .then(({ data, error }) => {
        if (!active || error || !data) return;
        setSettings((prev) => ({ ...prev, ...Object.fromEntries(data.map((s) => [s.key, s.value])) }));
      });
    return () => { active = false; };
  }, []);

  return settings;
}
