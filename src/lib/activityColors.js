// As cores de cada atividade vêm da base de dados como texto dinâmico
// (ex: "from-orange-500 to-red-600", escolhido no CRM). O Tailwind só
// gera CSS para classes que consegue "ver" escritas literalmente nos
// ficheiros — como estas nunca aparecem em nenhum componente do site
// (só na BD), o Tailwind nunca as gerava e os emblemas/fundos ficavam
// sem cor nenhuma. Esta lista mantém as classes detetáveis — tem de
// continuar igual à lista COLORS do CRM (ActivityEditForm.jsx).
export const ACTIVITY_COLOR_CLASSES = [
  'from-orange-500 to-red-600',
  'from-amber-400 to-orange-500',
  'from-pink-500 to-purple-600',
  'from-sky-400 to-blue-600',
  'from-green-500 to-emerald-600',
  'from-teal-400 to-cyan-600',
]
