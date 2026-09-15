import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { useSiteSettings } from "../lib/useSiteSettings";

const CHANNELS = (settings) => [
  {
    key: "whatsapp",
    href: `https://wa.me/${settings.whatsapp_number}`,
    external: true,
    icon: MessageCircle,
    iconBg: "bg-[#25D366]",
    label: "WhatsApp",
    value: settings.contact_phone,
  },
  {
    key: "phone",
    href: `tel:+${settings.contact_phone_link}`,
    icon: Phone,
    iconBg: "bg-gradient-to-br from-brand-orange to-brand-pink",
    label: "Telefone",
    value: settings.contact_phone,
  },
  {
    key: "email",
    href: `mailto:${settings.contact_email}`,
    icon: Mail,
    iconBg: "bg-gradient-to-br from-brand-teal to-brand-teal-dark",
    label: "Email",
    value: settings.contact_email,
  },
];

export default function Contact() {
  const settings = useSiteSettings();
  return (
    <section id="contacto" className="relative py-24 px-5 bg-canvas overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[36rem] h-64 rounded-full bg-brand-orange/10 blur-[100px]" />
      <div className="max-w-4xl mx-auto text-center relative">
        <span className="text-brand-orange font-semibold text-sm tracking-widest uppercase">
          Fala connosco
        </span>
        <h2 className="font-display uppercase text-4xl md:text-6xl mt-3 text-ink">
          Vamos organizar a tua aventura?
        </h2>
        <p className="text-ink-soft mt-4 max-w-xl mx-auto">
          Contacta-nos diretamente — confirmamos sempre disponibilidade antes
          de qualquer reserva.
        </p>

        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {CHANNELS(settings).map((c, i) => (
            <motion.a
              key={c.key}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="flex flex-col items-center gap-3 bg-white border border-ink/10 shadow-sm hover:shadow-xl rounded-2xl p-6 transition-shadow"
            >
              <div className={`w-14 h-14 rounded-2xl ${c.iconBg} flex items-center justify-center text-white shadow-md`}>
                <c.icon size={26} />
              </div>
              <span className="font-semibold text-ink">{c.label}</span>
              <span className="text-ink-soft text-sm">{c.value}</span>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-ink-soft text-sm">
          <MapPin size={16} />
          Viana do Castelo, Portugal
        </div>
      </div>
    </section>
  );
}
