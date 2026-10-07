/* Validar UC da fatura (Figma: Detalhe › V2 Identity · 1971:20200, 1977:28098, 1972:20920, 1972:21849, 1973:22387).
   Lib: Card Base/Card Header (md) · Combobox · Command Base (Search + CMDK Item Radio) · Button · Info Pill.
   Regra: a distribuidora vem do cadastro da UC; se não for a mesma da fatura, a unidade não confere e não valida.
   Uso: Identity.mount(el, state, onChange) — state = {read, uc, ok, sent}; chame de novo para redesenhar. */
(function(){
  const CSS=`
  .idf{background:#f5f5f4;border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:16px;font:400 14px/1.5 Inter,sans-serif;color:#1c1917}
  .idf-h b{display:block;font:600 18px/1.3 Poppins,Inter,sans-serif}
  .idf-h span{display:block;font-size:13px;color:#78716c;margin-top:4px}
  .idf.bad .idf-h b,.idf.bad .idf-l{color:#e11d48}
  .idf-r{display:flex;gap:12px;align-items:flex-start}
  .idf-f{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px;position:relative}
  .idf-l{font-size:13px;font-weight:500}
  .idf-t{height:40px;display:flex;align-items:center;gap:8px;padding:0 12px;border:1px solid #d6d3d1;border-radius:6px;background:#fafaf9;text-align:left;width:100%;font:inherit;color:inherit;cursor:pointer}
  .idf-t .v{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .idf-t .v.ph{color:#78716c}
  .idf-t .ms{font-family:"Material Symbols Rounded";font-size:18px;color:#78716c;font-style:normal;line-height:1}
  .idf-t:focus-visible,.idf-t[aria-expanded=true]{outline:2px solid #1c1917;outline-offset:-1px;background:#fff}
  .idf.bad .idf-t{border-color:#e11d48}
  .idf-help{font-size:12px;color:#78716c}
  .idf.bad .idf-help{color:#e11d48;font-size:13px}
  .idf-b{height:40px;margin-top:27px;padding:0 16px;border-radius:6px;border:0;background:#1c1917;color:#fff;font:500 14px Inter,sans-serif;cursor:pointer;white-space:nowrap}
  .idf-b:disabled{background:#8a8988;cursor:not-allowed}
  .idf-pop{position:absolute;z-index:30;top:70px;left:0;right:0;background:#fff;border-radius:8px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);overflow:hidden;animation:idfIn .12s ease}
  @keyframes idfIn{from{opacity:0;transform:translateY(-4px)}}
  .idf-s{display:flex;align-items:center;gap:8px;height:44px;padding:0 12px;border-bottom:1px solid #f5f5f4}
  .idf-s .ms{font-family:"Material Symbols Rounded";font-size:18px;color:#1c1917;font-style:normal}
  .idf-s input{flex:1;border:0;outline:0;font:inherit;background:none}
  .idf-ls{padding:4px;max-height:240px;overflow:auto}
  .idf-o{display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px 8px 24px;border:0;background:none;border-radius:4px;font:inherit;color:inherit;text-align:left;cursor:pointer}
  .idf-o .tx{flex:1;min-width:0}
  .idf-o .ms{font-family:"Material Symbols Rounded";font-size:18px;font-style:normal;color:#1c1917}
  .idf-o:hover,.idf-o.act{background:#f5f5f4}
  .idf-none{padding:12px 24px;font-size:13px;color:#78716c}
  .idf.ok{flex-direction:row;align-items:center;padding:8px 8px 8px 16px;min-height:48px} /* enviada (sem Alterar) tem a mesma altura da validada */
  .idf-pill{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;flex:1;min-width:0}
  .idf-pill .ms{font-family:"Material Symbols Rounded";font-size:20px;font-style:normal;color:#5ea500;font-variation-settings:"FILL" 1}
  .idf-pill.lock .ms{color:#78716c}
  .idf-g{height:32px;padding:0 12px;border:0;background:none;border-radius:6px;font:500 14px Inter,sans-serif;cursor:pointer}
  .idf-g:hover{background:#e7e5e4}
  @media (max-width:767px){.idf-r{flex-direction:column;align-items:stretch}.idf-b{margin-top:0}.idf-pop{top:70px}}`;
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
    if(S.sent){ el.innerHTML=`<div class="idf ok"><span class="idf-pill lock"><span class="ms" aria-hidden="true">lock</span>Enviada para faturamento · ${esc(S.sent.at)} · ${esc(lab(u))}</span></div>`; return; }
    if(S.ok){ el.innerHTML=`<div class="idf ok"><span class="idf-pill"><span class="ms" aria-hidden="true">check_circle</span>UC ${esc(u.uc)} validada · ${esc(u.dist)}</span><button class="idf-g" data-alt>Alterar</button></div>`;
      el.querySelector('[data-alt]').onclick=()=>{ S.ok=false; onChange('alterar'); el.querySelector('.idf-t')?.focus(); }; return; }
    const title = bad ? 'A unidade não confere com a fatura' : S.read ? 'Confirme a unidade da fatura' : 'Vincule a unidade da fatura';
    const desc  = bad ? 'Escolha outra unidade para liberar a edição dos dados coletados.'
                : S.read ? 'Encontramos a unidade pela leitura. Valide para liberar a edição dos dados coletados.'
                : 'A leitura não encontrou a unidade no cadastro. Escolha uma para liberar a edição dos dados coletados.';
    const help  = bad ? `A fatura é da ${INV.dist}, mas esta unidade é da ${u.dist}.`
                : (S.read && S.uc===S.read) ? 'Encontrada pela leitura da fatura.' : `Lida na fatura: ${INV.read}`;
    el.innerHTML=`<div class="idf ${bad?'bad':''}"><div class="idf-h"><b>${title}</b><span>${desc}</span></div>
      <div class="idf-r"><div class="idf-f"><span class="idf-l" id="idfL">Unidade Consumidora e Distribuidora</span>
        <button type="button" class="idf-t" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="idfL idfV" ${bad?'aria-invalid="true" aria-describedby="idfH"':''}><span class="v ${u?'':'ph'}" id="idfV">${u?esc(lab(u)):'Escolher unidade…'}</span><span class="ms" aria-hidden="true">unfold_more</span></button>
        <span class="idf-help" id="idfH" ${bad?'role="alert"':''}>${esc(help)}</span></div>
        <button class="idf-b" data-ok ${!u||bad?'disabled':''}>Validar alterações</button></div></div>`;
    const t=el.querySelector('.idf-t'), f=el.querySelector('.idf-f');
    el.querySelector('[data-ok]').onclick=()=>{ S.ok=true; onChange('validar'); };
    const close=back=>{ f.querySelector('.idf-pop')?.remove(); t.setAttribute('aria-expanded','false'); document.removeEventListener('mousedown',out); if(back) t.focus(); };
    const out=e=>{ if(!f.contains(e.target)) close(); };
    const open=()=>{ if(f.querySelector('.idf-pop')) return close(true);
      const p=document.createElement('div'); p.className='idf-pop';
      p.innerHTML=`<div class="idf-s"><span class="ms" aria-hidden="true">search</span><input aria-label="Buscar unidade" placeholder="Buscar por UC, distribuidora ou titular" role="combobox" aria-expanded="true" aria-controls="idfLs" autocomplete="off"></div><div class="idf-ls" id="idfLs" role="listbox"></div>`;
      f.appendChild(p); t.setAttribute('aria-expanded','true');
      const q=p.querySelector('input'), ls=p.querySelector('.idf-ls'); let act=0, shown=[];
      const draw=()=>{ const s=q.value.trim().toLowerCase();
        shown=UCS.filter(x=>!s||`${x.uc} ${x.dist} ${x.tit}`.toLowerCase().includes(s));
        act=Math.max(0,Math.min(act,shown.length-1));
        ls.innerHTML=shown.length?shown.map((x,i)=>`<button type="button" role="option" id="idfo${i}" aria-selected="${x.uc===S.uc}" class="idf-o ${i===act?'act':''}" data-uc="${x.uc}"><span class="tx">${esc(lab(x))} · ${esc(x.tit)}</span><span class="ms" aria-hidden="true">${x.uc===S.uc?'radio_button_checked':'radio_button_unchecked'}</span></button>`).join('')
          : '<div class="idf-none">Nenhuma unidade encontrada</div>';
        if(shown.length) q.setAttribute('aria-activedescendant','idfo'+act);
        ls.querySelectorAll('[data-uc]').forEach(b=>b.onclick=()=>pick(b.dataset.uc)); };
      const pick=id=>{ close(); S.uc=id; onChange('escolher'); el.querySelector('.idf-t')?.focus(); };
      q.oninput=()=>{ act=0; draw(); };
      q.onkeydown=e=>{ if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); act+=e.key==='ArrowDown'?1:-1; draw(); ls.querySelector('.act')?.scrollIntoView({block:'nearest'}); }
        else if(e.key==='Enter'){ e.preventDefault(); if(shown[act]) pick(shown[act].uc); }
        else if(e.key==='Escape'){ e.preventDefault(); close(true); }
        else if(e.key==='Tab') close(); };
      draw(); q.focus(); setTimeout(()=>document.addEventListener('mousedown',out)); };
    t.onclick=open;
    t.onkeydown=e=>{ if(e.key==='ArrowDown'){ e.preventDefault(); open(); } };
  }
  window.Identity={mount, UCS, INV, label:id=>{ const u=of(id); return u?lab(u):''; }};
})();
