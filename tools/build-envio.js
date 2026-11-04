// Gera um HTML único para envio: capa + Leitor (e detalhe), Contas a Faturar (e detalhamento),
// Faturamento de Usinas (só a v3) e Tickets. CSS, JS e imagens embutidos; navegação por ?p=<página>.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const R = (f) => fs.readFileSync(path.join(root, f), "utf8");
const B = String.fromCharCode(92);
const OUT = path.join(root, "prototipo-faturamento.html");

const PAGES = ["index.html", "detalhe.html", "faturamento.html", "faturamento-detalhe.html", "faturamento-usinas.html", "faturamento-pendente.html"];
const dataUri = (f, mime) => "data:" + mime + ";base64," + fs.readFileSync(path.join(root, f)).toString("base64");
const IMG = {
  "assets/plug.svg": dataUri("assets/plug.svg", "image/svg+xml"),
  "assets/fatura-grupo-a.png": dataUri("assets/fatura-grupo-a.png", "image/png"),
  "assets/chevron-down.svg": dataUri("assets/chevron-down.svg", "image/svg+xml"),
};
const safeScript = (s) => s.split("</script").join("<" + B + "/script");

function asset(f) {
  let s = R(f);
  if (f === "assets/select.js") s = s.replace("const CHEV = base+'chevron-down.svg';", "const CHEV = '" + IMG["assets/chevron-down.svg"] + "';");
  if (f === "assets/sidebar.js") s = s.replace("var page = (location.pathname.split('/').pop() || '').toLowerCase();",
    "var page = '?p=' + ((new URLSearchParams(location.search).get('p') || 'index.html').toLowerCase());");
  return s;
}

function inline(html) {
  // CSS e JS locais viram blocos inline
  html = html.replace(/<link[^>]*href="(assets\/[^"?]+\.css)(\?[^"]*)?"[^>]*>/g, (m, f) => "<style>\n" + asset(f) + "\n</style>");
  html = html.replace(/<script src="(assets\/[^"?]+\.js)(\?[^"]*)?"><\/script>/g, (m, f) => "<script>\n" + safeScript(asset(f)) + "\n</script>");
  // imagens locais viram data URI
  for (const [k, v] of Object.entries(IMG)) html = html.split(k).join(v);
  // links do protótipo que não vão no envio (componentes, versão anterior)
  html = html.replace(/<a class="dlk" href="(interacoes|faturamento-v1|faturamento-pendente-componentes)\.html"[^>]*>[\s\S]*?<\/a>/g, "");
  // navegação entre as páginas do envio: X.html → ?p=X.html (e X.html?a=b → ?p=X.html&a=b)
  html = html.replace(/(["'`])(faturamento-detalhe|faturamento-usinas|faturamento-pendente|faturamento|detalhe|index)\.html(\?)?/g,
    (m, q, n, qs) => q + "?p=" + n + ".html" + (qs ? "&" : ""));
  return html;
}

function usinasV3() {
  const s = R("faturamento-usinas.html");
  const a = s.indexOf("const V="), b = s.lastIndexOf("\nconst k=");
  const V = new Function(s.slice(a, b) + ";return V")();
  let t = V.v3;
  // sem seletor de versão (v1 e v2 ficam fora do envio)
  t = t.replace(/\s*<span class="dl" style="padding-left:6px">Versão<\/span>\s*<a class="vlk"[\s\S]*?v3<\/a>/, "");
  t = t.replace('<script>addEventListener("hashchange",()=>location.reload());</script>', "");
  t = t.replace("<title>Faturamento de Usinas (v3)</title>", "<title>Faturamento de Usinas</title>");
  return t;
}

const CARDS = [
  ["index.html", "electric_meter", "Leitor de Faturas", "Faturas enviadas para leitura, com filtros, ordenação, colunas e o envio de novas faturas. A fatura da Padaria Estrela do Sul abre o detalhe."],
  ["faturamento.html", "badge", "Contas a Faturar", "Leitura, estudo e conta a receber de cada faturamento. Resumo lateral com as etapas agrupadas; duplo clique na linha abre o detalhamento."],
  ["faturamento-usinas.html", "wind_power", "Faturamento de Usinas", "Medição, estudo e conta a pagar ao locador de cada usina. Etapas da Fatura e do Repasse no resumo."],
  ["faturamento-pendente.html", "confirmation_number", "Tickets · Faturamento Pendente", "Faturas que não foram recebidas: tentativas de contato, histórico e kanban."],
];
const capa = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Protótipo · Faturamento</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0..1,0&display=block" rel="stylesheet">
<style>
:root{--ink:#1c1917;--mid:#78716c;--brand:#71902f;--bg:#f5f5f4;--card:#fff;--line:#e7e5e4}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:400 14px/22px Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{max-width:960px;margin:0 auto;padding:56px 24px}
h1{margin:0;font:600 28px/36px Poppins,sans-serif;color:var(--brand)}
.sub{margin:6px 0 32px;color:var(--mid)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
a.c{display:flex;flex-direction:column;gap:10px;padding:24px;border-radius:16px;background:var(--card);border:1px solid var(--line);color:inherit;text-decoration:none;transition:box-shadow .15s,transform .15s}
a.c:hover{box-shadow:0 8px 24px rgba(0,0,0,.08);transform:translateY(-1px)}
.ic{width:40px;height:40px;border-radius:10px;background:var(--ink);color:#fff;display:grid;place-items:center}
.ms{font-family:"Material Symbols Rounded";font-size:22px;line-height:1;font-variation-settings:"FILL" 1}
a.c b{font:600 16px/24px Inter,sans-serif}
a.c span.d{color:var(--mid)}
.nt{margin-top:32px;padding:16px 20px;border-radius:12px;background:#fff;border:1px solid var(--line);color:var(--mid)}
.nt b{color:var(--ink);font-weight:600}
</style></head><body><main>
<h1>Protótipo · Faturamento</h1>
<p class="sub">Leitor de Faturas, Contas a Faturar, Faturamento de Usinas e Tickets. Atualizado em ${new Date().toLocaleDateString("pt-BR")}.</p>
<div class="grid">${CARDS.map(([p, ic, t, d]) => `<a class="c" href="?p=${p}"><span class="ic"><span class="ms">${ic}</span></span><b>${t}</b><span class="d">${d}</span></a>`).join("")}</div>
<p class="nt"><b>Como navegar:</b> a barra lateral leva às outras telas. O ícone ⊟ ao lado do caminho no topo abre e recolhe a barra lateral. Os dados são fictícios e as ações mostram um aviso no lugar de gravar.</p>
</main></body></html>`;

const map = { inicio: capa };
for (const p of PAGES) map[p] = inline(p === "faturamento-usinas.html" ? usinasV3() : R(p));
// a marca na barra lateral volta para a capa
for (const p of PAGES) map[p] = map[p].replace(/(<a class="sb-brand" href=")[^"]*(")/, "$1?p=inicio$2");

const enc = JSON.stringify(map).split("</").join("<" + B + "/").split("<!--").join("<" + B + "!--");
const shell = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>Protótipo · Faturamento</title></head>
<body><script>
/* Protótipo de Faturamento (COGECOM). Arquivo único: cada tela fica guardada abaixo e é aberta por ?p=<tela>. */
const P=${enc};
const k=new URLSearchParams(location.search).get('p')||'inicio';
document.open();document.write(P[k]||P.inicio);document.close();
</script></body></html>
`;
fs.writeFileSync(OUT, shell);
const c = shell.slice(shell.indexOf("<script>") + 8);
console.log("ok", (shell.length / 1024).toFixed(0) + "KB", "first </script at", c.search(/<\/script/i), "of", c.length);
