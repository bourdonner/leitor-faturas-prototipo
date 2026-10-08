/* Toast da Style Guide Enershare (lib: Toast · Toast + Paddings).
   toast(título, opções) — opções: string = descrição, ou {desc, err, action:{label, onClick}, ms}.
   Padrão: fundo branco, borda brand, título Poppins Medium 14, descrição Inter 14, botão com borda, fechar no hover.
   err = variante Destructive (fundo #f43f5e, texto claro). Desktop: canto inferior direito, 16 px da borda; mobile: no topo. */
(function(){
  const CSS=`
  .tst{position:fixed;right:16px;bottom:16px;z-index:200;width:388px;max-width:calc(100vw - 32px);box-sizing:border-box;display:flex;align-items:center;gap:16px;padding:24px 32px 24px 24px;background:rgba(255,255,255,.92);-webkit-backdrop-filter:blur(25px);backdrop-filter:blur(25px);border:1px solid #71902f;border-radius:6px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);opacity:0;transform:translateY(16px);transition:opacity .2s,transform .2s;pointer-events:none}
  .tst.show{opacity:1;transform:none;pointer-events:auto}
  .tst .tst-c{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
  .tst .tst-t{font:500 14px/1.5 Poppins,Inter,sans-serif;color:#0c0a09}
  .tst .tst-d{font:400 14px/1.7 Inter,sans-serif;color:#0c0a09}
  .tst .tst-d:empty{display:none}
  .tst .tst-b{flex:none;height:32px;padding:4px 12px;border:1px solid #d6d3d1;border-radius:6px;background:none;font:500 14px/24px Geist,Inter,sans-serif;color:#0c0a09;cursor:pointer;white-space:nowrap}
  .tst .tst-b:hover{background:#f5f5f4}
  .tst .tst-b[hidden]{display:none}
  .tst .tst-x{position:absolute;right:4px;top:4px;width:24px;height:24px;border:0;border-radius:4px;background:none;display:grid;place-items:center;color:#0c0a09;cursor:pointer;opacity:0;transition:opacity .15s}
  .tst:hover .tst-x,.tst .tst-x:focus-visible{opacity:1}
  .tst.err{background:#f43f5e;border-color:#f43f5e}
  .tst.err .tst-t,.tst.err .tst-d{color:#fafaf9}
  .tst.err .tst-b{border-color:#fafaf9;color:#fff}
  .tst.err .tst-b:hover{background:rgba(255,255,255,.12)}
  @media (max-width:767px){ .tst{left:16px;right:16px;bottom:auto;top:16px;width:auto;max-width:none;transform:translateY(-16px)} .tst .tst-x{opacity:1;width:40px;height:40px;right:0;top:0} }
  @media (prefers-reduced-motion:reduce){ .tst{transition:none} }`;
  const st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
  let el=null, tm=0;
  const mk=()=>{ el=document.createElement('div'); el.className='tst'; el.setAttribute('role','status'); el.setAttribute('aria-live','polite');
    el.innerHTML='<div class="tst-c"><div class="tst-t"></div><div class="tst-d"></div></div><button type="button" class="tst-b" hidden></button><button type="button" class="tst-x" aria-label="Fechar aviso"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
    document.body.appendChild(el); el.querySelector('.tst-x').onclick=hide;
    el.onmouseenter=()=>clearTimeout(tm); el.onmouseleave=()=>{ tm=setTimeout(hide,1500); }; };
  function hide(){ if(el) el.classList.remove('show'); }
  window.toast=function(title, o){
    if(typeof o==='string') o={desc:o}; o=o||{};
    if(!el) mk();
    el.querySelector('.tst-t').textContent=title;
    el.querySelector('.tst-d').textContent=o.desc||'';
    const b=el.querySelector('.tst-b'); b.hidden=!o.action;
    if(o.action){ b.textContent=o.action.label; b.onclick=()=>{ hide(); o.action.onClick&&o.action.onClick(); }; }
    el.classList.toggle('err',!!o.err);
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
    clearTimeout(tm); tm=setTimeout(hide, o.ms || (o.desc||o.action ? 5000 : 3000));
  };
  window.ltoast=(t,d)=>window.toast(t,{desc:d});
})();
