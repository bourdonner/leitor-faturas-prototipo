/* Tour guiado (coach marks) do protótipo de Faturamento.
   - Um spotlight desliza de um elemento a outro; o card acompanha com a explicação e o passo atual.
   - Passos com demonstração (hover da etapa, filtro de seleção múltipla, Ordenar, Colunas, seleção em lote)
     executam a interação de verdade enquanto o passo está aberto e desfazem ao sair.
   - Abre sozinho na primeira visita de cada página; o botão "Tour" (canto inferior direito) reabre.
   - Teclado: → / Enter avança, ← volta, Esc fecha. */
(function () {
  'use strict';
  if (window.__tour) return;
  var Q = function (s, r) { return (r || document).querySelector(s); };
  var QA = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var page = (new URLSearchParams(location.search).get('p') || location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (page === '' ) page = 'index.html';
  var KEY = 'tour-visto:' + page;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- utilidades de demonstração ---------- */
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var click = function (el) { if (el) el.click(); };
  var popOpen = function () { var p = Q('#pop'); return p && !p.hidden; };
  var closePop = function (anchor) { if (popOpen() && anchor) anchor.click(); var p = Q('#pop'); if (p && !p.hidden) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); } };
  var visible = function (el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
  /* linha com uma etapa interessante (falha > atenção > em andamento) */
  var pickRow = function (dotSel) {
    var dots = QA(dotSel);
    var pri = ['e', 'a', 'w', 'c'];
    for (var i = 0; i < pri.length; i++) { var d = dots.filter(function (x) { return x.dataset.st === pri[i] && visible(x); })[0]; if (d) return d; }
    return dots.filter(visible)[0];
  };
  /* Contas a Faturar: o tooltip nasce do mousemove na célula da etapa */
  var hoverCF = function (dot) {
    var tbl = Q('#tbl'); if (!dot || !tbl) return;
    var r = dot.getBoundingClientRect();
    dot.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }));
  };
  var unhoverCF = function () { var t = Q('#tbl'); if (t) t.dispatchEvent(new MouseEvent('mouseleave')); };
  /* Usinas: a página expõe show/hide da tag */
  var hoverUS = function (b) { if (b && window.__stag) window.__stag.show(b); };
  var unhoverUS = function () { if (window.__stag) window.__stag.hide(); };

  /* ---------- passos por página ---------- */
  var common = {
    sidebar: { sel: '.sb-tgl', pad: 6, title: 'Barra lateral aberta ou recolhida',
      text: 'Este ícone abre e recolhe a barra lateral, como no style guide. A escolha fica salva. Recolhida, passe o mouse nos ícones para ver os submenus; só os grupos com telas no protótipo são clicáveis.' },
    rbarFold: { sel: '#rail .rbar', title: 'Resumo da linha selecionada',
      text: 'Clique numa linha para ver o resumo aqui. O botão à direita recolhe ou expande todas as seções de uma vez; cada seção também tem o próprio chevron. O resumo rola sozinho e os cabeçalhos ficam presos no topo enquanto você lê.' },
    sort: { sel: '#bSort', title: 'Ordenar', place: 'bottom',
      text: 'Escolha o critério de ordenação. Clicar de novo no mesmo critério inverte a ordem (a seta mostra o sentido).',
      enter: function (el) { if (!popOpen()) click(el); return wait(220); }, leave: function (el) { closePop(el); } },
    cols: { sel: '#bCols', title: 'Colunas visíveis', place: 'bottom',
      text: 'Mostre ou esconda colunas. As fixas têm cadeado; “Restaurar padrão” volta ao original. A escolha fica salva neste navegador.',
      enter: function (el) { if (!popOpen()) click(el); return wait(220); }, leave: function (el) { closePop(el); } },
  };
  var multi = function (title) {
    /* a linha de filtros pode começar escondida (funil): o passo abre e, ao sair, devolve como estava */
    var openedRow = false, chip = function () { return Q('#frow .flt:not(.more-f)'); };
    return { sel: '#frow .flt:not(.more-f)', title: title || 'Filtros de seleção múltipla', place: 'bottom',
      text: 'Cada filtro aceita várias opções ao mesmo tempo: marque quantas quiser e o chip mostra as escolhidas. O × no chip limpa aquele filtro, “Limpar filtros” limpa todos e “Mais filtros” traz os filtros extras.',
      pick: function () { var c = chip(); if (!c || !visible(c)) { var b = Q('#bFlt'); if (b && !openedRow) { b.click(); openedRow = true; } c = chip(); } return c; },
      refind: chip,
      enter: function (el) { return wait(260).then(function () { var c = chip(); if (c && !popOpen()) click(c); return wait(240); }); },
      leave: function () { closePop(chip()); if (openedRow) { var b = Q('#bFlt'); if (b) b.click(); openedRow = false; } } };
  };
  var bulk = { sel: '#tbl .tr.row [data-a="sel"]', pad: 8, title: 'Ações em lote',
    text: 'Marque uma ou mais linhas: aparece uma barra embaixo com as ações que valem para todas as selecionadas. Ações que não servem para algum item ficam desabilitadas e explicam o motivo no hover.',
    enter: function (el) { if (el.getAttribute('aria-checked') !== 'true') click(el); return wait(300); },
    leave: function () { var b = Q('#tbl .tr.row [data-a="sel"][aria-checked="true"]'); if (b) click(b); },
    refind: function () { return Q('#tbl .tr.row [data-a="sel"][aria-checked="true"]') || Q('#tbl .tr.row [data-a="sel"]'); },
    also: '#bulk' };

  var STEPS = {
    'faturamento.html': {
      name: 'Contas a Faturar', icon: 'badge',
      intro: 'Só o que não fica óbvio na primeira olhada: os filtros de seleção múltipla, o hover das etapas, o duplo clique e o resumo.',
      steps: [
        multi(),
        { sel: '#tbl .tr.row .c-eta', title: 'Etapa: passe o mouse nas bolinhas', place: 'right',
          text: 'As 3 bolinhas são Leitura, Estudo e Conta a receber: verde concluída, escura atual, vermelha com falha (com uma onda), piscando quando o sistema está processando. No hover a bolinha vira uma tag com a etapa e o estado, por exemplo “Estudo Concluído”.',
          pick: function () { var d = pickRow('#tbl .tr.row .c-eta .steps i[data-tg]'); return d ? d.closest('.c-eta') : null; },
          enter: function (el) { var d = pickRow('#tbl .tr.row .c-eta .steps i[data-tg]'); var dots = QA('.steps i[data-tg]', el); var dd = dots.filter(function (x) { return x.dataset.st === 'e' || x.dataset.st === 'c' || x.dataset.st === 'w'; })[0] || dots[1] || d; return wait(150).then(function () { hoverCF(dd); }); },
          leave: unhoverCF, demo: 'hover' },
        { sel: '#tbl .tr.th .so-rev', pad: 8, title: 'Revisão manual', text: 'A bandeira laranja marca faturamentos em revisão manual. Clique na bandeira do cabeçalho para trazer esses primeiro.' },
        { sel: '#tbl .tr.row.cur, #tbl .tr.row', title: 'Clique e duplo clique', text: 'Um clique seleciona a linha e atualiza o resumo. Duplo clique abre o detalhamento do faturamento.' },
        common.rbarFold,
        { sel: '#rail .rs-gc', title: 'Etapas do faturamento', place: 'left', text: 'Fatura da concessionária, Estudo e Conta a receber ficam juntos num card só, cada um com o seu chevron para recolher. Destaques importantes (faturamento manual, rateio) continuam visíveis mesmo recolhidos.',
          enter: function (el) { el.scrollIntoView({ block: 'start' }); return wait(450); } }
      ] },
    'faturamento-usinas.html': {
      name: 'Faturamento de Usinas', icon: 'wind_power',
      intro: 'Só o que não fica óbvio na primeira olhada: as duas datas, os filtros de seleção múltipla, os 4 pontos de Fatura e Repasse e o resumo.',
      steps: [
        multi(),
        { sel: '#tbl .tr.th .c-ref', pad: 6, title: 'Fechamento × conta da concessionária', place: 'bottom',
          text: 'A data da primeira coluna é a referência de fechamento: o mês usado no faturamento por compensação, sempre preenchido. A referência da conta da concessionária serve só para a coleta e aparece embaixo do nome da concessionária (“Conta abr/2025”). Algumas concessionárias usam o mês seguinte ao da produção, por isso as duas podem diferir.' },
        { sel: '#tbl .tr.row .c-fr', title: 'Fatura e Repasse: passe o mouse nos pontos', place: 'right',
          text: 'Quatro pontos numa coluna só. Antes do divisor, a Fatura: fatura da concessionária (coleta e leitura) e conta a pagar à concessionária. Depois, o Repasse: estudo da usina e conta a pagar ao locador. No hover cada ponto mostra o estado; o tracejado fino indica que a etapa não se aplica. Clicar num ponto abre o resumo direto na seção.',
          pick: function () { var d = pickRow('#tbl .tr.row .c-fr .si[data-tg]'); return d ? d.closest('.c-fr') : null; },
          enter: function (el) { var b = QA('.si[data-tg]', el).filter(function (x) { return x.dataset.st !== 'd'; })[0] || Q('.si[data-tg]', el); return wait(150).then(function () { hoverUS(b); }); },
          leave: unhoverUS, demo: 'hover' },
        common.rbarFold,
        { sel: '#rail .rs-gc', title: 'Etapas da Fatura e do Repasse', place: 'left', text: 'Cada trilha é um card com um cabeçalho e as duas seções dentro, cada uma recolhível pelo próprio chevron.',
          enter: function (el) { el.scrollIntoView({ block: 'start' }); return wait(450); } }
      ] },
    'index.html': {
      name: 'Leitor de Faturas', icon: 'electric_meter',
      intro: 'O detalhe que não fica óbvio nesta tela: os filtros de seleção múltipla.',
      steps: [
        { sel: '.frow .fchip', title: 'Filtros de seleção múltipla', place: 'bottom', text: 'Cada filtro abre uma lista com busca e caixas de seleção: marque várias opções. O chip mostra as escolhidas e “Limpar todos” zera tudo. “Recebida em” aceita um período no calendário.',
          enter: function (el) { if (el.getAttribute('aria-expanded') !== 'true') click(el); return wait(240); },
          leave: function (el) { if (el && el.getAttribute('aria-expanded') === 'true') click(el); }, also: '#fd' }
      ] },
    'faturamento-pendente.html': {
      name: 'Tickets · Faturamento Pendente', icon: 'confirmation_number',
      intro: 'Só o que não fica óbvio na primeira olhada: filtros de seleção múltipla, kanban por tentativas e o resumo.',
      steps: [
        multi(),
        { sel: '#bView', title: 'Lista ou kanban', place: 'bottom', text: 'Alterne para o kanban por tentativas: arraste um ticket para a próxima coluna para registrar a tentativa.' },
        { sel: '#tbl .tr.row .dots', title: 'Tentativas de contato', place: 'right', text: 'Cada ponto é uma tentativa; ao chegar a 7 sem retorno, libera “Solicitar demissão” no resumo.' },
        { sel: '#rail .rbar', title: 'Resumo do ticket', text: 'O resumo rola sozinho, com os cabeçalhos presos no topo: cooperado, faturas pendentes, tentativas e histórico. Cada seção recolhe pelo chevron.' }
      ] }
  };
  var DEF = STEPS[page];
  if (!DEF) return;

  /* ---------- estilos ---------- */
  var css = document.createElement('style');
  css.textContent = [
    '.tr-root{position:fixed;inset:0;z-index:9000;pointer-events:none;font:400 14px/21px Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}',
    '.tr-root[hidden]{display:none}',
    '.tr-veil{position:fixed;inset:0;background:rgba(12,10,9,0);transition:background .35s ease;pointer-events:auto}',
    '.tr-root.on .tr-veil{background:rgba(12,10,9,.55)}',
    '.tr-root.spot .tr-veil{background:transparent;pointer-events:none}',
    '.tr-hole{position:fixed;border-radius:12px;box-shadow:0 0 0 200vmax rgba(12,10,9,.55);opacity:0;transition:top .5s cubic-bezier(.22,.9,.24,1),left .5s cubic-bezier(.22,.9,.24,1),width .5s cubic-bezier(.22,.9,.24,1),height .5s cubic-bezier(.22,.9,.24,1),border-radius .5s,opacity .3s ease}',
    '.tr-root.spot .tr-hole{opacity:1}',
    '.tr-ring{position:fixed;border-radius:14px;border:2px solid #baf743;box-shadow:0 0 0 4px rgba(186,247,67,.25),0 0 24px rgba(186,247,67,.35);opacity:0;transition:top .5s cubic-bezier(.22,.9,.24,1),left .5s cubic-bezier(.22,.9,.24,1),width .5s cubic-bezier(.22,.9,.24,1),height .5s cubic-bezier(.22,.9,.24,1),opacity .3s ease}',
    '.tr-root.spot .tr-ring{opacity:1;animation:trPulse 2.2s ease-in-out infinite}',
    '@keyframes trPulse{0%,100%{box-shadow:0 0 0 4px rgba(186,247,67,.25),0 0 18px rgba(186,247,67,.25)}50%{box-shadow:0 0 0 9px rgba(186,247,67,.10),0 0 32px rgba(186,247,67,.45)}}',
    '.tr-card{position:fixed;width:340px;max-width:calc(100vw - 32px);background:#fff;color:#1c1917;border-radius:16px;box-shadow:0 24px 48px rgba(12,10,9,.28),0 4px 12px rgba(12,10,9,.12);pointer-events:auto;',
    '  transition:top .5s cubic-bezier(.22,.9,.24,1),left .5s cubic-bezier(.22,.9,.24,1),opacity .3s ease,transform .45s cubic-bezier(.22,.9,.24,1);opacity:0;transform:translateY(10px) scale(.96);overflow:hidden}',
    '.tr-root.on .tr-card{opacity:1;transform:none}',
    '.tr-card.center{width:420px}',
    '.tr-arrow{position:absolute;width:14px;height:14px;background:#fff;transform:rotate(45deg);transition:left .5s cubic-bezier(.22,.9,.24,1),top .5s cubic-bezier(.22,.9,.24,1);display:none}',
    '.tr-card[data-p=bottom] .tr-arrow{display:block;top:-7px}.tr-card[data-p=top] .tr-arrow{display:block;bottom:-7px}',
    '.tr-card[data-p=right] .tr-arrow{display:block;left:-7px}.tr-card[data-p=left] .tr-arrow{display:block;right:-7px}',
    '.tr-bar{height:3px;background:#f5f5f4}.tr-bar i{display:block;height:100%;background:linear-gradient(90deg,#71902f,#baf743);transition:width .5s cubic-bezier(.22,.9,.24,1)}',
    '.tr-in{padding:18px 20px 16px}',
    '.tr-body{transition:opacity .22s ease,transform .3s cubic-bezier(.22,.9,.24,1)}',
    '.tr-body.out{opacity:0;transform:translateX(-12px)}.tr-body.pre{opacity:0;transform:translateX(12px);transition:none}',
    '.tr-k{display:flex;align-items:center;gap:8px;font:600 11px/16px Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#71902f;margin-bottom:6px}',
    '.tr-k .tg{margin-left:auto;font-weight:500;letter-spacing:0;text-transform:none;color:#a8a29e}',
    '.tr-demo{display:inline-flex;align-items:center;gap:4px;padding:1px 8px;border-radius:999px;background:#f7fee7;color:#4d7c0f;font:600 10.5px/16px Inter;letter-spacing:.02em;text-transform:none}',
    '.tr-demo::before{content:"";width:6px;height:6px;border-radius:50%;background:#65a30d;animation:trBlink 1.2s ease-in-out infinite}',
    '@keyframes trBlink{50%{opacity:.25}}',
    '.tr-t{margin:0 0 6px;font:600 17px/24px Poppins,Inter,sans-serif;color:#1c1917}',
    '.tr-x{margin:0;color:#57534e}',
    '.tr-ft{display:flex;align-items:center;gap:8px;margin-top:16px}',
    '.tr-dots{display:flex;gap:5px;flex:1;flex-wrap:wrap}',
    '.tr-dots i{width:6px;height:6px;border-radius:999px;background:#e7e5e4;transition:width .35s cubic-bezier(.22,.9,.24,1),background .3s}',
    '.tr-dots i.d{background:#c5d6a3}.tr-dots i.on{width:18px;background:#71902f}',
    '.tr-b{height:34px;padding:0 14px;border-radius:8px;border:0;font:500 13px/34px Inter,sans-serif;cursor:pointer;transition:background .15s,transform .15s}',
    '.tr-b:active{transform:scale(.97)}',
    '.tr-b.pri{background:#1c1917;color:#fafaf9}.tr-b.pri:hover{background:#44403c}',
    '.tr-b.gh{background:transparent;color:#57534e}.tr-b.gh:hover{background:#f5f5f4}',
    '.tr-b:focus-visible{outline:2px solid #71902f;outline-offset:2px}',
    '.tr-close{position:absolute;top:10px;right:10px;width:28px;height:28px;border-radius:8px;border:0;background:transparent;color:#a8a29e;cursor:pointer;font:400 20px/28px Inter}',
    '.tr-close:hover{background:#f5f5f4;color:#1c1917}',
    '.tr-hero[hidden]{display:none!important}',
    '.tr-hero{display:flex;align-items:center;justify-content:center;height:120px;background:radial-gradient(120% 140% at 20% 0%,#eefec9 0%,#d9f99d 35%,#71902f 100%);position:relative;overflow:hidden}',
    '.tr-hero .ic{width:64px;height:64px;border-radius:18px;background:#1c1917;color:#baf743;display:grid;place-items:center;box-shadow:0 10px 24px rgba(12,10,9,.3);animation:trFloat 3.2s ease-in-out infinite}',
    '.tr-hero .ic span{font-family:"Material Symbols Rounded";font-size:34px;font-variation-settings:"FILL" 1;line-height:1}',
    '.tr-hero b{position:absolute;border-radius:50%;background:rgba(255,255,255,.35);animation:trBubble 6s ease-in-out infinite}',
    '@keyframes trFloat{50%{transform:translateY(-6px) rotate(-3deg)}}',
    '@keyframes trBubble{0%{transform:translateY(20px) scale(.6);opacity:0}30%{opacity:1}100%{transform:translateY(-120px) scale(1);opacity:0}}',
    '.tr-cursor{position:fixed;width:22px;height:22px;z-index:9700;pointer-events:none;opacity:0;transition:left .7s cubic-bezier(.22,.9,.24,1),top .7s cubic-bezier(.22,.9,.24,1),opacity .3s;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))}',
    '.tr-cursor.on{opacity:1}',
    '.tr-cursor::after{content:"";position:absolute;left:-10px;top:-10px;width:20px;height:20px;border-radius:50%;border:2px solid #baf743;opacity:0}',
    '.tr-cursor.tap::after{animation:trTap .7s ease-out}',
    '@keyframes trTap{0%{opacity:1;transform:scale(.3)}100%{opacity:0;transform:scale(1.8)}}',
    /* o que está em demonstração fica acima do véu */
    'html.tr-active .stag,html.tr-active #pop,html.tr-active .pop,html.tr-active #lp,html.tr-active #fd,html.tr-active .bulk,html.tr-active #bulk{z-index:9600!important}',
    /* botão no topo, dentro da pílula do protótipo (ou solto no canto superior, se a página não tiver a pílula) */
    '.tr-launch{position:relative;display:inline-flex;align-items:center;gap:4px;height:26px;padding:0 10px 0 7px;border-radius:999px;border:0;background:#eefec9;color:#365314;font:600 11px/26px Inter,sans-serif;cursor:pointer;transition:background .15s,transform .15s;white-space:nowrap}',
    '.tr-launch:hover{background:#d9f99d}.tr-launch:active{transform:scale(.97)}',
    '.tr-launch .ms{font-family:"Material Symbols Rounded";font-size:15px;line-height:1;font-variation-settings:"FILL" 1}',
    '.tr-launch.solo{position:fixed;top:14px;right:16px;z-index:8500;box-shadow:0 1px 2px rgba(0,0,0,.08)}',
    '.tr-launch.new::before{content:"";position:absolute;inset:-3px;border-radius:999px;border:2px solid #84cc16;animation:trRing 1.8s ease-out infinite}',
    '@keyframes trRing{0%{opacity:.9;transform:scale(.92)}100%{opacity:0;transform:scale(1.18)}}',
    '.tr-sep{width:1px;height:16px;background:var(--border,#d6d3d1);margin:0 2px}',
    '@media (max-width:900px){.tr-launch,.tr-sep{display:none}}',
    '@media (prefers-reduced-motion:reduce){.tr-hole,.tr-ring,.tr-card,.tr-body,.tr-cursor,.tr-arrow,.tr-bar i{transition:none!important}.tr-ring,.tr-hero .ic,.tr-hero b,.tr-launch.new::before,.tr-demo::before{animation:none!important}}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---------- montagem ---------- */
  var root = document.createElement('div'); root.className = 'tr-root'; root.hidden = true;
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'false'); root.setAttribute('aria-label', 'Tour guiado');
  root.innerHTML = '<div class="tr-veil"></div><div class="tr-hole"></div><div class="tr-ring"></div>' +
    '<div class="tr-card"><div class="tr-arrow"></div><div class="tr-bar"><i></i></div><div class="tr-hero" hidden></div>' +
    '<button class="tr-close" aria-label="Fechar tour">×</button><div class="tr-in"><div class="tr-body"></div>' +
    '<div class="tr-ft"><div class="tr-dots"></div><button class="tr-b gh" data-t="prev">Voltar</button><button class="tr-b pri" data-t="next">Próximo</button></div></div></div>';
  var cursor = document.createElement('div'); cursor.className = 'tr-cursor';
  cursor.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 3l14 8-6.2 1.6L10 19z" fill="#fff" stroke="#1c1917" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  var launch = document.createElement('button'); launch.className = 'tr-launch'; launch.type = 'button';
  launch.innerHTML = '<span class="ms">explore</span>Tour'; launch.setAttribute('aria-label', 'Iniciar o tour guiado desta tela'); launch.title = 'Iniciar o tour guiado de novo';
  var mount = function () {
    if (!root.isConnected) { document.body.appendChild(root); document.body.appendChild(cursor); }
    if (!launch.isConnected) {
      var pill = Q('.proto');
      if (pill) { var sep = document.createElement('span'); sep.className = 'tr-sep'; pill.insertBefore(launch, pill.firstChild); pill.insertBefore(sep, launch.nextSibling); }
      else { launch.classList.add('solo'); document.body.appendChild(launch); }
    }
  };

  var hole = Q('.tr-hole', root), ring = Q('.tr-ring', root), card = Q('.tr-card', root), body = Q('.tr-body', root),
      bar = Q('.tr-bar i', root), dotsEl = Q('.tr-dots', root), prevB = Q('[data-t=prev]', root), nextB = Q('[data-t=next]', root), hero = Q('.tr-hero', root);

  var steps = [], idx = -1, curEl = null, curStep = null, raf = 0, busy = false;

  var build = function () {
    steps = [{ center: true, title: 'Tour · ' + DEF.name, text: DEF.intro + ' Leva menos de um minuto.' }]
      .concat(DEF.steps.filter(function (s) { return true; }))
      .concat([{ center: true, end: true, title: 'Pronto!', text: 'Quando quiser rever, use o botão “Tour” no topo da tela. As outras telas do protótipo também têm o seu tour.' }]);
  };
  var resolve = function (s) {
    if (s.center) return null;
    var el = s.pick ? s.pick() : null;
    if (!el) el = QA(s.sel).filter(visible)[0] || null;
    return el;
  };

  var place = function () {
    var s = curStep; if (!s) return;
    var vw = innerWidth, vh = innerHeight, cw = card.offsetWidth, ch = card.offsetHeight, m = 16;
    if (s.center || !curEl) {
      root.classList.remove('spot'); card.classList.add('center'); card.removeAttribute('data-p');
      card.style.left = Math.round((vw - card.offsetWidth) / 2) + 'px'; card.style.top = Math.round((vh - card.offsetHeight) / 2) + 'px';
      return;
    }
    card.classList.remove('center'); root.classList.add('spot');
    var r = curEl.getBoundingClientRect(), pad = s.pad != null ? s.pad : 8;
    var x = r.left - pad, y = r.top - pad, w = r.width + pad * 2, h = r.height + pad * 2;
    var rad = Math.min(14, h / 2);
    hole.style.left = x + 'px'; hole.style.top = y + 'px'; hole.style.width = w + 'px'; hole.style.height = h + 'px'; hole.style.borderRadius = rad + 'px';
    ring.style.left = (x - 3) + 'px'; ring.style.top = (y - 3) + 'px'; ring.style.width = (w + 6) + 'px'; ring.style.height = (h + 6) + 'px'; ring.style.borderRadius = (rad + 3) + 'px';
    /* o card desvia do alvo e do que a demonstração abriu (menu, tag, lista de filtros) */
    if (s.enter) { ['#pop', '#lp', '#fd', '.stag.on'].forEach(function (q) { var o = Q(q); if (o && !o.hidden && visible(o)) { var b = o.getBoundingClientRect(); var nx = Math.min(x, b.left - 6), ny = Math.min(y, b.top - 6); w = Math.max(x + w, b.right + 6) - nx; h = Math.max(y + h, b.bottom + 6) - ny; x = nx; y = ny; } }); }
    /* lado do card: o pedido, se couber; senão o que tiver mais espaço */
    var space = { bottom: vh - (y + h), top: y, right: vw - (x + w), left: x };
    var fits = { bottom: space.bottom > ch + 24, top: space.top > ch + 24, right: space.right > cw + 24, left: space.left > cw + 24 };
    var p = s.place && fits[s.place] ? s.place : ['bottom', 'right', 'left', 'top'].filter(function (k) { return fits[k]; })[0] || 'bottom';
    /* se o demo abre algo embaixo (popover/tag), evite cobrir: prefira o lado */
    var L, T;
    if (p === 'bottom' || p === 'top') { L = Math.min(Math.max(m, x + w / 2 - cw / 2), vw - cw - m); T = p === 'bottom' ? y + h + 14 : y - ch - 14; }
    else { T = Math.min(Math.max(m, y + h / 2 - ch / 2), vh - ch - m); L = p === 'right' ? x + w + 14 : x - cw - 14; }
    T = Math.min(Math.max(m, T), vh - ch - m);
    card.style.left = Math.round(L) + 'px'; card.style.top = Math.round(T) + 'px'; card.setAttribute('data-p', p);
    var arrow = Q('.tr-arrow', card);
    if (p === 'bottom' || p === 'top') { arrow.style.left = Math.min(Math.max(16, x + w / 2 - L - 7), cw - 30) + 'px'; arrow.style.top = ''; }
    else { arrow.style.top = Math.min(Math.max(16, y + h / 2 - T - 7), ch - 30) + 'px'; arrow.style.left = ''; }
  };
  /* a tela redesenha (ex.: depois de marcar uma linha): reencontra o alvo */
  var follow = function () { if (curStep && !curStep.center && (!curEl || !curEl.isConnected)) curEl = curStep.refind ? curStep.refind() : resolve(curStep); place(); raf = requestAnimationFrame(follow); };

  var moveCursor = function (el) {
    if (!el || reduce) { cursor.classList.remove('on'); return; }
    var r = el.getBoundingClientRect(); if (!r.width) { cursor.classList.remove('on'); return; }
    if (!cursor.classList.contains('on')) { cursor.style.transition = 'none'; cursor.style.left = (innerWidth / 2) + 'px'; cursor.style.top = (innerHeight - 80) + 'px'; void cursor.offsetWidth; cursor.style.transition = ''; }
    cursor.classList.add('on'); cursor.style.left = (r.left + r.width / 2) + 'px'; cursor.style.top = (r.top + r.height / 2) + 'px';
    setTimeout(function () { cursor.classList.remove('tap'); void cursor.offsetWidth; cursor.classList.add('tap'); }, 650);
  };

  var renderBody = function (s, i) {
    var n = steps.length - 2;
    var kick = s.center ? (s.end ? 'Fim do tour' : 'Bem-vindo') : ('Passo ' + i + ' de ' + n);
    body.innerHTML = '<div class="tr-k">' + kick + (s.demo ? ' <span class="tr-demo">demonstração ao vivo</span>' : '') + '</div>' +
      '<h3 class="tr-t">' + s.title + '</h3><p class="tr-x">' + s.text + '</p>';
    dotsEl.innerHTML = steps.map(function (_, k) { return '<i class="' + (k === i ? 'on' : k < i ? 'd' : '') + '"></i>'; }).join('');
    bar.style.width = Math.round(i / (steps.length - 1) * 100) + '%';
    prevB.style.visibility = i === 0 ? 'hidden' : 'visible';
    nextB.textContent = i === 0 ? 'Começar' : s.end ? 'Concluir' : 'Próximo';
    if (s.center && !s.end) {
      hero.hidden = false;
      hero.innerHTML = '<div class="ic"><span>' + DEF.icon + '</span></div>' +
        [12, 30, 55, 72, 88].map(function (l, k) { var sz = 10 + (k % 3) * 8; return '<b style="left:' + l + '%;bottom:-10px;width:' + sz + 'px;height:' + sz + 'px;animation-delay:' + (k * 1.1) + 's"></b>'; }).join('');
    } else if (s.end) { hero.hidden = false; hero.innerHTML = '<div class="ic"><span>task_alt</span></div>'; }
    else hero.hidden = true;
  };

  var leaveCur = function () {
    if (curStep && curStep.leave) { try { curStep.leave(curEl); } catch (e) {} }
    cursor.classList.remove('on');
  };

  var go = function (i) {
    if (busy || i < 0 || i >= steps.length) return;
    busy = true;
    leaveCur();
    /* pula passos cujo alvo não existe nesta tela/estado */
    var dir = i >= idx ? 1 : -1, s, el;
    while (i > 0 && i < steps.length - 1) { s = steps[i]; el = resolve(s); if (el) break; i += dir; }
    s = steps[i]; el = resolve(s);
    var first = idx === -1;
    idx = i; curStep = s; curEl = el;
    var swap = function () {
      renderBody(s, i);
      body.classList.remove('out'); body.classList.add('pre'); void body.offsetWidth; body.classList.remove('pre');
      var p = Promise.resolve();
      if (el) {
        var rr = el.getBoundingClientRect();
        if (rr.top < 60 || rr.bottom > innerHeight - 40) el.scrollIntoView({ block: 'center' });
        if (s.enter) p = Promise.resolve(s.enter(el)).catch(function () {});
      }
      p.then(function () { place(); if (s.demo === 'hover' || s.enter) moveCursor(s.demo === 'hover' ? (Q('.steps i[data-tg],.si[data-tg]', el) || el) : el); busy = false; nextB.focus({ preventScroll: true }); });
    };
    if (first || reduce) swap(); else { body.classList.add('out'); setTimeout(swap, 180); }
  };

  var open = function () {
    mount();
    build(); idx = -1;
    document.documentElement.classList.add('tr-active');
    root.hidden = false; void root.offsetWidth; root.classList.add('on');
    launch.classList.remove('new');
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    go(0); cancelAnimationFrame(raf); raf = requestAnimationFrame(follow);
  };
  var close = function (done) {
    leaveCur(); cancelAnimationFrame(raf);
    root.classList.remove('on', 'spot');
    setTimeout(function () { root.hidden = true; document.documentElement.classList.remove('tr-active'); }, 320);
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    curStep = null; curEl = null; idx = -1; busy = false;
  };

  root.addEventListener('click', function (e) {
    e.stopPropagation();
    var t = e.target.closest('[data-t]');
    if (t) { if (t.dataset.t === 'next') { if (curStep && curStep.end) close(true); else go(idx + 1); } else go(idx - 1); return; }
    if (e.target.closest('.tr-close')) { close(); return; }
    if (e.target.classList.contains('tr-veil') && curStep && curStep.center) close();
  });
  document.addEventListener('keydown', function (e) {
    if (root.hidden) return;
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); if (curStep && curStep.end) close(true); else go(idx + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
  }, true);
  launch.addEventListener('click', function (e) { e.stopPropagation(); open(); });

  window.__tour = { open: open, close: close, go: function (i) { go(i); } };

  /* primeira visita: abre sozinho depois que a tela termina de montar (só no desktop) */
  var start = function () {
    mount();
    var seen = false; try { seen = localStorage.getItem(KEY) === '1'; } catch (e) {}
    if (/[?&]tour=1\b/.test(location.search)) seen = false;
    if (!seen) launch.classList.add('new');
    if (!seen && innerWidth > 900) setTimeout(open, 1100);
  };
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
})();
