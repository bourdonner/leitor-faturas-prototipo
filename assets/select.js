/* Select da Style Guide Enershare (Select + Dropdown Menu).
   O <select> nativo continua no DOM, escondido, guardando valor e disparando "change";
   por cima entra o gatilho e o menu flutuante no estilo da library. */
(function(){
  const CSS = `
  .cs{position:relative;display:block;width:100%}
  .cs select{position:absolute!important;inset:0;opacity:0;pointer-events:none;width:100%;height:100%}
  .cs-trig{width:100%;height:40px;display:flex;align-items:center;gap:16px;padding:0 12px;border:1px solid #d6d3d1;border-radius:6px;background:#fafaf9;font:400 14px/1.7 Inter,sans-serif;color:#0c0a09;text-align:left;cursor:pointer}
  .cs-trig:focus-visible,.cs.open .cs-trig{outline:2px solid #71902f;outline-offset:0;background:#fff}
  .cs-trig .cs-v{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .cs-trig.ph .cs-v{color:#78716c}
  .cs-trig img{width:16px;height:16px;flex:none;transition:transform .15s}
  .cs.open .cs-trig img{transform:rotate(180deg)}
  .cs-menu{position:fixed;z-index:1000;border:1px solid #fafaf9;border-radius:6px;overflow:hidden;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);background:#fff;animation:csIn .12s ease}
  .cs-menu .cs-sec{background:#fff;border-top:1px solid #f5f5f4;padding:4px;display:flex;flex-direction:column;max-height:280px;overflow:auto}
  .cs-opt{position:relative;min-width:128px;padding:6px 8px 6px 32px;border-radius:4px;font:400 14px/1.7 Inter,sans-serif;color:#0c0a09;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;background:#fff;border:0}
  .cs-opt:hover,.cs-opt.act{background:#f5f5f4}
  .cs-opt .ck{position:absolute;left:8px;top:50%;transform:translateY(-50%);font-family:"Material Symbols Rounded";font-size:16px;line-height:1;font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 20;display:none;-webkit-font-smoothing:antialiased}
  .cs-opt[aria-selected="true"] .ck{display:block}
  @keyframes csIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
  @media (prefers-reduced-motion:reduce){.cs-menu{animation:none}}`;
  const st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);

  const base = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/select\.js.*$/,'') : 'assets/';
  const CHEV = base+'chevron-down.svg';
  const CHECK = '<span class="ck" aria-hidden="true">check</span>';
  let open = null; // {wrap, sel, menu, items, idx}

  const opts = sel => [...sel.options].filter(o=>o.value!=='' && !o.hidden);
  const phText = sel => { const p=[...sel.options].find(o=>o.value===''); return p ? p.textContent : 'Selecione'; };

  function paint(wrap){
    const sel=wrap.querySelector('select'), t=wrap.querySelector('.cs-trig'), o=sel.selectedOptions[0];
    const has = o && o.value!=='';
    t.querySelector('.cs-v').textContent = has ? o.textContent : phText(sel);
    t.classList.toggle('ph', !has);
  }
  function close(focus){
    if(!open) return; const {wrap,menu}=open; menu.remove(); wrap.classList.remove('open');
    wrap.querySelector('.cs-trig').setAttribute('aria-expanded','false');
    if(focus) wrap.querySelector('.cs-trig').focus();
    open=null;
  }
  function choose(o){
    const {wrap,sel}=open; close(true);
    if(sel.value!==o.value){ sel.value=o.value; paint(wrap); sel.dispatchEvent(new Event('input',{bubbles:true})); sel.dispatchEvent(new Event('change',{bubbles:true})); }
  }
  function setAct(i){
    if(!open) return; open.idx=Math.max(0,Math.min(open.items.length-1,i));
    open.items.forEach((b,k)=>b.classList.toggle('act',k===open.idx));
    open.items[open.idx]?.scrollIntoView({block:'nearest'});
  }
  function place(){
    if(!open) return; const r=open.wrap.querySelector('.cs-trig').getBoundingClientRect(), m=open.menu;
    m.style.minWidth=r.width+'px'; m.style.left=r.left+'px';
    const h=m.offsetHeight, below=innerHeight-r.bottom;
    m.style.top = (below < h+8 && r.top > h+8) ? (r.top-h-4)+'px' : (r.bottom+4)+'px';
  }
  function openMenu(wrap){
    if(open && open.wrap===wrap){ close(true); return; }
    close();
    const sel=wrap.querySelector('select'), list=opts(sel);
    const menu=document.createElement('div'); menu.className='cs-menu'; menu.setAttribute('role','listbox');
    const sec=document.createElement('div'); sec.className='cs-sec'; menu.appendChild(sec);
    const items=list.map(o=>{ const b=document.createElement('button'); b.type='button'; b.className='cs-opt'; b.setAttribute('role','option');
      b.setAttribute('aria-selected', String(o.selected && o.value!=='')); b.innerHTML=CHECK; b.append(o.textContent);
      b.onmousedown=e=>e.preventDefault(); b.onclick=()=>choose(o); b.onmouseenter=()=>setAct(items.indexOf(b)); sec.appendChild(b); return b; });
    document.body.appendChild(menu);
    wrap.classList.add('open'); wrap.querySelector('.cs-trig').setAttribute('aria-expanded','true');
    open={wrap,sel,menu,items,list,idx:0};
    place(); setAct(Math.max(0,list.findIndex(o=>o.selected)));
  }
  function enhance(sel){
    if(sel.dataset.cs) return; sel.dataset.cs='1'; sel.tabIndex=-1; sel.setAttribute('aria-hidden','true');
    const wrap=document.createElement('span'); wrap.className='cs';
    sel.parentNode.insertBefore(wrap, sel); wrap.appendChild(sel);
    const t=document.createElement('button'); t.type='button'; t.className='cs-trig';
    t.setAttribute('aria-haspopup','listbox'); t.setAttribute('aria-expanded','false');
    const lab = sel.id && document.querySelector(`label[for="${sel.id}"]`);
    if(lab){ lab.htmlFor=''; lab.onclick=()=>t.focus(); t.setAttribute('aria-label', lab.textContent.trim()); }
    t.innerHTML=`<span class="cs-v"></span><img src="${CHEV}" alt="">`;
    wrap.appendChild(t); paint(wrap);
    t.onclick=()=>openMenu(wrap);
    t.onkeydown=e=>{
      const isOpen = open && open.wrap===wrap;
      if(['ArrowDown','ArrowUp'].includes(e.key)){ e.preventDefault(); if(!isOpen) openMenu(wrap); else setAct(open.idx+(e.key==='ArrowDown'?1:-1)); }
      else if(e.key==='Enter'||e.key===' '){ e.preventDefault(); if(isOpen) choose(open.list[open.idx]); else openMenu(wrap); }
      else if(e.key==='Escape' && isOpen){ e.preventDefault(); e.stopPropagation(); close(true); }
      else if(e.key==='Tab') close();
      else if(isOpen && e.key.length===1){ const i=open.list.findIndex(o=>o.textContent.toLowerCase().startsWith(e.key.toLowerCase())); if(i>=0) setAct(i); }
    };
    sel.addEventListener('change',()=>paint(wrap));
    if(sel.form) sel.form.addEventListener('reset',()=>setTimeout(()=>paint(wrap)));
  }
  const scan = root => (root.querySelectorAll ? root.querySelectorAll('select') : []).forEach(enhance);
  document.addEventListener('mousedown',e=>{ if(open && !open.menu.contains(e.target) && !open.wrap.contains(e.target)) close(); });
  addEventListener('resize',()=>close());
  document.addEventListener('scroll',e=>{ if(open && !open.menu.contains(e.target)) close(); }, true);
  new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{ if(n.nodeType!==1) return; if(n.tagName==='SELECT') enhance(n); else scan(n); }))).observe(document.documentElement,{childList:true,subtree:true});
  scan(document);
  window.csRefresh = () => document.querySelectorAll('.cs').forEach(paint);
})();
