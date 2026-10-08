/* Página de componentes: cada componente do Leitor de Faturas isolado.
   A lógica é a mesma do protótipo (detalhe.html / index.html), portada função a função. */
(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const MS=(n,s,f)=>'<span class="ms'+(f?' f':'')+'"'+(s?' style="font-size:'+s+'px"':'')+' aria-hidden="true">'+n+'</span>';
const I={ edit:MS('edit',12,1), copy:MS('content_copy',16,1), warn:MS('warning',13,1), close:MS('close',12,1), send:MS('send',16,1),
  check:MS('check',14), pen:MS('edit',13,1), dot:MS('radio_button_checked',12,1), inbox:MS('inbox',13,1), hour:MS('hourglass_top',13,1), doc:MS('description',13,1) };
function toast(t){ const el=$('#toast'); el.textContent=t; el.classList.add('show'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),1800); }
const now=()=>new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LOGO='<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.98755 0.0722733C8.21864 1.12089 8.45227 2.15362 8.71118 2.93555C8.84282 3.33304 8.98251 3.67018 9.13403 3.91309C9.28312 4.15207 9.45604 4.3197 9.66138 4.3379C9.79849 4.35053 9.93839 4.29404 10.0784 4.15919C10.2173 4.02523 10.3619 3.80915 10.5129 3.49024C10.8077 2.86795 11.1355 1.83339 11.4983 0.188484L13.6077 2.29786C13.0275 3.20033 12.4647 4.09355 12.0959 4.82813C11.9084 5.20176 11.769 5.5387 11.7043 5.81739C11.6408 6.0915 11.6442 6.33196 11.7747 6.49024C11.8626 6.59711 12.0018 6.6565 12.1965 6.66016C12.39 6.66372 12.6455 6.61265 12.9788 6.49317C13.6291 6.26001 14.5955 5.75727 16.0198 4.84571V7.88184C14.9762 8.10809 13.95 8.34044 13.1731 8.59864C12.7781 8.72994 12.4429 8.86933 12.2014 9.02052C11.9639 9.16925 11.7972 9.34187 11.7786 9.54591L11.7756 9.58009L11.7815 9.58497C11.7805 9.71008 11.8344 9.83758 11.9563 9.96485C12.0895 10.1039 12.3043 10.2484 12.6223 10.3994C13.243 10.6941 14.2759 11.022 15.9182 11.3848L13.8176 13.4893C12.9204 12.9093 12.0304 12.3478 11.2981 11.9805C10.9255 11.7936 10.5895 11.6551 10.3118 11.5908C10.0386 11.5276 9.79876 11.5307 9.64185 11.6611C9.5352 11.7491 9.47647 11.8883 9.4729 12.083C9.46942 12.2766 9.52015 12.5323 9.63989 12.8662C9.87412 13.5193 10.3795 14.4913 11.2971 15.9258H7.99634C7.76523 14.8544 7.53205 13.8 7.27563 13.0107C7.14529 12.6095 7.00759 12.2719 6.85864 12.0342C6.7128 11.8014 6.54092 11.6401 6.33521 11.6445C6.12824 11.649 5.95036 11.8192 5.7981 12.0606C5.64255 12.3071 5.49751 12.6525 5.36353 13.0566C5.10702 13.8305 4.88579 14.8357 4.70337 15.8154L2.40942 13.5215C3.00475 12.599 3.58617 11.6862 3.96313 10.9453C4.15462 10.5689 4.29596 10.2324 4.35864 9.95899C4.41228 9.72483 4.41312 9.51474 4.31274 9.3711L4.26294 9.31348C4.11288 9.1699 3.8672 9.16356 3.58911 9.22559C3.30512 9.28894 2.95975 9.43029 2.58032 9.62012C1.85394 9.98358 0.989455 10.5341 0.170166 11.0947V7.89259C1.24377 7.65663 2.29999 7.423 3.09009 7.16602C3.49168 7.0354 3.82985 6.89749 4.06763 6.74805C4.3007 6.60157 4.46129 6.42789 4.4563 6.22071C4.45158 6.01393 4.28194 5.83634 4.04126 5.68458C3.79523 5.52946 3.45036 5.38558 3.04712 5.25196C2.27515 4.99615 1.2727 4.77478 0.295166 4.58985L2.57544 2.31153C3.49287 2.90182 4.39835 3.47606 5.13306 3.84864C5.50652 4.03801 5.84104 4.17745 6.11255 4.23927C6.37836 4.29975 6.61174 4.29182 6.75317 4.14454C6.8961 3.9969 6.9027 3.75389 6.84106 3.47852C6.778 3.19692 6.63814 2.85313 6.44946 2.47559C6.08821 1.75274 5.53959 0.891472 4.98169 0.0722733H7.98755Z" fill="currentColor"/></svg>';
const ME={ini:'EM',name:'Eduardo Moreira'}, ANA={ini:'AR',name:'Ana Ribeiro',c:'linear-gradient(140deg,#fcd9bd,#ea580c)'}, CAR={ini:'CM',name:'Carlos Mendes',c:'linear-gradient(140deg,#bae6fd,#0369a1)'}, SYS={sys:true,name:'Sistema'};
const who=u=>u&&u.sys ? `<span class="who sys" data-name="Sistema" aria-label="Feito pelo sistema">${LOGO}</span>`
  : `<span class="who" data-name="${u.name}" aria-label="Editado por ${u.name}"${u.c?` style="background:${u.c}"`:''}>${u.ini}</span>`;
const anim=(el,cls,ms=450)=>{ if(!el) return; el.classList.remove('opening','closing'); void el.offsetWidth; el.classList.add(cls); setTimeout(()=>el.classList.remove(cls),ms); };
const flash=(el,ms=1200)=>{ if(!el) return; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); setTimeout(()=>el.classList.remove('flash'),ms); };

/* ---------- máscaras (cópia do protótipo) ---------- */
const PAT={date:'##/##/####', cnpj:'##.###.###/####-##', cep:'#####-###', barcode:'###########-# ###########-# ###########-# ###########-#'};
const NUM={money:{dec:2}, pct:{dec:2}, int:{dec:0}, dec5:{dec:5}};
function kindOf(v,u,t){
  if (u==='R$') return 'money';
  if (u==='%') return 'pct';
  if (['kWh','kW','dias'].includes(u)) return 'int';
  if (t==='Constante') return 'dec';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) return 'date';
  if (/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(v)) return 'cnpj';
  if (/^\d{5}-\d{3}$/.test(v)) return 'cep';
  if (/^(\d{11}-\d ?){4}$/.test(v)) return 'barcode';
  if (/^\d+$/.test(v)) return 'digits';
  return 'text';
}
const fmtPat=(d,pat)=>{ let o='',j=0; for(const ch of pat){ if(j>=d.length) break; o+= ch==='#' ? d[j++] : ch; } return o; };
function applyMask(kind, raw, opt={}){
  const d=raw.replace(/\D/g,'');
  if (NUM[kind]){
    if (!d) return opt.signed && ((raw.match(/[-−]/g)||[]).length % 2 === 1) ? '−' : '';
    const dec=NUM[kind].dec, neg=opt.signed && ((raw.match(/[-−]/g)||[]).length % 2 === 1);
    let n=d.replace(/^0+(?=\d)/,''), out;
    if (dec){ n=n.padStart(dec+1,'0'); out=Number(n.slice(0,-dec)).toLocaleString('pt-BR')+','+n.slice(-dec); }
    else out=Number(n).toLocaleString('pt-BR');
    return (neg && /[1-9]/.test(d) ? '−' : '') + out;
  }
  if (PAT[kind]) return fmtPat(d, PAT[kind]);
  if (kind==='digits') return d.slice(0, opt.max||99);
  if (kind==='dec'){ const v=raw.replace(/[^\d,]/g,''); const i=v.indexOf(','); return i<0 ? v : v.slice(0,i+1)+v.slice(i+1).replace(/,/g,''); }
  return raw;
}
function validMask(kind, v){
  if (!v || (NUM[kind] && !/\d/.test(v))) return 'Preencha o valor';
  if (kind==='date'){ const [dd,mm,yy]=v.split('/').map(Number); const dt=new Date(yy,mm-1,dd);
    if (v.length!==10 || dt.getFullYear()!==yy || dt.getMonth()!==mm-1 || dt.getDate()!==dd) return 'Data inválida'; }
  if (PAT[kind] && kind!=='date' && v.length!==PAT[kind].length) return ({cnpj:'CNPJ incompleto',cep:'CEP incompleto',barcode:'Código de barras incompleto'})[kind];
  return '';
}
function attachMask(inp, kind, opt={}){
  if (!kind || kind==='text') return;
  inp.inputMode = NUM[kind] ? 'decimal' : 'numeric';
  if (PAT[kind]) inp.maxLength = PAT[kind].length;
  inp.addEventListener('input', ()=>{
    const nv=applyMask(kind, inp.value, opt);
    if (nv!==inp.value){ inp.value=nv; inp.setSelectionRange(nv.length, nv.length); }
    inp.closest('.fld,.ufld,td')?.classList.remove('err');
  });
}
function invalid(inp, kind){
  const msg=validMask(kind, inp.value.trim());
  if (msg){ inp.closest('.fld,.ufld,td')?.classList.add('err'); toast(msg); inp.focus(); }
  return !!msg;
}
const pn=t=>parseFloat(String(t).replace(/[^\d,−-]/g,'').replace(/\./g,'').replace(',','.').replace('−','-'));
const money=n=>(n<0?'−':'')+Math.abs(n).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const isPre=u=>u==='R$';
const withUnit=(v,u)=>!v||v==='—'||!u ? v : (u==='R$' ? 'R$ '+v : v+' '+u);
function fmt(p,v){ if(p.kind==='Percentual'){ v=v.replace('%','').trim(); return v.includes(',')||v.includes('.')? v.replace('.',',') : v+',00'; } return v; }
const hintOf=p=>[p.hint, p.why&&`Sugestão: <span class="sg">${p.why}</span>`].filter(Boolean).join('. ');
/* Tab com o campo vazio aceita a sugestão do placeholder (igual ao protótipo) */
document.addEventListener('keydown',e=>{ const t=e.target;
  if(e.key!=='Tab'||e.shiftKey||!(t instanceof HTMLInputElement)||!t.hasAttribute('data-sug')||t.value.trim()||!t.placeholder) return;
  e.preventDefault(); t.value=t.placeholder; t.dispatchEvent(new Event('input',{bubbles:true})); t.dispatchEvent(new Event('change',{bubbles:true})); t.setSelectionRange(t.value.length,t.value.length);
},true);
function fieldHTML(p,id){
  if (p.kind==='Seleção') return `<select class="input" id="${id}"><option value="">${p.ph}</option>${p.options.map(o=>`<option>${o}</option>`).join('')}</select>`;
  const u=p.unit?`<span class="u">${p.unit}</span>`:'';
  return `<label class="ufld">${p.unit&&isPre(p.unit)?u:''}<input id="${id}" placeholder="${p.ph}" ${p.why?'data-sug':''} data-mask="${{Percentual:'pct',Número:'int',Moeda:'money'}[p.kind]||'text'}">${p.unit&&!isPre(p.unit)?u:''}</label>`;
}

/* ---------- card de dado (card() + editCard() do protótipo) ---------- */
const valHTML=(v,u)=>`<span class="val">${u&&isPre(u)?`<span class="u">${u}</span>`:''}<span class="v">${v}</span>${u&&!isPre(u)?`<span class="u">${u}</span>`:''}</span>`;
function cardHTML(t,v,u,o={}){
  const p=o.pend;
  if (p && !p.done) return `<div class="card pend ${o.cls||''}" id="${o.uid}-c-${p.id}">
      <div class="ct"><span class="badge">${I.warn}</span>${t}<span class="sp"></span><span class="ca"><button data-pclear="${p.id}" aria-label="Limpar ${t}">${I.close}</button></span></div>
      <div class="in erow">${fieldHTML(p,`${o.uid}-in-${p.id}`)}<button class="cp send" data-psave="${p.id}" aria-label="Enviar ${t}">${I.send}</button></div>
      <div class="hint">${hintOf(p)}</div></div>`;
  const val=p ? p.done : v;
  return `<div class="card ${p?'done':''} ${o.cls||''}" ${p?`id="${o.uid}-c-${p.id}"`:''} data-edit="${t}" data-u="${u||''}">
    <div class="ct">${t}<span class="sp"></span><button class="ib edit" aria-label="Editar ${t}">${I.edit}</button></div>
    <div class="row">${valHTML(val,u)}<span class="sp"></span><button class="cp" data-copy aria-label="Copiar valor de ${t}">${I.copy}</button></div></div>`;
}
function editCard(c, btn, onSave){
  const row=c.querySelector('.row'); if(!row || c.classList.contains('editing')) return;
  const old=row.querySelector('.v').textContent, u=c.dataset.u;
  c.classList.add('editing');
  const acts=document.createElement('span'); acts.className='ca';
  acts.innerHTML=`<button aria-label="Fechar edição">${I.close}</button>`;
  btn.replaceWith(acts);
  const f=document.createElement('label'); f.className='fld';
  const inp=document.createElement('input'); inp.value=old==='—'?'':old; inp.setAttribute('aria-label',c.dataset.edit);
  const kind=kindOf(old,u,c.dataset.edit); attachMask(inp, kind, {max:old.length});
  const us=document.createElement('span'); us.className='u'; us.textContent=u;
  if(u && isPre(u)) f.append(us,inp); else if(u) f.append(inp,us); else f.append(inp);
  const er=document.createElement('div'); er.className='erow';
  const send=document.createElement('button'); send.className='cp send'; send.setAttribute('aria-label','Enviar '+c.dataset.edit); send.innerHTML=I.send;
  er.append(f,send); row.replaceWith(er); inp.focus(); inp.select();
  const finish=save=>{
    const nv=inp.value.trim();
    if(save && nv && nv!==old && invalid(inp, kind)) return;
    er.replaceWith(row); acts.replaceWith(btn); c.classList.remove('editing');
    if(save && nv && nv!==old){ row.querySelector('.v').textContent=nv; toast(`${c.dataset.edit} atualizado`); onSave&&onSave(c.dataset.edit,old,nv,kind); }
    else onSave&&onSave(c.dataset.edit,old,null,kind);
  };
  send.onclick=()=>finish(true);
  acts.children[0].onclick=()=>finish(false);
  inp.onkeydown=e=>{ if(e.key==='Enter') finish(true); if(e.key==='Escape') finish(false); };
  return kind;
}
function bindCards(root, onSave, onEdit){
  $$('[data-copy]',root).forEach(b=>b.onclick=()=>{ const v=b.closest('.card').querySelector('.v').textContent; navigator.clipboard?.writeText(v).catch(()=>{}); toast(`Copiado: ${v}`); onSave&&onSave('copy',v); });
  $$('.card .ib.edit',root).forEach(b=>b.onclick=()=>{ const k=editCard(b.closest('.card'), b, onSave); onEdit&&onEdit(b.closest('.card'),k); });
}

/* ---------- registro dos componentes ---------- */
const C=[]; const comp=o=>C.push(o);
const seg=(name,label,opts,cur)=>`<span><span class="k">${label}</span><span class="seg" data-seg="${name}">${opts.map(([v,t])=>`<button data-v="${v}" class="${v===cur?'on':''}">${t}</button>`).join('')}</span></span>`;
const onSeg=(r,fn)=>$$('[data-seg]',r).forEach(s=>$$('button',s).forEach(b=>b.addEventListener('click',()=>{ segSet(r,s.dataset.seg,b.dataset.v); fn(s.dataset.seg,b.dataset.v); })));
const segSet=(r,n,v)=>$$(`[data-seg="${n}"] button`,r).forEach(b=>b.classList.toggle('on',b.dataset.v===v));
const log=(r,t)=>{ $('.log',r).innerHTML=t; };

/* ===== 1. Tab bar ===== */
comp({id:'tabbar', grp:'Navegação', t:'Tab bar', lib:'Tab Bar · Tab Bar Item', iss:'COG-288',
 lead:'No desktop, cada item abre e fecha um painel; no mobile, troca a tela. O botão da direita depende do estado da fatura.',
 ctrls:seg('acao','Botão da direita',[['pend','Pendências'],['send','Faturar'],['sent','Enviada']],'pend')+seg('size','Tamanho',[['desk','Desktop'],['mob','Mobile']],'desk'),
 beh:[['Desktop · clique em Fatura, Detalhes ou Atividade','Abre/fecha o painel; vários podem ficar ativos. Quem decide se cabe é a prioridade dos painéis.'],
   ['Abrir','Ícone pula 6 px e cresce 1,12 (450 ms, cubic-bezier(.3,1.5,.5,1)); pílula interna cresce de .55 a 1 (350 ms)'],
   ['Fechar','Ícone encolhe para .78 (350 ms, ease); pílula some'],
   ['Mobile · toque num item','Troca de tela; só um ativo; tocar no ativo não desativa'],
   ['Pendências (desktop)','Abre/fecha o card de pendências; contador laranja com o total'],
   ['Pendências (mobile)','Abre a tela de pendências (lista)'],
   ['UC validada e 0 pendência','Pendências sai e entra Faturar'],
   ['Hover em Faturar','Fundo neon/800'],
   ['Clique em Faturar','Loading: ícone progress_activity girando + "Enviando…", sem clique; ao terminar, o botão sai']],
 notes:['Pendências e Faturar são botões separados da pílula, 10 px ao lado (mobile: 4 px).','Mobile: só ícone (o nome fica no DOM, escondido, para leitor de tela); Atividade sai da barra e vai para o painel do header.','Faturar no mobile precisa de aria-label "Enviar para faturamento".','Lib: <code>Tab Bar Item Type=Send</code> com State Default · Hover · Loading.'],
 init(r){
  const cv=$('.canvas',r), S={};
  const reset=()=>Object.assign(S,{acao:'pend',size:'desk',open:{pdf:true,det:true,act:true},pend:true,screen:'det',busy:false});
  const onTab=k=>S.size==='mob' ? S.screen===k : k==='pend' ? S.pend : !!S.open[k];
  const paint=()=>$$('.tb[data-toggle]',cv).forEach(b=>{ const on=onTab(b.dataset.toggle); b.classList.toggle('on',on); b.setAttribute('aria-pressed',on); });
  const draw=()=>{
    cv.innerHTML=`<div class="cx ${S.size==='mob'?'mob':''}"><nav class="tabbar" aria-label="Painéis"><span class="tb-main">${[['pdf','picture_as_pdf','Fatura'],['det','description','Detalhes'],['act','history','Atividade']].map(([k,i,l])=>`<button class="tb" data-toggle="${k}"><span class="ic">${MS(i,26,1)}</span><span>${l}</span></button>`).join('')}</span>
      <button class="tb tb-send" aria-label="Enviar para faturamento" ${S.acao==='send'?'':'hidden'}><span class="ic">${MS('send',26,1)}</span><span>Faturar</span></button>
      <button class="tb tb-pend" data-toggle="pend" ${S.acao==='pend'?'':'hidden'}><span class="ic">${MS('warning',26,1)}<b class="cnt">3</b></span><span>Pendências</span></button></nav></div>`;
    paint();
    $$('.tb[data-toggle]',cv).forEach(b=>b.onclick=()=>{ const k=b.dataset.toggle, nm=b.lastElementChild.textContent.trim();
      if(S.size==='mob'){ S.screen=k; paint(); anim(b,'opening'); log(r,`Screen: <b>${nm}</b>`); return; }
      if(k==='pend') S.pend=!S.pend; else S.open[k]=!S.open[k];
      const on=onTab(k); paint(); anim(b,on?'opening':'closing'); log(r,`${k==='pend'?'Pending card':nm+' panel'}: <b>${on?'open':'closed'}</b>`); });
    const sd=$('.tb-send',cv);
    sd.onclick=()=>{ if(S.busy) return; S.busy=true; sd.classList.add('busy'); sd.setAttribute('aria-busy','true'); sd.setAttribute('aria-label','Enviando para faturamento');
      $('.ic .ms',sd).textContent='progress_activity'; sd.lastElementChild.textContent='Enviando…'; log(r,'<b>Loading</b>: not clickable');
      setTimeout(()=>{ S.busy=false; S.acao='sent'; segSet(r,'acao','sent'); draw(); log(r,'<b>Sent</b>: button removed, invoice read-only'); },1400); };
  };
  onSeg(r,(n,v)=>{ S[n]=v; S.busy=false; draw(); log(r,''); });
  r._reset=()=>{ reset(); segSet(r,'acao','pend'); segSet(r,'size','desk'); draw(); };
  reset(); draw(); }});

/* ===== 2. Painéis ===== */
comp({id:'paineis', grp:'Navegação', t:'Painéis por prioridade', iss:'COG-287',
 lead:'Até três painéis lado a lado, em tamanho real (a moldura só reduz a escala). Quando falta largura, sai o de menor prioridade: Detalhes › Fatura › Atividade.',
 ctrls:`<span><span class="k">Largura da área</span><input type="range" min="560" max="1700" step="10" value="1440" data-w style="width:220px;vertical-align:middle;accent-color:#71902f"> <b data-wv style="font-size:12px">1440 px</b></span>`,
 beh:[['Estreitar a área','Sai Atividade, depois Fatura; Detalhes fica até 520 px'],['Abrir um painel que não cabe','Fecha os outros, do menos para o mais prioritário, até ele caber'],['Fechar todos','"Nenhum painel aberto" + Voltar ao padrão (reabre os três, respeitando a largura)'],['Painel fechando','350 ms ease: largura → 0, opacidade → 0, desce 24 px e escala .96'],['Painel abrindo','400 ms cubic-bezier(.2,.9,.3,1.1): sobe 32 px, escala .95 → 1']],
 notes:['Fatura 686 px (encolhe até 400); Detalhes ocupa o resto (mín. 520); Atividade 284 fixo. Gap 24.','A Fatura não cresce além da página do PDF; sem Detalhes, ela ocupa o espaço.','Dentro de Detalhes, cards em 2/3/4 colunas pela largura do painel (container query: conteúdo ≥ 900 → 3, ≥ 1200 → 4).','Abaixo de 768 px vira uma tela por vez (tab bar mobile).'],
 init(r){
  const cv=$('.canvas',r), PRI=['det','pdf','act'], MINW={det:520,pdf:400,act:284}, NM={pdf:'Fatura',det:'Detalhes',act:'Atividade'}, IC={pdf:'picture_as_pdf',det:'description',act:'history'}, SPEC={pdf:'686 · min 400',det:'fill · min 520',act:'284 fixed'};
  const S={open:{pdf:true,det:true,act:true},W:1440,vis:[]};
  cv.innerHTML=`<div class="cx" style="width:100%"><div data-box style="position:relative;overflow:hidden;background:#fff;border-radius:16px;box-shadow:0 0 40px rgba(0,0,0,.04)"><div data-sc style="transform-origin:0 0"><div class="cols" style="height:300px">
    ${['pdf','det','act'].map(k=>`<div class="panel p-${k}" data-p="${k}"><div style="margin:auto;text-align:center;white-space:nowrap;display:flex;flex-direction:column;gap:4px"><b style="font-size:20px">${NM[k]}</b><span style="color:var(--mid);font-size:16px">${SPEC[k]}</span><span data-wd style="font-size:16px;font-weight:600"></span></div></div>`).join('')}
    <div class="cols-empty" hidden>${MS('view_column')}<b>Nenhum painel aberto</b><span>Abra um painel pela barra abaixo ou volte à visualização padrão.</span><button class="btn primary" data-reset>Voltar ao padrão</button></div>
  </div></div></div>
  <div style="display:flex;justify-content:center;margin-top:16px"><nav class="tabbar"><span class="tb-main">${['pdf','det','act'].map(k=>`<button class="tb" data-toggle="${k}"><span class="ic">${MS(IC[k],26,1)}</span><span>${NM[k]}</span></button>`).join('')}</span></nav></div></div>`;
  const box=$('[data-box]',cv), sc=$('[data-sc]',cv), cols=$('.cols',cv);
  const fits=set=>set.reduce((w,k)=>w+MINW[k],0)+24*Math.max(0,set.length-1) <= cols.clientWidth;
  const visibleSet=()=>{ const v=[]; PRI.forEach(k=>{ if(S.open[k] && fits([...v,k])) v.push(k); }); return v; };
  const scale=()=>{ const k=Math.min(1, box.parentElement.clientWidth/S.W); sc.style.width=S.W+'px'; sc.style.transform=`scale(${k})`; box.style.width=S.W*k+'px'; box.style.margin='0 auto'; box.style.height=300*k+'px'; return k; }; // o fundo branco acompanha a largura escolhida
  const widths=()=>$$('.panel',cv).forEach(p=>{ p.querySelector('[data-wd]').textContent = p.classList.contains('min')?'':Math.round(p.offsetWidth)+' px now'; });
  const render=(first)=>{ scale(); const prev=S.vis; S.vis=visibleSet();
    PRI.forEach(k=>{ const p=$(`[data-p=${k}]`,cv), is=S.vis.includes(k), was=prev.includes(k); p.classList.toggle('min',!is); if(!first && is && !was) anim(p,'opening',450);
      const b=$(`.tb[data-toggle=${k}]`,cv); b.classList.toggle('on',is); if(!first && is!==was) anim(b,is?'opening':'closing'); });
    cols.classList.toggle('no-pdf',!S.vis.includes('pdf')); cols.classList.toggle('no-det',!S.vis.includes('det'));
    $('.cols-empty',cv).hidden=S.vis.length>0; setTimeout(widths,420); };
  $$('.tb[data-toggle]',cv).forEach(b=>b.onclick=()=>{ const k=b.dataset.toggle, before=[...S.vis];
    if(S.vis.includes(k)) S.open[k]=false;
    else { S.open[k]=true; for(const o of [...PRI].reverse().filter(x=>x!==k)){ if(visibleSet().includes(k)) break; S.open[o]=false; } }
    render(); const closed=before.filter(x=>x!==k && !S.vis.includes(x)).map(x=>NM[x]);
    log(r, S.vis.includes(k)?`${NM[k]} <b>opened</b>${closed.length?` · closed ${closed.join(' and ')} to fit`:''}`:`${NM[k]} <b>closed</b>`); });
  $('[data-reset]',cv).onclick=()=>{ S.open={pdf:true,det:true,act:true}; render(); log(r,'<b>Reset to default</b>'); };
  const w=$('[data-w]',r); w.oninput=()=>{ S.W=+w.value; $('[data-wv]',r).textContent=S.W+' px'; render(); const out=['pdf','det','act'].filter(k=>S.open[k]&&!S.vis.includes(k)).map(k=>NM[k]); log(r, out.length?`Doesn't fit: <b>${out.join(' and ')}</b> (stays open, returns when it fits)`:'All open panels fit'); };
  new ResizeObserver(()=>{ scale(); }).observe(box.parentElement);
  r._reset=()=>{ S.open={pdf:true,det:true,act:true}; S.W=1440; w.value=1440; $('[data-wv]',r).textContent='1440 px'; render(); };
  render(true); }});

/* ===== 3. Card de dado ===== */
comp({id:'card', grp:'Dados', t:'Card de dado', lib:'Data Card', iss:'COG-289',
 lead:'Um rótulo, um valor e a unidade. Precisa de legenda? Vira outro card.',
 ctrls:seg('st','Fatura',[['rev','Em revisão'],['ro','Enviada (só leitura)']],'rev')+seg('size','Tamanho',[['desk','Desktop'],['mob','Mobile']],'desk'),
 beh:[['Lápis','Edição: o valor vira campo com a unidade dentro; enviar fica ao lado (no lugar do copiar) e fechar no cabeçalho (no lugar do lápis)'],['Enter ou enviar','Valida a máscara. Inválido: borda vermelha + aviso, não salva. Válido: salva e volta à visualização'],['Esc ou fechar','Cancela; volta o valor anterior'],['Enviar sem mudar nada ou vazio','Só fecha a edição'],['Copiar','Copia só o valor, sem unidade'],['Pendente · enviar ou Enter','Resolve: o card vira Corrigido (borda verde) e continua editável'],['Pendente · fechar (×)','Limpa o campo e devolve o foco']],
 notes:['Visualização e edição têm a mesma altura.','R$ antes do valor; as outras unidades depois.','Pendente: borda laranja, campo vazio, sugestão no placeholder (nunca preenchida) e a dica de onde ela veio.','Só leitura (fatura enviada): sem lápis; copiar continua. Lib: <code>State=Read only</code>.','Mobile: fundo rgba(245,245,244,.4), borda #f5f5f4, raio 12, padding 16; lápis e fechar com toque de 40 px.'],
 init(r){
  const cv=$('.canvas',r), S={};
  const reset=()=>Object.assign(S,{st:'rev',size:'desk',p:{id:'cofins',kind:'Percentual',unit:'%',ph:'3,38',why:'COFINS (valor) ÷ base de cálculo',label:'COFINS (alíquota)',done:null}});
  const draw=()=>{ const o={uid:'cd'};
    cv.innerHTML=`<div class="cx ${S.size==='mob'?'mob':''}" style="width:${S.size==='mob'?'345px':'760px'}"><div class="grid g2 ${S.st==='ro'?'ro':''}">
      ${cardHTML('Consumo fora ponta','5.960','kWh',o)}${cardHTML('Total a pagar','4.440,13','R$',o)}
      ${cardHTML('COFINS (alíquota)','','%',{...o,pend:S.st==='ro'?{...S.p,done:S.p.done||'3,38'}:S.p})}${cardHTML('Vencimento','25/03/2025','',o)}</div></div>`;
    bindCards(cv,(t,old,nv)=>{ if(t==='copy') return log(r,`Copied value only: <b>${old}</b>`); log(r, nv?`<b>${t}</b>: ${old} → ${nv}`:`<b>${t}</b>: closed, no change`); }, (c,k)=>log(r,`Editing <b>${c.dataset.edit}</b> · mask <code>${k}</code> · same height: ${c.offsetHeight} px`));
    const p=S.p, f=$(`#cd-in-${p.id}`,cv); if(!f) return;
    attachMask(f,f.dataset.mask);
    const go=()=>{ const v=f.value.trim(); if(!v){ f.focus(); return; } if(invalid(f,f.dataset.mask)) return; p.done=fmt(p,v); toast(`${p.label}: ${p.done}`); draw(); flash($('#cd-c-'+p.id,cv),900); log(r,`Resolved: <b>${p.done} %</b> → corrected`); };
    f.onkeydown=e=>{ if(e.key==='Enter'&&f.value.trim()) go(); };
    $(`[data-psave="${p.id}"]`,cv).onclick=go;
    $(`[data-pclear="${p.id}"]`,cv).onclick=()=>{ f.value=''; f.focus(); };
  };
  onSeg(r,(n,v)=>{ S[n]=v; draw(); log(r,''); });
  r._reset=()=>{ reset(); segSet(r,'st','rev'); segSet(r,'size','desk'); draw(); };
  reset(); draw(); }});

/* ===== 4. Campos com máscara ===== */
comp({id:'mascaras', grp:'Dados', t:'Campos com máscara', iss:'COG-289',
 lead:'A máscara vem do tipo do valor. Clique no lápis, digite e confirme com Enter para ver a validação.',
 beh:[['Moeda (R$) e percentual (%)','2 casas, digitando da direita: "512399" → 5.123,99'],['kWh, kW, dias','Inteiro com milhar: "5960" → 5.960'],['Data','dd/mm/aaaa; precisa ser uma data real (31/02/2025 é inválida)'],['CNPJ, CEP, código de barras','Pontuação automática; precisa estar completo'],['Nº da instalação, nota fiscal, série','Só dígitos, no máximo o tamanho original'],['Constante','Número com uma vírgula'],['Inválido','Borda vermelha + aviso ("Data inválida", "CNPJ incompleto"…); não salva']],
 notes:['O tipo sai da unidade, do rótulo ou do formato do valor original (função kindOf).','Teclado numérico no mobile (inputmode decimal/numeric).','No iOS, campos com 16 px para o Safari não dar zoom.','Na planilha, quantidade e valores aceitam "−" (créditos) e as tarifas têm 5 casas.'],
 init(r){ const cv=$('.canvas',r);
  const draw=()=>{ const o={uid:'mk'};
    cv.innerHTML=`<div class="cx" style="width:100%"><div class="grid g3">
      ${cardHTML('Valor','4.440,13','R$',o)}${cardHTML('Alíquota','18,00','%',o)}${cardHTML('Consumo','5.960','kWh',o)}
      ${cardHTML('Vencimento','25/03/2025','',o)}${cardHTML('CNPJ','12.345.678/0001-90','',o)}${cardHTML('CEP','32400-000','',o)}
      ${cardHTML('Nº da instalação','3014567890','',o)}${cardHTML('Constante','1','',o)}${cardHTML('Demanda','75','kW',o)}
      ${cardHTML('Código de barras','83610000044-2 40130138004-3 11989574712-4 30145678901-7','',{...o,cls:'full'})}</div></div>`;
    bindCards(cv,(t,old,nv)=>{ if(t==='copy') return; log(r, nv?`<b>${t}</b> saved: ${nv}`:`<b>${t}</b>: closed, no change`); }, (c,k)=>log(r,`<b>${c.dataset.edit}</b> · mask <code>${k}</code>`)); };
  r._reset=draw; draw(); }});

/* ===== 5. Planilha de itens ===== */
const COLS=['Quant.','Preço c/ tributos','Tarifa s/ tributos','PIS/COFINS','ICMS','Valor'];
const COLK={2:'int',3:'dec5',4:'dec5',5:'money',6:'money',7:'money'};
const cellUnit=(r,c)=> c===2 ? [r[1],0] : (c===3||c===4) ? ['R$/'+r[1],0] : ['R$',1];
const ITEMS=()=>[['Consumo ponta TUSD','kWh','540','1,48213','1,15443','32,89','144,06','800,35'],['Consumo ponta TE','kWh','540','0,51237','0,39909','11,37','49,80','276,68'],['Consumo fora ponta TUSD','kWh','5.960','0,11845','0,09226','29,02','127,07','705,96'],['Consumo fora ponta TE','kWh','5.960','0,32971','0,25681','80,76','353,71','1.965,07'],['Energia injetada fora ponta TUSD','kWh','−4.100','0,11845','0,09226','−19,96','−87,42','−485,65'],['Energia injetada fora ponta TE','kWh','−4.100','0,32971','0,25681','−55,56','−243,33','−1.351,81'],['Demanda','kW','75','32,41500','25,24804','99,92','','2.431,13'],['Contrib. ilum. pública municipal','—','—','—','—','—','—','98,40']];
const _cv=document.createElement('canvas').getContext('2d');
function midFit(t,max){ const w=x=>_cv.measureText(x).width; if(w(t)<=max) return t; let lo=2,hi=t.length-1,best=t.slice(0,1)+'…';
  while(lo<=hi){ const n=(lo+hi)>>1, a=Math.ceil(n/2), x=t.slice(0,a).trimEnd()+'…'+t.slice(t.length-(n-a)).trimStart(); if(w(x)<=max){ best=x; lo=n+1; } else hi=n-1; } return best; }
comp({id:'planilha', grp:'Dados', t:'Planilha de itens e soma', iss:'COG-290',
 lead:'Itens da nota fiscal. A soma da coluna Valor tem que fechar com o Total da fatura (R$ 4.440,13); se não fecha, a célula editada vira pendência.',
 ctrls:seg('size','Tamanho',[['desk','Desktop'],['mob','Mobile']],'desk')+`<button class="cbtn" data-err>Simular valor errado na Demanda</button>`,
 beh:[['Clique','Seleciona a célula (borda verde)'],['Duplo clique, Enter ou F2','Edita com a máscara da coluna; quantidade e valores aceitam "−"'],['Setas ← → ↑ ↓','Movem a seleção'],['Enter na edição / sair do campo','Salva (inválido: borda vermelha + aviso)'],['Esc na edição','Cancela'],['Célula pendente','Fundo laranja + ícone; ao editar, campo vazio com a sugestão no placeholder. No mobile abre com um toque'],['Tab com a célula pendente vazia','Preenche com a sugestão; Enter confirma'],['Largura ao editar','A coluna mantém a largura; só cresce (180 ms, ease) se o valor ou a sugestão não couberem'],['Valor editado e soma ≠ total','A célula vira pendência, com o valor que fecha no placeholder; rodapé e aviso em vermelho'],['Corrigiu com um valor que ainda não fecha','Continua pendência, com nova sugestão']],
 notes:['Unidade dentro da célula, em cinza: "540 kWh", "1,48213 R$/kWh", "R$ 800,35". Sem coluna "Unid.".','Cabeçalho e coluna Item fixos no desktop. No mobile, Item rola junto e ocupa até metade da largura; nome longo é cortado no meio ("Energia in…onta TUSD").','Célula alterada: fundo #f7fee7. Negativos em verde-escuro.','Barra de rolagem no estilo Scroll-area (alça 8 px).'],
 init(r){
  const cv=$('.canvas',r), TOTAL=4440.13; let S;
  const reset=()=>{ S={size:'desk',items:ITEMS(),chg:{'7-7':1},n:0,pend:[{id:'item',label:'ICMS do item Demanda',kind:'Moeda',unit:'R$',ph:'437,60',why:'18% de R$ 2.431,13',cell:[6,6],done:null}]}; };
  const open=()=>S.pend.filter(p=>!p.done);
  const cellPend=(ri,c)=>open().find(p=>p.cell[0]===ri&&p.cell[1]===c);
  const cellHTML=(ri,c)=>{ const v=S.items[ri][c]; if(!v||v==='—'||(c<5&&S.items[ri][1]==='—')) return v||''; const [u,pre]=cellUnit(S.items[ri],c); return pre?`<span class="cu">${u}</span> ${v}`:`${v} <span class="cu">${u}</span>`; };
  const sum=()=>Math.round(S.items.reduce((a,x)=>a+(pn(x[7])||0),0)*100)/100;
  const checkSum=(ri,c)=>{ if(c!==7) return false; const gap=Math.round((TOTAL-sum())*100)/100; if(!gap) return false; const nm=S.items[ri][0];
    S.pend.push({id:'sum'+(++S.n),label:nm+' · valor',kind:'Moeda',unit:'R$',ph:money((pn(S.items[ri][7])||0)+gap),why:'valor que fecha a soma',hint:'A soma dos itens não fecha com o total da fatura',cell:[ri,7],done:null});
    toast('A soma dos itens não fecha com o total da fatura'); return true; };
  const draw=(sel)=>{ const tot=sum(), off=tot!==TOTAL;
    cv.innerHTML=`<div class="cx ${S.size==='mob'?'mob':''}" style="width:${S.size==='mob'?'345px':'100%'}"><div class="grade-h"><span>${S.size==='mob'?'Toque duas vezes numa célula para editar':'Clique duas vezes numa célula para editar'}</span>${off?`<span class="off">Soma ≠ total da fatura (R$ ${money(TOTAL)})</span>`:''}</div>
      <div class="grade"><table><thead><tr><th class="stk">Item</th>${COLS.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${S.items.map((x,ri)=>`<tr><td class="stk">${x[0]}</td>${x.slice(2).map((v,ci)=>{ const c=ci+2, p=cellPend(ri,c);
        return p?`<td class="num pend" data-r="${ri}" data-c="${c}" data-pend="${p.id}" tabindex="-1" title="${p.hint||'Não encontrado na fatura'}"><span class="pw">${I.warn}</span></td>`
          :`<td class="num ${String(v).startsWith('−')?'neg':''} ${S.chg[ri+'-'+c]?'chg':''}" data-r="${ri}" data-c="${c}" tabindex="-1">${cellHTML(ri,c)}</td>`; }).join('')}</tr>`).join('')}</tbody>
      <tfoot><tr><td class="stk">Total</td><td colspan="5"></td><td class="${off?'off':''}"><span class="cu">R$</span> ${money(tot)}</td></tr></tfoot></table></div></div>`;
    fit(); bind(); if(sel){ const n=at(...sel); if(n) select(n); } };
  const fit=()=>{ const g=$('.grade',cv), mob=S.size==='mob', half=Math.floor(g.clientWidth/2); g.style.setProperty('--stkw',mob?half+'px':'');
    $$('tbody td.stk',g).forEach(td=>{ const full=td.textContent; if(!mob) return; const cs=getComputedStyle(td); _cv.font=`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; const s=midFit(full,half-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)-2); td.textContent=s; if(s!==full){ td.title=full; td.setAttribute('aria-label',full); } }); };
  const at=(ri,c)=>$(`td[data-r="${ri}"][data-c="${c}"]`,cv);
  const select=td=>{ $$('td.sel',cv).forEach(x=>x.classList.remove('sel')); td.classList.add('sel'); td.focus(); };
  const edit=td=>{
    if(td.classList.contains('ed')) return;
    const ri=+td.dataset.r, c=+td.dataset.c, old=S.items[ri][c], kind=COLK[c];
    const cs0=getComputedStyle(td), w0=td.clientWidth-parseFloat(cs0.paddingLeft)-parseFloat(cs0.paddingRight);
    td.classList.add('ed'); td.innerHTML=`<span class="ghost" aria-hidden="true">${td.innerHTML}</span><input size="1">`; const inp=td.querySelector('input'); inp.value=old==='—'?'':old;
    const p=td.dataset.pend && S.pend.find(x=>x.id===td.dataset.pend); if(p){ inp.value=''; inp.placeholder=p.ph||''; if(p.why) inp.dataset.sug='1'; }
    const gh=td.querySelector('.ghost'), nat=gh.getBoundingClientRect().width; gh.style.minWidth=nat+'px';
    const grow=()=>{ const cs=getComputedStyle(inp); _cv.font=`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; const need=Math.ceil(Math.max(_cv.measureText(inp.value).width,_cv.measureText(inp.placeholder).width))+4; gh.style.minWidth=(need>w0?need:nat)+'px'; if(need>w0) log(r,`Column grows <b>${Math.round(w0)} → ${need} px</b> (animated) to fit the ${inp.value?'value':'suggestion'}`); };
    requestAnimationFrame(grow); inp.addEventListener('input',grow);
    inp.setAttribute('aria-label',`${S.items[ri][0]} · ${COLS[c-2]}`); inp.focus(); inp.select();
    attachMask(inp,kind,{signed:c!==3&&c!==4});
    const done=save=>{ const nv=inp.value.trim();
      if(save && nv && (p || nv!==old) && invalid(inp,kind)) return;
      td.classList.remove('ed','err');
      if(p){ if(save&&nv){ p.done=nv; S.items[ri][c]=nv; S.chg[ri+'-'+c]=1; const bad=checkSum(ri,c); if(!bad) toast(`${p.label}: ${nv}`);
          draw([ri,c]); log(r,bad?`Still off → <b>new pending</b>, suggestion R$ ${open().slice(-1)[0].ph}`:`Resolved: <b>${nv}</b>`); }
        else { td.innerHTML=`<span class="pw">${I.warn}</span>`; select(td); } return; }
      if(save && nv && nv!==old){ S.items[ri][c]=nv; S.chg[ri+'-'+c]=1; const bad=checkSum(ri,c); if(!bad) toast(`${S.items[ri][0]} atualizado`);
        draw([ri,c]); log(r,bad?`Sum is off → cell becomes <b>pending</b>, suggestion R$ ${open().slice(-1)[0].ph}`:`<b>${S.items[ri][0]}</b> · ${COLS[c-2]}: ${old} → ${nv}`); return; }
      td.innerHTML=cellHTML(ri,c); select(td); };
    inp.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); done(true); } if(e.key==='Escape'){ e.preventDefault(); done(false); } e.stopPropagation(); };
    inp.onblur=()=>{ if(td.classList.contains('ed')) done(true); };
  };
  const bind=()=>$$('td.num',cv).forEach(td=>{
    td.onclick=()=>{ if(S.size==='mob' && td.classList.contains('pend')) edit(td); else select(td); };
    td.ondblclick=()=>edit(td);
    td.onkeydown=e=>{ const ri=+td.dataset.r, c=+td.dataset.c, mv={ArrowUp:[ri-1,c],ArrowDown:[ri+1,c],ArrowLeft:[ri,c-1],ArrowRight:[ri,c+1]}[e.key];
      if(mv){ const n=at(...mv); if(n){ e.preventDefault(); select(n); } } else if(e.key==='Enter'||e.key==='F2'){ e.preventDefault(); edit(td); } }; });
  onSeg(r,(n,v)=>{ S[n]=v; draw(); log(r,''); });
  $('[data-err]',r).onclick=()=>{ S.items[6][7]='2.400,00'; S.chg['6-7']=1; checkSum(6,7); draw([6,7]); log(r,'Demanda = 2.400,00 → sum is off. Double-click (or Enter) the orange cell.'); };
  r._reset=()=>{ reset(); segSet(r,'size','desk'); draw(); };
  reset(); draw(); }});

/* ===== 6. Pendências ===== */
comp({id:'pendencias', grp:'Revisão', t:'Pendências', iss:'COG-291',
 lead:'O que a leitura não encontrou. No desktop, um card flutuante acima da tab bar percorre os itens; no mobile, uma tela com a lista. O card no próprio dado também resolve.',
 ctrls:seg('size','Tamanho',[['desk','Desktop'],['mob','Mobile']],'desk')+seg('uc','UC',[['ok','Validada'],['no','Não validada']],'ok'),
 beh:[['Anterior / próxima','Navega "N de total"; nas pontas o botão fica desabilitado'],['Digitar','Confirmar só habilita com valor'],['Confirmar ou Enter','Valida, resolve e passa para a próxima; o card do dado fica verde e pisca'],['Ver no Campo','Leva até o card do dado e pisca laranja (1,2 s)'],['Minimizar (↙)','Fecha o card; o botão Pendências da tab bar reabre'],['Seleção (modalidade)','Escolher a opção já resolve'],['Última resolvida','O card some; na tab bar, Pendências sai e entra Faturar'],['UC não validada','O card só diz para validar a UC e leva até ela']],
 notes:['Placeholder com o valor derivável (nunca preenchido) + dica de onde veio: COFINS = valor ÷ base; leitura = anterior + consumo; ICMS do item = alíquota × valor.','Mobile: cada item com campo, Ver no Campo e Confirmar; lista vazia → "Sem pendências".','O contador do botão Pendências acompanha o total em aberto.'],
 init(r){
  const cv=$('.canvas',r); let S;
  const reset=()=>{ S={size:'desk',uc:'ok',open:true,i:0,pend:[
    {id:'cofins',title:'COFINS (alíquota)',label:'COFINS (alíquota)',kind:'Percentual',unit:'%',ph:'3,38',why:'COFINS (valor) ÷ base de cálculo',done:null},
    {id:'leit',title:'Leitura atual',label:'Leitura atual ponta (kWh)',kind:'Número',unit:'kWh',ph:'13.020',why:'leitura anterior + consumo medido',done:null},
    {id:'mod',title:'Modalidade tarifária',label:'Modalidade tarifária',kind:'Seleção',ph:'Selecione',options:['Convencional','Horária verde','Horária azul','Branca'],done:null}]}; };
  const open=()=>S.pend.filter(p=>!p.done);
  const resolve=(p,v,f)=>{ if(p.kind!=='Seleção' && f && invalid(f,f.dataset.mask)) return; p.done=fmt(p,v); toast(`${p.label}: ${p.done}`); draw(); flash($('#pd-c-'+p.id,cv),900);
    log(r, open().length?`<b>${p.label}</b> = ${p.done} · ${open().length} left`:'<b>All resolved</b>: card hides, Faturar appears'); };
  const focusPend=p=>{ const c=$('#pd-c-'+p.id,cv); if(!c) return; c.scrollIntoView({behavior:'smooth',block:'nearest'}); flash(c); log(r,`Ver no Campo: <b>${p.title}</b>`); };
  const cards=()=>`<div class="grid g2" style="width:${S.size==='mob'?'100%':'560px'}">${S.pend.map(p=>cardHTML(p.title,'',p.unit||'',{uid:'pd',pend:p})).join('')}${cardHTML('Total a pagar','4.440,13','R$',{uid:'pd'})}</div>`;
  const tabbar=()=>{ const n=open().length; return `<nav class="tabbar" aria-label="Painéis"><span class="tb-main"><button class="tb" data-toggle="pdf"><span class="ic">${MS('picture_as_pdf',26,1)}</span><span>Fatura</span></button><button class="tb on" data-toggle="det"><span class="ic">${MS('description',26,1)}</span><span>Detalhes</span></button><button class="tb" data-toggle="act"><span class="ic">${MS('history',26,1)}</span><span>Atividade</span></button></span>
    <button class="tb tb-send" aria-label="Enviar para faturamento" ${S.uc==='ok'&&!n?'':'hidden'}><span class="ic">${MS('send',26,1)}</span><span>Faturar</span></button>
    <button class="tb tb-pend ${(S.size==='mob'||S.open)&&n?'on':''}" data-pend ${n?'':'hidden'}><span class="ic">${MS('warning',26,1)}<b class="cnt">${n}</b></span><span>Pendências</span></button></nav>`; };
  const cardBody=()=>{ const list=open(); if(!list.length) return '';
    if(S.uc!=='ok') return `<div class="pc-b"><div class="fl"><b>Valide a UC primeiro</b><span style="color:var(--mid);font-size:13px">As pendências ficam liberadas depois que a UC da fatura for confirmada.</span></div><div class="acts"><span></span><button class="btn primary" data-goid>Ir para a UC</button></div></div>`;
    S.i=Math.min(S.i,list.length-1); const p=list[S.i];
    return `<div class="pc-b"><div class="fl"><label for="pd-pf">${p.label}</label>${fieldHTML(p,'pd-pf')}<span style="color:var(--mid);font-size:12px">${hintOf(p)}</span></div>
      <div class="acts"><span class="nav"><button data-prev aria-label="Anterior" ${S.i===0?'disabled':''}>${MS('chevron_left')}</button><span>${S.i+1} de ${list.length}</span><button data-next aria-label="Próxima" ${S.i===list.length-1?'disabled':''}>${MS('chevron_right')}</button></span><button class="btn primary" data-ok disabled>Confirmar</button></div></div>`; };
  const plist=()=>{ const list=open(); return list.length?`<div class="plist">${list.map(p=>`<div class="pl-item"><div class="pl-h"><span class="badge">${I.warn}</span>${p.label}</div><div class="pl-m">${({cofins:'Resumo',leit:'Consumo',mod:'Identificação'})[p.id]} · ${hintOf(p)}</div>${fieldHTML(p,'pd-pl-'+p.id)}<div class="pl-a"><button class="bxs" data-plgo="${p.id}"><span class="tx">Ver no Campo</span>${MS('open_in_new',16)}</button><button class="btn primary" data-plok="${p.id}" disabled>Confirmar</button></div></div>`).join('')}</div>`
      : `<div class="pl-empty">${MS('check_circle',0,1)}<b>Sem pendências</b>Todos os dados da fatura foram conferidos.</div>`; };
  const draw=()=>{ const mob=S.size==='mob', list=open();
    cv.innerHTML=`<div class="cx ${mob?'mob':''}" style="display:flex;flex-direction:column;align-items:center;gap:20px;${mob?'width:345px':''}">
      ${mob?`<div style="width:100%">${plist()}</div>`:cards()}
      ${!mob&&list.length?`<div class="pend-card ${S.open?'':'hide'}" role="dialog" aria-label="Pendências"><div class="pc-h"><span class="badge">${MS('warning',14,1)}</span><span>Pendências</span><span class="sp"></span>${S.uc==='ok'?`<button class="bxs" data-go><span class="tx">Ver no Campo</span>${MS('open_in_new',16)}</button>`:''}<button class="ib" data-min aria-label="Minimizar pendências">${MS('close_fullscreen',16)}</button></div>${cardBody()}</div>`:''}
      ${tabbar()}</div>`;
    bind(); };
  const bind=()=>{ const list=open(), p=list[S.i];
    // cards do próprio dado (desktop)
    S.pend.filter(x=>!x.done).forEach(x=>{ const f=$('#pd-in-'+x.id,cv); if(!f) return; if(f.dataset.mask) attachMask(f,f.dataset.mask);
      f.onkeydown=e=>{ if(e.key==='Enter'&&f.value.trim()) resolve(x,f.value.trim(),f); };
      f.onchange=()=>{ if(x.kind==='Seleção'&&f.value) resolve(x,f.value,f); };
      const sv=$(`[data-psave="${x.id}"]`,cv), cl=$(`[data-pclear="${x.id}"]`,cv);
      if(sv) sv.onclick=()=>{ if(f.value.trim()) resolve(x,f.value.trim(),f); else f.focus(); };
      if(cl) cl.onclick=()=>{ f.value=''; f.focus(); }; });
    bindCards(cv,()=>{});
    // card flutuante
    const f=$('#pd-pf',cv);
    if(f && p){ const ok=$('[data-ok]',cv); if(f.dataset.mask) attachMask(f,f.dataset.mask);
      f.oninput=f.onchange=()=>{ ok.disabled=!f.value.trim(); if(p.kind==='Seleção'&&f.value) resolve(p,f.value,f); };
      f.onkeydown=e=>{ if(e.key==='Enter'&&f.value.trim()) resolve(p,f.value.trim(),f); };
      ok.onclick=()=>resolve(p,f.value.trim(),f);
      $('[data-prev]',cv).onclick=()=>{ S.i--; draw(); }; $('[data-next]',cv).onclick=()=>{ S.i++; draw(); };
      $('[data-go]',cv).onclick=()=>focusPend(p); }
    const gid=$('[data-goid]',cv); if(gid) gid.onclick=()=>log(r,'Goes to the UC block and focuses the field');
    const mn=$('[data-min]',cv); if(mn) mn.onclick=()=>{ S.open=false; $('.pend-card',cv).classList.add('hide'); $('[data-pend]',cv).classList.remove('on'); anim($('[data-pend]',cv),'closing'); log(r,'Card <b>minimized</b>; reopen via Pendências'); };
    const tp=$('[data-pend]',cv); if(tp) tp.onclick=()=>{ if(S.size==='mob'){ anim(tp,'opening'); log(r,'Mobile: opens the <b>pending screen</b>'); return; } S.open=!S.open; $('.pend-card',cv)?.classList.toggle('hide',!S.open); tp.classList.toggle('on',S.open); anim(tp,S.open?'opening':'closing'); log(r,`Pending card <b>${S.open?'open':'closed'}</b>`); };
    const sd=$('.tb-send',cv); if(sd) sd.onclick=()=>log(r,'Faturar: see <b>Tab bar</b>');
    // lista (mobile)
    list.forEach(x=>{ const ff=$('#pd-pl-'+x.id,cv); if(!ff) return; const okb=$(`[data-plok="${x.id}"]`,cv); if(ff.dataset.mask) attachMask(ff,ff.dataset.mask);
      const upd=()=>{ okb.disabled=!ff.value.trim(); }; ff.addEventListener('input',upd); ff.addEventListener('change',upd);
      ff.addEventListener('keydown',e=>{ if(e.key==='Enter'&&ff.value.trim()) resolve(x,ff.value.trim(),ff); });
      okb.onclick=()=>resolve(x,ff.value.trim(),ff);
      $(`[data-plgo="${x.id}"]`,cv).onclick=()=>log(r,`Mobile · Ver no Campo: opens the field's tab (<b>${x.title}</b>) and flashes it`); }); };
  onSeg(r,(n,v)=>{ S[n]=v; draw(); log(r,''); });
  r._reset=()=>{ reset(); segSet(r,'size','desk'); segSet(r,'uc','ok'); draw(); };
  reset(); draw(); }});

/* ===== 7. Marcador fora da área ===== */
comp({id:'marcador', grp:'Revisão', t:'Marcador de pendência fora da área', iss:'COG-291',
 lead:'Quando a pendência está escondida pela rolagem, aparece na borda do container um marcador apontando para ela. Role a lista e a planilha.',
 beh:[['Pendência abaixo da área visível','Marcador na borda de baixo, seta ↓, na altura horizontal do item'],['Acima','Borda de cima, seta ↑'],['À direita/esquerda na planilha (rolagem lateral)','Marcador na borda da planilha, seta → ou ←, na linha do item'],['Clique no marcador','Rola até o item (suave) e ele pisca'],['Item visível','O marcador some']],
 notes:['Animação: o marcador balança 4 px na direção da seta (1 s, ease-in-out) + anel pulsando (1,4 s).','Na planilha, a coluna Item fixa conta como área escondida.','A área visível desconta a tab bar flutuante.','Com "reduzir movimento", sem animação.'],
 init(r){ const cv=$('.canvas',r);
  const draw=()=>{
    cv.innerHTML=`<div class="cx" style="position:relative;width:420px"><div data-sc style="height:320px;overflow:auto;background:var(--s100);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:12px">
      ${['Crédito compensado fora ponta','Saldo fora ponta','Consumo fora ponta'].map(t=>cardHTML(t,'1.250','kWh',{uid:'mk2'})).join('')}
      <div class="grade" data-g style="flex:none"><table><thead><tr><th class="stk">Item</th>${COLS.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>
        <tr><td class="stk">Demanda</td><td>75 <span class="cu">kW</span></td><td>32,41500 <span class="cu">R$/kW</span></td><td>25,24804 <span class="cu">R$/kW</span></td><td><span class="cu">R$</span> 99,92</td><td class="num pend" data-pid="icms"><span class="pw">${I.warn}</span></td><td><span class="cu">R$</span> 2.431,13</td></tr></tbody></table></div>
      ${['Demanda medida','Demanda contratada','Dias de leitura'].map(t=>cardHTML(t,'68','kW',{uid:'mk2'})).join('')}
      <div class="card pend" data-pid="cofins"><div class="ct"><span class="badge">${I.warn}</span>COFINS (alíquota)</div><div class="in erow"><label class="ufld"><input placeholder="3,38" aria-label="COFINS (alíquota)"><span class="u">%</span></label><button class="cp send" aria-label="Enviar">${I.send}</button></div><div class="hint">Não encontrado na fatura</div></div>
      ${['Total a pagar','Vencimento'].map(t=>cardHTML(t,'—','',{uid:'mk2'})).join('')}
      </div><div class="offl"></div></div>`;
    const wrap=$('.cx',cv), sc=$('[data-sc]',cv), g=$('[data-g]',cv), layer=$('.offl',cv);
    const clip=(a,b)=>({left:Math.max(a.left,b.left),right:Math.min(a.right,b.right),top:Math.max(a.top,b.top),bottom:Math.min(a.bottom,b.bottom)});
    const ARW={r:'arrow_right',l:'arrow_left',d:'arrow_drop_down',u:'arrow_drop_up'};
    const up=()=>{ const W=wrap.getBoundingClientRect(), cr=sc.getBoundingClientRect(), view={left:cr.left,right:cr.right,top:cr.top,bottom:cr.bottom}, items=[];
      $$('[data-pid]',sc).forEach(el=>{ const rr=el.getBoundingClientRect(); let dir=null,x,y; const grade=el.closest('.grade');
        if(grade){ const gr=grade.getBoundingClientRect(), stk=grade.querySelector('.stk').getBoundingClientRect().width, gv=clip({left:gr.left+stk,right:gr.right,top:gr.top,bottom:gr.bottom},view), inRows=rr.bottom>gv.top&&rr.top<gv.bottom;
          if(inRows&&rr.left>=gv.right-4){ dir='r'; x=gv.right-18; y=(rr.top+rr.bottom)/2; } else if(inRows&&rr.right<=gv.left+4){ dir='l'; x=gv.left+18; y=(rr.top+rr.bottom)/2; } }
        if(!dir){ if(rr.top>=view.bottom-4){ dir='d'; y=view.bottom-22; } else if(rr.bottom<=view.top+4){ dir='u'; y=view.top+22; } if(dir) x=Math.min(Math.max((rr.left+rr.right)/2,view.left+20),view.right-20); }
        if(dir) items.push({el,dir,x:x-W.left,y:y-W.top}); });
      const sig=items.map(o=>o.el.dataset.pid+o.dir+Math.round(o.x)+Math.round(o.y)).join('|'); if(layer.dataset.sig===sig) return; layer.dataset.sig=sig;
      layer.innerHTML=items.map((o,i)=>`<button class="offi ${o.dir}" data-i="${i}" style="left:${o.x}px;top:${o.y}px" aria-label="Ir para a pendência"><span class="b">${I.warn}</span><span class="ms f a" aria-hidden="true">${ARW[o.dir]}</span></button>`).join('');
      $$('.offi',layer).forEach(b=>b.onclick=()=>{ const o=items[+b.dataset.i], el=o.el, s=sc.getBoundingClientRect(), e=el.getBoundingClientRect();
        sc.scrollBy({top:e.top-(s.top+s.height/2-e.height/2),behavior:'smooth'});
        const gg=el.closest('.grade'); if(gg){ const gr=gg.getBoundingClientRect(); gg.scrollBy({left:e.left-(gr.left+gr.width/2-e.width/2),behavior:'smooth'}); }
        setTimeout(()=>flash(el),250); log(r,`Scrolled to <b>${el.dataset.pid==='icms'?'ICMS · Demanda':'COFINS'}</b>`); }); };
    sc.addEventListener('scroll',up); g.addEventListener('scroll',up); new ResizeObserver(up).observe(sc); up(); };
  r._reset=draw; draw(); }});

/* ===== 8. Atividade ===== */
comp({id:'atividade', grp:'Revisão', t:'Atividade', iss:'COG-292',
 lead:'Linha do tempo da fatura, mais recente no topo. Passe o mouse (ou foque com Tab) num evento de edição.',
 ctrls:`<button class="cbtn" data-a="edit">Simular edição de card</button><button class="cbtn" data-a="pend">Simular pendência resolvida</button><button class="cbtn" data-a="sys">Simular status do sistema</button>`,
 beh:[['Hover, foco ou toque num evento de edição','Abre o de → para (200 ms): antigo riscado sobre cinza, novo em negrito sobre verde-claro'],['Pendência resolvida','"pendente" em itálico → valor'],['Hover no autor','Mostra o nome'],['Evento novo','Entra no topo com um leve deslize (500 ms)']],
 notes:['Autor no canto: sistema = círculo preto com a marca Enershare; pessoa = iniciais com cor própria.','Ícone do evento por tipo: edição (cinza), alerta (laranja), ok (verde), status (preto).','Status do sistema em 1–2 palavras + data e hora.','Mobile: a Atividade abre pelo painel do header (botão histórico).'],
 init(r){ const cv=$('.canvas',r); let A;
  const reset=()=>{ A=[['Contrib. ilum. pública municipal editado','edit','11:20',false,ANA,{from:'R$ 89,40',to:'R$ 98,40'}],['Demanda contratada editado','edit','11:05',false,CAR,{from:'70 kW',to:'75 kW'}],['Vencimento editado','edit','10:51',false,ANA,{from:'24/03/2025',to:'25/03/2025'}],['Para revisar','alert','10:42'],['Lida','def','10:42'],['Lendo fatura','def','10:41'],['Recebida','def','10:40']]; };
  const difHTML=d=>`<div class="dif" aria-hidden="true"><span class="o ${d.from?'':'none'}">${d.from||'pendente'}</span><span class="ms" aria-hidden="true">arrow_forward</span><span class="t">${d.to}</span></div>`;
  const draw=()=>{ cv.innerHTML=`<div class="cx"><div class="panel p-act" style="width:284px;height:560px"><div class="act-h"><span class="ph">${MS('history',14)}</span><span class="t">Atividade</span><button class="ib sq" aria-label="Minimizar atividade">${MS('hide')}</button></div>
    <div class="act-list">${A.map((a,i)=>`${i?'<div class="link"></div>':''}<div class="ev ${a[3]?'new':''} ${a[5]?'has-dif':''}" ${a[5]?`tabindex="0" aria-label="${a[0]}: de ${a[5].from||'pendente'} para ${a[5].to}"`:''}><span class="i c-${a[1]}">${a[1]==='edit'?I.pen:a[1]==='ok'?I.check:a[1]==='alert'?I.warn:a[0]==='Recebida'?I.inbox:a[0]==='Lendo fatura'?I.hour:a[0]==='Lida'?I.doc:I.dot}</span>${who(a[4]||SYS)}<div class="n">${a[0]}</div><div class="d">13/03 às ${a[2]}</div>${a[5]?difHTML(a[5]):''}</div>`).join('')}</div></div></div>`;
    A.forEach(a=>a[3]=false); };
  $$('[data-a]',r).forEach(b=>b.onclick=()=>{ const k=b.dataset.a;
    if(k==='edit') A.unshift(['Total a pagar editado','edit',now(),true,ME,{from:'R$ 4.400,13',to:'R$ 4.440,13'}]);
    if(k==='pend') A.unshift(['COFINS corrigido','edit',now(),true,ME,{from:'',to:'3,38 %'}]);
    if(k==='sys') A.unshift(['Sem pendências','ok',now(),true]);
    draw(); log(r,'New event on top'); });
  r._reset=()=>{ reset(); draw(); }; reset(); draw(); }});

/* ===== 9. Validar UC ===== */
comp({id:'identidade', grp:'Fatura', t:'Validar UC', lib:'Card Header md · Combobox · Command Base · Button · Info Pill', iss:'COG-293',
 lead:'Antes de revisar, confirma de qual unidade é a fatura. A distribuidora vem do cadastro da UC. O bloco fica acima do painel Detalhes e minimiza junto com ele.',
 ctrls:seg('st','Estado',[['auto','Confirmar'],['nf','Vincular'],['bad','Não confere'],['ok','Validada'],['sent','Enviada']],'auto')+`<button class="cbtn" data-min>Minimizar Detalhes</button>`,
 beh:[['Abrir o campo (clique, Enter ou ↓)','Popover com busca + opções de rádio: UC · distribuidora · titular'],['Digitar na busca','Filtra por número da UC, distribuidora ou titular'],['↑ ↓ · Enter · Esc','Navega, escolhe, fecha (o foco volta ao campo)'],['Escolher UC de outra distribuidora','Título, rótulo e campo em vermelho: "A fatura é da X, mas esta unidade é da Y"; Validar desabilitado'],['Sem unidade escolhida','Validar desabilitado'],['Validar alterações','Pílula verde "UC 3014567890 validada · Luz do Vale" + Alterar; os dados abaixo são liberados'],['Alterar','Volta para o campo; os dados travam de novo'],['Minimizar Detalhes','O bloco some junto com o painel; reabrir traz os dois']],
 notes:['Título por estado: "Confirme a unidade da fatura" (achada pela leitura) · "Vincule a unidade da fatura" (não achada) · "A unidade não confere com a fatura".','Ajuda: "Encontrada pela leitura da fatura." ou "Lida na fatura: UC … · …".','Até validar: dados esmaecidos (opacidade .45) e sem clique; o card de Pendências manda para a UC.','Medidas (Figma): bloco #f5f5f4, raio 16, padding 24 (16 no estreito), título Poppins 20 #292524, campo 44 px, botão 40 px; desabilitado = 50% de opacidade. Validada/enviada: bloco 72 px com pílula 48 px (ícone verified #65a30d, texto Inter Bold 14).','Popover abre logo abaixo do texto de ajuda; nenhuma opção destacada até usar as setas.','Regra de negócio: COG-282 (stg). Código: <code>assets/identidade.js</code>.'],
 init(r){ const cv=$('.canvas',r); let S, min=false;
  const set=v=>{ S={read:v==='nf'?null:'3014567890',uc:v==='nf'?'':v==='bad'?'3014002210':'3014567890',ok:v==='ok',sent:v==='sent'?{at:'07/10/2026 às 14:32'}:null}; draw(); };
  const draw=()=>{ cv.innerHTML=`<div class="cx" style="width:680px;max-width:100%"><div class="panel p-det" data-w style="background:none;gap:16px;min-width:0;${min?'display:none':''}"><div data-id></div>
      <div style="background:var(--s100);border-radius:16px;padding:16px;${S.ok||S.sent?'':'opacity:.45;pointer-events:none;user-select:none'}"><div class="sec-t" style="margin:0 0 12px">Créditos</div><div class="grid g2">${cardHTML('Crédito compensado','4.100','kWh',{uid:'id2'})}${cardHTML('Crédito abatido','1.837,46','R$',{uid:'id2'})}</div></div></div>
      ${min?`<div style="text-align:center;color:var(--mid);padding:24px">Details minimized: the UC block hides too.</div>`:''}</div>`;
    if(min) return;
    Identity.mount($('[data-id]',cv),S,ev=>{ const u=Identity.UCS.find(x=>x.uc===S.uc); draw();
      if(ev==='escolher') log(r,u&&u.dist!==Identity.INV.dist?`<b>Mismatch</b>: ${Identity.label(S.uc)} is another utility`:`Picked <b>${Identity.label(S.uc)}</b> · Validate enabled`);
      if(ev==='validar') log(r,'<b>Validated</b>: data unlocked');
      if(ev==='alterar') log(r,'Change: data <b>locked</b> again'); });
    bindCards(cv,()=>{}); };
  onSeg(r,(n,v)=>{ set(v); log(r,''); });
  $('[data-min]',r).onclick=e=>{ min=!min; e.target.textContent=min?'Open Details':'Minimize Details'; draw(); log(r,min?'Details <b>minimized</b>: UC block hides too':'Details <b>open</b>: block back'); };
  r._reset=()=>{ min=false; $('[data-min]',r).textContent='Minimize Details'; segSet(r,'st','auto'); set('auto'); };
  set('auto'); }});

/* ===== 10. Extrair novamente ===== */
comp({id:'extrair', grp:'Fatura', t:'Extrair novamente', lib:'Button · Alert Dialog', iss:'COG-293',
 lead:'Pede uma nova leitura da fatura. São 2 tentativas manuais. A tela não mostra contador: ele aparece só no diálogo.',
 ctrls:seg('n','Tentativas restantes',[['2','2'],['1','1'],['0','0']],'2')+seg('st','Fatura',[['rev','Em revisão'],['sent','Enviada']],'rev'),
 beh:[['Clique','Abre o diálogo de confirmação; foco no Cancelar'],['Confirmar','Gasta uma tentativa; a fatura volta para "Lendo fatura" (aviso)'],['Cancelar, Esc ou clique fora','Fecha; o foco volta ao botão'],['Tab no diálogo','Fica preso entre Cancelar e Extrair novamente'],['Sem tentativas','Botão desabilitado (title "Sem tentativas restantes")'],['Fatura enviada','O botão sai; no lugar, "Enviada por … em …"']],
 notes:['Texto: "A leitura recomeça do zero e as correções feitas aqui são descartadas. Restam N de 2 tentativas." Na última: "Esta é a última tentativa."','Botão outline 36 px, raio 8, ícone refresh 18 px.','Mobile: fica no painel do header (botão quadrado com refresh).'],
 init(r){ const cv=$('.canvas',r); let S={n:2,st:'rev'};
  const draw=()=>{ cv.innerHTML=`<div class="cx" style="width:100%"><div style="display:flex;align-items:flex-start;gap:16px"><div><div style="font:600 24px/1.3 Poppins,Inter,sans-serif;color:var(--brand)">Padaria Estrela do Sul Ltda · fatura-mar25.pdf</div></div><div data-acts style="margin-left:auto;display:flex;gap:8px"></div></div></div>`;
    const h=$('[data-acts]',cv);
    if(S.st==='sent'){ h.innerHTML=`<span class="sent-by">Enviada por Eduardo Moreira em 07/10/2026 às 14:32</span>`; return; }
    h.innerHTML=`<button class="btn outline" data-re ${S.n?'':'disabled title="Sem tentativas restantes"'}>${MS('refresh',18)}Extrair novamente</button>`;
    $('[data-re]',cv).onclick=dlg; };
  const dlg=()=>{ const prev=document.activeElement, ov=document.createElement('div'); ov.className='cx'; ov.innerHTML=`<div class="dlg-ov"><div class="dlg" role="alertdialog" aria-modal="true" aria-labelledby="exT" aria-describedby="exD"><h2 id="exT">Extrair a fatura novamente?</h2><p id="exD">A leitura recomeça do zero e as correções feitas aqui são descartadas. ${S.n===1?'Esta é a última tentativa.':`Restam ${S.n} de 2 tentativas.`}</p><div class="acts"><button class="btn outline" data-x>Cancelar</button><button class="btn primary" data-y>Extrair novamente</button></div></div></div>`;
    document.body.appendChild(ov); const o=$('.dlg-ov',ov);
    const close=()=>{ ov.remove(); ($('[data-re]',cv)||prev)?.focus?.(); }; // foco volta ao botão (no Safari o clique não foca)
    $('[data-x]',ov).onclick=close; o.onclick=e=>{ if(e.target===o) close(); };
    o.onkeydown=e=>{ if(e.key==='Escape') close(); if(e.key==='Tab'){ const f=$$('button',o), i=f.indexOf(document.activeElement); e.preventDefault(); f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus(); } };
    $('[data-y]',ov).onclick=()=>{ close(); S.n--; segSet(r,'n',String(S.n)); toast('Fatura enviada para nova leitura'); draw(); log(r,`Attempt used · <b>${S.n}</b> left${S.n?'':' (button disabled)'}`); };
    $('[data-x]',ov).focus(); };
  onSeg(r,(k,v)=>{ S[k]=k==='n'?+v:v; draw(); log(r,''); });
  r._reset=()=>{ S={n:2,st:'rev'}; segSet(r,'n','2'); segSet(r,'st','rev'); draw(); };
  draw(); }});

/* ===== 11. Mobile: header e painel ===== */
comp({id:'mobile', grp:'Mobile', t:'Header e barra ao rolar', lib:'Header Size=Mobile, Context=Invoice', iss:'COG-294',
 lead:'No mobile, header e tab bar saem do caminho quando se rola para baixo. Os badges do header abrem um painel com o resumo da fatura.',
 beh:[['Rolar para baixo (≥ 4 px)','Header sobe e tab bar desce (280 ms, ease)'],['Rolar para cima ou chegar ao topo (< 8 px)','Voltam'],['Trocar de tela pela tab bar','Voltam'],['Rolagem lateral (planilha)','Não conta'],['Tocar num badge ou na pílula','Painel sobre fundo desfocado: status, referência, distribuidora ↗, UC ↗, histórico, baixar, abrir'],['Histórico','Mostra a Atividade dentro do painel; "‹" volta'],['×, toque fora ou Esc','Fecha; o foco volta ao badge (Esc na Atividade volta ao resumo)']],
 notes:['Badges de 34 px sobrepostos (−12 px): UC, distribuidora, referência; a pílula de pendências fica por cima (vira check verde sem número quando zera).','Painel: fundo rgba(245,245,244,.4) + blur 6 px; entra descendo 8 px e de .98 para 1 (250 ms).','Fatura (PDF) no mobile: pinça 1×–4× mantendo o ponto entre os dedos; toque duplo alterna cabe na tela ↔ 2×.'],
 init(r){ const cv=$('.canvas',r);
  const actHTML=()=>`<div class="m-actlist">${[['Vencimento editado','edit','10:51',ANA,{from:'24/03/2025',to:'25/03/2025'}],['Para revisar','alert','10:42'],['Lida','def','10:42'],['Recebida','def','10:40']].map((a,i)=>`${i?'<div class="link"></div>':''}<div class="ev ${a[4]?'has-dif':''}" ${a[4]?'tabindex="0"':''}><span class="i c-${a[1]}">${a[1]==='edit'?I.pen:a[1]==='alert'?I.warn:a[0]==='Recebida'?I.inbox:I.doc}</span>${who(a[3]||SYS)}<div class="n">${a[0]}</div><div class="d">13/03 às ${a[2]}</div>${a[4]?`<div class="dif"><span class="o">${a[4].from}</span><span class="ms">arrow_forward</span><span class="t">${a[4].to}</span></div>`:''}</div>`).join('')}</div>`;
  const infoHTML=()=>`<div class="m-sec"><span class="m-hb alert"><span class="msr fill" aria-hidden="true">warning</span>3 pendências</span><span class="m-hb brand"><span class="msr fill" aria-hidden="true">calendar_today</span>Março de 2025</span>
    <div class="m-row"><span class="m-hb"><span class="msr fill" aria-hidden="true">electric_meter</span>Luz do Vale</span><button class="m-go" aria-label="Abrir distribuidora"><span class="mss" aria-hidden="true">open_in_new</span></button></div>
    <div class="m-row"><span class="m-hb"><span class="msr fill" aria-hidden="true">electrical_services</span>UC 3014567890</span><button class="m-go" aria-label="Abrir unidade consumidora"><span class="mss" aria-hidden="true">open_in_new</span></button></div></div>
    <div class="m-acts"><button class="m-ab" data-hist aria-label="Atividade"><span class="mss" aria-hidden="true">history</span></button><button class="m-ab" aria-label="Baixar fatura"><span class="mss" aria-hidden="true">download</span></button><button class="m-ab" aria-label="Abrir fatura em nova aba"><span class="mss" aria-hidden="true">open_in_new</span></button><button class="m-ab" aria-label="Extrair novamente"><span class="mss" aria-hidden="true">refresh</span></button></div>`;
  const draw=()=>{ cv.innerHTML=`<div class="phone"><div class="cx mob" data-ph style="position:absolute;inset:0;display:flex;flex-direction:column;overflow:hidden">
      <header class="m-head" data-head><button class="m-menu" aria-label="Menu"><span class="mss" aria-hidden="true">menu</span></button><div class="m-tt"><b>Padaria Estrela do Sul Ltda</b><span>Fatura · Mar/2025</span></div>
        <div class="m-badges"><button class="m-bd uc" data-info aria-label="Unidade consumidora 3014567890"><span class="msr fill" aria-hidden="true">electrical_services</span></button><button class="m-bd ink" data-info aria-label="Distribuidora: Luz do Vale"><span class="msr fill" aria-hidden="true">electric_meter</span></button><button class="m-bd brand" data-info aria-label="Referência: março de 2025"><span class="msr fill" aria-hidden="true">calendar_today</span></button><button class="m-pill alert" data-info aria-label="3 pendências"><span class="msr fill" aria-hidden="true">warning</span>3</button></div></header>
      <div data-sc style="flex:1;overflow:auto"><div class="bar"><div class="tabs"><button class="tab on">Resumo</button><button class="tab">Itens</button><button class="tab">Consumo</button><button class="tab">Identificação</button></div></div>
        <div style="padding:0 24px 120px;display:flex;flex-direction:column;gap:20px"><div class="sec-t">Créditos</div><div class="grid g2">${['Crédito compensado fora ponta','Crédito abatido fora ponta','Crédito compensado ponta','Crédito abatido ponta','Saldo fora ponta','Saldo ponta','Consumo fora ponta','Consumo ponta'].map((t,i)=>cardHTML(t,(1000+i*137).toLocaleString('pt-BR'),'kWh',{uid:'mb'})).join('')}</div></div></div>
      <nav class="tabbar" data-tb style="position:absolute;left:50%;bottom:16px;transform:translateX(-50%);transition:transform .28s ease"><span class="tb-main"><button class="tb" data-scr><span class="ic">${MS('picture_as_pdf',26,1)}</span><span>Fatura</span></button><button class="tb on" data-scr><span class="ic">${MS('description',26,1)}</span><span>Detalhes</span></button></span><button class="tb tb-pend" data-scr><span class="ic">${MS('warning',26,1)}<b class="cnt">3</b></span><span>Pendências</span></button></nav>
      <div class="m-ov" hidden><div class="m-sheet" role="dialog" aria-modal="true" aria-labelledby="mbT"><div class="m-nav"><button class="m-nb" data-back aria-label="Voltar" hidden><span class="msr fill" aria-hidden="true">chevron_left</span></button><b id="mbT">Padaria Estrela do Sul Ltda</b><button class="m-nb" data-close aria-label="Fechar"><span class="msr" aria-hidden="true">close</span></button></div><div class="m-body"></div></div></div></div></div>`;
    const ph=$('[data-ph]',cv), head=$('[data-head]',cv), tb=$('[data-tb]',cv), sc=$('[data-sc]',cv), ov=$('.m-ov',cv); let last=0, trig=null, view=null;
    const setChrome=show=>{ head.style.marginTop=show?'':`-${head.offsetHeight}px`; tb.style.transform=show?'translateX(-50%)':'translate(-50%, calc(100% + 40px))'; };
    sc.addEventListener('scroll',()=>{ const t=sc.scrollTop, d=t-last; last=t; if(Math.abs(d)<4) return; if(t<8){ setChrome(true); log(r,'Top: header and bar <b>back</b>'); return; } setChrome(d<0); log(r,d<0?'Scroll up: <b>back</b>':'Scroll down: header <b>up</b>, bar <b>down</b>'); });
    $$('[data-scr]',cv).forEach(b=>b.onclick=()=>{ $$('[data-scr]',cv).forEach(x=>x.classList.toggle('on',x===b)); anim(b,'opening'); setChrome(true); log(r,'Screen changed: header and bar <b>back</b>'); });
    const show=v=>{ view=v; $('#mbT',cv).textContent=v==='act'?'Atividade':'Padaria Estrela do Sul Ltda'; $('[data-back]',cv).hidden=v!=='act'; const b=$('.m-body',cv); b.innerHTML=v==='act'?actHTML():infoHTML(); b.scrollTop=0;
      if(v==='info'){ $('[data-hist]',cv).onclick=()=>{ show('act'); log(r,'History: <b>Activity</b> inside the sheet'); }; $$('.m-go',cv).forEach(g=>g.onclick=()=>toast('Opens the registry (out of scope)')); } };
    const close=()=>{ ov.hidden=true; view=null; trig?.focus(); log(r,'Sheet <b>closed</b>; focus back to badge'); };
    $$('[data-info]',cv).forEach(b=>b.onclick=()=>{ trig=b; ov.hidden=false; show('info'); $('[data-close]',cv).focus(); log(r,'Header sheet <b>opened</b>'); });
    $('[data-back]',cv).onclick=()=>show('info'); $('[data-close]',cv).onclick=close;
    ov.addEventListener('click',e=>{ if(e.target===ov) close(); });
    ph.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!ov.hidden){ if(view==='act') show('info'); else close(); } });
    bindCards(cv,()=>{}); };
  r._reset=draw; draw(); }});

/* ===== 12. Filtros (listagem) ===== */
comp({id:'filtro', grp:'Listagem', t:'Busca e filtros', lib:'Filter · Command Base', iss:'COG-295',
 lead:'Padrão do Cadastro: a linha de filtros fica visível por padrão, abaixo da busca. Cada filtro abre busca + opções.',
 beh:[['Clique num filtro','Abre o menu: busca, opções (caixa de seleção; data = rádio) e Limpar seleção. Clicar de novo fecha'],['Marcar opção','Aplica na hora e o menu continua aberto; o chip mostra até 2 valores + "+N"'],['Escolher data','Aplica e fecha o menu'],['Limpar seleção','Volta o filtro para Todas/Todos'],['Limpar todos','Aparece só com algum filtro ativo'],['Funil','Mostra/esconde a linha de filtros (verde = visível). Escondida, os filtros continuam valendo e o funil mostra quantos estão ativos'],['Esc ou clique fora','Fecha o menu']],
 notes:['Filtros: Situação · Pendências · Concessionária · Enviado por · Recebida em. Padrão: Todas / Todos / Qualquer data.','Chip: rótulo | valor(es) ▾, altura 40, borda #f5f5f4.','Busca por titular, UC ou nome do arquivo.','Mobile: funil à esquerda e filtros com rolagem lateral; busca embaixo.'],
 init(r){ const cv=$('.canvas',r); let S;
  const FDEF=[{k:'st',label:'Situação',all:'Todas',ph:'Pesquise por uma situação',opts:['Para revisar','Erro na leitura','Erro no faturamento','Em revisão','Faturando','Lendo fatura','Faturada','Recusada','Duplicada']},
    {k:'pend',label:'Pendências',all:'Todas',ph:'Pesquise por pendências',opts:['Com pendências','Sem pendências','Não se aplica']},
    {k:'conc',label:'Concessionária',all:'Todas',ph:'Pesquise por uma concessionária',opts:['Força Sul','Luz do Vale','Não identificada']},
    {k:'env',label:'Enviado por',all:'Todos',ph:'Pesquise por uma pessoa',opts:['Ana Ribeiro','Carlos Mendes','Eduardo Moreira']},
    {k:'dt',label:'Recebida em',date:true,ph:'Pesquise por um período',opts:['Qualquer data','Últimos 7 dias','Últimos 30 dias']}];
  const reset=()=>{ S={F:{st:[],pend:[],conc:[],env:[]},dt:'Qualquer data',showF:true,fOpen:null,q:''}; };
  const active=()=>FDEF.filter(f=>f.date?S.dt!=='Qualquer data':S.F[f.k].length).length;
  const chipHTML=f=>{ const vals=f.date?[S.dt]:(S.F[f.k].length?S.F[f.k]:[f.all]); const shown=vals.slice(0,2), extra=vals.length-shown.length;
    return `<button type="button" class="fchip ${S.fOpen===f.k?'open':''}" data-fk="${f.k}" aria-haspopup="dialog" aria-expanded="${S.fOpen===f.k}"><span class="fl">${f.label}</span><span class="fsep"></span>${shown.map(v=>`<span class="fb">${esc(v)}</span>`).join('')}${extra?`<span class="fx">+${extra}</span>`:''}<span class="msr">expand_more</span></button>`; };
  const draw=()=>{ const n=active();
    cv.innerHTML=`<div class="cx lst" style="position:relative;width:100%;min-height:330px"><div class="tools"><div class="field grow"><span class="fbtn" aria-hidden="true"><span><span class="msr">search</span></span></span><input data-q placeholder="Buscar por titular, UC ou nome do arquivo" value="${esc(S.q)}" aria-label="Buscar faturas" autocomplete="off">
      <button class="fbtn ${S.showF?'on':''}" data-funnel aria-pressed="${S.showF}" aria-label="${S.showF?'Esconder filtros':'Mostrar filtros'}${!S.showF&&n?` (${n} ativo${n>1?'s':''})`:''}"><span><span class="msr fill">filter_alt</span>${!S.showF&&n?`<b class="fcount">${n}</b>`:''}</span></button></div></div>
      ${S.showF?`<div class="frow" role="group" aria-label="Filtros">${FDEF.map(chipHTML).join('')}${n?`<button type="button" class="btn sm sec" data-clearall>Limpar todos</button>`:''}</div>`:''}
      <div class="dd fp" hidden role="dialog"><div class="sec"><label class="fsearch"><span class="msr">search</span><input data-fq autocomplete="off" aria-label="Pesquisar opções"></label><div class="fopts" role="group"></div><button type="button" class="btn out sm fclr">Limpar seleção</button></div></div></div>`;
    const W=$('.cx',cv);
    $('[data-q]',cv).oninput=e=>{ S.q=e.target.value; };
    $('[data-funnel]',cv).onclick=()=>{ S.showF=!S.showF; S.fOpen=null; draw(); $('[data-funnel]',cv).focus(); log(r,S.showF?'Filters <b>shown</b>':`Filters <b>hidden</b>${active()?` · funnel shows ${active()} active`:''}`); };
    const ca=$('[data-clearall]',cv); if(ca) ca.onclick=()=>{ reset(); S.showF=true; draw(); log(r,'<b>Clear all</b>'); };
    $$('[data-fk]',cv).forEach(b=>b.onclick=e=>{ e.stopPropagation(); const was=S.fOpen===b.dataset.fk; S.fOpen=was?null:b.dataset.fk; draw(); if(!was) r._open(); });
    const dd=$('.dd',cv);
    dd.onclick=e=>{ e.stopPropagation(); const f=FDEF.find(x=>x.k===S.fOpen); if(!f) return;
      if(e.target.closest('.fclr')){ if(f.date) S.dt='Qualquer data'; else S.F[f.k]=[]; log(r,`${f.label}: <b>${f.all||'Qualquer data'}</b> (cleared)`); }
      else { const o=e.target.closest('[data-fv]'); if(!o) return; const v=o.dataset.fv; if(f.date) S.dt=v; else S.F[f.k]=S.F[f.k].includes(v)?S.F[f.k].filter(x=>x!==v):[...S.F[f.k],v]; log(r,`${f.label}: <b>${f.date?S.dt:(S.F[f.k].join(', ')||f.all)}</b>`); }
      if(f.date){ S.fOpen=null; draw(); $(`[data-fk="${f.k}"]`,cv)?.focus(); } else { const q=$('[data-fq]',cv).value; draw(); r._open(q); } };
    dd.onkeydown=e=>{ if(e.key==='Escape'){ const k=S.fOpen; S.fOpen=null; draw(); $(`[data-fk="${k}"]`,cv)?.focus(); } };
    function openFilter(q=''){ const f=FDEF.find(x=>x.k===S.fOpen), b=$(`[data-fk="${f.k}"]`,cv), fq=$('[data-fq]',cv);
      fq.value=q; fq.placeholder=f.ph; dd.setAttribute('aria-label','Filtro: '+f.label);
      const fill=()=>{ const t=fq.value.trim().toLowerCase(), opts=f.opts.filter(o=>!t||o.toLowerCase().includes(t));
        $('.fopts',dd).innerHTML=opts.length?opts.map(o=>{ const on=f.date?S.dt===o:S.F[f.k].includes(o); return `<button type="button" role="${f.date?'menuitemradio':'menuitemcheckbox'}" aria-checked="${on}" data-fv="${esc(o)}"><span>${esc(o)}</span><span class="${f.date?'rdo':'cbx'} ${on?'on':''}">${on&&!f.date?'<span class="mss">check</span>':''}</span></button>`; }).join(''):`<p class="fnone">Nada encontrado.</p>`; };
      fq.oninput=fill; fill(); dd.hidden=false;
      const wb=W.getBoundingClientRect(), bb=b.getBoundingClientRect(); dd.style.top=(bb.bottom-wb.top+4)+'px'; dd.style.left=Math.max(0,Math.min(bb.left-wb.left,W.clientWidth-dd.offsetWidth))+'px';
      fq.focus(); fq.setSelectionRange(q.length,q.length); }
    r._open=openFilter; // sempre o menu do desenho atual
  };
  document.addEventListener('click',e=>{ if(S&&S.fOpen&&!e.target.closest('.dd')&&!e.target.closest('[data-fk]')){ S.fOpen=null; draw(); } });
  r._reset=()=>{ reset(); draw(); }; reset(); draw(); }});

/* ===== 13. Envio de fatura ===== */
comp({id:'upload', grp:'Listagem', t:'Nova fatura (envio)', lib:'File Upload Item', iss:'COG-295',
 lead:'Escolher ou arrastar arquivos, conferir a lista e só então enviar. Os arquivos sobem um por vez.',
 ctrls:`<span><span class="k">Simular</span></span><button class="cbtn" data-s="ok">fatura.pdf</button><button class="cbtn" data-s="img">foto.jpg</button><button class="cbtn" data-s="type">planilha.xlsx</button><button class="cbtn" data-s="big">scan (32 MB)</button><button class="cbtn" data-s="empty">vazio (0 KB)</button><button class="cbtn" data-s="dup">fatura.pdf de novo</button><button class="cbtn" data-s="many">22 arquivos</button>`,
 beh:[['Arrastar sobre o modal','Área fica verde: "Solte para adicionar N arquivos"'],['Soltar ou escolher','Arquivo entra na lista como "Aguardando envio"; a área vira uma faixa menor'],['Tipo errado, vazio ou > 20 MB','Item vermelho com o motivo; não conta no envio'],['Arquivo repetido','Não entra; aviso "… já está na lista"'],['Mais de 20','Os excedentes ficam de fora; aviso'],['Remover (×)','Tira da lista'],['Enviar N faturas','Sobe um por vez (barra + %); vira "Enviada para leitura" com check; durante o envio não dá para remover nem cancelar'],['Fim do envio','O modal fecha e as faturas entram no topo da listagem como "Lendo fatura", destacadas']],
 notes:['Aceita PDF, JPG, PNG e WebP; até 20 MB cada; até 20 arquivos.','O botão mostra a contagem só dos válidos ("Enviar 2 faturas"); sem válidos, desabilitado.','Mobile: antes, escolha entre "Tirar foto da fatura" (câmera com enquadramento; sem permissão, câmera do aparelho) e "Escolher arquivos".'],
 init(r){ const cv=$('.canvas',r), MAXF=20, MAXB=20*1024*1024, OK_EXT=/\.(pdf|jpe?g|png|webp)$/i; let NF;
  const fmtMB=b=>b<102400?Math.max(1,Math.round(b/1024))+' KB':(b/1048576).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+' MB';
  const valid=()=>NF.files.filter(f=>f.state!=='err');
  const reset=()=>{ NF={files:[],sending:false,seq:0,drag:0,run:{}}; }; // run: Reiniciar cancela um envio em andamento
  const addFiles=list=>{ let extra=0; const dup=[];
    for(const f of [...list]){ if(NF.files.some(x=>x.name===f.name&&x.bytes===f.size)){ dup.push(f.name); continue; } if(NF.files.length>=MAXF){ extra++; continue; }
      const okType=/^(application\/pdf|image\/(jpeg|png|webp))$/.test(f.type)||OK_EXT.test(f.name), img=/^image\//.test(f.type)||/\.(jpe?g|png|webp)$/i.test(f.name);
      const it={id:++NF.seq,name:f.name,bytes:f.size,size:fmtMB(f.size),icon:img?'image':'picture_as_pdf',state:'ready',pct:0,err:''};
      if(!okType){ it.state='err'; it.err='Formato não aceito. Envie PDF, JPG, PNG ou WebP.'; } else if(f.size===0){ it.state='err'; it.size='0 KB'; it.err='Arquivo vazio. Escolha o arquivo de novo.'; } else if(f.size>MAXB){ it.state='err'; it.err='Maior que 20 MB. Diminua o arquivo ou tire uma foto da fatura.'; }
      NF.files.push(it); }
    if(extra){ toast(`Limite de ${MAXF} arquivos por envio. ${extra} ${extra>1?'ficaram':'ficou'} de fora.`); log(r,`<b>${extra}</b> left out (limit 20)`); }
    else if(dup.length){ toast(dup.length>1?`${dup.length} arquivos já estavam na lista.`:`${dup[0]} já está na lista.`); log(r,'Duplicate: <b>not added</b>'); }
    render(); };
  const fileHTML=f=>{ const err=f.state==='err', up=f.state==='up', done=f.state==='done';
    const tx=up?`<div class="l1"><span class="nm">${esc(f.name)}</span><span class="sz">· ${f.size}</span><span class="pc">${f.pct}%</span></div><div class="trk"><i style="width:${f.pct}%"></i></div>`
      :`<div class="l1"><span class="nm" title="${esc(f.name)}">${esc(f.name)}</span><span class="sz">· ${f.size}</span></div><div class="stt">${err?f.err:done?'Enviada para leitura':'Aguardando envio'}</div>`;
    const act=done?`<span class="ok" aria-label="Enviada"><span class="msr">check</span></span>`:(up||NF.sending)?'':`<button type="button" class="act" data-rm="${f.id}" aria-label="Remover ${esc(f.name)}"><span class="msr">close</span></button>`;
    return `<div class="fi ${err?'err':''} ${done?'done':''} ${up?'up':''}" data-fid="${f.id}"><span class="ty"><span class="msr ${err||done?'fill':''}">${err?'warning':f.icon}</span></span><div class="tx">${tx}</div>${act}</div>`; };
  const render=()=>{ const n=valid().length;
    const list=NF.files.length?`<div class="files">${NF.files.map(fileHTML).join('')}</div>`:'';
    const more=NF.sending?'':NF.files.length?`<div class="drop mini" data-drop><span class="msr big">upload_file</span><span class="t1x">Arraste mais arquivos ou</span><button type="button" class="lnk pick" data-pick>escolha no computador</button></div>`
      :`<div class="drop" data-drop><span class="msr big">upload_file</span><span class="t1">Arraste as faturas para cá</span><span class="or">ou</span><button type="button" class="btn out sm pick" data-pick>Escolher arquivos</button><span class="cap">PDF, JPG, PNG ou WebP · até 20 MB cada · até 20 arquivos</span></div>`;
    const label=NF.sending?`<span class="msr spin">progress_activity</span>Enviando…`:n?`Enviar ${n} fatura${n>1?'s':''}`:'Enviar';
    cv.innerHTML=`<div class="cx lst"><div class="dlg nf" data-nf><div class="dh"><h2>Nova fatura</h2><p>Envie a fatura em PDF ou imagem. A leitura dos dados começa assim que o envio termina.</p></div><div class="db">${list}${more}</div><div class="df"><button type="button" class="btn out" data-cancel ${NF.sending?'disabled':''}>Cancelar</button><button type="button" class="btn pri" data-send ${n&&!NF.sending?'':'disabled'}>${label}</button></div><button type="button" class="ibtn x" aria-label="Fechar" data-cancel><span class="mss">close</span></button></div><input type="file" multiple hidden data-input accept="application/pdf,image/jpeg,image/png,image/webp,.pdf,.jpg,.jpeg,.png,.webp"></div>`;
    const inp=$('[data-input]',cv); $$('[data-pick]',cv).forEach(b=>b.onclick=()=>inp.click()); inp.onchange=e=>{ if(e.target.files.length) addFiles(e.target.files); e.target.value=''; };
    $$('[data-rm]',cv).forEach(b=>b.onclick=()=>{ NF.files=NF.files.filter(f=>f.id!==+b.dataset.rm); render(); log(r,'Removed'); });
    $$('[data-cancel]',cv).forEach(b=>b.onclick=()=>{ if(NF.sending){ toast('Aguarde o envio terminar.'); return; } reset(); render(); log(r,'Cancelled: list cleared'); });
    $('[data-send]',cv).onclick=send;
    const nf=$('[data-nf]',cv), resetDrop=()=>{ const d=$('[data-drop]',cv); if(!d) return; d.classList.remove('over'); const t=d.querySelector('.t1,.t1x'); if(t&&t.dataset.o) t.textContent=t.dataset.o; };
    nf.ondragenter=e=>{ if(NF.sending) return; e.preventDefault(); NF.drag++; const d=$('[data-drop]',cv); if(!d||d.classList.contains('over')) return; d.classList.add('over'); const k=e.dataTransfer&&e.dataTransfer.items?e.dataTransfer.items.length:0, t=d.querySelector('.t1,.t1x'); if(t){ t.dataset.o=t.textContent; t.textContent=k?`Solte para adicionar ${k} arquivo${k>1?'s':''}`:'Solte para adicionar'; } };
    nf.ondragover=e=>{ if(!NF.sending) e.preventDefault(); };
    nf.ondragleave=()=>{ if(--NF.drag<=0){ NF.drag=0; resetDrop(); } };
    nf.ondrop=e=>{ e.preventDefault(); NF.drag=0; resetDrop(); if(!NF.sending&&e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }; };
  const send=()=>{ const q=valid(); if(!q.length) return; NF.sending=true; NF.files=q; render(); log(r,`Uploading <b>${q.length}</b>, one at a time`); let i=0; const run=NF.run;
    const step=()=>{ if(NF.run!==run) return; const f=q[i]; if(!f){ setTimeout(()=>{ if(NF.run!==run) return; toast(`${q.length} fatura${q.length>1?'s':''} enviada${q.length>1?'s':''}`); log(r,`Done: modal closes; new rows on top as <b>Lendo fatura</b>`); reset(); render(); },700); return; }
      f.state='up'; f.pct=0; render();
      const tm=setInterval(()=>{ if(NF.run!==run) return clearInterval(tm); f.pct=Math.min(100,f.pct+8+Math.round(Math.random()*14));
        if(f.pct>=100){ clearInterval(tm); f.state='done'; i++; render(); setTimeout(step,250); return; }
        const el=$(`[data-fid="${f.id}"]`,cv); if(el){ el.querySelector('.trk i').style.width=f.pct+'%'; el.querySelector('.pc').textContent=f.pct+'%'; } },120); };
    step(); };
  const SIM={ok:{name:'fatura-luzdovale-mar25.pdf',type:'application/pdf',size:840000},img:{name:'foto-fatura.jpg',type:'image/jpeg',size:2300000},type:{name:'planilha.xlsx',type:'application/vnd.ms-excel',size:30000},big:{name:'scan-alta-resolucao.pdf',type:'application/pdf',size:32*1048576},empty:{name:'vazio.pdf',type:'application/pdf',size:0},dup:{name:'fatura-luzdovale-mar25.pdf',type:'application/pdf',size:840000}};
  $$('[data-s]',r).forEach(b=>b.onclick=()=>{ if(NF.sending) return toast('Aguarde o envio terminar.'); const k=b.dataset.s; addFiles(k==='many'?Array.from({length:22},(_,i)=>({name:`fatura-${String(i+1).padStart(2,'0')}.pdf`,type:'application/pdf',size:500000+i})):[SIM[k]]); });
  r._reset=()=>{ reset(); render(); }; reset(); render(); }});

/* ---------- documentação (EN, curta). A interface do produto continua em pt-BR ---------- */
const SZ=seg('size','Size',[['desk','Desktop'],['mob','Mobile']],'desk');
const DOC={
 tabbar:{grp:'Navigation',t:'Tab bar',lead:'Opens/closes panels on desktop, switches screens on mobile. The right button depends on the invoice state.',
  ctrls:seg('acao','Right button',[['pend','Pending'],['send','Bill'],['sent','Sent']],'pend')+SZ,
  beh:[['Click Fatura/Detalhes/Atividade','Desktop: toggles the panel (several can be on). Mobile: switches screen (one on).'],['Open / close','Icon bounces / shrinks (450 / 350 ms); inner pill scales .55 → 1'],['Pendências','Toggles the pending card (desktop) or opens the pending screen (mobile)'],['UC validated + 0 pending','Pendências is replaced by Faturar'],['Click Faturar','Loading (spinner, "Enviando…", not clickable) → button removed']],
  notes:['Right button sits 10 px from the pill (mobile 4 px).','Mobile: icons only (label kept for screen readers); Atividade moves to the header sheet.','Lib: <code>Tab Bar Item Type=Send</code> (Default · Hover · Loading).']},
 paineis:{grp:'Navigation',t:'Panels by priority',lead:'Up to 3 panels side by side, real size (scaled to fit). When space runs out, the lowest priority leaves: Details › Invoice › Activity.',
  ctrls:'<span><span class="k">Available width</span><input type="range" min="560" max="1700" step="10" value="1440" data-w style="width:220px;vertical-align:middle;accent-color:#71902f"> <b data-wv style="font-size:12px">1440 px</b></span>',
  beh:[['Narrow the area','Activity leaves, then Invoice; Details stays (min 520)'],['Open a panel that doesn\'t fit','Closes others, lowest priority first'],['Close all','"Nenhum painel aberto" + Voltar ao padrão'],['Close / open','350 ms ease (width, opacity) / 400 ms spring']],
  notes:['Invoice 686 (min 400) · Details fills (min 520) · Activity 284. Gap 24.','Card grid inside Details: 2/3/4 columns by panel width (container query).','Below 768 px: one screen at a time.']},
 card:{grp:'Data',t:'Data card',lead:'One label, one value, its unit.',
  ctrls:seg('st','Invoice',[['rev','In review'],['ro','Sent (read-only)']],'rev')+SZ,
  beh:[['Pencil','Edit: field with unit inside; send replaces copy, close replaces pencil'],['Enter / send','Validates the mask; invalid = red border + toast'],['Esc / close','Cancels'],['Copy','Copies the value only'],['Pending · Tab','Fills the placeholder suggestion'],['Pending · send','Resolved → green border, still editable']],
  notes:['View and edit have the same height.','R$ before the value; other units after.','Read-only: no pencil, copy stays (<code>State=Read only</code>).','Mobile: 16 px padding, radius 12, 40 px touch targets.']},
 mascaras:{grp:'Data',t:'Masked fields',lead:'Mask comes from the value type. Click the pencil, type, press Enter.',
  beh:[['Money / %','2 decimals, typed from the right: 512399 → 5.123,99'],['kWh / kW / days','Integer with thousands'],['Date','dd/mm/yyyy, must be a real date'],['CNPJ / CEP / barcode','Auto punctuation, must be complete'],['IDs (UC, NF, series)','Digits only, original length'],['Invalid','Red border + message, not saved']],
  notes:['Type: unit → label → value format (<code>kindOf</code>).','Numeric keyboard on mobile; 16 px fields on iOS.','Spreadsheet allows "−" and 5-decimal rates.']},
 planilha:{grp:'Data',t:'Line items & sum',lead:'The Valor column must add up to the invoice total (R$ 4.440,13). If not, the edited cell becomes pending.',
  ctrls:SZ+'<button class="cbtn" data-err>Simulate wrong Demanda value</button>',
  beh:[['Click / arrows','Select / move'],['Double-click, Enter, F2','Edit (Esc cancels, Enter or blur saves)'],['Editing','Column keeps its width; grows (180 ms) only if the text doesn\'t fit'],['Sum ≠ total','Cell turns pending; placeholder = value that closes the sum'],['Pending cell · Tab','Fills the suggestion'],['Still off after fixing','Stays pending with a new suggestion']],
  notes:['Unit inside the cell, gray. No unit column.','Header and Item column sticky on desktop; on mobile Item scrolls and takes ≤ 50%, middle-truncated.','Changed cell #f7fee7 · pending cell orange.']},
 pendencias:{grp:'Review',t:'Pending items',lead:'What the reading missed. Desktop: floating card above the tab bar. Mobile: a list screen.',
  ctrls:SZ+seg('uc','UC',[['ok','Validated'],['no','Not validated']],'ok'),
  beh:[['‹ ›','Navigate "N de total"'],['Type / Tab','Confirmar enables with a value; Tab fills the suggestion'],['Confirmar / Enter','Resolves; field card flashes; next item'],['Ver no Campo','Scrolls to the field and flashes it (1.2 s)'],['Minimize','Hides the card; Pendências reopens it'],['Last one resolved','Card hides; Faturar replaces Pendências'],['UC not validated','Card only points to the UC block']],
  notes:['Suggestion = derived value, never prefilled (COFINS = value ÷ base, reading = previous + usage).','Tab on an empty field still fills the suggestion; no on-screen hint.']},
 marcador:{grp:'Review',t:'Off-screen marker',lead:'When a pending item is scrolled out of view, a marker on the container edge points to it. Scroll the list and the table.',
  beh:[['Below / above','Marker on bottom / top edge'],['Left / right (table)','Marker on the table edge, in the item row'],['Click','Smooth scroll to the item + flash'],['Item visible','Marker hides']],
  notes:['Bobs 4 px (1 s) + pulsing ring (1.4 s); off with reduced motion.','The visible area excludes the floating tab bar and the sticky Item column.']},
 atividade:{grp:'Review',t:'Activity',lead:'Invoice timeline, newest first. Hover (or Tab to) an edit event.',
  ctrls:'<button class="cbtn" data-a="edit">Add edit</button><button class="cbtn" data-a="pend">Add resolved pending</button><button class="cbtn" data-a="sys">Add system status</button>',
  beh:[['Hover / focus an edit','Shows from → to (200 ms): old struck through, new bold on light green'],['Resolved pending','"pendente" → value'],['Hover author','Shows the name'],['New event','Slides in on top']],
  notes:['Author: system = black circle with the Enershare mark; person = initials.','Mobile: opened from the header sheet (history).']},
 identidade:{grp:'Invoice',t:'Validate UC',lead:'Confirms which unit the invoice belongs to before review. The utility comes from the UC record. Sits above Details and minimizes with it.',
  ctrls:seg('st','State',[['auto','Confirm'],['nf','Link'],['bad','Mismatch'],['ok','Validated'],['sent','Sent']],'auto')+'<button class="cbtn" data-min>Minimize Details</button>',
  beh:[['Open field (click / ↓)','Popover: search + radio options (UC · utility · holder)'],['Type','Filters by UC, utility or holder'],['↑ ↓ · Enter · Esc','Move · pick · close (focus back)'],['UC from another utility','Title, label and message in red; Validar disabled'],['No UC picked','Validar disabled'],['Validar alterações','Pill "UC … validada" + Alterar; data unlocked'],['Alterar','Back to the field; data locked']],
  notes:['Titles: Confirme / Vincule a unidade da fatura · A unidade não confere com a fatura.','Until validated: data at 45% opacity, no clicks.','Validated / sent block: 72 px. Rule source: COG-282 (stg).']},
 extrair:{grp:'Invoice',t:'Extract again',lead:'Requests a new reading. 2 manual attempts. The count shows only in the dialog.',
  ctrls:seg('n','Attempts left',[['2','2'],['1','1'],['0','0']],'2')+seg('st','Invoice',[['rev','In review'],['sent','Sent']],'rev'),
  beh:[['Click','Confirm dialog; focus on Cancelar'],['Confirm','Uses one attempt; invoice back to "Lendo fatura"'],['Cancel / Esc / outside','Closes; focus back to the button'],['No attempts','Button disabled (tooltip)'],['Invoice sent','Replaced by "Enviada por … em …"']],
  notes:['Edits are discarded (the dialog says so); last attempt has its own copy.','Tab is trapped in the dialog. Mobile: in the header sheet.']},
 mobile:{grp:'Mobile',t:'Header & scroll',lead:'On mobile, header and tab bar get out of the way on scroll. Badges open a summary sheet.',
  beh:[['Scroll down (≥ 4 px)','Header up, tab bar down (280 ms)'],['Scroll up / top / switch screen','Both come back'],['Horizontal scroll','Ignored'],['Tap a badge','Sheet over blurred background: status, links, history, download, extract'],['×, outside, Esc','Closes; focus back to the badge']],
  notes:['Badges 34 px, overlapping −12 px; pending pill on top.','PDF: pinch 1×–4× keeping the focal point; double tap fit ↔ 2×.']},
 filtro:{grp:'List',t:'Search & filters',lead:'Registry pattern: filter row visible by default under the search. Each filter opens search + options.',
  beh:[['Click a filter','Menu: search, options (checkbox; date = radio), Limpar seleção'],['Check an option','Applies now, menu stays open; chip shows up to 2 values + "+N"'],['Pick a date','Applies and closes'],['Limpar todos','Only when a filter is active'],['Funnel','Shows/hides the row; hidden filters still apply, funnel shows the count'],['Esc / outside','Closes the menu']],
  notes:['Filters: Situação · Pendências · Concessionária · Enviado por · Recebida em.','Mobile: funnel on the left, filters scroll horizontally.']},
 upload:{grp:'List',t:'New invoice (upload)',lead:'Pick or drop files, review the list, then send. One file at a time.',
  ctrls:'<span><span class="k">Add</span></span><button class="cbtn" data-s="ok">fatura.pdf</button><button class="cbtn" data-s="img">foto.jpg</button><button class="cbtn" data-s="type">planilha.xlsx</button><button class="cbtn" data-s="big">32 MB</button><button class="cbtn" data-s="empty">0 KB</button><button class="cbtn" data-s="dup">duplicate</button><button class="cbtn" data-s="many">22 files</button>',
  beh:[['Drag over','Drop zone turns green: "Solte para adicionar N arquivos"'],['Add','Item "Aguardando envio"; drop zone becomes a strip'],['Wrong type / empty / > 20 MB','Red item with the reason; not sent'],['Duplicate · > 20 files','Not added; toast'],['Enviar N faturas','Uploads one by one (bar + %); no remove/cancel meanwhile'],['Done','Modal closes; rows on top as "Lendo fatura"']],
  notes:['PDF, JPG, PNG, WebP · 20 MB each · 20 files.','Button counts valid files only.','Mobile: "Tirar foto da fatura" (camera with framing) or "Escolher arquivos".']}
};
C.forEach(c=>Object.assign(c,DOC[c.id]||{}));

/* ---------- código: HTML do componente renderizado, CSS da folha de estilo, JS dos trechos da página ---------- */
const CSSK={tabbar:['.tabbar','.tb','.cnt','tbOpen','tbClose','spin'],paineis:['.cols','.panel','.p-pdf','.p-det','.p-act','.cols-empty','panelIn'],card:['.card','.ufld','.fld','.badge','.grid','.g2','.full','kbd','.tabk'],mascaras:['.fld','.ufld','.err'],
  planilha:['.grade','cellFlash'],pendencias:['.pend-card','.pc-','.bxs','.plist','.pl-','kbd','.tabk'],marcador:['.offi','.offl','offR','offL','offD','offU','offPing'],atividade:['.ev','.act-','.link','.c-def','.c-alert','.c-ok','.c-edit','.who'],
  identidade:['.idf'],extrair:['.dlg-ov','.cx .dlg','.cx .btn','.sent-by','mOvIn'],mobile:['.m-','mSheetIn'],filtro:['.fbtn','.fcount','.frow','.fchip','.dd','.fp ','.fsearch','.fopts','.cbx','.rdo','.fnone','.field','.tools'],upload:['.nf','.dlg .d','.drop','.files','.fi','.ibtn','.dlg .x']};
function cssFor(id){ const keys=CSSK[id]||[], out=[];
  const sheets=[...document.styleSheets].filter(s=>(s.href||'').includes('componentes.css')||(s.ownerNode&&s.ownerNode.textContent.includes('.idf{')));
  const clean=sel=>sel.replace(/\.cx\.mob /g,'[mobile] ').replace(/\.cx\.lst /g,'').replace(/\.cx /g,'');
  const take=(r,ind)=>{
    if(r.cssRules&&!r.selectorText&&!r.name){ const inner=[]; [...r.cssRules].forEach(x=>{ const t=take(x,ind+'  '); if(t) inner.push(t); }); return inner.length?(ind+r.cssText.split('{')[0].trim()+' {\n'+inner.join('\n')+'\n'+ind+'}'):''; }
    const sel=r.selectorText||r.name||''; if(!keys.some(k=>sel.includes(k))) return '';
    if(r.name) return ind+r.cssText.replace(/\s+/g,' ');
    const body=r.style.cssText.split(';').map(x=>x.trim()).filter(Boolean).map(x=>ind+'  '+x+';').join('\n');
    return ind+clean(sel)+' {\n'+body+'\n'+ind+'}'; };
  sheets.forEach(s=>{ try{ [...s.cssRules].forEach(r=>{ const t=take(r,''); if(t) out.push(t); }); }catch(e){} });
  return out.join('\n'); }
function htmlOf(el){ const lines=[], VOID=/^(input|img|br|hr|meta|link)$/;
  const walk=(n,d)=>{ const pad='  '.repeat(d);
    if(n.nodeType===3){ const t=n.textContent.replace(/\s+/g,' ').trim(); if(t) lines.push(pad+t); return; }
    if(n.nodeType!==1) return; const tag=n.tagName.toLowerCase();
    if(tag==='svg'){ lines.push(pad+'<svg …/>'); return; }
    const attrs=[...n.attributes].filter(a=>a.name!=='style').map(a=>a.value===''?' '+a.name:' '+a.name+'="'+a.value+'"').join('');
    const kids=[...n.childNodes].filter(c=>c.nodeType===1||(c.nodeType===3&&c.textContent.trim()));
    if(VOID.test(tag)){ lines.push(pad+'<'+tag+attrs+'>'); return; }
    if(kids.length===1&&kids[0].nodeType===3){ lines.push(pad+'<'+tag+attrs+'>'+kids[0].textContent.replace(/\s+/g,' ').trim()+'</'+tag+'>'); return; }
    lines.push(pad+'<'+tag+attrs+'>');
    const els=kids.filter(c=>c.nodeType===1), same=els.length>3&&els.every(c=>c.tagName===els[0].tagName&&c.className.split(' ')[0]===els[0].className.split(' ')[0]);
    (same?els.slice(0,2):kids).forEach(c=>walk(c,d+1)); if(same) lines.push(pad+'  <!-- … '+(els.length-2)+' more -->');
    lines.push(pad+'</'+tag+'>'); };
  walk(el,0); return lines.join('\n'); }
const escH=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const hl={
  // atributos antes das tags: senão o realce pega as próprias marcas que acabou de inserir
  html:s=>escH(s).replace(/ ([a-z-]+)="([^"]*)"/g,' <i class="k-a">$1</i>="<span class="k-s">$2</span>"').replace(/(&lt;\/?)([a-z0-9-]+)/g,'$1<b class="k-t">$2</b>').replace(/(&lt;!--.*?--&gt;)/g,'<span class="k-c">$1</span>'),
  css:s=>escH(s).replace(/^(\s*)([^\n{}]+?) \{$/gm,'$1<b class="k-t">$2</b> {').replace(/^(\s+)([a-z-]+):/gm,'$1<i class="k-a">$2</i>:'),
  js:s=>escH(s).replace(/(\/\/[^\n]*)/g,'<span class="k-c">$1</span>').replace(/\b(const|let|function|return|if|else|for|of|new|await|async)\b(?![^<]*<\/span>)/g,'<b class="k-t">$1</b>') };
const snip=id=>{ const s=document.querySelector('script.snip[data-id="'+id+'"]'); return s?s.textContent.replace(/^\n/,'').replace(/\s+$/,''):'// no snippet'; };

/* ---------- montagem ---------- */
const main=$('#main'), nav=$('#navl'); let g='';
C.forEach(c=>{
  if(c.grp!==g){ g=c.grp; nav.insertAdjacentHTML('beforeend',`<div class="grp">${g}</div>`); }
  nav.insertAdjacentHTML('beforeend',`<a href="#${c.id}" data-id="${c.id}">${c.t}</a>`);
  main.insertAdjacentHTML('beforeend',`<section class="cmp box" id="${c.id}">
    <div class="cmp-h"><h3>${c.t}</h3><span class="tags">${c.iss?`<a class="chip iss" href="https://linear.app/cogecom/issue/${c.iss}">${c.iss}</a>`:''}${c.lib?`<span class="chip">Lib: ${c.lib}</span>`:''}</span></div>
    <p class="lead">${c.lead}</p>
    <div class="ctrls">${c.ctrls||''}<button class="reset"><span class="pg-ms">restart_alt</span>Reset</button></div>
    <div class="canvas ${['identidade','pendencias','filtro','upload','planilha','card','mascaras'].includes(c.id)?'top':''} ${['identidade','extrair','filtro','upload'].includes(c.id)?'white':''}"></div><div class="log" aria-live="polite"></div>
    <div class="dt"><div class="ptabs" role="tablist" aria-label="${c.t}"><button role="tab" class="ptab on" aria-selected="true" data-dt="beh">Behavior</button><button role="tab" class="ptab" aria-selected="false" data-dt="notes">Notes</button><button role="tab" class="ptab" aria-selected="false" data-dt="code">Code</button></div>
      <div class="dpane" data-p="beh"><table class="bh">${c.beh.map(([a,b])=>`<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table></div>
      <div class="dpane" data-p="notes" hidden><ul class="nt">${c.notes.map(n=>`<li>${n}</li>`).join('')}</ul></div>
      <div class="dpane" data-p="code" hidden><div class="code-h"><div class="ptabs sm" role="tablist"><button role="tab" class="ptab on" data-lang="html">HTML</button><button role="tab" class="ptab" data-lang="css">CSS</button><button role="tab" class="ptab" data-lang="js">JS</button></div><span class="code-src"></span><button class="copy"><span class="pg-ms">content_copy</span>Copy</button></div><pre class="code"><code></code></pre></div></div></section>`);
  const r=$('#'+c.id); c.init(r);
  const html0=htmlOf($('.canvas',r).firstElementChild);
  $('.reset',r).onclick=()=>{ r._reset&&r._reset(); log(r,''); };
  const src={html:()=>html0, css:()=>cssFor(c.id), js:()=>snip(c.id)};
  const from={html:'Initial state, generated from the rendered component', css:c.id==='identidade'?'assets/identidade.js (injected style)':'assets/componentes.css · [mobile] = .cx.mob', js:'Prototype logic (commented summary)'};
  let lang='html', raw='';
  const show=()=>{ raw=src[lang](); $('.code code',r).innerHTML=hl[lang](raw); $('.code-src',r).textContent=from[lang]; $$('[data-lang]',r).forEach(b=>{ b.classList.toggle('on',b.dataset.lang===lang); b.setAttribute('aria-selected',b.dataset.lang===lang); }); };
  $$('[data-dt]',r).forEach(b=>b.onclick=()=>{ $$('[data-dt]',r).forEach(x=>{ x.classList.toggle('on',x===b); x.setAttribute('aria-selected',x===b); }); $$('.dpane',r).forEach(p=>p.hidden=p.dataset.p!==b.dataset.dt); if(b.dataset.dt==='code') show(); });
  $$('[data-lang]',r).forEach(b=>b.onclick=()=>{ lang=b.dataset.lang; show(); });
  $('.copy',r).onclick=()=>{ navigator.clipboard?.writeText(raw).catch(()=>{}); toast('Code copied'); };
});
const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) $$('#navl a[data-id]').forEach(a=>a.classList.toggle('on',a.dataset.id===e.target.id)); }),{root:$('#sheet'),rootMargin:'-20% 0px -70% 0px'});
$$('section.cmp').forEach(s=>io.observe(s));
const ALIAS={cards:'card',listagem:'filtro'}; const h=location.hash.slice(1); if(ALIAS[h]) location.replace('#'+ALIAS[h]); else if(h){ const go=()=>document.getElementById(h)?.scrollIntoView({behavior:'instant',block:'start'}); (document.fonts?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(go)); } // espera as fontes: a altura das seções muda
})();
