// Dados de exemplo — SUBSTITUIR pelos valores reais (preços, descrições, capacidades)
//
// calculatorType define como a calculadora se comporta:
// - "people"    : preço por pessoa, com mínimo de grupo
// - "paintball" : nº de pessoas + pacote de bolas (preço por pessoa varia por pacote)
// - "rental"    : lista de itens avulsos (cada um com o seu preço e quantidade própria)

export const services = [
  {
    id: "paintball",
    name: "Paintball",
    tagline: "Adrenalina em equipa, ao ar livre",
    emoji: "🎯",
    color: "from-orange-500 to-red-600",
    description:
      "Sessões de paintball para grupos de amigos, empresas ou despedidas de solteiro, com equipamento completo e monitores certificados.",
    calculatorType: "paintball",
    minPeople: 6,
    ballPackages: [
      { id: "100", label: "100 bolas", pricePerPerson: 10 },
      { id: "150", label: "150 bolas", pricePerPerson: 14 },
      { id: "200", label: "200 bolas", pricePerPerson: 18 },
    ],
  },
  {
    id: "paintball-kids",
    name: "Paintball Kids",
    tagline: "Diversão segura para os mais novos",
    emoji: "🧒",
    color: "from-amber-400 to-orange-500",
    description:
      "Versão adaptada do paintball para crianças, com bolas de baixo impacto e supervisão constante.",
    calculatorType: "paintball",
    minPeople: 6,
    ballPackages: [
      { id: "50", label: "50 bolas", pricePerPerson: 7 },
      { id: "100", label: "100 bolas", pricePerPerson: 10 },
    ],
  },
  {
    id: "festas",
    name: "Festas de Aniversário",
    tagline: "O teu dia especial, à tua medida",
    emoji: "🎉",
    color: "from-pink-500 to-purple-600",
    description:
      "Pacotes completos de festa com insufláveis, animação e jogos para crianças e adultos.",
    calculatorType: "people",
    minPeople: 8,
    pricePerPerson: 12,
  },
  {
    id: "insuflaveis",
    name: "Aluguer de Insufláveis",
    tagline: "Castelos, escorregas, camas elásticas e mais",
    emoji: "🏰",
    color: "from-sky-400 to-blue-600",
    description:
      "Aluguer de insufláveis e camas elásticas para eventos privados ou institucionais, com entrega e montagem incluída. Escolhe um ou vários itens.",
    calculatorType: "rental",
    items: [
      { id: "castelo", name: "Castelo Insuflável Clássico", emoji: "🏰", price: 70 },
      { id: "escorrega", name: "Escorrega Insuflável Gigante", emoji: "🛝", price: 90 },
      { id: "touro", name: "Touro Mecânico", emoji: "🐂", price: 120 },
      { id: "piscina-bolas", name: "Piscina de Bolas", emoji: "🔵", price: 60 },
      { id: "camas-elasticas", name: "Camas Elásticas", emoji: "🤸", price: 50 },
    ],
  },
  {
    id: "bubble-soccer",
    name: "Bubble Soccer",
    tagline: "Futebol dentro de uma bolha gigante",
    emoji: "⚽",
    color: "from-green-500 to-emerald-600",
    description:
      "Jogo de futebol dentro de bolas insufláveis gigantes — risota garantida para todas as idades.",
    calculatorType: "people",
    minPeople: 6,
    pricePerPerson: 14,
  },
  {
    id: "atl",
    name: "ATL / Atividades Extracurriculares",
    tagline: "Animação para escolas e colónias",
    emoji: "🏕️",
    color: "from-teal-400 to-cyan-600",
    description:
      "Programas de atividades para ATL, escolas e colónias de férias, adaptados à idade dos participantes.",
    calculatorType: "people",
    minPeople: 10,
    pricePerPerson: 8,
  },
];
