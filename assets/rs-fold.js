/* Resumo: card recolhido compacto + animação entre recolhido e aberto.
   Padrão da lib Enershare (Summary Card / *, Collapsed=True, base do Erick em 05/11):
   cabeçalho de 52px numa linha só — ícone 20px, título 14 bold • detalhe 14 regular, sem o atalho de abrir.
   Vale para qualquer [data-fold] que alterna a classe .closed (Contas a Faturar, Usinas, Tickets, Comentários).
   A animação é FLIP: guarda as posições no clique (fase de captura), deixa a página trocar a classe,
   mede o estado final sem transições e anima de um para o outro (altura do card, ícone, textos, chevron e corpo). */
(() => {
  if (window.__rsFold) return; window.__rsFold = true;

  const css = `
.fp.fp [data-fold].closed>:is(.rs-hd,.act-h){padding:12px 16px}
.fp.fp [data-fold].closed>:is(.rs-hd,.act-h) .eb{width:20px;height:20px}
.fp.fp [data-fold].closed>:is(.rs-hd,.act-h) .eb .msr{font-size:12px}
.fp.fp [data-fold].closed>.rs-hd .t{flex-direction:row;align-items:center;gap:8px}
.fp.fp [data-fold].closed>.rs-hd .t b{font-size:14px;line-height:24px;flex:0 1 auto;min-width:0}
.fp.fp [data-fold].closed>.rs-hd .t .cap{display:block;flex:0 0 auto;max-width:65%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;line-height:24px;letter-spacing:0}
.fp.fp [data-fold].closed>.rs-hd .t .cap::before{content:"";display:inline-block;vertical-align:middle;width:4px;height:4px;margin:0 8px 2px 0;border-radius:50%;background:currentColor}
.fp.fp [data-fold].closed>.rs-hd>.ib:not([data-a*="fold"]){display:none}
.fp.fp [data-fold].closed>.act-h{font-size:14px}
.fp.fp [data-fold].closed>.rs-bd.keep{padding:0 16px 12px}
.fp .rsf-now,.fp .rsf-now *{transition:none!important}
.fp .rsf-hold .rsf-b{grid-template-rows:1fr!important;opacity:1!important;pointer-events:none}
.fp .rsf-hold .bd.rsf-b{display:flex!important}`;
  const st = document.createElement('style'); st.id = 'rs-fold-css'; st.textContent = css; document.head.appendChild(st);

  const DUR = 320, EASE = 'cubic-bezier(.2,.7,.2,1)';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const head = c => c.querySelector(':scope>.rs-hd,:scope>.act-h');
  const bodyOf = c => c.querySelector(':scope>.rs-bd>.rs-cl,:scope>.rs-cl,:scope>.bd');
  const items = c => { const h = head(c); if (!h) return [];
    const a = []; for (const ch of h.children) { if (ch.classList.contains('t')) a.push(...ch.children); else a.push(ch); }
    const keep = c.querySelector(':scope>.rs-bd.keep'); if (keep) for (const ch of keep.children) if (!ch.classList.contains('rs-cl')) a.push(ch);
    return a; };
  const rel = (el, o) => { const r = el.getBoundingClientRect(); return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height, on: r.width > 0 || r.height > 0, fs: parseFloat(getComputedStyle(el).fontSize) }; };
  const chevDeg = c => c.classList.contains('closed') ? 180 : 0;

  let snap = null; const clean = new WeakMap();
  function take(c) { const o = c.getBoundingClientRect(); if (!o.height) return null;
    const m = new Map(); items(c).forEach(el => m.set(el, rel(el, o)));
    const b = bodyOf(c); return { h: o.height, closed: c.classList.contains('closed'), m, body: b ? rel(b, o) : null }; }

  document.addEventListener('click', e => {
    if (reduce.matches || !e.target.closest || !e.target.closest('[data-a*="fold"]')) return;
    snap = new Map();
    document.querySelectorAll('[data-fold]').forEach(c => { const f = clean.get(c); if (f) f(); const s = take(c); if (s) snap.set(c, s); });
    setTimeout(() => { snap = null; }, 60);
  }, true);

  function play(c, s) {
    const closing = c.classList.contains('closed');
    c.classList.add('rsf-now');
    const o = c.getBoundingClientRect(), newH = o.height;
    const after = new Map(); items(c).forEach(el => after.set(el, rel(el, o)));
    const anims = [], opt = { duration: DUR, easing: EASE };
    const prev = { pos: c.style.position, ov: c.style.overflow };
    c.style.position = 'relative'; c.style.overflow = 'clip';
    anims.push(c.animate([{ height: s.h + 'px' }, { height: newH + 'px' }], opt));
    after.forEach((a, el) => { const b = s.m.get(el);
      if (!a.on) return;
      if (!b || !b.on) { anims.push(el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: DUR * .6, delay: DUR * .3, easing: 'ease', fill: 'backwards' })); return; }
      const k = el.classList.contains('eb') ? b.w / a.w : (b.fs && a.fs ? b.fs / a.fs : 1);
      const dx = b.x - a.x, dy = b.y - a.y;
      if (Math.abs(dx) < .5 && Math.abs(dy) < .5 && Math.abs(k - 1) < .01) return;
      anims.push(el.animate([{ transformOrigin: '0 0', transform: `translate(${dx}px,${dy}px) scale(${k})` }, { transformOrigin: '0 0', transform: 'none' }], opt));
    });
    const chev = c.querySelector(':scope>:is(.rs-hd,.act-h) .chev');
    if (chev) anims.push(chev.animate([{ transform: `rotate(${s.closed ? 180 : 0}deg)` }, { transform: `rotate(${chevDeg(c)}deg)` }], opt));
    const body = bodyOf(c); let held = null;
    if (body && closing && s.body && s.body.on) {
      held = body; body.classList.add('rsf-b'); c.classList.add('rsf-hold');
      Object.assign(body.style, { position: 'absolute', left: s.body.x + 'px', top: s.body.y + 'px', width: s.body.w + 'px', height: s.body.h + 'px' });
      anims.push(body.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: DUR * .55, easing: 'ease', fill: 'forwards' }));
    } else if (body && !closing) {
      anims.push(body.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: DUR * .8, delay: DUR * .15, easing: EASE, fill: 'backwards' }));
    }
    let done = false;
    const fin = () => { if (done) return; done = true; clean.delete(c);
      anims.forEach(a => { try { a.cancel(); } catch (_) {} });
      if (held) { held.classList.remove('rsf-b'); ['position', 'left', 'top', 'width', 'height'].forEach(p => held.style[p] = ''); }
      c.classList.remove('rsf-hold'); void c.offsetHeight; c.classList.remove('rsf-now'); c.style.position = prev.pos; c.style.overflow = prev.ov; };
    clean.set(c, fin);
    anims[0].finished.then(fin, () => {}); setTimeout(fin, DUR + 150);
  }

  new MutationObserver(list => {
    if (!snap) return;
    const seen = new Set();
    list.forEach(m => { const c = m.target; if (seen.has(c) || !snap.has(c)) return; seen.add(c);
      const s = snap.get(c); if (s.closed !== c.classList.contains('closed')) { snap.delete(c); play(c, s); } });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'], subtree: true });
})();
