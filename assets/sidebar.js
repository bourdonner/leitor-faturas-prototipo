/* Sidebar no padrão do stg (stg.enershare.com.br): mesma ordem de grupos, mesmos ícones e mesmos submenus.
   Fonte: bundle do stg, funções aen (grupo Operação) e oen (grupo Sistema). Ícones copiados dos SVGs do stg.
   Recolhida (48 px) mostra só o ícone do grupo; no hover abre um painel com o nome do grupo e os submenus.
   Submenus com página no protótipo são links; os outros aparecem apagados.
   O Leitor de Faturas não está na sidebar do stg (/leitor-faturas não tem item de menu); aqui ele fica no grupo Faturamento. */
(function () {
  var sb = document.querySelector('.sidebar');
  var content = sb && sb.querySelector('.sb-content');
  if (!content) return;

  var I = {
    consumidores: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M0.666504 7.33333V14H3.99984V10H6.6665V14H9.99984V7.33333L5.33317 4L0.666504 7.33333Z"/><path d="M6.6665 2V3.31333L11.3332 6.64667V7.33333H12.6665V8.66667H11.3332V10H12.6665V11.3333H11.3332V14H15.3332V2H6.6665ZM12.6665 6H11.3332V4.66667H12.6665V6Z"/></svg>',
    financeiro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',
    locadores: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2.22016 10.6666H7.3335V8.66665H2.66683L2.22016 10.6666Z"/><path d="M8.66683 10.6666H13.7802L13.3335 8.66665H8.66683V10.6666Z"/><path d="M14.0735 12H8.66683V14.6666H14.6668L14.0735 12Z"/><path d="M1.3335 14.6666H7.3335V12H1.92683L1.3335 14.6666Z"/><path d="M8.66683 5.33331H7.3335V7.33331H8.66683V5.33331Z"/><path d="M11.4526 3.86062L10.5098 4.80342L11.924 6.21762L12.8668 5.27482L11.4526 3.86062Z"/><path d="M4.55094 3.86097L3.13674 5.27517L4.07954 6.21797L5.49374 4.80377L4.55094 3.86097Z"/><path d="M4.00016 1.33331H2.00016V2.66665H4.00016V1.33331Z"/><path d="M14.0002 1.33331H12.0002V2.66665H14.0002V1.33331Z"/><path d="M8.00016 4.66665C9.84016 4.66665 11.3335 3.17331 11.3335 1.33331H4.66683C4.66683 3.17331 6.16016 4.66665 8.00016 4.66665Z"/></svg>',
    distribuidores: '<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M720-360v-80h80q17 0 28.5 11.5T840-400q0 17-11.5 28.5T800-360h-80Zm0 160v-80h80q17 0 28.5 11.5T840-240q0 17-11.5 28.5T800-200h-80Zm-160 40q-33 0-56.5-23.5T480-240h-80v-160h80q0-33 23.5-56.5T560-480h120v320H560ZM280-280q-66 0-113-47t-47-113q0-66 47-113t113-47h60q25 0 42.5-17.5T400-660q0-25-17.5-42.5T340-720H200q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h140q58 0 99 41t41 99q0 58-41 99t-99 41h-60q-33 0-56.5 23.5T200-440q0 33 23.5 56.5T280-360h80v80h-80Z"/></svg>',
    faturamento: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>',
    precadastro: '<svg viewBox="0 -960 960 960" fill="currentColor"><path d="M360-600v-80h360v80H360Zm0 120v-80h360v80H360ZM560-80v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T903-300L683-80H560Zm263-224 37-39-37-37-38 38 38 38ZM240-80q-50 0-85-35t-35-85v-120h120v-560h600v361q-20-2-40.5 1.5T760-505v-295H320v480h240l-80 80v160H240Z"/></svg>',
    operacoes: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M12.7602 8.62664C12.7869 8.42664 12.8002 8.21998 12.8002 7.99998C12.8002 7.78664 12.7869 7.57331 12.7536 7.37331L14.1069 6.31998C14.2269 6.22664 14.2602 6.04664 14.1869 5.91331L12.9069 3.69998C12.8269 3.55331 12.6602 3.50664 12.5136 3.55331L10.9202 4.19331C10.5869 3.93998 10.2336 3.72664 9.84024 3.56664L9.60024 1.87331C9.57357 1.71331 9.44024 1.59998 9.28024 1.59998H6.72024C6.56024 1.59998 6.43357 1.71331 6.4069 1.87331L6.1669 3.56664C5.77357 3.72664 5.41357 3.94664 5.0869 4.19331L3.49357 3.55331C3.3469 3.49998 3.18024 3.55331 3.10024 3.69998L1.8269 5.91331C1.7469 6.05331 1.77357 6.22664 1.9069 6.31998L3.26024 7.37331C3.2269 7.57331 3.20024 7.79331 3.20024 7.99998C3.20024 8.20664 3.21357 8.42664 3.2469 8.62664L1.89357 9.67998C1.77357 9.77331 1.74024 9.95331 1.81357 10.0866L3.09357 12.3C3.17357 12.4466 3.34024 12.4933 3.4869 12.4466L5.08024 11.8066C5.41357 12.06 5.7669 12.2733 6.16024 12.4333L6.40024 14.1266C6.43357 14.2866 6.56024 14.4 6.72024 14.4H9.28024C9.44024 14.4 9.57357 14.2866 9.59357 14.1266L9.83357 12.4333C10.2269 12.2733 10.5869 12.06 10.9136 11.8066L12.5069 12.4466C12.6536 12.5 12.8202 12.4466 12.9002 12.3L14.1802 10.0866C14.2602 9.93998 14.2269 9.77331 14.1002 9.67998L12.7602 8.62664ZM8.00024 10.4C6.68024 10.4 5.60024 9.31998 5.60024 7.99998C5.60024 6.67998 6.68024 5.59998 8.00024 5.59998C9.32024 5.59998 10.4002 6.67998 10.4002 7.99998C10.4002 9.31998 9.32024 10.4 8.00024 10.4Z"/></svg>'
  };

  /* href = página do protótipo; pages = arquivos que deixam o item ativo */
  var OPERACAO = [
    { label: 'Consumidores', icon: 'consumidores', subs: [
      { label: 'Titulares' }, { label: 'Instalações' }, { label: 'Grupo de Titulares' }, { label: 'Carteiras' },
      { label: 'Livro de Matrículas' },
      { label: 'Contas a Faturar', href: 'faturamento.html', pages: ['faturamento.html', 'faturamento-v1.html', 'faturamento-detalhe.html'] },
      { label: 'Faturamento de Grupo' }, { label: 'Saldo Final' }] },
    { label: 'Financeiro', icon: 'financeiro', subs: [{ label: 'Contas a Pagar' }, { label: 'Contas a Receber' }] },
    { label: 'Locadores', icon: 'locadores', subs: [
      { label: 'Usinas' }, { label: 'Titulares de Usinas' }, { label: 'Integradores' },
      { label: 'Faturamento Usinas', href: 'faturamento-usinas.html', pages: ['faturamento-usinas.html'] },
      { label: 'Faturamento Locador por Fechamento' }, { label: 'Gestão de Energia' }] },
    { label: 'Distribuidores', icon: 'distribuidores', subs: [{ label: 'Concessionárias' }, { label: 'Tarifas' }, { label: 'Bandeiras Tarifárias' }] },
    { label: 'Faturamento', icon: 'faturamento', subs: [
      { label: 'Tickets', href: 'faturamento-pendente.html', pages: ['faturamento-pendente.html', 'faturamento-pendente-componentes.html'] },
      { label: 'Leitor de Faturas', href: 'index.html', pages: ['index.html', 'detalhe.html', ''] }] },
    { label: 'Pré-Cadastro', icon: 'precadastro', subs: [{ label: 'Cálculos' }] }
  ];
  var SISTEMA = [
    { label: 'Operações', icon: 'operacoes', subs: [
      { label: 'Categorias de anexos' }, { label: 'Config. Cooperativa' }, { label: 'Doações' }, { label: 'Empresas' },
      { label: 'Grupo de Permissões' }, { label: 'Histórico de Notificações' }, { label: 'Observabilidade do Pipeline' },
      { label: 'Config. Marketing' }, { label: 'Políticas de Comunicação' }] }
  ];

  var page = (location.pathname.split('/').pop() || '').toLowerCase();
  var isOn = function (s) { return s.pages && s.pages.indexOf(page) >= 0; };

  var css = document.createElement('style');
  css.textContent =
    '.sidebar .sb-content{display:flex;flex-direction:column}.sidebar .sb-sec.stg{gap:0}.sidebar .sb-sec.stg.end{margin-top:auto}' +
    '.sidebar .sb-grp{position:relative}' +
    '.sidebar .sb-grp>.sb-item{width:32px;height:36px;border-radius:4px;display:grid;place-items:center;color:var(--ink)}' +
    '.sidebar .sb-grp>.sb-item svg{width:16px;height:16px;display:block}' +
    '.sidebar .sb-grp>.sb-item.off{cursor:default}' +
    '.sb-fly{position:absolute;left:40px;top:-4px;min-width:200px;padding:8px;border-radius:8px;background:var(--fg,#fff);color:var(--ink);' +
      'box-shadow:0 10px 15px rgba(0,0,0,.10),0 4px 6px rgba(0,0,0,.10);border:1px solid var(--s200,#e7e5e4);display:none;z-index:70;font:400 14px/20px Inter,system-ui,sans-serif}' +
    '.sb-fly::before{content:"";position:absolute;left:-12px;top:0;bottom:0;width:12px}' +
    '.sidebar .sb-grp:hover .sb-fly,.sidebar .sb-grp:focus-within .sb-fly{display:block}' +
    '.sb-fly .t{font:600 12px/16px Inter,system-ui,sans-serif;color:var(--mid,#78716c);padding:4px 8px 6px;white-space:nowrap}' +
    '.sb-fly a,.sb-fly span.x{display:block;padding:6px 8px;border-radius:4px;white-space:nowrap;color:var(--ink);text-decoration:none}' +
    '.sb-fly a:hover,.sb-fly a.on{background:var(--fsec,#f5f5f4)}' +
    '.sb-fly a.on{font-weight:500}' +
    '.sb-fly span.x{color:var(--s400,#a8a29e);cursor:default}';
  document.head.appendChild(css);

  var esc = function (t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var group = function (g) {
    var linked = g.subs.filter(function (s) { return s.href; });
    var on = g.subs.some(isOn);
    var main = linked[0];
    var tag = main ? 'a href="' + main.href + '"' : 'span';
    var h = '<div class="sb-grp">' +
      '<' + tag + ' class="sb-item' + (on ? ' on' : '') + (main ? '' : ' off') + '" aria-label="' + esc(g.label) + '"' + (on ? ' aria-current="page"' : '') + '>' + I[g.icon] + '</' + (main ? 'a' : 'span') + '>' +
      '<div class="sb-fly" role="menu"><div class="t">' + esc(g.label) + '</div>';
    g.subs.forEach(function (s) {
      h += s.href
        ? '<a role="menuitem" href="' + s.href + '"' + (isOn(s) ? ' class="on" aria-current="page"' : '') + '>' + esc(s.label) + '</a>'
        : '<span class="x">' + esc(s.label) + '</span>';
    });
    return h + '</div></div>';
  };

  /* ===== aberta x recolhida (como no stg/style guide): o botão ⊟ (vertical_split) do topo alterna; a escolha fica salva ===== */
  var CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 15.4 6 9.4 7.4 8l4.6 4.6L16.6 8 18 9.4z"/></svg>';
  var ocss = document.createElement('style');
  ocss.textContent =
    '.sidebar{transition:width .2s cubic-bezier(.2,.7,.2,1)}' +
    '.sidebar .sb-open-nav,.sidebar .sb-user{display:none}' +
    'html.sb-open .sidebar{width:256px}' +
    'html.sb-open .sidebar .sb-col{display:none}' +
    'html.sb-open .sidebar .sb-open-nav{display:block}' +
    'html.sb-open .sidebar .sb-content{overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}' +
    'html.sb-open .sidebar .sb-foot{display:flex;align-items:center;gap:8px}' +
    'html.sb-open .sidebar .sb-user{display:flex;flex-direction:column;min-width:0;font:400 12px/16px Inter,system-ui,sans-serif;color:var(--mid,#78716c)}' +
    '.sidebar .sb-user b{font:500 14px/20px Inter,system-ui,sans-serif;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '@media (min-width:768px){.page,.main{transition:margin-left .2s cubic-bezier(.2,.7,.2,1)}html.sb-open .page,html.sb-open .main{margin-left:288px}}' +
    '.sb-open-nav{padding:0 4px 8px}' +
    '.sb-open-nav .sb-cat{margin:0;padding:20px 8px 8px;font:600 12px/16px Poppins,Inter,sans-serif;color:var(--mid,#78716c)}' +
    '.sb-open-nav .sb-cat:first-child{padding-top:8px}' +
    '.sb-orow{display:flex;align-items:center;gap:8px;width:100%;height:32px;margin:0 0 2px;padding:0 8px;border:0;background:none;border-radius:6px;color:var(--ink);font:400 14px/20px Inter,system-ui,sans-serif;cursor:pointer;text-align:left}' +
    '.sb-orow:hover{background:var(--fsec,#f5f5f4)}' +
    '.sb-og.on>.sb-orow{font-weight:500}' +
    '.sb-orow .i{width:16px;height:16px;flex:none;display:grid;place-items:center}.sb-orow .i svg{width:16px;height:16px;display:block}' +
    '.sb-orow .l{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.sb-orow .chev{width:16px;height:16px;flex:none;color:var(--mid,#78716c);transition:transform .2s}' +
    '.sb-og.open>.sb-orow .chev{transform:rotate(180deg)}' +
    '.sb-osub{display:grid;grid-template-rows:0fr;transition:grid-template-rows .2s cubic-bezier(.2,.7,.2,1)}' +
    '.sb-og.open>.sb-osub{grid-template-rows:1fr}' +
    '.sb-osub>div{min-height:0;overflow:hidden;display:flex;flex-direction:column;padding-left:24px}' +
    '.sb-osub a,.sb-osub span{display:block;height:32px;line-height:32px;padding:0 8px;margin-bottom:2px;border-radius:6px;font:400 14px/32px Inter,system-ui,sans-serif;color:var(--ink);text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.sb-osub a:hover,.sb-osub a.on{background:var(--fsec,#f5f5f4)}.sb-osub a.on{font-weight:500}' +
    '.sb-osub span.x{color:var(--s400,#a8a29e);cursor:default}' +
    '.sb-tgl{cursor:pointer;border-radius:6px}';
  document.head.appendChild(ocss);

  var ogroup = function (g, i) {
    var on = g.subs.some(isOn);
    return '<div class="sb-og' + (on ? ' on open' : '') + '"><button type="button" class="sb-orow" aria-expanded="' + on + '">' +
      '<span class="i">' + I[g.icon] + '</span><span class="l">' + esc(g.label) + '</span>' + CHEV + '</button>' +
      '<div class="sb-osub"><div>' + g.subs.map(function (s) {
        return s.href
          ? '<a href="' + s.href + '"' + (isOn(s) ? ' class="on" aria-current="page"' : '') + '>' + esc(s.label) + '</a>'
          : '<span class="x">' + esc(s.label) + '</span>';
      }).join('') + '</div></div></div>';
  };

  content.innerHTML =
    '<div class="sb-col">' +
    '<div class="sb-sec stg" aria-label="Operação">' + OPERACAO.map(group).join('') + '</div>' +
    '<div class="sb-sec stg end" aria-label="Sistema">' + SISTEMA.map(group).join('') + '</div></div>' +
    '<nav class="sb-open-nav" aria-label="Menu"><p class="sb-cat">Operação</p>' + OPERACAO.map(ogroup).join('') +
    '<p class="sb-cat">Sistema</p>' + SISTEMA.map(ogroup).join('') + '</nav>';
  content.addEventListener('click', function (e) {
    var b = e.target.closest('.sb-orow'); if (!b) return;
    var og = b.parentNode, open = !og.classList.contains('open');
    og.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
  });
  var foot = sb.querySelector('.sb-foot');
  if (foot && !foot.querySelector('.sb-user')) foot.insertAdjacentHTML('beforeend', '<div class="sb-user"><b>Erick Martins</b><span>Cogecom</span></div>');
  /* a .sb-col precisa ocupar a altura para o grupo Sistema ir para o fim */
  var ccss = document.createElement('style');
  ccss.textContent = '.sidebar .sb-col{flex:1;display:flex;flex-direction:column}';
  document.head.appendChild(ccss);

  var KEY = 'sb-open';
  var get = function () { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } };
  var setOpen = function (v) {
    document.documentElement.classList.toggle('sb-open', v);
    try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {}
    document.querySelectorAll('.sb-tgl').forEach(function (t) { t.setAttribute('aria-label', v ? 'Recolher menu' : 'Abrir menu'); t.setAttribute('aria-expanded', v); });
  };
  document.documentElement.classList.toggle('sb-open', get());
  var wire = function () {
    /* o ícone vertical_split do topo vira o botão (em algumas páginas é um <button>, em outras só um <span>) */
    document.querySelectorAll('.msr,.ico,.mss').forEach(function (el) {
      if (el.textContent.trim() !== 'vertical_split' || el.closest('.sidebar,.sb-dw')) return;
      var t = el.closest('button') || el;
      if (t.classList.contains('sb-tgl')) return;
      t.classList.add('sb-tgl');
      if (t.tagName !== 'BUTTON') { t.setAttribute('role', 'button'); t.setAttribute('tabindex', '0'); t.removeAttribute('aria-hidden'); }
      t.setAttribute('aria-label', get() ? 'Recolher menu' : 'Abrir menu');
      t.setAttribute('aria-expanded', get());
      var go = function (e) { e.preventDefault(); e.stopImmediatePropagation(); setOpen(!document.documentElement.classList.contains('sb-open')); };
      t.addEventListener('click', go, true);
      t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') go(e); });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
  setTimeout(wire, 600);

  /* mobile: o botão ☰ (#mmenu) abre uma gaveta com os mesmos grupos, abertos */
  var dcss = document.createElement('style');
  dcss.textContent =
    '.sb-dw{position:fixed;inset:0;z-index:200;display:none}.sb-dw.open{display:block}' +
    '.sb-dw .bg{position:absolute;inset:0;background:rgba(12,10,9,.4)}' +
    '.sb-dw .pn{position:absolute;left:0;top:0;bottom:0;width:min(300px,85vw);background:var(--fg,#fff);color:var(--ink,#1c1917);overflow-y:auto;padding:16px 12px;' +
      'box-shadow:0 10px 15px rgba(0,0,0,.15);font:400 14px/20px Inter,system-ui,sans-serif;display:flex;flex-direction:column;gap:12px}' +
    '.sb-dw .hd{display:flex;align-items:center;justify-content:space-between;padding:0 4px 4px;font:600 16px/24px Poppins,Inter,sans-serif}' +
    '.sb-dw .cl{width:36px;height:36px;border:0;background:none;border-radius:8px;font-size:22px;line-height:1;cursor:pointer;color:inherit}' +
    '.sb-dw .g{display:flex;flex-direction:column}' +
    '.sb-dw .gt{display:flex;align-items:center;gap:8px;padding:6px 8px;font-weight:600}' +
    '.sb-dw .gt svg{width:16px;height:16px;flex:none}' +
    '.sb-dw a,.sb-dw span.x{display:block;padding:8px 8px 8px 32px;border-radius:6px;color:inherit;text-decoration:none}' +
    '.sb-dw a.on{background:var(--fsec,#f5f5f4);font-weight:500}' +
    '.sb-dw span.x{color:var(--s400,#a8a29e)}';
  document.head.appendChild(dcss);

  var dw = document.createElement('div');
  dw.className = 'sb-dw';
  dw.setAttribute('role', 'dialog');
  dw.setAttribute('aria-label', 'Menu');
  dw.innerHTML = '<div class="bg"></div><nav class="pn"><div class="hd">Menu<button class="cl" aria-label="Fechar menu">×</button></div>' +
    OPERACAO.concat(SISTEMA).map(function (g) {
      return '<div class="g"><div class="gt">' + I[g.icon] + esc(g.label) + '</div>' + g.subs.map(function (s) {
        return s.href
          ? '<a href="' + s.href + '"' + (isOn(s) ? ' class="on" aria-current="page"' : '') + '>' + esc(s.label) + '</a>'
          : '<span class="x">' + esc(s.label) + '</span>';
      }).join('') + '</div>';
    }).join('') + '</nav>';
  var mount = function () { if (!dw.parentNode) document.body.appendChild(dw); };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  var close = function () { dw.classList.remove('open'); };
  dw.querySelector('.bg').addEventListener('click', close);
  dw.querySelector('.cl').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  /* captura antes dos handlers das páginas (que mostravam "Menu fora do escopo do protótipo") */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#mmenu,.mmenu');
    if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation();
    mount(); dw.classList.add('open');
  }, true);
})();
