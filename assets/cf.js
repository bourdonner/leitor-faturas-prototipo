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
  bea:{n:'Beatriz Nunes',pj:0,doc:'345.789.123-21',cart:'Carteira Cooperados PR',grp:null,reg:1},
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
/* cidade da UC */
const CID={'3014567890':'Curitiba - PR','3014567891':'São José dos Pinhais - PR','3000451278':'Ponta Grossa - PR','3009876543':'Londrina - PR','3012233445':'Curitiba - PR','3005566778':'Maringá - PR','3017788990':'Cascavel - PR','3003344556':'Guarapuava - PR','3020011223':'Joinville - SC','3011122334':'Curitiba - PR'};
/* faturamentos:[id, ref, titular, uc, leitura{st,dt}, concessionária{inj,cons,val}, estudo{st,val,eco,taxa}, receber{st,tit,ven,pag,banco}, revisão, comentários, estado do detalhe] */
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
/* resumo: saldo de créditos (meses) e data de pagamento */
const SAL={'FT-10231':12,'FT-10232':9,'FT-10233':4,'FT-10234':0,'FT-10235':7,'FT-10236':3,'FT-10237':6,'FT-10238':2,'FT-10239':10,'FT-10240':8,'FT-10198':11};
const PAGO={'FT-10235':'01/04/2025','FT-10198':'03/03/2025'};
const HOJE=new Date(2025,3,2);
const dias=d=>{ const [a,b,c]=d.split('/').map(Number); return Math.round((HOJE-new Date(c,b-1,a))/864e5); };
const pct=n=>n.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';
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
/* pontos da etapa (Figma "Etapa / Pontos"): anteriores em verde, atual escura (vermelha se falhou), seguintes apagadas */
H.steps=r=>{ const i=etapa(r), st=fase(r)[1];
  return `<span class="steps" aria-hidden="true">${[0,1,2].map(k=>`<i class="${k<i||DONE.includes(st)?'d':k===i?(FAIL.includes(st)?'e':'c'):''}"></i>`).join('')}</span>`; };
H.lei=r=>H.badge(r.lei.st,LEI);
H.tit=r=>{ const t=TIT[r.t]; return `<div class="ent"><span class="ic ${t.pj?'':'pf'}"><span class="msr fill">${t.pj?'bolt':'person'}</span></span><div class="t"><div>${esc(t.n.toUpperCase())}</div><div class="s">${esc(t.doc)}</div></div>${t.grp?`<button class="grp" data-a="grupo" data-v="${esc(t.grp)}" title="${esc(t.grp)}" aria-label="Abrir ${esc(t.grp)}"><span class="msr fill">groups</span></button>`:''}</div>`; };
H.ust=u=>{ const s=UST[u.st]; return `<span class="ust ${s[0]}" title="${u.st}" aria-label="${u.st}"><span class="msr fill">${s[1]}</span></span>`; };
H.uc=r=>`<div class="ent">${H.ust(UCS[r.uc])}<div class="t"><div>${r.uc}</div><div class="s">${esc(CID[r.uc])}</div></div></div>`;
H.est=r=>H.badge(r.est.st,EST);
H.rec=r=>r.rec?H.badge(r.rec.st,REC):`<span style="color:var(--s400)">${r.est.st==='Calculado'?'Aguardando emissão':'Aguardando estudo'}</span>`;

const COLS=[
 {k:'ck',w:'48px',h:()=>{ const v=visible(); const n=v.filter(r=>S.sel.has(r.id)).length; const st=n===0?'':n===v.length?'on':'mid'; return `<button class="cbx ${st}" data-a="selall" role="checkbox" aria-checked="${n===0?'false':n===v.length?'true':'mixed'}" aria-label="Selecionar todos">${st==='on'?'<span class="mss">check</span>':''}</button>`; },
   c:r=>`<button class="cbx ${S.sel.has(r.id)?'on':''}" data-a="sel" data-id="${r.id}" role="checkbox" aria-checked="${S.sel.has(r.id)}" aria-label="Selecionar ${r.id}">${S.sel.has(r.id)?'<span class="mss">check</span>':''}</button>`},
 {k:'ref',w:'110px',h:()=>'<button class="so">Ref.<span class="msr">import_export</span></button>',c:r=>r.ref},
 {k:'tit',w:'minmax(240px,1fr)',h:()=>'Titular',c:H.tit,cel:1},
 {k:'uc',w:'minmax(220px,1fr)',h:()=>'Unidade consumidora',c:H.uc,cel:1},
 {k:'est',w:'150px',h:()=>'Estudo',c:H.est},
 {k:'eta',w:'160px',h:()=>'Etapa',c:r=>`<div class="two eta">${H.steps(r)}<span title="Etapa ${etapa(r)+1} de 3">${fase(r)[0]}</span></div>`},
 {k:'rec',w:'160px',h:()=>'Status',c:H.rec},
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
    if(q&&![r.id,r.ref,t.n,t.doc,r.uc,u.leg,u.ap,u.conc,CID[r.uc]].join(' ').toLowerCase().includes(q)) return false;
    for(const f of FLT){ const v=S.f[f.k]; if(v&&v.length&&!f.m(r,v)) return false; } return true; }); }

H.filters=()=>FLT.map(f=>{ const v=S.f[f.k]||[]; const has=v.length>0;
  return `<button class="flt ${has?'has':''}" data-a="flt" data-k="${f.k}" aria-haspopup="dialog"><span class="lb">${f.l}</span>${has?'<span class="sep"></span>'+(v.length>2?`<span class="chip">${v.length} selecionados</span>`:v.map(x=>`<span class="chip">${esc(x)}</span>`).join(''))+`<span class="x" data-a="fclr" data-k="${f.k}" role="button" aria-label="Limpar ${f.l}"><span class="msr">close</span></span>`:'<span class="msr">expand_more</span>'}</button>`; }).join('')
  +(Object.values(S.f).some(v=>v&&v.length)?'<button class="fclear" data-a="fclrall">Limpar filtros</button>':'');
H.table=()=>{ const gt=COLS.map(c=>c.w).join(' '); const v=visible();
  const head=`<div class="tr th" role="row" style="grid-template-columns:${gt}">${COLS.map(c=>`<div role="columnheader">${c.h()}</div>`).join('')}</div>`;
  const rows=v.map(r=>`<div class="tr row ${S.sel.has(r.id)?'is-sel':''} ${S.railOpen&&S.cur===r.id?'cur':''}" role="row" tabindex="0" data-a="row" data-id="${r.id}" style="grid-template-columns:${gt}">${COLS.map(c=>`<div role="cell" class="${c.cel?'cel':''}">${c.c(r)}</div>`).join('')}</div>`).join('');
  return head+(rows||'<div class="empty">Nenhum faturamento com esses filtros.</div>'); };

/* ---------- resumo (Figma: Resumo / Faturamento, Titular, Unidade consumidora, Fatura da concessionária, Estudo, Conta a receber) ---------- */
/* item: ícone de status 30px + rótulo/valor; o.cpt = compacto (sem ícone), o.dst = destaque laranja, o.tone = 'pos' (verde) ou 'na' (indisponível) */
const IT=o=>`<div class="rs-it${o.cpt?' cpt':''}${o.dst?' dst':''}">${o.cpt?'':`<span class="ci ${o.cls||''}"><span class="msr fill${o.spin?' spin':''}">${o.ic}</span></span>`}<div class="grow"><div class="lb">${o.l}</div><div class="v ${o.tone||''}">${o.tone==='na'?'Indisponível':`<span>${o.v}</span>`}${o.x&&o.tone!=='na'?`<i></i><span class="x">${o.x}</span>`:''}</div></div>${o.tone==='na'?'':o.act||''}</div>`;
const two=(a,b)=>`<div class="rs-two">${a}${b}</div>`;
const cp=(v,lbl)=>`<button class="ib" data-a="copy" data-v="${esc(v)}" aria-label="Copiar ${lbl}"><span class="msr">content_copy</span></button>`;
const lk=(msg,lbl)=>`<button class="ib" data-a="toast" data-msg="${esc(msg)}" aria-label="${esc(lbl)}"><span class="msr">open_in_new</span></button>`;
const FOLDS=['tit','uc','fc','est','rec','cm'];
const fold=(k,ttl)=>`<button class="ib" data-a="fold" data-k="${k}" aria-label="${S.fold.has(k)?'Expandir':'Recolher'} ${ttl}" aria-expanded="${!S.fold.has(k)}"><span class="msr chev">expand_less</span></button>`;
const shut=k=>S.fold.has(k)?' closed':'';
const kv=rows=>`<div class="kvl">${rows.map(x=>`<div><span>${x[0]}</span><b class="${x[2]||''}">${x[1]}</b></div>`).join('')}</div>`;
/* card: cabeçalho (ícone 20px, título, detalhe, link, recolher) + itens; recolhido mantém só os destaques */
const card=(k,h,body,keep)=>`<section class="rs-card${shut(k)}" aria-label="${esc(h.t)}"><div class="rs-hd${h.big?'':' sm'}"><span class="eb${h.off?' off':''}"><span class="msr fill">${h.ic}</span></span><div class="t"><b>${esc(h.t)}</b>${h.d?`<span class="cap">${esc(h.d)}</span>`:''}</div>${h.open||''}${fold(k,h.t.toLowerCase())}</div>${S.fold.has(k)?(keep?`<div class="rs-bd">${keep}</div>`:''):`<div class="rs-bd">${body}</div>`}</section>`;
H.rbar=()=>{ const all=FOLDS.every(k=>!S.fold.has(k)); return `<div class="rbar"><span class="msr">article_shortcut</span><span class="grow">Resumo do faturamento</span><button class="ib tip" data-a="foldall" data-tip="${all?'Recolher tudo':'Expandir tudo'}" aria-label="${all?'Recolher todas as seções':'Expandir todas as seções'}"><span class="msr">${all?'unfold_less':'unfold_more'}</span></button><button class="ib" data-a="railclose" aria-label="Fechar resumo"><span class="msr">right_panel_close</span></button></div>`; };
/* topo: faixa "Revisão necessária" (se pedida) + fatura de ref. com as ações */
H.head=r=>`<section class="rs-card rs-fat">${r.rev?'<div class="rs-rev" role="status"><span class="grow">Revisão necessária</span><span class="msr fill">flag</span></div>':''}
  <div class="rs-tk"><div class="row"><b>Fatura de ${r.ref}</b><button class="more" data-a="rowmenu" data-id="${r.id}" aria-label="Ações do faturamento" aria-haspopup="menu"><span class="msr">more_horiz</span></button></div>
  ${r.rev?`<button class="b sec full" data-a="revoff" data-id="${r.id}">Marcar como revisado</button>`:''}<a class="b pri full" href="faturamento-detalhe.html?estado=${r.e}" style="text-decoration:none">Abrir detalhamento</a></div></section>`;
H.titP=r=>{ const t=TIT[r.t];
  return card('tit',{ic:t.pj?'work':'person',t:t.n,d:'Titular',big:1,open:lk('Abriria o cadastro do titular','Abrir cadastro do titular')},
    (t.reg?IT({ic:'how_to_reg',cls:'al',l:'Status',v:'Em processo de registro'}):IT({ic:'check',cls:'ok',l:'Status',v:'Ativo'}))
    +IT({ic:'badge',l:t.pj?'CNPJ':'CPF',v:t.doc,act:cp(t.doc,t.pj?'CNPJ':'CPF')})
    +IT({ic:'groups',l:'Grupo',v:t.grp?esc(t.grp):'Titular não vinculado a um grupo',act:t.grp?`<button class="ib" data-a="grupo" data-v="${esc(t.grp)}" aria-label="Abrir ${esc(t.grp)}"><span class="msr">open_in_new</span></button>`:''})
    +IT({ic:'wallet',l:'Carteira',v:t.cart?esc(t.cart):'Titular não vinculado a uma carteira',act:t.cart?lk('Abriria a '+t.cart,'Abrir carteira'):''})); };
const UCI={on:['check','ok'],off:['power_off','al'],can:['block','dg']};
H.ucP=r=>{ const u=UCS[r.uc]; const s=UCI[UST[u.st][0]];
  const dst=(u.rat?IT({dst:1,ic:'call_split',cls:'al',l:'Rateio externo',v:'Ativo'}):'')+(u.man?IT({dst:1,ic:'edit_note',cls:'al',l:'Faturamento manual',v:'Ativo'}):'');
  return card('uc',{ic:'electric_meter',t:r.uc,d:'Unidade consumidora'+(u.ap?' · '+u.ap:''),big:1,open:`<button class="ib" data-a="ucdw" data-id="${r.id}" aria-label="Detalhes e configurações da UC"><span class="msr">open_in_new</span></button>`},
    IT({ic:s[0],cls:s[1],l:'Status',v:u.st})
    +IT({ic:'electrical_services',l:'Distribuidora',v:esc(u.conc),act:lk('Abriria a distribuidora '+u.conc,'Abrir distribuidora')})
    +IT({ic:'offline_bolt',l:'Saldo máximo',v:u.saldo+' meses',act:`<button class="ib" data-a="ucdw" data-id="${r.id}" aria-label="Ver configurações de saldo"><span class="msr">open_in_new</span></button>`})
    +IT({ic:'energy_savings_leaf',l:'Modalidade',v:esc(u.mod)})+dst, dst); };
H.fcP=r=>{ const u=UCS[r.uc], f=r.fc, na=r.lei.st!=='Processado'?'na':'';
  return card('fc',{ic:'receipt_long',t:'Fatura da concessionária',off:!!na},
    (u.ger==='Produção solar'?IT({ic:'solar_power',cls:'al',l:'Produção solar',v:kwh(Math.round(f.inj*1.08)),tone:na}):'')
    +IT({ic:'bolt',l:'Consumo',v:kwh(f.cons),tone:na})
    +two(IT({ic:'incomplete_circle',l:'Injeção',v:kwh(f.inj),tone:na}),IT({ic:'trending_up',l:'Taxa de injeção',v:pct(Math.round(f.inj/f.cons*100)),tone:na}))
    +IT({ic:'payments',l:'Valor da fatura',v:brl(f.val),tone:na,act:cp(brl(f.val),'valor da fatura')})
    +IT({ic:'offline_bolt',l:'Saldo',v:n2(SAL[r.id],'mês','meses'),tone:na,act:lk('Abriria o extrato de saldo','Abrir saldo')})); };
H.estP=r=>{ const e=r.est, ok=e.val!=null, na=ok?'':'na', pos=ok?'pos':'na';
  const proj=ok?e.val+e.eco:0, amb=ok?e.val*.012:0, ver=ok?e.val*.03:0;
  const st=e.st==='Em cálculo'?IT({ic:'progress_activity',cls:'bl',spin:1,l:'Status',v:'Calculando o estudo'})
    :e.st==='Falha no cálculo'?IT({ic:'block',cls:'dg',l:'Falha no cálculo',v:esc((r.cm.find(c=>c.sys)||{}).t||'Não foi possível calcular')}):'';
  return card('est',{ic:'calculate',t:'Estudo',off:e.st==='Em cálculo'},
    st+two(IT({cpt:1,l:'Valor projetado',v:brl(proj),tone:na}),IT({cpt:1,l:'Valor total',v:brl(e.val),tone:na}))
    +IT({ic:'flag',cls:'al',l:'Bandeira tarifária amarela',v:brl(amb),x:'12 dias',tone:na})
    +IT({ic:'flag',cls:'dg',l:'Bandeira tarifária vermelha',v:brl(ver),x:'18 dias',tone:na})
    +IT({ic:'savings',cls:'ok',l:'Economia total',v:brl(e.eco),x:ok?pct(e.eco/proj*100):'',tone:pos})
    +two(IT({cpt:1,l:'Desc. energia injetada',v:brl(ok?e.eco-e.taxa:0),tone:pos}),IT({cpt:1,l:'Desconto titular',v:TIT[r.t].pj?'10%':'15%',tone:pos}))
    +(e.st==='Falha no cálculo'?'<button class="b sec full" data-a="toast" data-msg="Recálculo solicitado">Recalcular</button>':'')); };
H.recP=r=>{ const c=r.rec;
  if(!c){ const w=r.est.val!=null?'Aguardando emissão':'Aguardando estudo';
    return card('rec',{ic:'request_quote',t:'Conta a receber',off:1},IT({ic:'hourglass_empty',cls:'gr',l:'Status',v:w})+IT({ic:'event',l:'Vencimento',tone:'na'})); }
  const ST={'Emissão pendente':{ic:'pending_actions',cls:'al',v:'Emissão pendente'},'Gerando boleto':{ic:'progress_activity',cls:'bl',spin:1,v:'O boleto está sendo gerado'},
    'Aberto':{ic:'attach_money',v:'Aguardando pagamento'},'Atrasado':{ic:'attach_money',cls:'dg',v:'Fatura atrasada',x:c.ven?'vencida há '+n2(dias(c.ven),'dia','dias'):''},
    'Liquidado':{ic:'check',cls:'ok',v:'Fatura paga',x:PAGO[r.id]},'Sem cobrança':{ic:'do_not_disturb_on',v:'Faturamento sem cobrança'}}[c.st];
  return card('rec',{ic:'request_quote',t:'Conta a receber'},IT({...ST,l:'Status'})
    +(c.st==='Sem cobrança'?'':IT({ic:'event',cls:c.st==='Atrasado'?'dg':'',l:'Vencimento',v:c.ven||'—'}))); };
H.cm=r=>{ const ev=c=>{ const who=c.who?`<span class="who2" data-name="${esc(c.who)}">${ini(c.who)}</span>`:'<span class="who2 sys" data-name="Sistema"><span class="msr fill">bolt</span></span>';
    return `<div class="ev ${c.isNew?'new':''}"><span class="i ${c.sys?(c.t.includes('revis')?'c-alert':'c-def'):'c-edit'}"><span class="msr fill">${c.sys?(c.t.includes('revis')?'flag':'bolt'):'chat'}</span></span>${who}<div class="n">${esc(c.t)}</div><div class="d">${c.d}</div></div>`; };
  return `<div class="act-p${shut('cm')}"><div class="act-h"><span class="grow">Comentários</span><span class="cap">${r.cm.length||''}</span>${fold('cm','comentários')}</div><div class="act-l evs">${r.cm.map((c,i)=>(i?'<div class="lnk"></div>':'')+ev(c)).join('')}</div>
  <form class="cmp" data-id="${r.id}"><label class="sr" for="cmT" style="position:absolute;left:-9999px">Comentário</label><textarea class="ta" id="cmT" placeholder="Escreva um comentário"></textarea><div class="row"><button class="b pri sm" type="submit">Comentar</button></div></form></div>`; };
H.rail=r=>H.rbar()+H.head(r)+H.titP(r)+H.ucP(r)+H.fcP(r)+H.estP(r)+H.recP(r)+H.cm(r);

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
