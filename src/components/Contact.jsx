import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { useSiteSettings } from "../lib/useSiteSettings";

export default function Contact() {
  const settings = useSiteSettings();
  return (
    <section id="contacto" className="py-24 px-5 bg-brand-dark-2/50">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-brand-orange font-semibold text-sm tracking-wide uppercase">
          Fala connosco
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold mt-3">
          Vamos organizar a tua aventura?
        </h2>
        <p className="text-white/60 mt-4 max-w-xl mx-auto">
          Contacta-nos diretamente — confirmamos sempre disponibilidade antes
          de qualquer reserva.
        </p>

        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          <a
            href={`https://wa.me/${settings.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 hover:border-brand-orange/50 rounded-2xl p-6 transition-colors"
          >
            <MessageCircle className="text-[#25D366]" size={28} />
            <span className="font-semibold">WhatsApp</span>
            <span className="text-white/50 text-sm">{settings.contact_phone}</span>
          </a>
          <a
            href={`tel:+${settings.contact_phone_link}`}
            className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 hover:border-brand-orange/50 rounded-2xl p-6 transition-colors"
          >
            <Phone className="text-brand-orange" size={28} />
            <span className="font-semibold">Telefone</span>
            <span className="text-white/50 text-sm">{settings.contact_phone}</span>
          </a>
          <a
            href={`mailto:${settings.contact_email}`}
            className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 hover:border-brand-orange/50 rounded-2xl p-6 transition-colors"
          >
            <Mail className="text-brand-orange" size={28} />
            <span className="font-semibold">Email</span>
            <span className="text-white/50 text-sm">{settings.contact_email}</span>
          </a>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-white/40 text-sm">
          <MapPin size={16} />
          Viana do Castelo, Portugal
        </div>
      </div>
    </section>
  );
}
