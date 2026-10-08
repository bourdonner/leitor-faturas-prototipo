/* Validar UC da fatura (Figma: Detalhe › V2 Identity · 1971:20200, 1977:28098, 1972:20920, 1972:21849, 1973:22387).
   Lib: Card Base/Card Header (md) · Combobox · Command Base (Search + CMDK Item Radio) · Button · Info Pill.
   Regra: a distribuidora vem do cadastro da UC; se não for a mesma da fatura, a unidade não confere e não valida.
   Uso: Identity.mount(el, state, onChange) — state = {read, uc, ok, sent}; chame de novo para redesenhar. */
(function(){
  /* seletores prefixados com .idf-c: vencem estilos genéricos de botão de quem usa o componente.
     valores do Figma (Detalhe › UC validation): bloco hover:secondary #f5f5f4, raio 16, padding 16 como os outros cards grandes (validada: 16 no desktop, 12 no mobile), gap 16 */
  const CSS=`
  .idf-c .idf{background:#f5f5f4;border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:16px;font:400 14px/1.7 Inter,sans-serif;color:#1c1917}
  .idf-c .idf-h{display:flex;flex-direction:column;gap:6px}
  .idf-c .idf-h b{display:block;font:600 20px/1.2 Poppins,Inter,sans-serif;color:#292524}
  .idf-c .idf-h span{display:block;font-size:14px;line-height:1.7;color:#78716c}
  .idf-c .idf.bad .idf-h b,.idf-c .idf.bad .idf-l,.idf-c .idf.bad .idf-help{color:#f43f5e}
  .idf-c .idf-r{display:flex;flex-direction:column;gap:16px;align-items:flex-start}
  .idf-c .idf-f{width:100%;min-width:0;display:flex;flex-direction:column;gap:8px;position:relative}
  /* desktop (Figma 1971:20200, 08/10): cabeçalho de painel — badge laranja + título 14 regular + minimizar; sem rótulo visível e sem ajuda (só o erro) */
  .idf-c .idf-ph{display:flex;align-items:center;gap:8px;min-height:28px}
  .idf-c .idf-ph .bd{width:20px;height:20px;border-radius:6px;background:#f97316;color:#fff;display:grid;place-items:center;flex:none}
  .idf-c .idf-ph .bd .ms{font-family:"Material Symbols Rounded";font-size:12px;font-style:normal;line-height:1;font-variation-settings:"FILL" 1}
  .idf-c .idf-ph .t{flex:1;min-width:0;font-size:14px;line-height:1.7}
  .idf-c .idf-ph .mn{width:28px;height:28px;border-radius:6px;border:0;background:#fafaf9;color:#1c1917;display:grid;place-items:center;cursor:pointer;flex:none}
  .idf-c .idf-ph .mn .ms{font-family:"Material Symbols Rounded";font-size:16px;font-style:normal;line-height:1}
  .idf-c .idf-h{display:none}
  .idf-c .idf-l{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .idf-c .idf:not(.bad) .idf-help{display:none}
  .idf-c .idf-l{font-size:14px;line-height:1.7;font-weight:400}
  .idf-c .idf-t{height:44px;display:flex;align-items:center;padding:10px 12px;border:1px solid #d6d3d1;border-radius:6px;background:#fafaf9;text-align:left;width:100%;font:inherit;color:#1c1917;cursor:pointer}
  .idf-c .idf-t .v{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .idf-c .idf-t .v.ph{color:#78716c}
  .idf-c .idf-t svg{flex:none;margin-left:16px;color:#1c1917}
  .idf-c .idf-t:focus-visible,.idf-c .idf-t[aria-expanded=true]{outline:0;border-color:#1c1917;box-shadow:0 0 0 1px #1c1917}
  .idf-c .idf-help{font-size:12px;line-height:1.4;color:#78716c}
  .idf-c .idf.bad .idf-help{font-size:14px;line-height:1.7}
  .idf-c .idf-b{height:40px;padding:8px 16px;border-radius:6px;border:0;background:#1c1917;color:#fafaf9;font:400 14px/1.7 Inter,sans-serif;cursor:pointer;white-space:nowrap;flex:none}
  .idf-c .idf-b:disabled{opacity:.5;cursor:not-allowed}
  .idf-c .idf-pop{position:absolute;z-index:30;top:101px;left:0;right:0;background:#fff;border:1px solid #f5f5f4;border-radius:8px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);overflow:hidden;animation:idfIn .12s ease}
 @keyframes idfIn{from{opacity:0;transform:translateY(-4px)}}
  .idf-c .idf-s{display:flex;align-items:center;gap:8px;height:44px;padding:10px 12px;border-bottom:1px solid #f5f5f4}
  .idf-c .idf-s .ms{font-family:"Material Symbols Rounded";font-size:16px;color:#1c1917;font-style:normal;line-height:1}
  .idf-c .idf-s input{flex:1;border:0;outline:0;font:inherit;background:none;color:#1c1917}
  .idf-c .idf-s input::placeholder{color:#78716c}
  .idf-c .idf-ls{padding:4px;max-height:240px;overflow:auto}
  .idf-c .idf-o{display:flex;align-items:center;gap:8px;width:100%;height:36px;padding:6px 8px 6px 32px;border:0;background:#fff;border-radius:4px;font:400 14px/1.7 Inter,sans-serif;color:#1c1917;text-align:left;cursor:pointer}
  .idf-c .idf-o .tx{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .idf-c .idf-o .ms{font-family:"Material Symbols Rounded";font-size:16px;font-style:normal;line-height:1;color:#1c1917}
  .idf-c .idf-o:hover,.idf-c .idf-o.act{background:#f5f5f4}
  .idf-c .idf-none{padding:8px 8px 8px 32px;font-size:14px;color:#78716c}
  /* validada / enviada: bloco padding 12; pílula 48 px, fundo view only rgba(245,245,244,.4), ícone verified #65a30d, texto Inter Bold 14 */
  .idf-c .idf.ok{flex-direction:row;align-items:center;gap:8px;padding:16px}
  .idf-c .idf-pill{display:inline-flex;align-items:center;gap:12px;height:48px;padding:12px 16px 12px 12px;border-radius:999px;background:rgba(245,245,244,.4);font:700 14px/1.7 Inter,sans-serif;color:#1c1917;min-width:0}
  .idf-c .idf-pill .ms{font-family:"Material Symbols Rounded";font-size:20px;font-style:normal;line-height:1;color:#65a30d;font-variation-settings:"FILL" 1}
  .idf-c .idf-pill .tx{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .idf-c .idf-pill.lock .ms{color:#78716c}
  .idf-c .idf-sp{flex:1}
  .idf-c .idf-g{height:36px;padding:6px 12px;border:0;background:none;border-radius:6px;font:400 14px/1.7 Inter,sans-serif;color:#1c1917;cursor:pointer;flex:none}
  .idf-c .idf-g:hover{background:#e7e5e4}
  /* estreito (mobile, Figma M1): padding 16 e botão em largura total abaixo do campo — pela largura do espaço, não da janela */
  .idf-c{container-type:inline-size}
 @container (max-width:519px){
    .idf-c .idf{padding:16px}
    .idf-c .idf-r{flex-direction:column;align-items:stretch}
    .idf-c .idf-ph{display:none}
    .idf-c .idf-h{display:flex}
    .idf-c .idf-l{position:static;width:auto;height:auto;overflow:visible;clip:auto}
    .idf-c .idf:not(.bad) .idf-help{display:block}
    .idf-c .idf.ok{padding:12px}
    .idf-c .idf-pill{height:auto}
    .idf-c .idf-pill .tx{white-space:normal}
  }`;
  const st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);

  const INV={dist:'Luz do Vale', read:'UC 3014567890 · Luz do Vale'}; // o que a leitura achou na fatura
  const UCS=[
    {uc:'3014567890',dist:'Luz do Vale',tit:'Padaria Estrela do Sul Ltda'},
    {uc:'3014567811',dist:'Luz do Vale',tit:'Padaria Estrela do Sul Ltda'},
    {uc:'3014002210',dist:'Força Sul',tit:'Mercado Bom Preço'},
    {uc:'3014998876',dist:'Luz do Vale',tit:'Estrela Confeitaria'}];
  const of=id=>UCS.find(u=>u.uc===id), lab=u=>`UC ${u.uc} · ${u.dist}`;
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);

  function mount(el,S,onChange){
    const u=of(S.uc), bad=!!(u && u.dist!==INV.dist);
    const nr='';
    if(S.sent){ el.innerHTML=`<div class="idf-c"><div class="idf ok ${nr}"><span class="idf-pill lock"><span class="ms" aria-hidden="true">lock</span><span class="tx">Enviada para faturamento no dia ${esc(S.sent.at)}</span></span></div></div>`; return; }
    if(S.ok){ el.innerHTML=`<div class="idf-c"><div class="idf ok ${nr}"><span class="idf-pill"><span class="ms" aria-hidden="true">verified</span><span class="tx">UC ${esc(u.uc)} validada · ${esc(u.dist)}</span></span><span class="idf-sp"></span><button class="idf-g" data-alt>Alterar</button></div></div>`;
      el.querySelector('[data-alt]').onclick=()=>{ S.ok=false; onChange('alterar'); el.querySelector('.idf-t')?.focus(); }; return; }
    const title = bad ? 'A unidade não confere com a fatura' : S.read ? 'Confirme a unidade da fatura' : 'Vincule a unidade da fatura';
    const desc  = bad ? 'Escolha outra unidade para liberar a edição dos dados coletados.'
                : S.read ? 'Encontramos a unidade pela leitura. Valide para liberar a edição dos dados coletados.'
                : 'A leitura não encontrou a unidade no cadastro. Escolha uma para liberar a edição dos dados coletados.';
    const help  = bad ? `A fatura é da ${INV.dist}, mas esta unidade é da ${u.dist}.`
                : (S.read && S.uc===S.read) ? 'Encontrada pela leitura da fatura.' : `Lida na fatura: ${INV.read}`;
    el.innerHTML=`<div class="idf-c"><div class="idf ${bad?'bad':''} ${nr}"><div class="idf-ph"><span class="bd"><span class="ms" aria-hidden="true">warning</span></span><span class="t">${title}</span><button type="button" class="mn" data-toggle="det" aria-label="Minimizar detalhes"><span class="ms" aria-hidden="true">hide</span></button></div><div class="idf-h"><b>${title}</b><span>${desc}</span></div>
      <div class="idf-r"><div class="idf-f"><span class="idf-l" id="idfL">Unidade Consumidora e Distribuidora</span>
        <button type="button" class="idf-t" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="idfL idfV" ${bad?'aria-invalid="true" aria-describedby="idfH"':''}><span class="v ${u?'':'ph'}" id="idfV">${u?esc(lab(u)):'Escolher unidade…'}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg></button>
        <span class="idf-help" id="idfH" ${bad?'role="alert"':''}>${esc(help)}</span></div>
        <button class="idf-b" data-ok ${!u||bad?'disabled':''}>Validar alterações</button></div></div></div>`;
    const t=el.querySelector('.idf-t'), f=el.querySelector('.idf-f');
    el.querySelector('[data-ok]').onclick=()=>{ S.ok=true; onChange('validar'); };
    const close=back=>{ f.querySelector('.idf-pop')?.remove(); t.setAttribute('aria-expanded','false'); document.removeEventListener('mousedown',out); if(back) t.focus(); };
    const out=e=>{ if(!f.contains(e.target)) close(); };
    const open=()=>{ if(f.querySelector('.idf-pop')) return close(true);
      const p=document.createElement('div'); p.className='idf-pop';
      p.innerHTML=`<div class="idf-s"><span class="ms" aria-hidden="true">search</span><input aria-label="Buscar unidade" placeholder="Buscar por UC, distribuidora ou titular" role="combobox" aria-expanded="true" aria-controls="idfLs" autocomplete="off"></div><div class="idf-ls" id="idfLs" role="listbox"></div>`;
      f.appendChild(p); t.setAttribute('aria-expanded','true');
      const h=f.querySelector('.idf-help'), ref=h.offsetParent?h:t; p.style.top=(ref.offsetTop+ref.offsetHeight+4)+'px'; // abre logo abaixo da ajuda; sem ajuda visível, abaixo do campo (Figma)
      const q=p.querySelector('input'), ls=p.querySelector('.idf-ls'); let act=-1, shown=[]; // nada destacado até usar as setas (Figma)
      const draw=()=>{ const s=q.value.trim().toLowerCase();
        shown=UCS.filter(x=>!s||`${x.uc} ${x.dist} ${x.tit}`.toLowerCase().includes(s));
        act=Math.min(act,shown.length-1);
        ls.innerHTML=shown.length?shown.map((x,i)=>`<button type="button" role="option" id="idfo${i}" aria-selected="${x.uc===S.uc}" class="idf-o ${i===act?'act':''}" data-uc="${x.uc}"><span class="tx">${esc(lab(x))} · ${esc(x.tit)}</span><span class="ms" aria-hidden="true">${x.uc===S.uc?'radio_button_checked':'radio_button_unchecked'}</span></button>`).join('')
          : '<div class="idf-none">Nenhuma unidade encontrada</div>';
        if(act>=0) q.setAttribute('aria-activedescendant','idfo'+act); else q.removeAttribute('aria-activedescendant');
        ls.querySelectorAll('[data-uc]').forEach(b=>b.onclick=()=>pick(b.dataset.uc)); };
      const pick=id=>{ close(); S.uc=id; onChange('escolher'); el.querySelector('.idf-t')?.focus(); };
      q.oninput=()=>{ act=-1; draw(); };
      q.onkeydown=e=>{ if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); act=Math.max(0,Math.min(shown.length-1,act+(e.key==='ArrowDown'?1:-1))); draw(); ls.querySelector('.act')?.scrollIntoView({block:'nearest'}); }
        else if(e.key==='Enter'){ e.preventDefault(); const o=shown[Math.max(act,0)]; if(o) pick(o.uc); }
        else if(e.key==='Escape'){ e.preventDefault(); close(true); }
        else if(e.key==='Tab') close(); };
      draw(); q.focus(); setTimeout(()=>document.addEventListener('mousedown',out)); };
    t.onclick=open;
    t.onkeydown=e=>{ if(e.key==='ArrowDown'){ e.preventDefault(); open(); } };
  }
  window.Identity={mount, UCS, INV, label:id=>{ const u=of(id); return u?lab(u):''; }};
})();
