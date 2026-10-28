/* Contas a Faturar v2 — listagem simples + resumo lateral (padrão Faturamento Pendente, Tickets 35:8027) + drawer da UC.
   Visual: fp.css + cf.css. Dados fictícios. O detalhamento continua em faturamento-detalhe.html (?estado=). */
(function(){
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const n2=(n,a,b)=>n+' '+(n===1?a:b);
const ini=n=>n.split(' ').filter(Boolean).map(x=>x[0]).slice(0,2).join('').toUpperCase();
const brl=n=>n==null?'—':'R$ '+n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const kwh=n=>n.toLocaleString('pt-BR')+' kWh';
const ME='Eduardo Moreira', NOW='Hoje às 11:20';

/* status de cada etapa → cor do badge (mesmas cores do Tickets) */
const LEI={'Coleta agendada':'b-grey','Em leitura':'b-dark','Processado':'b-ok','Falha na leitura':'b-danger'};
const EST={'Em cálculo':'b-grey','Calculado':'b-dark','Falha no cálculo':'b-danger'};
const REC={'Emissão pendente':'b-alert','Gerando boleto':'b-grey','Aberto':'b-dark','Atrasado':'b-danger','Liquidado':'b-ok','Sem cobrança':'b-grey'};
const UST={'Em fornecimento':['on','check'],'Fora de fornecimento':['off','power_off'],'Em cancelamento':['can','block']};
const CARTS=['Carteira Sul','Carteira Norte','Carteira Cooperados PR'];
const CONCS=['Luz do Vale','Força Sul'];

/* titulares */
const TIT={
  pad:{n:'Padaria Estrela do Sul Ltda',pj:1,doc:'12.345.678/0001-90',cart:'Carteira Sul',grp:'Grupo Estrela do Sul'},
  mar:{n:'Mariana Alves Costa',pj:0,doc:'123.456.789-09',cart:'Carteira Cooperados PR',grp:null},
  ofi:{n:'Oficina Bom Motor ME',pj:1,doc:'23.456.789/0001-01',cart:'Carteira Norte',grp:null},
  cli:{n:'Clínica Sorriso Vivo',pj:1,doc:'34.567.890/0001-12',cart:'Carteira Sul',grp:'Grupo Sorriso'},
  raf:{n:'Rafael Souza Lima',pj:0,doc:'234.321.654-10',cart:'Carteira Cooperados PR',grp:null},
  mer:{n:'Mercado Boa Praça',pj:1,doc:'45.678.901/0001-23',cart:'Carteira Norte',grp:'Grupo Boa Praça'},
  bea:{n:'Beatriz Nunes',pj:0,doc:'345.789.123-21',cart:'Carteira Cooperados PR',grp:null},
  esc:{n:'Escola Pequeno Saber',pj:1,doc:'56.789.012/0001-34',cart:'Carteira Sul',grp:null},
  far:{n:'Farmácias Farmix Ltda',pj:1,doc:'67.890.123/0001-45',cart:'Carteira Norte',grp:'Grupo Farmix'}
};
/* UCs: detalhes (padrão de rede, subgrupo) e configurações (o que pesa no faturamento) */
const UCS={
  '3014567890':{st:'Em fornecimento',leg:'LV-004512',ap:'Loja Centro',conc:'Luz do Vale',rede:'Trifásico',sub:'B3',mod:'Geração Distribuída',ger:'Produção solar',comp:'Autoconsumo remoto',auto:true,saldo:50,man:false,rat:false},
  '3014567891':{st:'Em fornecimento',leg:null,ap:'Fábrica',conc:'Luz do Vale',rede:'Trifásico',sub:'A4',mod:'Geração Distribuída',ger:'Produção solar',comp:'Autoconsumo remoto',auto:true,saldo:60,man:true,rat:false},
  '3000451278':{st:'Em fornecimento',leg:'LV-000981',ap:null,conc:'Luz do Vale',rede:'Monofásico',sub:'B1',mod:'Geração Distribuída',ger:'Sem produção',comp:'Geração compartilhada',auto:false,saldo:12,man:false,rat:false},
  '3009876543':{st:'Fora de fornecimento',leg:null,ap:null,conc:'Luz do Vale',rede:'Bifásico',sub:'B3',mod:'Geração Distribuída',ger:'Sem produção',comp:'Geração compartilhada',auto:false,saldo:50,man:false,rat:true},
  '3012233445':{st:'Em fornecimento',leg:'FS-118200',ap:'Unidade Batel',conc:'Força Sul',rede:'Trifásico',sub:'B3',mod:'Geração Distribuída',ger:'Sem produção',comp:'Geração compartilhada',auto:false,saldo:50,man:true,rat:false},
  '3005566778':{st:'Em fornecimento',leg:null,ap:null,conc:'Força Sul',rede:'Monofásico',sub:'B1',mod:'Geração Distribuída',ger:'Sem produção',comp:'Geração compartilhada',auto:false,saldo:12,man:false,rat:false},
  '3017788990':{st:'Em fornecimento',leg:'LV-007733',ap:null,conc:'Luz do Vale',rede:'Trifásico',sub:'B3',mod:'Geração Distribuída',ger:'Sem produção',comp:'Geração compartilhada',auto:false,saldo:50,man:false,rat:false},
  '3003344556':{st:'Em cancelamento',leg:null,ap:null,conc:'Luz do Vale',rede:'Monofásico',sub:'B1',mod:'Geração Distribuída',ger:'Sem produção',comp:'Geração compartilhada',auto:false,saldo:12,man:false,rat:false},
  '3020011223':{st:'Em fornecimento',leg:'FS-220114',ap:null,conc:'Força Sul',rede:'Trifásico',sub:'A4',mod:'Geração Distribuída',ger:'Sem produção',comp:'Geração compartilhada',auto:false,saldo:50,man:false,rat:false},
  '3011122334':{st:'Em fornecimento',leg:null,ap:'Filial Água Verde',conc:'Força Sul',rede:'Trifásico',sub:'B3',mod:'Geração Distribuída',ger:'Sem produção',comp:'Geração compartilhada',auto:false,saldo:50,man:false,rat:true}
};
/* faturamentos: [id, ref, titular, uc, leitura{st,dt}, concessionária{inj,cons,val}, estudo{st,val,eco,taxa}, receber{st,tit,ven,pag,banco}, revisão, comentários, estado do detalhe] */
const R=(id,ref,t,uc,lei,fc,est,rec,rev,cm,e)=>({id,ref,t,uc,lei,fc,est,rec,rev:!!rev,cm:cm||[],e});
const ROWS=[
  R('FT-10231','Mar/2025','pad','3014567890',{st:'Processado',dt:'26/03/2025'},{inj:3120,cons:2480,val:1340.22},{st:'Calculado',val:1882.40,eco:312.80,taxa:19.90},{st:'Aberto',tit:'000184512',ven:'05/04/2025',pag:'Boleto',banco:'Sicredi'},0,
    [{who:'Ana Ribeiro',t:'Cooperado pediu boleto por e-mail também.',d:'27/03 às 09:12'}],'aberto'),
  R('FT-10232','Mar/2025','pad','3014567891',{st:'Processado',dt:'26/03/2025'},{inj:8400,cons:7920,val:5210.10},{st:'Calculado',val:6930.00,eco:1180.40,taxa:19.90},{st:'Emissão pendente',tit:null,ven:'05/04/2025',pag:'Boleto',banco:'Sicredi'},1,
    [{who:'Carlos Mendes',t:'Faturamento manual: conferir a demanda antes de emitir.',d:'27/03 às 14:30'},{sys:1,t:'Marcado para revisão',d:'27/03 às 14:31',who:'Carlos Mendes'}],'emissao'),
  R('FT-10233','Mar/2025','mar','3000451278',{st:'Processado',dt:'25/03/2025'},{inj:310,cons:280,val:182.60},{st:'Calculado',val:212.18,eco:24.10,taxa:9.90},{st:'Gerando boleto',tit:null,ven:'07/04/2025',pag:'Pix',banco:'Banco do Brasil'},0,[],'emissao'),
  R('FT-10234','Mar/2025','ofi','3009876543',{st:'Processado',dt:'20/03/2025'},{inj:1450,cons:1390,val:812.33},{st:'Calculado',val:946.70,eco:118.20,taxa:19.90},{st:'Atrasado',tit:'000183977',ven:'28/03/2025',pag:'Boleto',banco:'Sicredi'},1,
    [{who:'Juliana Rocha',t:'UC fora de fornecimento e com rateio externo. Ver se cobra este mês.',d:'02/04 às 10:05'},{sys:1,t:'Marcado para revisão',d:'02/04 às 10:06',who:'Juliana Rocha'}],'atrasado'),
  R('FT-10235','Mar/2025','cli','3012233445',{st:'Processado',dt:'22/03/2025'},{inj:2100,cons:2010,val:1102.45},{st:'Calculado',val:1320.55,eco:201.30,taxa:19.90},{st:'Liquidado',tit:'000183650',ven:'02/04/2025',pag:'Débito automático',banco:'Itaú'},0,[],'liquidado'),
  R('FT-10236','Mar/2025','raf','3005566778',{st:'Processado',dt:'27/03/2025'},{inj:260,cons:240,val:160.12},{st:'Calculado',val:188.40,eco:21.60,taxa:9.90},null,0,[],'estudo'),
  R('FT-10237','Mar/2025','mer','3017788990',{st:'Processado',dt:'27/03/2025'},{inj:1980,cons:1870,val:990.80},{st:'Falha no cálculo'},null,1,
    [{sys:1,t:'Bandeira tarifária de março não cadastrada',d:'27/03 às 18:02'}],'falha-calculo'),
  R('FT-10238','Mar/2025','bea','3003344556',{st:'Processado',dt:'28/03/2025'},{inj:540,cons:610,val:612.33},{st:'Em cálculo'},null,0,[],'lida'),
  R('FT-10239','Mar/2025','esc','3020011223',{st:'Processado',dt:'28/03/2025'},{inj:5200,cons:5480,val:3105.90},{st:'Em cálculo'},null,0,[],'lida'),
  R('FT-10240','Mar/2025','far','3011122334',{st:'Processado',dt:'24/03/2025'},{inj:4200,cons:3980,val:2310.70},{st:'Calculado',val:2799.90,eco:402.10,taxa:19.90},{st:'Sem cobrança',tit:null,ven:null,pag:null,banco:null},0,[],'liquidado'),
  R('FT-10198','Fev/2025','pad','3014567890',{st:'Processado',dt:'24/02/2025'},{inj:2980,cons:2390,val:1288.40},{st:'Calculado',val:1764.12,eco:298.50,taxa:19.90},{st:'Liquidado',tit:'000181220',ven:'05/03/2025',pag:'Boleto',banco:'Sicredi'},0,[],'liquidado')
];
const S={sel:new Set(),cur:'FT-10232',railOpen:true,fltOpen:true,q:'',f:{},dw:null,fold:new Set()};
const row=id=>ROWS.find(r=>r.id===id);

/* etapa mais avançada = status do faturamento no resumo */
/* aqui a leitura está sempre concluída: a etapa atual é o estudo ou a conta a receber */
const fase=r=>r.rec?['Conta a receber',r.rec.st,REC]:['Estudo',r.est.st,EST];
/* segmentos da etapa (como na v1): anteriores em verde, atual escura (vermelha se falhou), seguintes apagadas */
const FAIL=['Falha no cálculo','Atrasado'], DONE=['Liquidado','Sem cobrança'];
const etapa=r=>r.rec?2:1;

/* ---------- peças ---------- */
const H={};
H.badge=(txt,map)=>`<span class="bdg ${map[txt]||'b-grey'}">${esc(txt)}</span>`;
H.steps=r=>{ const i=etapa(r), st=fase(r)[1];
  return `<span class="steps" aria-hidden="true">${[0,1,2].map(k=>`<i class="${k<i||DONE.includes(st)?'d':k===i?(FAIL.includes(st)?'e':'c'):''}"></i>`).join('')}</span>`; };
H.lei=r=>H.badge(r.lei.st,LEI);
H.tit=r=>{ const t=TIT[r.t]; return `<div class="ent"><span class="ic ${t.pj?'':'pf'}"><span class="msr fill">${t.pj?'bolt':'person'}</span></span><div class="t"><div>${esc(t.n.toUpperCase())}</div><div class="s">${esc(t.cart)}</div></div>${t.grp?`<button class="grp" data-a="grupo" data-v="${esc(t.grp)}" title="${esc(t.grp)}" aria-label="Abrir ${esc(t.grp)}"><span class="msr fill">groups</span></button>`:''}</div>`; };
H.ust=u=>{ const s=UST[u.st]; return `<span class="ust ${s[0]}" title="${u.st}" aria-label="${u.st}"><span class="msr fill">${s[1]}</span></span>`; };
H.uc=r=>{ const u=UCS[r.uc]; const sub=[u.ap||u.leg,u.conc].filter(Boolean).join(' · '); return `${H.ust(u)}<div class="two"><span>${r.uc}</span><span class="s">${esc(sub)}</span></div>`; };
H.est=r=>H.badge(r.est.st,EST);
H.rec=r=>r.rec?H.badge(r.rec.st,REC):`<span style="color:var(--s400)">${r.est.st==='Calculado'?'Aguardando emissão':'Aguardando estudo'}</span>`;

const COLS=[
 {k:'ck',w:'48px',h:()=>{ const v=visible(); const n=v.filter(r=>S.sel.has(r.id)).length; const st=n===0?'':n===v.length?'on':'mid'; return `<button class="cbx ${st}" data-a="selall" role="checkbox" aria-checked="${n===0?'false':n===v.length?'true':'mixed'}" aria-label="Selecionar todos">${st==='on'?'<span class="mss">check</span>':''}</button>`; },
   c:r=>`<button class="cbx ${S.sel.has(r.id)?'on':''}" data-a="sel" data-id="${r.id}" role="checkbox" aria-checked="${S.sel.has(r.id)}" aria-label="Selecionar ${r.id}">${S.sel.has(r.id)?'<span class="mss">check</span>':''}</button>`},
 {k:'ref',w:'96px',h:()=>'<button class="so">Ref.<span class="msr">import_export</span></button>',c:r=>r.ref},
 {k:'eta',w:'212px',h:()=>'Etapa',c:r=>`${H.steps(r)}<span title="Etapa ${etapa(r)+1} de 3">${fase(r)[0]}</span>`,cel:1},
 {k:'lei',w:'176px',h:()=>'<button class="so">Leitura<span class="msr">import_export</span></button>',c:H.lei},
 {k:'tit',w:'minmax(260px,1.3fr)',h:()=>'Titular',c:H.tit},
 {k:'uc',w:'minmax(200px,1fr)',h:()=>'Unidade consumidora',c:H.uc,cel:1},
 {k:'est',w:'164px',h:()=>'Estudo',c:H.est},
 {k:'rec',w:'164px',h:()=>'Conta a receber',c:H.rec},
 {k:'rev',w:'48px',h:()=>'<span class="msr" title="Precisa de revisão" aria-label="Precisa de revisão">flag</span>',c:r=>r.rev?'<span class="rvf" title="Precisa de revisão" aria-label="Precisa de revisão"><span class="msr fill">flag</span></span>':''},
 {k:'act',w:'56px',h:()=>'',c:r=>`<button class="more" data-a="rowmenu" data-id="${r.id}" aria-label="Ações de ${r.id}" aria-haspopup="menu"><span class="msr">more_horiz</span></button>`}
];
const FLT=[
 {k:'rev',l:'Revisão',o:['Precisa de revisão','Sem revisão'],m:(r,v)=>v.includes(r.rev?'Precisa de revisão':'Sem revisão')},
 {k:'ref',l:'Referência',o:['Mar/2025','Fev/2025'],m:(r,v)=>v.includes(r.ref)},
 {k:'lei',l:'Leitura',o:Object.keys(LEI),m:(r,v)=>v.includes(r.lei.st)},
 {k:'est',l:'Estudo',o:Object.keys(EST),m:(r,v)=>v.includes(r.est.st)},
 {k:'rec',l:'Conta a receber',o:['Aguardando',...Object.keys(REC)],m:(r,v)=>v.includes(r.rec?r.rec.st:'Aguardando')},
 {k:'cart',l:'Carteira',o:CARTS,m:(r,v)=>v.includes(TIT[r.t].cart)},
 {k:'conc',l:'Concessionária',o:CONCS,m:(r,v)=>v.includes(UCS[r.uc].conc)},
 {k:'man',l:'Faturamento',o:['Manual','Automático'],m:(r,v)=>v.includes(UCS[r.uc].man?'Manual':'Automático')}
];
function visible(){ const q=S.q.trim().toLowerCase();
  return ROWS.filter(r=>{ const t=TIT[r.t], u=UCS[r.uc];
    if(q&&![r.id,r.ref,t.n,t.doc,r.uc,u.leg,u.ap,u.conc].join(' ').toLowerCase().includes(q)) return false;
    for(const f of FLT){ const v=S.f[f.k]; if(v&&v.length&&!f.m(r,v)) return false; } return true; }); }

H.filters=()=>FLT.map(f=>{ const v=S.f[f.k]||[]; const has=v.length>0;
  return `<button class="flt ${has?'has':''}" data-a="flt" data-k="${f.k}" aria-haspopup="dialog"><span class="lb">${f.l}</span>${has?'<span class="sep"></span>'+(v.length>2?`<span class="chip">${v.length} selecionados</span>`:v.map(x=>`<span class="chip">${esc(x)}</span>`).join(''))+`<span class="x" data-a="fclr" data-k="${f.k}" role="button" aria-label="Limpar ${f.l}"><span class="msr">close</span></span>`:'<span class="msr">expand_more</span>'}</button>`; }).join('')
  +(Object.values(S.f).some(v=>v&&v.length)?'<button class="fclear" data-a="fclrall">Limpar filtros</button>':'');
H.table=()=>{ const gt=COLS.map(c=>c.w).join(' '); const v=visible();
  const head=`<div class="tr th" role="row" style="grid-template-columns:${gt}">${COLS.map(c=>`<div role="columnheader">${c.h()}</div>`).join('')}</div>`;
  const rows=v.map(r=>`<div class="tr row ${S.sel.has(r.id)?'is-sel':''} ${S.railOpen&&S.cur===r.id?'cur':''}" role="row" tabindex="0" data-a="row" data-id="${r.id}" style="grid-template-columns:${gt}">${COLS.map(c=>`<div role="cell" class="${c.cel?'cel':''}">${c.c(r)}</div>`).join('')}</div>`).join('');
  return head+(rows||'<div class="empty">Nenhum faturamento com esses filtros.</div>'); };

/* ---------- resumo ---------- */
const it=(ic,l,v,act,cl)=>`<div class="it"><span class="ci ${cl||''}"><span class="msr fill">${ic}</span></span><div class="grow"><div class="cap">${l}</div><div class="v">${v}</div></div>${act||''}</div>`;
const lk=(msg,lbl)=>`<button class="ib" data-a="toast" data-msg="${esc(msg)}" aria-label="${esc(lbl)}"><span class="msr">open_in_new</span></button>`;
const FOLDS=['tit','uc','fc','est','rec','cm'];
const fold=(k,ttl)=>`<button class="ib" data-a="fold" data-k="${k}" aria-label="${S.fold.has(k)?'Expandir':'Recolher'} ${ttl}" aria-expanded="${!S.fold.has(k)}"><span class="msr chev">expand_less</span></button>`;
const shut=k=>S.fold.has(k)?' closed':'';
const kv=rows=>`<div class="kvl">${rows.map(x=>`<div><span>${x[0]}</span><b class="${x[2]||''}">${x[1]}</b></div>`).join('')}</div>`;
H.rbar=()=>{ const all=FOLDS.every(k=>!S.fold.has(k)); return `<div class="rbar"><span class="msr">article_shortcut</span><span class="grow">Resumo do faturamento</span><button class="ib tip" data-a="foldall" data-tip="${all?'Recolher tudo':'Expandir tudo'}" aria-label="${all?'Recolher todas as seções':'Expandir todas as seções'}"><span class="msr">${all?'unfold_less':'unfold_more'}</span></button><button class="ib" data-a="railclose" aria-label="Fechar resumo"><span class="msr">right_panel_close</span></button></div>`; };
H.head=r=>{ const f=fase(r); return `<div class="pnl"><div class="tkhead"><span class="ttl" style="flex:none">${r.ref}</span>${H.badge(f[1],f[2])}<span style="flex:1"></span><button class="more" data-a="rowmenu" data-id="${r.id}" aria-label="Ações do faturamento" aria-haspopup="menu"><span class="msr">more_horiz</span></button></div>
  <div class="cap" style="font-size:14px;line-height:20px;display:flex;align-items:center;gap:8px">${H.steps(r)}${r.id} · ${f[0]}</div>
  <a class="b pri full" href="faturamento-detalhe.html?estado=${r.e}" style="text-decoration:none">Abrir detalhamento<span class="msr">arrow_forward</span></a></div>`; };
H.rev=r=>r.rev?`<div class="rvbar" role="status"><span class="msr fill ic">flag</span><b>Precisa de revisão</b><button class="b out sm" data-a="revoff" data-id="${r.id}">Revisado</button></div>`:'';
H.titP=r=>{ const t=TIT[r.t];
  return `<div class="pnl tight${shut('tit')}"><div class="ph2" style="padding:0 4px 4px"><span class="who" style="padding:0;flex:1;min-width:0"><span class="av"><span class="msr fill">${t.pj?'work':'person'}</span></span><span style="min-width:0"><span class="nm" style="display:block">${esc(t.n)}</span><span class="cap">Titular</span></span></span>${lk('Abriria o cadastro do titular','Abrir cadastro')}${fold('tit','titular')}</div>
  <div class="bd">${it('badge',t.pj?'CNPJ':'CPF',t.doc,`<button class="ib" data-a="copy" data-v="${t.doc}" aria-label="Copiar ${t.pj?'CNPJ':'CPF'}"><span class="msr">content_copy</span></button>`)}
  ${it('folder_shared','Carteira',esc(t.cart),lk('Abriria a carteira','Abrir carteira'))}
  ${t.grp?it('groups','Grupo',esc(t.grp),`<button class="ib" data-a="grupo" data-v="${esc(t.grp)}" aria-label="Abrir grupo"><span class="msr">open_in_new</span></button>`):''}</div></div>`; };
H.ucP=r=>{ const u=UCS[r.uc]; const s=UST[u.st];
  const tags=[u.man&&['edit_note','Faturamento manual'],u.rat&&['call_split','Rateio externo'],u.st!=='Em fornecimento'&&[s[1],u.st]].filter(Boolean);
  return `<div class="pnl tight${shut('uc')}"><div class="ph2" style="padding:0 4px 4px"><span class="who" style="padding:0;flex:1;min-width:0"><span class="av"><span class="mss fill">electric_meter</span></span><span style="min-width:0"><span class="nm" style="display:block">${r.uc}</span><span class="cap">${esc(u.ap||'Unidade consumidora')}</span></span></span>${lk('Abriria a instalação','Abrir instalação')}${fold('uc','unidade consumidora')}</div>
  ${tags.length?`<div class="tags" style="padding:0 4px">${tags.map(x=>`<span class="tag al"><span class="msr fill">${x[0]}</span>${x[1]}</span>`).join('')}</div>`:''}
  <div class="bd">${it(s[1],'Status',u.st,'',s[0]==='on'?'ok':'')}
  ${it('electrical_services','Concessionária',u.conc)}
  ${u.leg?it('tag','Código legado',u.leg,`<button class="ib" data-a="copy" data-v="${u.leg}" aria-label="Copiar código legado"><span class="msr">content_copy</span></button>`):''}
  <button class="b out full" data-a="ucdw" data-id="${r.id}"><span class="msr">tune</span>Detalhes e configurações</button></div></div>`; };
const stageHead=(ic,ttl,badge,cap,k)=>`<div class="stg"><span class="ki k-d" style="width:24px;height:24px"><span class="msr fill">${ic}</span></span><div class="grow"><div class="ttl" style="font-size:15px">${ttl}</div>${cap?`<div class="cap">${cap}</div>`:''}</div>${badge||''}${k?fold(k,ttl.toLowerCase()):''}</div>`;
H.fcP=r=>{ const l=r.lei; const pre=l.st==='Coleta agendada';
  return `<div class="pnl tight${shut('fc')}" style="padding:16px">${stageHead('receipt_long','Fatura da concessionária',H.badge(l.st,LEI),'','fc')}
  <div class="bd">${kv(pre?[['Previsão de leitura',l.dt]]:[[l.st==='Processado'?'Processado em':'Coletada em',l.dt],...(r.fc?[['Total injetado',kwh(r.fc.inj)],['Consumo',kwh(r.fc.cons)],['Valor da fatura',brl(r.fc.val)]]:[])])}</div></div>`; };
H.estP=r=>{ const e=r.est;
  return `<div class="pnl tight${shut('est')}" style="padding:16px">${stageHead('calculate','Estudo',H.badge(e.st,EST),'','est')}
  <div class="bd">${e.st==='Em cálculo'?'<div class="cap" style="font-size:13px;line-height:20px">Calculando o estudo a partir da fatura processada.</div>':e.val!=null?kv([['Valor do estudo',brl(e.val)],['Economia total',brl(e.eco),'ok'],['Taxa de entrega',brl(e.taxa)]]):`<div class="cap" style="font-size:13px;line-height:20px">${esc((r.cm.find(c=>c.sys)||{}).t||'Não foi possível calcular')}</div><button class="b out full" data-a="toast" data-msg="Recálculo solicitado">Recalcular</button>`}</div></div>`; };
H.recP=r=>{ const c=r.rec;
  if(!c) return `<div class="pnl tight off" style="padding:16px">${stageHead('request_quote','Conta a receber','',r.est&&r.est.val!=null?'Aguardando emissão':'Aguardando estudo')}</div>`;
  const m=x=>x||'<span style="color:var(--s400);font-weight:400">—</span>';
  return `<div class="pnl tight${shut('rec')}" style="padding:16px">${stageHead('request_quote','Conta a receber',H.badge(c.st,REC),'','rec')}
  <div class="bd">${c.st==='Sem cobrança'?'<div class="cap" style="font-size:13px;line-height:20px">Este faturamento não gera cobrança.</div>':kv([['Nº do título',m(c.tit)],['Vencimento',m(c.ven),c.st==='Atrasado'?'dg':''],['Tipo de pagamento',m(c.pag)],['Banco',m(c.banco)]])}</div></div>`; };
H.cm=r=>{ const ev=c=>{ const who=c.who?`<span class="who2" data-name="${esc(c.who)}">${ini(c.who)}</span>`:'<span class="who2 sys" data-name="Sistema"><span class="msr fill">bolt</span></span>';
    return `<div class="ev ${c.isNew?'new':''}"><span class="i ${c.sys?(c.t.includes('revis')?'c-alert':'c-def'):'c-edit'}"><span class="msr fill">${c.sys?(c.t.includes('revis')?'flag':'bolt'):'chat'}</span></span>${who}<div class="n">${esc(c.t)}</div><div class="d">${c.d}</div></div>`; };
  return `<div class="act-p${shut('cm')}"><div class="act-h"><span class="grow">Comentários</span><span class="cap">${r.cm.length||''}</span>${fold('cm','comentários')}</div><div class="act-l evs">${r.cm.map((c,i)=>(i?'<div class="lnk"></div>':'')+ev(c)).join('')}</div>
  <form class="cmp" data-id="${r.id}"><label class="sr" for="cmT" style="position:absolute;left:-9999px">Comentário</label><textarea class="ta" id="cmT" placeholder="Escreva um comentário"></textarea><div class="row"><button class="b pri sm" type="submit">Comentar</button></div></form></div>`; };
H.rail=r=>H.rbar()+H.head(r)+H.rev(r)+H.titP(r)+H.ucP(r)+H.fcP(r)+H.estP(r)+H.recP(r)+H.cm(r);

/* ---------- drawer da UC ---------- */
H.drawer=r=>{ const u=UCS[r.uc]; const yn=b=>b?'Sim':'Não';
  return `<div class="dwh"><div class="grow"><div class="cap">Unidade consumidora</div><h2 id="dwT">${r.uc}</h2></div><button class="ib" data-a="dwclose" aria-label="Fechar"><span class="msr">close</span></button></div>
  <div class="dwb">
    <div class="pnl tight" style="padding:16px"><div class="ttl">Detalhes da UC</div>${kv([['Status',u.st],['Concessionária',u.conc],['Código legado',u.leg||'—',u.leg?'':'mut'],['Apelido',u.ap||'—',u.ap?'':'mut'],['Padrão de rede',u.rede],['Subgrupo tarifário',u.sub],['Modalidade',u.mod]])}</div>
    <div class="pnl tight" style="padding:16px"><div class="ttl">Configurações</div>${kv([['Faturamento manual',yn(u.man),u.man?'al':''],['Geração',u.ger],['Tipo de compensação',u.comp],['Autoconsumo',yn(u.auto)],['Saldo máximo',u.saldo+' meses'],['Rateio externo',u.rat?'Ativo':'Inativo',u.rat?'al':'']])}</div>
  </div>
  <div class="dwf"><button class="b out" data-a="toast" data-msg="Abriria a instalação no Cadastro"><span class="msr">open_in_new</span>Abrir instalação</button><button class="b pri" data-a="dwclose">Fechar</button></div>`; };
function openDw(id){ S.dw=id; const d=document.getElementById('dw'); d.innerHTML=H.drawer(row(id)); d.classList.add('on'); document.getElementById('dwOv').classList.add('on'); d._ret=document.activeElement; setTimeout(()=>d.querySelector('h2').focus(),0); }
function closeDw(){ const d=document.getElementById('dw'); d.classList.remove('on'); document.getElementById('dwOv').classList.remove('on'); S.dw=null; if(d._ret&&document.contains(d._ret)) d._ret.focus(); }

/* ---------- menus e ações ---------- */
H.menu=r=>[[r.rev?'Marcar como revisado':'Pedir revisão',r.rev?'flag':'outlined_flag',r.rev?'revoff':'revon'],['Abrir detalhamento','open_in_new','det'],['Detalhes e configurações da UC','tune','ucdw'],['sep'],['Recalcular','calculate','recalc'],['Copiar link','link','link']]
  .map(o=>o[0]==='sep'?'<div class="sepl"></div>':`<button class="opt" role="menuitem" data-a="${o[2]}" data-id="${r.id}"><span class="grow">${o[0]}</span><span class="msr">${o[1]}</span></button>`).join('');
const snap=()=>JSON.stringify(ROWS.map(r=>[r.rev,r.cm]));
const restore=s=>{ JSON.parse(s).forEach((x,i)=>{ ROWS[i].rev=x[0]; ROWS[i].cm=x[1]; }); refresh(); };
function setRev(ids,on){ const s=snap(); let n=0;
  ids.forEach(id=>{ const r=row(id); if(r.rev===on) return; n++; r.rev=on; r.cm.push({sys:1,t:on?'Marcado para revisão':'Revisão concluída',d:NOW,who:ME,isNew:1}); });
  refresh(); if(n) toast(on?n2(n,'faturamento marcado para revisão','faturamentos marcados para revisão'):n2(n,'faturamento revisado','faturamentos revisados'),{action:{label:'Desfazer',onClick:()=>restore(s)}}); }

/* ---------- montagem ---------- */
const mounts=[];
function mount(el,fn){ mounts.push({el,fn}); el.innerHTML=fn(); }
function refresh(){ const v=new Set(visible().map(r=>r.id)); [...S.sel].forEach(id=>{ if(!v.has(id)) S.sel.delete(id); });
  const ta=document.getElementById('cmT'); const draft=ta?ta.value:'';
  mounts.forEach(m=>{ m.el.innerHTML=m.fn(); });
  const ta2=document.getElementById('cmT'); if(ta2&&draft&&ta2.closest('form').dataset.id===S.cur) ta2.value=draft;
  updateBulk(); syncRail(); }
function updateBulk(){ const b=document.getElementById('bulk'); const n=S.sel.size; b.classList.toggle('on',n>0); document.getElementById('bulkN').textContent=n2(n,'selecionado','selecionados'); }
function syncRail(){ const r=document.getElementById('rail'); r.hidden=!S.railOpen; const b=document.getElementById('bRail'); b.classList.toggle('on',S.railOpen); b.setAttribute('aria-pressed',S.railOpen); }

let popEl=null, popAnchor=null;
function openPop(anchor,html,opts={}){ closePop(); popEl=document.getElementById('pop'); popEl.innerHTML=html; popEl.hidden=false; popAnchor=anchor; anchor.classList.add('open'); anchor.setAttribute('aria-expanded','true');
  popEl.style.minWidth=(opts.w||224)+'px'; const r=anchor.getBoundingClientRect(); const pw=popEl.offsetWidth, ph=popEl.offsetHeight;
  let x=opts.alignRight?r.right-pw:r.left; x=Math.max(8,Math.min(x,innerWidth-pw-8)); const up=opts.up||r.bottom+ph+8>innerHeight;
  popEl.style.position='fixed'; popEl.style.left=x+'px';
  if(up){ popEl.style.top='auto'; popEl.style.bottom=(innerHeight-r.top+6)+'px'; } else { popEl.style.bottom='auto'; popEl.style.top=(r.bottom+6)+'px'; }
  const f=popEl.querySelector('input,button'); if(f) f.focus({preventScroll:true}); }
function closePop(){ if(popEl){ popEl.hidden=true; popEl.innerHTML=''; } if(popAnchor){ popAnchor.classList.remove('open'); popAnchor.setAttribute('aria-expanded','false'); popAnchor=null; } }

function onClick(e){
  const a=e.target.closest('[data-a]');
  if(popEl&&!popEl.hidden&&!e.target.closest('#pop')&&!(popAnchor&&popAnchor.contains(e.target))) closePop();
  if(!a) return; const k=a.dataset.a, id=a.dataset.id;
  switch(k){
    case 'row': S.cur=id; S.railOpen=true; refresh(); break;
    case 'sel': e.stopPropagation(); S.sel.has(id)?S.sel.delete(id):S.sel.add(id); refresh(); break;
    case 'selall': { const v=visible(); const all=v.every(r=>S.sel.has(r.id)); v.forEach(r=>all?S.sel.delete(r.id):S.sel.add(r.id)); refresh(); break; }
    case 'rowmenu': e.stopPropagation(); if(popAnchor===a){ closePop(); break; } openPop(a,H.menu(row(id)),{alignRight:true,w:260}); break;
    case 'revon': closePop(); setRev([id],true); break;
    case 'revoff': closePop(); setRev([id],false); break;
    case 'det': closePop(); location.href='faturamento-detalhe.html?estado='+row(id).e; break;
    case 'ucdw': e.stopPropagation(); closePop(); openDw(id); break;
    case 'dwclose': closeDw(); break;
    case 'recalc': closePop(); toast('Recálculo solicitado',row(id).id); break;
    case 'link': closePop(); toast('Link copiado'); break;
    case 'grupo': e.stopPropagation(); toast('Abriria o '+a.dataset.v); break;
    case 'flt': { if(e.target.closest('[data-a="fclr"]')) return; if(popAnchor===a){ closePop(); break; } const f=FLT.find(x=>x.k===a.dataset.k); const v=S.f[f.k]||[];
      openPop(a,`${f.o.length>6?'<label class="ps"><span class="msr">search</span><input data-a="fsearch" placeholder="Pesquisar" aria-label="Pesquisar opções"></label>':''}<div role="group" aria-label="${f.l}">${f.o.map(o=>`<button class="opt" data-a="fopt" data-k="${f.k}" data-v="${esc(o)}" role="menuitemcheckbox" aria-checked="${v.includes(o)}"><span class="cbx ${v.includes(o)?'on':''}">${v.includes(o)?'<span class="mss">check</span>':''}</span><span class="grow">${esc(o)}</span></button>`).join('')}</div>`,{w:240}); break; }
    case 'fopt': { const f=a.dataset.k, v=a.dataset.v; const cur=S.f[f]||[]; S.f[f]=cur.includes(v)?cur.filter(x=>x!==v):[...cur,v]; const on=S.f[f].includes(v); a.setAttribute('aria-checked',on); const c=a.querySelector('.cbx'); c.classList.toggle('on',on); c.innerHTML=on?'<span class="mss">check</span>':''; refresh(); const nb=document.querySelector(`.flt[data-k="${f}"]`); if(nb){ popAnchor=nb; nb.classList.add('open'); } break; }
    case 'fclr': e.stopPropagation(); S.f[a.dataset.k]=[]; closePop(); refresh(); break;
    case 'fclrall': S.f={}; refresh(); break;
    case 'fold': { const f=a.dataset.k; S.fold.has(f)?S.fold.delete(f):S.fold.add(f); refresh(); const b=document.querySelector(`#rail [data-a="fold"][data-k="${f}"]`); if(b) b.focus(); break; }
    case 'foldall': { const all=FOLDS.every(f=>!S.fold.has(f)); S.fold=new Set(all?FOLDS:[]); refresh(); const b=document.querySelector('#rail [data-a="foldall"]'); if(b) b.focus(); break; }
    case 'railclose': S.railOpen=false; refresh(); break;
    case 'copy': { const v=a.dataset.v; try{ navigator.clipboard.writeText(v).then(()=>toast('Copiado',v),()=>toast(v)); }catch(err){ toast(v); } break; }
    case 'toast': toast(a.dataset.msg); break;
  }
}
function onBulk(e){ const a=e.target.closest('[data-bulk]'); if(!a) return; const k=a.dataset.bulk; const ids=[...S.sel];
  if(k==='limpar'){ S.sel.clear(); refresh(); }
  if(k==='revon') setRev(ids,true);
  if(k==='revoff') setRev(ids,false);
  if(k==='recalc') toast(n2(ids.length,'recálculo solicitado','recálculos solicitados'));
  if(k==='exp') toast(n2(ids.length,'faturamento exportado','faturamentos exportados')+' (CSV)'); }
function setTheme(t){ document.querySelectorAll('.fp').forEach(el=>el.classList.toggle('dk',t==='dark')); document.body.classList.toggle('dk',t==='dark');
  document.querySelectorAll('.proto [data-th]').forEach(b=>b.classList.toggle('on',b.dataset.th===t)); try{ localStorage.setItem('fp-theme',t); }catch(err){} }

function mountScreen(){
  mount(document.getElementById('frow'),H.filters);
  mount(document.getElementById('tbl'),H.table);
  mount(document.getElementById('rail'),()=>H.rail(row(S.cur)||ROWS[0]));
  mount(document.getElementById('count'),()=>{ const v=visible().length; return n2(v,'faturamento','faturamentos')+(v!==ROWS.length?` de ${ROWS.length}`:''); });
  document.addEventListener('click',onClick);
  document.getElementById('bulk').addEventListener('click',onBulk);
  document.getElementById('dwOv').addEventListener('click',closeDw);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if(popEl&&!popEl.hidden){ const a=popAnchor; closePop(); a&&a.focus(); return; } if(S.dw) closeDw(); }
    if((e.key==='Enter'||e.key===' ')&&e.target.matches('.tr.row')){ e.preventDefault(); e.target.click(); } });
  document.addEventListener('input',e=>{ if(e.target.matches('[data-a="fsearch"]')){ const q=e.target.value.toLowerCase(); popEl.querySelectorAll('.opt').forEach(o=>o.hidden=!o.textContent.toLowerCase().includes(q)); } });
  document.addEventListener('submit',e=>{ const f=e.target.closest('.cmp'); if(!f) return; e.preventDefault(); const ta=f.querySelector('textarea'); const t=ta.value.trim(); if(!t){ ta.focus(); return; }
    row(f.dataset.id).cm.push({who:ME,t,d:NOW,isNew:1}); ta.value=''; refresh(); toast('Comentário adicionado'); });
  document.getElementById('bRail').onclick=()=>{ S.railOpen=!S.railOpen; refresh(); };
  document.getElementById('bFlt').onclick=e=>{ S.fltOpen=!S.fltOpen; document.getElementById('frow').hidden=!S.fltOpen; e.currentTarget.setAttribute('aria-pressed',S.fltOpen); };
  document.getElementById('q').addEventListener('input',e=>{ S.q=e.target.value; refresh(); });
  document.querySelectorAll('.proto [data-th]').forEach(b=>b.onclick=()=>setTheme(b.dataset.th));
  let th=null; try{ th=localStorage.getItem('fp-theme'); }catch(err){} setTheme(th||'light');
  updateBulk(); syncRail();
}
window.CF={mountScreen,S,ROWS};
})();
