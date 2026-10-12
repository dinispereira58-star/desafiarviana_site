// Enquadramento das fotos recortadas (object-cover): o CRM guarda-o no próprio
// endereço da imagem, "…/foto.jpg#pos=50,30" (percentagens horizontal,vertical).
// O fragmento "#…" não vai ao servidor, por isso a imagem é a mesma.
const RE = /#pos=(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)$/;

export function imgPos(url) {
  const m = url ? String(url).match(RE) : null;
  if (!m) return { src: url, style: undefined };
  return { src: url.slice(0, m.index), style: { objectPosition: `${m[1]}% ${m[2]}%` } };
}
