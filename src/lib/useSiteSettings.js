import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const DEFAULTS = {
  contact_phone: "926 150 134 / 967 543 491",
  contact_phone_link: "351926150134",
  contact_email: "desafiarviana@hotmail.com",
  whatsapp_number: "351926150134",
  hero_badge: "🌲 Viana do Castelo & arredores",
  hero_title_line1: "Adrenalina, diversão",
  hero_title_line2: "e",
  hero_title_highlight: "momentos inesquecíveis",
  hero_subtitle: "Paintball, Bubble Soccer, insufláveis e festas de aniversário. Organizamos a tua atividade de A a Z — tu só tens de aparecer.",
  hero_cta_primary: "Simular Orçamento",
  hero_cta_secondary: "Ver Atividades",
  hero_stat_1: "⭐ +9 anos de experiência",
  hero_stat_2: "🎯 6 atividades diferentes",
  hero_stat_3: "👨‍👩‍👧‍👦 Para todas as idades",
  hero_bg_image: "",
  hero_background_type: "color", // "color" | "image"
  hero_background_image: "",
  hero_background_opacity: 40,
  hero_title_color: "",
  hero_title_font: "",
  hero_title_size: "",
  hero_subtitle_color: "",
  hero_subtitle_font: "",
  hero_subtitle_size: "",
  site_logo_url: "",
  footer_text: "Todos os direitos reservados.",
  terms_content: `Estes Termos e Condições regulam a utilização dos serviços da Desafiar Viana e a participação nas atividades por nós organizadas (paintball, bubble soccer, insufláveis, festas de aniversário, ATL, entre outras). Ao efetuares uma reserva, aceitas as condições aqui descritas.

1. Reservas

As reservas podem ser feitas através do site, WhatsApp, telefone ou email. Uma reserva só é considerada confirmada após a nossa confirmação expressa de disponibilidade. Os valores apresentados no simulador do site são estimativas, sujeitas a confirmação final.

2. Pagamento

O pagamento pode ser feito em numerário ou por transferência bancária, no local ou antes da atividade, conforme combinado no momento da reserva.

3. Cancelamentos e Remarcações

Pedimos que qualquer cancelamento ou pedido de remarcação seja comunicado com a maior antecedência possível, para permitir a reorganização da agenda. Em caso de condições meteorológicas adversas que impossibilitem a atividade, esta será remarcada sem custos adicionais.

4. Segurança e Responsabilidade

Todos os participantes devem seguir as instruções dos nossos monitores e as regras de segurança específicas de cada atividade. A Desafiar Viana fornece o equipamento de proteção necessário e monitores presentes durante toda a atividade. A participação em atividades físicas envolve riscos inerentes, que os participantes (ou os seus responsáveis legais, no caso de menores) aceitam ao inscreverem-se.

5. Menores de Idade

A participação de menores em atividades como o Paintball Kids requer autorização de um responsável legal, que deve acompanhar ou autorizar expressamente a participação.

6. Alterações aos Termos

A Desafiar Viana reserva-se o direito de atualizar estes Termos e Condições a qualquer momento. A versão em vigor é sempre a publicada no site.

7. Contactos

Para qualquer questão relacionada com estes Termos e Condições, contacta-nos através dos meios disponíveis na página de Contacto.`,
  privacy_content: `A Desafiar Viana respeita a privacidade dos seus clientes e visitantes do site, e compromete-se a proteger os dados pessoais que nos são confiados, em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD).

1. Dados Recolhidos

Recolhemos os dados que nos forneces diretamente ao efetuares um pedido de marcação ou contacto: nome, telefone, email e informação sobre a atividade pretendida.

2. Finalidade do Tratamento

Os dados recolhidos são utilizados exclusivamente para gerir pedidos de marcação, responder a contactos, e comunicar informações relevantes sobre a atividade reservada.

3. Partilha de Dados

Não partilhamos os teus dados pessoais com terceiros para fins comerciais. Os dados podem ser acedidos por prestadores de serviços que nos apoiam na gestão do negócio (como o alojamento da base de dados), sempre sob condições de confidencialidade.

4. Conservação dos Dados

Conservamos os dados pelo tempo necessário para cumprir as finalidades descritas, ou enquanto exigido por obrigações legais.

5. Os Teus Direitos

Tens o direito de aceder, retificar, apagar ou solicitar a portabilidade dos teus dados pessoais, bem como opor-te ao seu tratamento, a qualquer momento. Para exercer estes direitos, contacta-nos através dos meios disponíveis na página de Contacto.

6. Segurança

Adotamos medidas técnicas e organizativas adequadas para proteger os teus dados contra acesso não autorizado, perda ou alteração.

7. Alterações a Esta Política

Esta Política de Privacidade pode ser atualizada periodicamente. A versão em vigor é sempre a publicada no site.`,
  cookies_content: `Este site utiliza cookies para melhorar a experiência de navegação. Ao continuares a navegar, aceitas a utilização de cookies nos termos aqui descritos.

1. O Que São Cookies

Cookies são pequenos ficheiros de texto guardados no teu dispositivo quando visitas um site, que permitem reconhecer o teu browser em visitas futuras.

2. Que Cookies Utilizamos

Utilizamos cookies essenciais ao funcionamento do site e cookies que nos ajudam a perceber como o site é utilizado, para o podermos melhorar continuamente.

3. Como Gerir os Cookies

Podes gerir ou desativar os cookies nas definições do teu browser a qualquer momento. Tem em conta que desativar certos cookies pode afetar o funcionamento de algumas partes do site.

4. Alterações a Esta Política

Esta Política de Cookies pode ser atualizada periodicamente. A versão em vigor é sempre a publicada no site.`,
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
