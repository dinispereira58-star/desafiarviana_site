// Função serverless (Vercel) que serve HTML com meta tags Open Graph
// dinâmicas — para quando o link do site é partilhado no WhatsApp,
// Facebook, etc. Esses "crawlers" não executam JavaScript, por isso as
// tags definidas com React (document.title, etc.) nunca chegavam a ser
// vistas por eles; esta função lê os dados diretamente do Supabase a
// cada pedido, para que alterar a imagem/texto no CRM funcione de
// imediato, sem precisar de voltar a publicar o site.
//
// Ligada via vercel.json: só pedidos com User-Agent de "crawler"
// conhecido chegam aqui — visitantes normais continuam a receber a
// aplicação React normal.

const SITE_URL = 'https://desafiarviana-site.vercel.app';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

async function fetchJson(url, headers) {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.VITE_SUPABASE_KEY;
  const rawPath = (req.query.path || '').replace(/^\/+/, '');
  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

  let title = 'Desafiar Viana — Paintball, Insufláveis & Festas';
  let description = 'Paintball, Bubble Soccer, insufláveis e festas de aniversário em Viana do Castelo. Simula o teu orçamento e reserva a tua atividade.';
  let image = '';

  if (SUPABASE_URL && SUPABASE_KEY) {
    const settingsRows = await fetchJson(`${SUPABASE_URL}/rest/v1/site_settings?select=key,value`, headers);
    const settings = Object.fromEntries((settingsRows || []).map((r) => [r.key, r.value]));
    title = settings.og_title || title;
    description = settings.og_description || description;
    image = settings.og_image || settings.hero_bg_image || '';

    // Página de uma atividade específica — usa o nome/foto dela em vez
    // dos valores gerais do site.
    const activityMatch = rawPath.match(/^atividades\/([^/?]+)/);
    if (activityMatch) {
      const activityRows = await fetchJson(
        `${SUPABASE_URL}/rest/v1/activities?id=eq.${encodeURIComponent(activityMatch[1])}&select=name,tagline,photo_url`,
        headers
      );
      const activity = activityRows?.[0];
      if (activity) {
        title = `${activity.name} — Desafiar Viana`;
        description = activity.tagline || description;
        image = activity.photo_url || image;
      }
    }
  }

  const url = `${SITE_URL}/${rawPath}`;

  const html = `<!doctype html>
<html lang="pt">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Desafiar Viana" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:url" content="${escapeHtml(url)}" />
${image ? `<meta property="og:image" content="${escapeHtml(image)}" />\n<meta name="twitter:image" content="${escapeHtml(image)}" />` : ''}
<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta http-equiv="refresh" content="0; url=${escapeHtml(url)}" />
</head>
<body></body>
</html>`;

  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.setHeader('cache-control', 's-maxage=300, stale-while-revalidate=3600');
  res.status(200).send(html);
}
