/* Seletor de período — lib: Calendar (Type=Date Range) + Calendar Base (Selected · Range · Alignment).
   DateRange.mount(el, {from, to, view, months, onPick(from,to)}) desenha o calendário dentro de el.
   1º clique = início, 2º = fim (se for antes do início, os dois trocam); passando o mouse mostra o intervalo.
   Células 36×33, Poppins 14; início/fim #1c1917 com texto claro; meio do intervalo #f5f5f4 sem raio. */
(function(){
  const CSS=`
  .drp{display:flex;gap:24px;font:400 14px/1.5 Inter,sans-serif;color:#0c0a09}
  .drp .drp-m{display:flex;flex-direction:column;gap:8px}
  .drp .drp-h{position:relative;display:flex;align-items:center;justify-content:center;height:28px;font:500 16px/1.5 Poppins,Inter,sans-serif;text-transform:capitalize}
  .drp .drp-nav{height:28px;padding:0;position:absolute;top:0;width:28px;height:28px;border:1px solid #e7e5e4;border-radius:6px;background:#fff;display:grid;place-items:center;cursor:pointer;color:#0c0a09;padding:0}
  .drp .drp-nav:hover{background:#f5f5f4}
  .drp .drp-nav.p{left:0} .drp .drp-nav.n{right:0}
  .drp .drp-g{display:grid;grid-template-columns:repeat(7,36px);row-gap:4px}
  .drp .drp-w{height:24px;display:grid;place-items:center;font:400 12px/1 Poppins,Inter,sans-serif;color:#78716c}
  .drp .drp-d{position:static;display:block;text-align:center;width:36px;height:33px;border:0;padding:0;background:none;border-radius:6px;font:500 14px/1 Poppins,Inter,sans-serif;color:#0c0a09;cursor:pointer}
  .drp .drp-d:hover{background:#f5f5f4}
  .drp .drp-d:focus-visible{outline:2px solid #71902f;outline-offset:-2px}
  .drp .drp-d.out{color:#a8a29e;font-weight:400}
  .drp .drp-d.in{background:#f5f5f4;border-radius:0}
  .drp .drp-d.in.l{border-radius:6px 0 0 6px} .drp .drp-d.in.r{border-radius:0 6px 6px 0} .drp .drp-d.in.l.r{border-radius:6px}
  .drp .drp-d.end{background:#1c1917;color:#fafaf9;border-radius:6px}
  .drp .drp-d.today:not(.end){text-decoration:underline;text-underline-offset:3px}`;
  const st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
  const MES=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const DOW=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const day=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate());
  const same=(a,b)=>a&&b&&a.getTime()===b.getTime();
  const fmt=d=>[d.getDate(),d.getMonth()+1].map(n=>String(n).padStart(2,'0')).join('/')+'/'+d.getFullYear();
  const ARR=(dir)=>`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="${dir<0?'M15 18l-6-6 6-6':'M9 18l6-6-6-6'}"/></svg>`;

  function mount(el,o){
    let a=o.from?day(o.from):null, b=o.to?day(o.to):null, hov=null;
    let view=new Date((o.view||a||new Date()).getFullYear(),(o.view||a||new Date()).getMonth(),1);
    const months=o.months||2, today=day(new Date());
    const draw=()=>{
      const lo=a&&(b||hov)?new Date(Math.min(a,b||hov)):a, hi=a&&(b||hov)?new Date(Math.max(a,b||hov)):a;
      let h='';
      for(let m=0;m<months;m++){
        const first=new Date(view.getFullYear(),view.getMonth()+m,1), start=new Date(first); start.setDate(1-first.getDay());
        h+=`<div class="drp-m"><div class="drp-h">${m===0?`<button type="button" class="drp-nav p" data-nav="-1" aria-label="Mês anterior">${ARR(-1)}</button>`:''}<span>${MES[first.getMonth()]} ${first.getFullYear()}</span>${m===months-1?`<button type="button" class="drp-nav n" data-nav="1" aria-label="Próximo mês">${ARR(1)}</button>`:''}</div>
          <div class="drp-g" role="grid">${DOW.map(d=>`<span class="drp-w" aria-hidden="true">${d}</span>`).join('')}`;
        for(let i=0;i<42;i++){
          const d=new Date(start); d.setDate(start.getDate()+i); const out=d.getMonth()!==first.getMonth(), col=i%7;
          if(i===35 && d.getMonth()!==first.getMonth()) break; // não desenha a 6ª linha se ela for toda do mês seguinte
          const inR=lo&&hi&&d>=lo&&d<=hi, end=same(d,a)||same(d,b);
          const cls=['drp-d',out?'out':'',inR&&!end?'in':'',end?'end':'',same(d,today)?'today':'',inR&&(col===0||same(d,lo))?'l':'',inR&&(col===6||same(d,hi))?'r':''].join(' ');
          h+=`<button type="button" class="${cls}" data-d="${d.getTime()}" aria-label="${fmt(d)}" aria-pressed="${end}">${d.getDate()}</button>`;
        }
        h+='</div></div>';
      }
      el.innerHTML=`<div class="drp">${h}</div>`;
    };
    el.onclick=e=>{ e.stopPropagation();
      const n=e.target.closest('[data-nav]'); if(n){ view=new Date(view.getFullYear(),view.getMonth()+(+n.dataset.nav),1); draw(); el.querySelector(`[data-nav="${n.dataset.nav}"]`)?.focus(); return; }
      const c=e.target.closest('[data-d]'); if(!c) return; const d=new Date(+c.dataset.d);
      if(!a||b){ a=d; b=null; hov=null; draw(); el.querySelector(`[data-d="${d.getTime()}"]`)?.focus(); o.onStart&&o.onStart(a); return; }
      if(d<a){ b=a; a=d; } else b=d;
      draw(); o.onPick&&o.onPick(a,b); };
    el.onmouseover=e=>{ if(!a||b) return; const c=e.target.closest('[data-d]'); const d=c?new Date(+c.dataset.d):null; if(!same(d,hov)){ hov=d; draw(); } };
    draw();
    return {get:()=>({from:a,to:b})};
  }
  window.DateRange={mount,fmt,day};
})();
