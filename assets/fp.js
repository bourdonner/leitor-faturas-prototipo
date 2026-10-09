/* Faturamento Pendente (Tickets) — estado, componentes e interações.
   Usado por faturamento-pendente.html (tela) e faturamento-pendente-componentes.html (componentes soltos).
   Os componentes são funções que devolvem HTML; as ações usam data-a + data-tk e passam por um único handler. */
(function(){
const ME='Juliana Rocha';
const PEOPLE=['Juliana Rocha','Carlos Mendes','Marina Duarte','Rafael Nunes'];
const CARTS=['Carteira Sul','Carteira Norte','Grandes Contas','Suporte N1'];
const CONCS=['CPFL Paulista','Enel SP','Cemig','Copel'];
const MOTIVOS=['Erro de leitura','Fatura não emitida','Coleta não executada'];
const SIT={ 'Sem Atendimento':'b-grey','Aguardando Fatura':'b-alert','Em Atendimento':'b-dark','Resolvido':'b-ok','Demissão':'b-danger' };
const STA={ 'Aberto':'b-grey','Em andamento':'b-alert','Resolvido':'b-ok','Cancelado':'b-grey' };
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const ini=n=>n?n.split(' ').map(p=>p[0]).slice(0,2).join(''):'';
const pad=n=>String(n).padStart(2,'0');

/* ---------- dados fictícios ---------- */
const MES=['01','02','03','04','05','06','07','08','09','10','11','12'];
function genFat(n, ucs, seed, conc){
  const out=[]; let m=8, y=2025;
  for(let i=0;i<n;i++){
    const uc=ucs[i%ucs.length]; const mot=MOTIVOS[(i+seed)%3];
    const comp=MES[m]+'/'+y; const prev=pad(3+((i+seed)%20))+'/'+MES[(m+1)%12]+'/'+(m===11?y+1:y);
    out.push({id:'f'+seed+'-'+i,comp,uc,mot,prev,late:4+((i*7+seed)%40),conc});
    m++; if(m>11){m=0;y++;}
  }
  return out;
}
const T=[
 ['TK-04182','Sem Atendimento',0,'FERNANDA LIMA',0,['3302114'],1,null,'Carteira Sul','Aberto','08/10/2026',0],
 ['TK-04175','Aguardando Fatura',4,'SOLARIS ENERGIAS RENOVÁVEIS',1,['1234531','8890742','5512093','7720114','6631880'],12,'Juliana Rocha','Grandes Contas','Em andamento','01/10/2026',0],
 ['TK-04170','Aguardando Fatura',5,'ANA SOUZA',0,['4410298'],1,'Rafael Nunes','Carteira Norte','Em andamento','07/10/2026',1],
 ['TK-04168','Resolvido',5,'LUIZA CASTRO',0,['9910233'],0,'Marina Duarte','Carteira Sul','Resolvido','06/10/2026',0],
 ['TK-04166','Em Atendimento',7,'QUANTUM SOLUTIONS',1,['2201551','2201552','2201553'],4,'Carlos Mendes','Suporte N1','Em andamento','06/10/2026',2],
 ['TK-04163','Em Atendimento',1,'NOVATECH ENERGY',1,['7781002','7781003'],2,'Juliana Rocha','Grandes Contas','Em andamento','05/10/2026',3],
 ['TK-04159','Demissão',7,'STELLARIS INDUSTRIES',1,['5150020','5150021','5150022'],2,'Rafael Nunes','Carteira Norte','Em andamento','05/10/2026',1],
 ['TK-04155','Sem Atendimento',0,'MARCOS PEREIRA',0,['8012775'],1,null,'Carteira Sul','Aberto','04/10/2026',2],
 ['TK-04151','Em Atendimento',2,'HELIOS COMÉRCIO',1,['6620117','6620118'],2,'Carlos Mendes','Suporte N1','Em andamento','04/10/2026',0],
 ['TK-04148','Aguardando Fatura',6,'PADARIA ESTRELA DO SUL',1,['3390451','3390452'],3,'Juliana Rocha','Grandes Contas','Em andamento','03/10/2026',0],
 ['TK-04144','Em Atendimento',2,'CARLA MENDONÇA',0,['1180994'],1,'Rafael Nunes','Carteira Norte','Em andamento','03/10/2026',3],
 ['TK-04140','Em Atendimento',3,'VERDE VALE AGRO',1,['4471200'],1,null,'Carteira Sul','Aberto','02/10/2026',2],
 ['TK-04137','Aguardando Fatura',3,'JOÃO BATISTA',0,['2259031'],2,'Juliana Rocha','Carteira Sul','Em andamento','02/10/2026',1]
];
const CH=[['call','Telefone'],['chat','WhatsApp'],['mail','E-mail']];
const RES=['Caixa postal','Sem retorno','Sem contato','Cooperado enviará','Sem retorno','Sem contato','Sem retorno'];
function genHist(t){
  const h=[];
  if(t.id==='TK-04175'){
    h.push({ic:'chat',c:'c-def',t:'4ª tentativa · Cooperado enviará',d:'07/10 às 10:40',who:'Juliana Rocha',ev:1});
    h.push({ic:'call',c:'c-def',t:'3ª tentativa · Sem contato',d:'04/10 às 10:40',who:'Juliana Rocha',ev:1});
    h.push({ic:'mail',c:'c-def',t:'2ª tentativa · Sem retorno',d:'01/10 às 10:40',who:'Carlos Mendes',ev:1});
    h.push({ic:'call',c:'c-def',t:'1ª tentativa · Caixa postal',d:'28/09 às 10:40',who:'Juliana Rocha',ev:1});
    h.push({ic:'play_arrow',c:'c-ok',t:'Atendimento iniciado',d:'27/09 às 10:40',who:'Juliana Rocha'});
    h.push({ic:'person_add',c:'c-edit',t:'Responsável definido',d:'26/09 às 10:40',who:'Juliana Rocha',from:'Sem responsável',to:'Juliana Rocha'});
    h.push({ic:'note_add',c:'c-def',t:'Fatura 02/2026 adicionada',d:'26/09 às 10:40',who:'Juliana Rocha'});
    h.push({ic:'login',c:'c-def',t:'Pendência gerada automaticamente',d:'25/09 às 10:40',who:null});
    return h;
  }
  for(let i=t.tent;i>=1;i--){ const ch=CH[(i+t.seed)%3]; h.push({ic:ch[0],c:'c-def',t:i+'ª tentativa · '+RES[(i-1)%RES.length],d:pad(2+i)+'/10 às 1'+(i%10)+':20',who:t.resp||PEOPLE[i%4],ev:1}); }
  if(t.tent) h.push({ic:'play_arrow',c:'c-ok',t:'Atendimento iniciado',d:'02/10 às 09:10',who:t.resp||'Carlos Mendes'});
  if(t.resp) h.push({ic:'person_add',c:'c-edit',t:'Responsável definido',d:'01/10 às 16:02',who:t.resp,from:'Sem responsável',to:t.resp});
  h.push({ic:'login',c:'c-def',t:'Pendência gerada automaticamente',d:t.aberto.slice(0,5)+' às 06:00',who:null});
  return h;
}
const S={ tickets:[], sel:new Set(), cur:'TK-04175', railOpen:true, indOpen:false, fltOpen:true, q:'',
  f:{visao:['Triagem','Meus']}, shown:{}, undo:null };
T.forEach((r,i)=>{
  const t={id:r[0],sit:r[1],tent:r[2],coop:r[3],pj:!!r[4],ucs:r[5],resp:r[7],cart:r[8],status:r[9],aberto:r[10],seed:i,conc:CONCS[r[11]],
    doc:r[4]?pad(10+i)+'.345.678/0001-'+pad(90-i):pad(100+i*7).slice(0,3)+'.456.789-'+pad(10+i)};
  t.fat=genFat(r[6],r[5],i,t.conc);
  if(t.id==='TK-04175'){ const f=t.fat; [['09/2025','1234531','Erro de leitura'],['10/2025','1234531','Erro de leitura'],['11/2025','8890742','Fatura não emitida'],['12/2025','5512093','Coleta não executada'],['01/2026','7720114','Erro de leitura']].forEach((x,k)=>{f[k].comp=x[0];f[k].uc=x[1];f[k].mot=x[2];}); }
  t.hist=genHist(t);
  S.tickets.push(t);
});
const tk=id=>S.tickets.find(t=>t.id===id);

/* ---------- peças ---------- */
const H={};
H.badge=(txt,map)=>`<span class="bdg ${map[txt]||'b-grey'}">${esc(txt)}</span>`;
H.dots=n=>{ const c=n>=7?'r':n>=3?'o':'g'; let s=''; for(let i=1;i<=7;i++) s+=`<i class="${i<=n?c:''}"></i>`; return `<span class="dots ${n>=3?c:''}" aria-label="${n} de 7 tentativas">${s}<span>${n}/7</span></span>`; };
H.ucs=n=>n+(n===1?' UC':' UCs');
H.ent=t=>`<div class="ent"><span class="ic ${t.pj?'':'pf'}"><span class="msr fill">${t.pj?'bolt':'person'}</span></span><div class="t"><div>${esc(t.coop)}</div><div class="s">${H.ucs(t.ucs.length)}</div></div></div>`;
H.faturas=n=>n===0?'—':n+(n===1?' fatura':' faturas');
H.menuTicket=t=>[['Transferir responsável','person_add','resp'],['Devolver à triagem','undo','triagem'],['Resolver manualmente','check_circle','resolver'],['Editar descrição','edit','desc'],['sep'],['Cancelar ticket','close','cancelar','dg']]
  .map(o=>o[0]==='sep'?'<div class="sepl"></div>':`<button class="opt ${o[3]||''}" role="menuitem" data-a="m-${o[2]}" data-tk="${t.id}"><span class="grow">${o[0]}</span><span class="msr">${o[1]}</span></button>`).join('');

/* colunas: prioridade de ocultação (regra 350:32798) — some primeiro quem tem o menor número */
const COLS=[
 {k:'ck',w:'48px',h:()=>{ const v=visible(); const n=v.filter(t=>S.sel.has(t.id)).length; const st=n===0?'':n===v.length?'on':'mid'; return `<button class="cbx ${st}" data-a="selall" role="checkbox" aria-checked="${n===0?'false':n===v.length?'true':'mixed'}" aria-label="Selecionar todos">${st==='on'?'<span class="mss">check</span>':''}</button>`; },
   c:t=>`<button class="cbx ${S.sel.has(t.id)?'on':''}" data-a="sel" data-tk="${t.id}" role="checkbox" aria-checked="${S.sel.has(t.id)}" aria-label="Selecionar ${t.id}">${S.sel.has(t.id)?'<span class="mss">check</span>':''}</button>`},
 {k:'tk',w:'96px',h:()=>'<button class="so">Ticket<span class="msr">import_export</span></button>',c:t=>t.id},
 {k:'sit',w:'176px',h:()=>'<button class="so">Situação<span class="msr">import_export</span></button>',c:t=>H.badge(t.sit,SIT)},
 {k:'tent',w:'148px',hide:6,h:()=>'<button class="so">Tentativa<span class="msr">import_export</span></button>',c:t=>H.dots(t.tent)},
 {k:'coop',w:'minmax(240px,1fr)',h:()=>'Cooperado',c:t=>H.ent(t)},
 {k:'fat',w:'96px',hide:5,h:()=>'Faturas',c:t=>H.faturas(t.fat.length)},
 {k:'resp',w:'140px',hide:4,h:()=>'Responsável',c:t=>t.resp?esc(t.resp):'<span style="color:var(--mid)">—</span>'},
 {k:'cart',w:'140px',hide:1,h:()=>'Carteira',c:t=>esc(t.cart)},
 {k:'sta',w:'124px',hide:3,h:()=>'Status',c:t=>H.badge(t.status,STA)},
 {k:'ab',w:'116px',hide:2,h:()=>'<button class="so">Aberto em<span class="msr">import_export</span></button>',c:t=>t.aberto},
 {k:'act',w:'56px',h:()=>'',c:t=>`<button class="more" data-a="rowmenu" data-tk="${t.id}" aria-label="Ações do ${t.id}" aria-haspopup="menu"><span class="msr">more_horiz</span></button>`}
];
const FIXW={ck:48,tk:96,sit:176,tent:148,fat:96,resp:140,cart:140,sta:124,ab:116,act:56};

/* filtros */
const FLT=[
 {k:'visao',l:'Visão',o:['Triagem','Meus'],m:(t,v)=>v.some(x=>x==='Triagem'?!t.resp:t.resp===ME)},
 {k:'sit',l:'Situação',o:Object.keys(SIT),m:(t,v)=>v.includes(t.sit)},
 {k:'sta',l:'Status',o:['Aberto','Em andamento','Resolvido'],m:(t,v)=>v.includes(t.status)},
 {k:'cart',l:'Carteira',o:CARTS,m:(t,v)=>v.includes(t.cart)},
 {k:'resp',l:'Responsável',o:['Sem responsável',...PEOPLE],m:(t,v)=>v.includes(t.resp||'Sem responsável')},
 {k:'tent',l:'Tentativas',o:['0','1','2','3','4','5','6','7'],m:(t,v)=>v.includes(String(t.tent))},
 {k:'conc',l:'Concessionária',o:CONCS,m:(t,v)=>v.includes(t.conc)},
 {k:'mot',l:'Motivo da falha',o:MOTIVOS,m:(t,v)=>t.fat.some(f=>v.includes(f.mot))},
 {k:'ab',l:'Aberto em',o:['Últimos 7 dias','Últimos 30 dias'],m:(t,v)=>v.includes('Últimos 30 dias')||Number(t.aberto.slice(0,2))>=3}
];
function visible(){
  const q=S.q.trim().toLowerCase();
  return S.tickets.filter(t=>{
    if(q && !(t.id+' '+t.coop+' '+t.ucs.join(' ')+' '+t.conc).toLowerCase().includes(q)) return false;
    for(const f of FLT){ const v=S.f[f.k]; if(v&&v.length&&!f.m(t,v)) return false; }
    return true;
  });
}
H.filters=()=>FLT.map(f=>{ const v=S.f[f.k]||[]; const has=v.length>0;
  return `<button class="flt ${has?'has':''}" data-a="flt" data-k="${f.k}" aria-haspopup="dialog"><span class="lb">${f.l}</span>${has?'<span class="sep"></span>'+(v.length>2?`<span class="chip">${v.length} selecionados</span>`:v.map(x=>`<span class="chip">${esc(x)}</span>`).join(''))+`<span class="x" data-a="fclr" data-k="${f.k}" role="button" aria-label="Limpar ${f.l}"><span class="msr">close</span></span>`:'<span class="msr">expand_more</span>'}</button>`; }).join('')
  + (Object.values(S.f).some(v=>v&&v.length)?'<button class="fclear" data-a="fclrall">Limpar filtros</button>':'');

H.table=(hidden=[])=>{
  const cols=COLS.filter(c=>!hidden.includes(c.k)); const gt=cols.map(c=>c.w).join(' ');
  const v=visible();
  const head=`<div class="tr th" role="row" style="grid-template-columns:${gt}">${cols.map(c=>`<div role="columnheader">${c.h()}</div>`).join('')}</div>`;
  const rows=v.map(t=>`<div class="tr row ${S.sel.has(t.id)?'is-sel':''} ${S.railOpen&&S.cur===t.id?'cur':''}" role="row" tabindex="0" data-a="row" data-tk="${t.id}" style="grid-template-columns:${gt}">${cols.map(c=>`<div role="cell">${c.c(t)}</div>`).join('')}</div>`).join('');
  return head+(rows||'<div class="empty">Nenhum ticket com esses filtros.</div>');
};

/* indicadores (calculados dos tickets) */
H.indicators=()=>{
  const at=S.tickets.filter(t=>t.status!=='Resolvido'&&t.status!=='Cancelado'); const res=S.tickets.filter(t=>t.status==='Resolvido');
  const pend=at.reduce((a,t)=>a+t.fat.length,0);
  const tile=(t,n,c,cl)=>`<div class="tile ${cl||''}"><div class="tt">${t}</div><div class="nn">${n}</div><div class="cc">${c}</div></div>`;
  const semR=at.filter(t=>!t.resp).length, semA=at.filter(t=>t.tent===0).length;
  const by=[0,1,2,3,4,5,6,7].map(n=>at.filter(t=>t.tent===n).length); const max=Math.max(1,...by); const lim=by[7];
  return `<div class="ind-h"><b>Indicadores</b><span class="cap">Atualizado às 11:14</span><button class="ib" data-a="indref" aria-label="Atualizar indicadores"><span class="msr">refresh</span></button></div>
  <div class="ind-b"><div class="tiles">
    ${tile('Abertos',at.length,pend+(pend===1?' fatura pendente':' faturas pendentes'))}${tile('Sem responsável',semR,'Aguardando triagem',semR?'al':'')}${tile('Sem atendimento',semA,'Nenhuma tentativa',semA?'al':'')}
    ${tile('Em atendimento',at.filter(t=>t.sit==='Em Atendimento').length,'Com tentativas de contato')}${tile('Aguardando fatura',at.filter(t=>t.sit==='Aguardando Fatura').length,'Cooperado vai enviar')}
    ${tile('Resolvidos',res.length,'10/09/2026 a 09/10/2026')}${tile('Taxa de resolução',Math.round(100*res.length/Math.max(1,S.tickets.length))+'%','Resolvidos sobre abertos')}${res.length?tile('Tempo médio de resolução','2,4 dias','Da abertura à resolução'):tile('Tempo médio de resolução','—','Sem resolvidos no período','zero')}
  </div><div class="chart"><b>Tickets ativos por tentativas realizadas</b><span class="cap">${at.length} tickets ativos · ${lim} no limite de 7 tentativas</span>
    <div class="plot">${by.map((v,i)=>`<div class="col ${i===7?'lim':''}" tabindex="0" aria-label="${i===0?'Nenhuma tentativa':i+(i===1?' tentativa':' tentativas')}: ${v} tickets"><span class="v">${v}</span><span class="bar" style="height:${Math.max(2,Math.round(132*v/max))}px"></span></div>`).join('')}</div>
    <div class="axis">${by.map((v,i)=>`<span class="${i===7?'lim':''}">${i===0?'Nenhuma':i}</span>`).join('')}</div>
    <div class="cfoot"><span>Tentativas realizadas</span><span class="lim">7 = limite atingido, libera a demissão</span></div></div></div>`;
};

/* resumo */
H.rbar=()=>`<div class="rbar"><span class="msr">receipt_long</span><span class="grow">Resumo do ticket</span><button class="ib" data-a="railclose" aria-label="Fechar resumo"><span class="msr">right_panel_close</span></button></div>`;
H.pnlHead=(key,title,cap,extra)=>`<div class="ph2"><div class="grow"><div class="ttl">${title}</div>${cap?`<div class="cap">${cap}</div>`:''}</div>${extra||''}<button class="ib" data-a="fold" data-k="${key}" aria-label="Recolher ${title}" aria-expanded="true"><span class="msr chev">expand_less</span></button></div>`;
H.ticket=t=>`<div class="pnl" data-tk="${t.id}"><div class="tkhead"><span class="ttl" style="flex:none">${t.id}</span>${H.badge(t.status,STA)}<span style="flex:1"></span><button class="more" data-a="tkmenu" data-tk="${t.id}" aria-label="Ações do ticket" aria-haspopup="menu"><span class="msr">more_horiz</span></button></div><div class="cap" style="font-size:14px;line-height:20px">Aberto em ${t.aberto} · ${H.faturas(t.fat.length).replace('—','sem faturas pendentes')}</div></div>`;
H.coop=t=>{ const it=(ic,l,v,act)=>`<div class="it"><span class="ci"><span class="msr fill">${ic}</span></span><div class="grow"><div class="cap">${l}</div><div class="v">${v}</div></div>${act||''}</div>`;
  return `<div class="pnl tight" data-fold="coop"><div class="ph2" style="padding:0 4px 4px"><span class="who" style="padding:0;flex:1;min-width:0"><span class="av"><span class="msr fill">${t.pj?'business_center':'person'}</span></span><span style="min-width:0"><span class="nm" style="display:block">${esc(t.coop.toLowerCase().replace(/(^|\s)\S/g,m=>m.toUpperCase()))}</span><span class="cap">Titular</span></span></span><button class="ib" data-a="toast" data-msg="Abriria o cadastro do cooperado" aria-label="Abrir cadastro"><span class="msr">open_in_new</span></button><button class="ib" data-a="fold" data-k="coop" aria-label="Recolher cooperado" aria-expanded="true"><span class="msr chev">expand_less</span></button></div>
  <div class="bd">${it('hourglass_top','Situação',esc(t.sit))}${it('badge',t.pj?'CNPJ':'CPF',t.doc,`<button class="ib" data-a="copy" data-v="${t.doc}" aria-label="Copiar ${t.pj?'CNPJ':'CPF'}"><span class="msr">content_copy</span></button>`)}${it('groups','Carteira',esc(t.cart),'<button class="ib" data-a="toast" data-msg="Abriria a carteira" aria-label="Abrir carteira"><span class="msr">open_in_new</span></button>')}${it('id_card','Responsável',t.resp?esc(t.resp):'Sem responsável')}</div></div>`; };
H.fatCard=(t,f)=>`<div class="ev hv" tabindex="0" aria-label="${f.comp}, UC ${f.uc}, ${f.mot}. Leitura prevista ${f.prev}, ${f.late} dias em atraso"><span class="i c-alert"><span class="msr fill">hourglass_top</span></span><button class="act2" data-a="up1" data-tk="${t.id}" data-f="${f.id}" aria-label="Enviar fatura ${f.comp}"><span class="msr">upload</span></button><div class="n">${f.comp}</div><div class="d">UC ${f.uc} · ${f.mot}</div><div class="dif"><span class="k">Leitura prevista ${f.prev}</span><span class="late">${f.late} dias em atraso</span></div></div>`;
H.faturasPnl=t=>{ const n=t.fat.length; const sh=Math.min(n,S.shown[t.id]||5); const rest=n-sh; const ucs=[...new Set(t.fat.map(f=>f.uc))].length;
  if(!n) return `<div class="pnl" data-fold="fat">${H.pnlHead('fat','Nenhuma fatura pendente','Todas as faturas foram recebidas')}<div class="bd"><button class="b out full" data-a="imp" data-tk="${t.id}">Importar faturas</button></div></div>`;
  return `<div class="pnl" data-fold="fat">${H.pnlHead('fat',n+(n===1?' fatura pendente':' faturas pendentes'),H.ucs(ucs)+' · '+t.conc)}<div class="bd"><div class="evs gap">${t.fat.slice(0,sh).map(f=>H.fatCard(t,f)).join('')}</div>
  ${rest>0?`<button class="b gh" data-a="more5" data-tk="${t.id}">Carregar mais ${Math.min(5,rest)} · ${rest===1?'falta 1':'faltam '+rest}<span class="msr">expand_more</span></button>`:''}
  <button class="b out full" data-a="imp" data-tk="${t.id}">Importar faturas</button></div></div>`; };
H.tentPnl=t=>`<div class="pnl" data-fold="tent">${H.pnlHead('tent','Tentativas de contato',t.tent+' de 7 realizadas'+(t.tent?' · última há 2 dias':''))}<div class="bd">${H.dots(t.tent)}<button class="b pri full" data-a="tent" data-tk="${t.id}" ${t.tent>=7||t.status==='Resolvido'?'disabled':''}>Registrar tentativa</button><button class="b out full" data-a="toast" data-msg="Abriria Solicitar demissão" ${t.tent>=7?'':'disabled'}>Solicitar demissão</button><div class="cap" style="text-align:center">${t.tent>=7?'Limite atingido: a demissão está liberada':'Libera na 7ª tentativa sem retorno'}</div></div></div>`;
H.ev=(t,e,i)=>{ const who=e.who?`<span class="who2" data-name="${esc(e.who)}">${ini(e.who)}</span>`:'<span class="who2 sys" data-name="Sistema"><span class="msr fill">bolt</span></span>';
  let dif='';
  if(e.from) dif=`<div class="dif"><span class="o ${e.from==='Sem responsável'?'none':''}">${esc(e.from)}</span><span class="msr">arrow_forward</span><span class="t">${esc(e.to)}</span></div>`;
  else if(e.ev) dif=`<div class="dif"><button class="b out" data-a="toast" data-msg="Abriria o visualizador de evidência"><span class="msr">visibility</span>Ver evidência</button>${i===0?`<button class="b gh" data-a="undo-tent" data-tk="${t.id}"><span class="msr">undo</span>Desfazer</button>`:''}</div>`;
  return `<div class="ev ${dif?'hv':''} ${e.isNew?'new':''}" ${dif?'tabindex="0"':''}><span class="i ${e.c}"><span class="msr fill">${e.ic}</span></span>${who}<div class="n">${esc(e.t)}</div><div class="d">${e.d}</div>${dif}</div>`; };
H.hist=t=>`<div class="act-p" data-fold="hist"><div class="act-h"><span class="grow">Histórico de tentativas</span><button class="ib w" data-a="fold" data-k="hist" aria-label="Minimizar histórico" aria-expanded="true"><span class="msr">close_fullscreen</span></button></div><div class="act-l evs">${t.hist.map((e,i)=>(i?'<div class="lnk"></div>':'')+H.ev(t,e,i)).join('')}</div></div>`;
H.rail=t=>H.rbar()+H.ticket(t)+H.coop(t)+H.faturasPnl(t)+H.tentPnl(t)+H.hist(t);

/* ---------- montagem ---------- */
const mounts=[]; // {el, fn}
const folded={};
function mount(el,fn){ mounts.push({el,fn}); paint(el,fn); }
function paint(el,fn){ el.innerHTML=fn(); el.querySelectorAll('[data-fold]').forEach(p=>{ if(folded[p.dataset.fold]) setFold(p,true); }); }
function refresh(){ if(document.getElementById('tbl')){ const v=new Set(visible().map(t=>t.id)); [...S.sel].forEach(id=>{ if(!v.has(id)) S.sel.delete(id); }); } mounts.forEach(m=>{ if(document.contains(m.el)) paint(m.el,m.fn); }); updateBulk(); }
function setFold(p,closed){ p.classList.toggle('closed',closed); const b=p.querySelector('[data-a="fold"]'); if(b) b.setAttribute('aria-expanded',String(!closed)); }

/* tabela com colunas que somem por prioridade */
function hiddenFor(w){ const hide=[]; const order=COLS.filter(c=>c.hide).sort((a,b)=>a.hide-b.hide);
  const used=()=>COLS.filter(c=>c.k!=='coop'&&!hide.includes(c.k)).reduce((a,c)=>a+FIXW[c.k],0);
  for(const c of order){ if(w-used()>=240) break; hide.push(c.k); }
  return hide; }
function mountTable(el){ let hid=[]; const fn=()=>H.table(hid); mount(el,fn);
  if(window.ResizeObserver){ new ResizeObserver(()=>{ const n=hiddenFor(el.parentElement.clientWidth-2); if(n.join()!==hid.join()){ hid=n; paint(el,fn); } }).observe(el.parentElement); } }

/* ---------- pop-over ---------- */
let popEl=null, popAnchor=null;
function openPop(anchor, html, opts={}){
  closePop(); popEl=document.getElementById('pop'); if(!popEl) return;
  popEl.innerHTML=html; popEl.hidden=false; popAnchor=anchor; anchor.classList.add('open'); anchor.setAttribute('aria-expanded','true');
  popEl.style.minWidth=(opts.w||224)+'px';
  const r=anchor.getBoundingClientRect(); const pw=popEl.offsetWidth, ph=popEl.offsetHeight;
  let x=opts.alignRight?r.right-pw:r.left; x=Math.max(8,Math.min(x,innerWidth-pw-8));
  const up=opts.up||r.bottom+ph+8>innerHeight; popEl.style.position='fixed'; popEl.style.left=x+'px';
  if(up){ popEl.style.top='auto'; popEl.style.bottom=(innerHeight-r.top+6)+'px'; } else { popEl.style.bottom='auto'; popEl.style.top=(r.bottom+6)+'px'; }
  const f=popEl.querySelector('input,button'); if(f) f.focus({preventScroll:true});
}
function closePop(){ if(popEl){ popEl.hidden=true; popEl.innerHTML=''; } if(popAnchor){ popAnchor.classList.remove('open'); popAnchor.setAttribute('aria-expanded','false'); popAnchor=null; } }
const respMenu=(scope)=>`<div class="ph">Responsável</div>${PEOPLE.map(p=>`<button class="opt" role="menuitem" data-a="setresp" data-v="${p}" data-scope="${scope}"><span class="grow">${p}</span><span class="msr">person_add</span></button>`).join('')}<div class="sepl"></div><button class="opt" role="menuitem" data-a="setresp" data-v="" data-scope="${scope}"><span class="grow">Remover responsável</span><span class="msr">close</span></button>`;
const cartMenu=(scope)=>`<div class="ph">Mover para</div>${CARTS.map(p=>`<button class="opt" role="menuitem" data-a="setcart" data-v="${p}" data-scope="${scope}"><span class="grow">${p}</span><span class="msr">swap_horiz</span></button>`).join('')}`;

/* ---------- ações em lote / undo ---------- */
function snapshot(){ return JSON.stringify(S.tickets); }
function restore(s){ const arr=JSON.parse(s); S.tickets.splice(0,S.tickets.length,...arr); refresh(); }
function act(ids, fn, msg){ const snap=snapshot(); ids.forEach(id=>{ const t=tk(id); if(t) fn(t); }); refresh();
  if(window.toast) toast(msg,{action:{label:'Desfazer',onClick:()=>restore(snap)}}); }
const n2=(n,s,p)=>n+' '+(n===1?s:p);
function scopeIds(scope){ return scope==='bulk'?[...S.sel]:[scope]; }
function doResp(scope,v){ const ids=scopeIds(scope); act(ids,t=>{ if(t.resp===(v||null)) return; t.hist.unshift({ic:'person_add',c:'c-edit',t:v?'Responsável definido':'Responsável removido',d:'09/10 às 11:20',who:ME,from:t.resp||'Sem responsável',to:v||'Sem responsável',isNew:1}); t.resp=v||null; if(t.status==='Aberto'&&v) t.status='Em andamento'; },
  v?`${n2(ids.length,'ticket','tickets')} com ${v}`:`Responsável removido de ${n2(ids.length,'ticket','tickets')}`); }
function doCart(scope,v){ const ids=scopeIds(scope); act(ids,t=>{ if(t.cart===v) return; t.hist.unshift({ic:'swap_horiz',c:'c-edit',t:'Carteira alterada',d:'09/10 às 11:20',who:ME,from:t.cart,to:v,isNew:1}); t.cart=v; },`${n2(ids.length,'ticket movido','tickets movidos')} para ${v}`); }
function doTriagem(scope){ const ids=scopeIds(scope); act(ids,t=>{ if(t.resp) t.hist.unshift({ic:'undo',c:'c-edit',t:'Devolvido à triagem',d:'09/10 às 11:20',who:ME,from:t.resp,to:'Sem responsável',isNew:1}); t.resp=null; },`${n2(ids.length,'ticket devolvido','tickets devolvidos')} à triagem`); }
function doResolver(scope){ const ids=scopeIds(scope); act(ids,t=>{ if(t.status==='Resolvido') return; t.status='Resolvido'; t.sit='Resolvido'; t.hist.unshift({ic:'check_circle',c:'c-ok',t:'Resolvido manualmente',d:'09/10 às 11:20',who:ME,isNew:1}); },`${n2(ids.length,'ticket resolvido','tickets resolvidos')}`); }
function updateBulk(){ const b=document.getElementById('bulk'); if(!b) return; const n=S.sel.size; b.classList.toggle('on',n>0); const l=document.getElementById('bulkN'); if(l) l.textContent=n2(n,'selecionado','selecionados'); }

/* ---------- modal: registrar tentativa ---------- */
let tentTk=null, evFile=null;
function openOv(id){ const o=document.getElementById(id); o.classList.add('on'); o._ret=document.activeElement; setTimeout(()=>{ const f=o.querySelector('h2'); f.tabIndex=-1; f.focus(); },0); }
function closeOv(o){ o.classList.remove('on'); if(o._ret&&o._ret.focus) o._ret.focus(); }
function openTent(id){ tentTk=id; const t=tk(id); evFile=null;
  document.getElementById('tSub').textContent=`Tentativa ${t.tent+1} de 7 · ${t.id} · ${t.coop.toLowerCase().replace(/(^|\s)\S/g,m=>m.toUpperCase())}`;
  document.getElementById('evName').textContent='Escolher arquivo'; document.getElementById('evName').style.color='';
  const h=document.querySelector('#fTent .help'); h.style.color=''; h.textContent='Print de tela, protocolo da ligação ou comprovante de envio · PNG, JPG ou PDF até 10 MB';
  document.getElementById('tPr').value=''; openOv('ovTent'); }
function saveTent(){ const t=tk(tentTk); const pr=document.getElementById('tPr').value.trim();
  if(!evFile&&!pr){ const h=document.querySelector('#fTent .help'); h.style.color='var(--danger)'; h.textContent='Anexe a evidência ou informe o protocolo da ligação.'; return; }
  const ch=document.querySelector('#chs [aria-checked="true"]').dataset.v; const res=document.getElementById('tRes').value; const ic={Telefone:'call',WhatsApp:'chat','E-mail':'mail'}[ch];
  const snap=snapshot();
  t.tent++; t.hist.unshift({ic,c:'c-def',t:`${t.tent}ª tentativa · ${res.replace('Cooperado informou que enviará','Cooperado enviará')}`,d:'09/10 às 11:12',who:ME,ev:1,isNew:1});
  if(t.sit==='Sem Atendimento'){ t.hist.splice(1,0,{ic:'play_arrow',c:'c-ok',t:'Atendimento iniciado',d:'09/10 às 11:12',who:ME}); }
  t.sit=res==='Cooperado informou que enviará'?'Aguardando Fatura':'Em Atendimento'; t.status='Em andamento'; if(!t.resp) t.resp=ME;
  closeOv(document.getElementById('ovTent')); refresh();
  toast(t.tent>=7?'7ª tentativa registrada':'Tentativa registrada',{desc:t.tent>=7?'Limite atingido: a demissão está liberada.':`${t.tent} de 7 · ${t.id}`,action:{label:'Desfazer',onClick:()=>restore(snap)}}); }

/* ---------- modal: importar faturas (mesmo componente da Nova fatura do Leitor) ---------- */
let imp={tk:null,files:[],only:null};
const MAXB=20*1024*1024;
const fmtB=b=>b>=1048576?(b/1048576).toFixed(1).replace('.',',')+' MB':Math.max(1,Math.round(b/1024))+' KB';
const MON={jan:'01',fev:'02',mar:'03',abr:'04',mai:'05',jun:'06',jul:'07',ago:'08',set:'09',out:'10',nov:'11',dez:'12'};
function guess(name,t,taken){ const n=name.toLowerCase(); let c=null; let m=n.match(/(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)[^0-9]?(\d{4})/); if(m) c=MON[m[1]]+'/'+m[2];
  m=!c&&n.match(/(\d{4})[-_.](\d{2})/); if(m) c=m[2]+'/'+m[1]; m=!c&&n.match(/(\d{2})[-_.](\d{4})/); if(m) c=m[1]+'/'+m[2];
  const free=t.fat.filter(f=>!taken.includes(f.id)); const hit=c&&free.find(f=>f.comp===c); return (hit||free[0]||{}).id||null; }
function openImp(id,fid){ imp={tk:id,files:[],only:fid||null}; const t=tk(id); const f=fid&&t.fat.find(x=>x.id===fid);
  document.getElementById('iT').textContent=f?'Enviar fatura':'Importar faturas';
  document.getElementById('iSub').textContent=f?`Fatura ${f.comp} da UC ${f.uc}. Envie em PDF ou imagem; a leitura começa assim que o envio termina.`:'Envie as faturas em PDF ou imagem. Cada arquivo entra na leitura e é ligado à fatura pendente da mesma UC e competência.';
  renderImp(); openOv('ovImp'); }
function addFiles(list){ const t=tk(imp.tk);
  [...list].forEach(fl=>{ const ok=/pdf|jpe?g|png|webp/i.test(fl.type||fl.name); const taken=imp.files.map(x=>x.target).filter(Boolean);
    const f={name:fl.name,size:fl.size,img:/jpe?g|png|webp/i.test(fl.type||fl.name),pct:0,st:'up',target:null,msg:''};
    if(!ok){ f.st='err'; f.msg='Formato não aceito. Envie PDF, JPG ou PNG.'; }
    else if(fl.size>MAXB){ f.st='err'; f.msg='Maior que 20 MB. Diminua o arquivo ou tire uma foto da fatura.'; }
    else f.target=imp.only&&!taken.includes(imp.only)?imp.only:guess(fl.name,t,taken);
    if(f.st!=='err'&&!f.target){ f.st='err'; f.msg='Todas as faturas pendentes deste ticket já têm arquivo.'; }
    imp.files.push(f);
    if(f.st==='up'){ const tm=setInterval(()=>{ f.pct=Math.min(100,f.pct+12+Math.random()*18); if(f.pct>=100){ f.st='ok'; clearInterval(tm); } renderImp(); },160); }
  }); renderImp(); }
function renderImp(){ const t=tk(imp.tk); const b=document.getElementById('iBody'); if(!b) return;
  const opt=f=>t.fat.map(x=>`<option value="${x.id}" ${x.id===f.target?'selected':''}>UC ${x.uc} · ${x.comp}</option>`).join('');
  const drop=(mini)=>`<div class="drop ${mini?'mini':''}" id="iDrop"><span class="msr big">upload_file</span>${mini?'<span>Arraste mais arquivos ou</span> <button type="button" class="pick" data-a="ipick">escolha no computador</button>':`<span class="t1">Arraste as faturas aqui</span><span class="or">ou</span><button type="button" class="b out" data-a="ipick">Escolher no computador</button><span class="capx">PDF, JPG ou PNG até 20 MB · vários arquivos de uma vez</span><button type="button" class="b gh sm" data-a="isample" style="margin-top:4px">Usar arquivos de exemplo</button>`}</div>`;
  const items=imp.files.map((f,i)=>`<div class="fi ${f.st==='err'?'err':''}"><span class="ty"><span class="msr ${f.st==='err'?'fill':''}">${f.st==='err'?'warning':f.img?'image':'picture_as_pdf'}</span></span><div class="tx"><div class="l1"><span class="nm">${esc(f.name)}</span><span class="sz">· ${fmtB(f.size)}</span></div>
    ${f.st==='err'?`<div class="st">${f.msg}</div>`:f.st==='up'?`<div class="st">Enviando… ${Math.round(f.pct)}%</div><div class="trk"><i style="width:${f.pct}%"></i></div>`:`<div class="st">Vai para <select data-a="itarget" data-i="${i}" aria-label="Fatura de destino">${opt(f)}</select></div>`}</div>
    <button type="button" class="ac" data-a="irm" data-i="${i}" aria-label="Remover ${esc(f.name)}"><span class="msr">close</span></button></div>`).join('');
  b.innerHTML=imp.files.length?`<div class="files">${items}</div>${drop(true)}`:drop(false);
  const ok=imp.files.filter(f=>f.st==='ok').length, up=imp.files.some(f=>f.st==='up');
  const s=document.getElementById('iSend'); s.disabled=!ok||up; s.textContent=up?'Enviando…':ok?`Enviar ${n2(ok,'fatura','faturas')}`:'Enviar faturas';
  const d=document.getElementById('iDrop'); if(d){ d.ondragover=e=>{ e.preventDefault(); d.classList.add('over'); }; d.ondragleave=()=>d.classList.remove('over'); d.ondrop=e=>{ e.preventDefault(); d.classList.remove('over'); addFiles(e.dataTransfer.files); }; } }
function sendImp(){ const t=tk(imp.tk); const snap=snapshot(); const ok=imp.files.filter(f=>f.st==='ok'); const ids=[...new Set(ok.map(f=>f.target))];
  ids.forEach(id=>{ const f=t.fat.find(x=>x.id===id); if(!f) return; t.fat=t.fat.filter(x=>x.id!==id); t.hist.unshift({ic:'note_add',c:'c-def',t:`Fatura ${f.comp} adicionada`,d:'09/10 às 11:25',who:ME,isNew:1}); });
  if(!t.fat.length){ t.status='Resolvido'; t.sit='Resolvido'; t.hist.unshift({ic:'check_circle',c:'c-ok',t:'Resolvido por importação manual',d:'09/10 às 11:25',who:ME,isNew:1}); }
  closeOv(document.getElementById('ovImp')); refresh();
  toast(`${n2(ids.length,'fatura enviada','faturas enviadas')} para leitura`,{desc:t.fat.length?`${n2(t.fat.length,'fatura continua pendente','faturas continuam pendentes')} em ${t.id}.`:`${t.id} resolvido.`,action:{label:'Desfazer',onClick:()=>restore(snap)}}); }
function sampleFiles(){ const t=tk(imp.tk); const f0=t.fat[0], f1=t.fat[1]||t.fat[0];
  const mk=(n,s,ty)=>({name:n,size:s,type:ty});
  const toName=f=>{ const [m,y]=f.comp.split('/'); return Object.keys(MON).find(k=>MON[k]===m)+y; };
  addFiles([mk(`fatura-${t.conc.split(' ')[0].toLowerCase()}-${toName(f0)}.pdf`,1258291,'application/pdf'),mk('IMG_4821.jpg',3565158,'image/jpeg'),mk('fatura-digitalizada.pdf',26004684,'application/pdf')].slice(0,f1===f0?2:3)); }

/* ---------- handler único ---------- */
function onClick(e){
  const a=e.target.closest('[data-a]');
  if(popEl&&!popEl.hidden&&!e.target.closest('#pop')&&!(popAnchor&&popAnchor.contains(e.target))) closePop();
  if(!a) return; const k=a.dataset.a, id=a.dataset.tk;
  switch(k){
    case 'row': if(e.target.closest('button,select,input,a')&&e.target.closest('[data-a]')!==a) return; S.cur=id; S.railOpen=true; refresh(); syncRail(); break;
    case 'sel': e.stopPropagation(); S.sel.has(id)?S.sel.delete(id):S.sel.add(id); refresh(); break;
    case 'selall': { const v=visible(); const all=v.every(t=>S.sel.has(t.id)); v.forEach(t=>all?S.sel.delete(t.id):S.sel.add(t.id)); refresh(); break; }
    case 'rowmenu': case 'tkmenu': e.stopPropagation(); if(popAnchor===a){ closePop(); break; } openPop(a,H.menuTicket(tk(id)),{alignRight:true}); break;
    case 'm-resp': openPop(popAnchor||a,respMenu(id),{alignRight:true}); break;
    case 'm-triagem': closePop(); doTriagem(id); break;
    case 'm-resolver': closePop(); doResolver(id); break;
    case 'm-desc': closePop(); toast('Abriria Editar descrição'); break;
    case 'm-cancelar': closePop(); act([id],t=>{ t.status='Cancelado'; t.hist.unshift({ic:'close',c:'c-edit',t:'Ticket cancelado',d:'09/10 às 11:20',who:ME,isNew:1}); },`${id} cancelado`); break;
    case 'setresp': closePop(); doResp(a.dataset.scope,a.dataset.v); break;
    case 'setcart': closePop(); doCart(a.dataset.scope,a.dataset.v); break;
    case 'flt': { if(e.target.closest('[data-a="fclr"]')) return; if(popAnchor===a){ closePop(); break; } const f=FLT.find(x=>x.k===a.dataset.k); const v=S.f[f.k]||[];
      openPop(a,`${f.o.length>6?'<label class="ps"><span class="msr">search</span><input data-a="fsearch" placeholder="Pesquisar" aria-label="Pesquisar opções"></label>':''}<div role="group" aria-label="${f.l}">${f.o.map(o=>`<button class="opt" data-a="fopt" data-k="${f.k}" data-v="${esc(o)}" role="menuitemcheckbox" aria-checked="${v.includes(o)}"><span class="cbx ${v.includes(o)?'on':''}">${v.includes(o)?'<span class="mss">check</span>':''}</span><span class="grow">${esc(o)}</span></button>`).join('')}</div>`,{w:240}); break; }
    case 'fopt': { const f=a.dataset.k, v=a.dataset.v; const cur=S.f[f]||[]; S.f[f]=cur.includes(v)?cur.filter(x=>x!==v):[...cur,v]; const on=S.f[f].includes(v); a.setAttribute('aria-checked',on); const c=a.querySelector('.cbx'); c.classList.toggle('on',on); c.innerHTML=on?'<span class="mss">check</span>':''; const anc=popAnchor; refresh(); const nb=document.querySelector(`.flt[data-k="${f}"]`); if(nb){ popAnchor=nb; nb.classList.add('open'); } break; }
    case 'fclr': e.stopPropagation(); S.f[a.dataset.k]=[]; closePop(); refresh(); break;
    case 'fclrall': S.f={}; refresh(); break;
    case 'railclose': S.railOpen=false; refresh(); syncRail(); break;
    case 'fold': { const p=a.closest('[data-fold]'); const c=!p.classList.contains('closed'); folded[p.dataset.fold]=c; setFold(p,c); break; }
    case 'more5': { a.innerHTML='<span class="msr spin">progress_activity</span>Carregando…'; a.disabled=true; setTimeout(()=>{ S.shown[id]=(S.shown[id]||5)+5; refresh(); },450); break; }
    case 'imp': openImp(id); break;
    case 'up1': e.stopPropagation(); openImp(id,a.dataset.f); break;
    case 'tent': openTent(id); break;
    case 'undo-tent': { const t=tk(id); const snap=snapshot(); const i=t.hist.findIndex(x=>x.ev); if(i<0) break; t.hist.splice(i,1); t.tent=Math.max(0,t.tent-1); refresh(); toast('Tentativa desfeita',{action:{label:'Refazer',onClick:()=>restore(snap)}}); break; }
    case 'copy': { const v=a.dataset.v; try{ navigator.clipboard.writeText(v).then(()=>toast('Copiado',v),()=>toast(v)); }catch(err){ toast(v); } break; }
    case 'toast': toast(a.dataset.msg); break;
    case 'indref': toast('Indicadores atualizados'); break;
    case 'ipick': document.getElementById('iIn').click(); break;
    case 'isample': sampleFiles(); break;
    case 'irm': imp.files.splice(Number(a.dataset.i),1); renderImp(); break;
  }
}
function onBulk(e){ const a=e.target.closest('[data-bulk]'); if(!a) return; const k=a.dataset.bulk;
  if(k==='limpar'){ S.sel.clear(); refresh(); return; }
  if(k==='resp'){ if(popAnchor===a) return closePop(); openPop(a,respMenu('bulk'),{up:true}); return; }
  if(k==='cart'){ if(popAnchor===a) return closePop(); openPop(a,cartMenu('bulk'),{up:true}); return; }
  if(k==='triagem') return doTriagem('bulk');
  if(k==='resolver') return doResolver('bulk');
  if(k==='mais'){ if(popAnchor===a) return closePop(); openPop(a,`<button class="opt" data-a="toast" data-msg="${n2(S.sel.size,'ticket exportado','tickets exportados')} (CSV)"><span class="grow">Exportar selecionados</span><span class="msr">download</span></button><button class="opt" data-a="toast" data-msg="Abriria Registrar tentativa em lote"><span class="grow">Registrar tentativa</span><span class="msr">call</span></button><div class="sepl"></div><button class="opt dg" data-a="bcancel"><span class="grow">Cancelar tickets</span><span class="msr">close</span></button>`,{up:true,alignRight:true}); }
}
function syncRail(){ const r=document.getElementById('rail'); if(!r) return; r.hidden=!S.railOpen; const b=document.getElementById('bRail'); if(b){ b.classList.toggle('on',S.railOpen); b.setAttribute('aria-pressed',S.railOpen); } }

function wireCommon(){
  if(wireCommon.done) return; wireCommon.done=1;
  document.addEventListener('click',e=>{ const c=e.target.closest('[data-a="bcancel"]'); if(c){ closePop(); const ids=[...S.sel]; act(ids,t=>{ t.status='Cancelado'; },`${n2(ids.length,'ticket cancelado','tickets cancelados')}`); return; } onClick(e); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if(popEl&&!popEl.hidden){ const a=popAnchor; closePop(); a&&a.focus(); return; } const o=document.querySelector('.ov.on'); if(o) closeOv(o); }
    if((e.key==='Enter'||e.key===' ')&&e.target.matches('.tr.row')){ e.preventDefault(); e.target.click(); } });
  document.addEventListener('input',e=>{ if(e.target.matches('[data-a="fsearch"]')){ const q=e.target.value.toLowerCase(); popEl.querySelectorAll('.opt').forEach(o=>o.hidden=!o.textContent.toLowerCase().includes(q)); } });
  document.addEventListener('change',e=>{ if(e.target.matches('[data-a="itarget"]')){ imp.files[Number(e.target.dataset.i)].target=e.target.value; } });
  const bulk=document.getElementById('bulk'); if(bulk) bulk.addEventListener('click',onBulk);
  document.querySelectorAll('.ov').forEach(o=>{ o.addEventListener('click',e=>{ if(e.target===o||e.target.closest('[data-close]')) closeOv(o); }); });
  const fT=document.getElementById('fTent'); if(fT){ fT.addEventListener('submit',e=>{ e.preventDefault(); saveTent(); });
    document.getElementById('chs').addEventListener('click',e=>{ const b=e.target.closest('.chn'); if(!b) return; document.querySelectorAll('#chs .chn').forEach(x=>x.setAttribute('aria-checked',String(x===b))); });
    document.getElementById('evBtn').onclick=()=>document.getElementById('evIn').click();
    document.getElementById('evLbl').onclick=()=>document.getElementById('evIn').click();
    document.getElementById('evIn').onchange=e=>{ const f=e.target.files[0]; if(!f) return; if(f.size>10*1024*1024){ toast('Arquivo maior que 10 MB',{err:true}); return; } evFile=f; const n=document.getElementById('evName'); n.innerHTML=`<b>${esc(f.name)}</b>`; const h=document.querySelector('#fTent .help'); h.style.color=''; };
    const md=document.getElementById('mdT'); md.onclick=()=>{ const box=document.getElementById('md'); box.hidden=!box.hidden; md.setAttribute('aria-expanded',String(!box.hidden)); md.querySelector('.chev').style.transform=box.hidden?'':'rotate(180deg)'; }; }
  const fI=document.getElementById('fImp'); if(fI){ fI.addEventListener('submit',e=>{ e.preventDefault(); sendImp(); }); document.getElementById('iIn').onchange=e=>{ addFiles(e.target.files); e.target.value=''; }; }
  document.querySelectorAll('.proto [data-th]').forEach(b=>b.onclick=()=>setTheme(b.dataset.th));
  let th=null; try{ th=localStorage.getItem('fp-theme'); }catch(err){} setTheme(th||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
}
function setTheme(t){ document.querySelectorAll('.fp').forEach(el=>el.classList.toggle('dk',t==='dark')); document.body.classList.toggle('dk',t==='dark');
  document.querySelectorAll('.proto [data-th]').forEach(b=>b.classList.toggle('on',b.dataset.th===t)); try{ localStorage.setItem('fp-theme',t); }catch(err){} }

function mountScreen(){
  wireCommon();
  mount(document.getElementById('frow'),H.filters);
  mountTable(document.getElementById('tbl'));
  const rail=document.getElementById('rail'); mount(rail,()=>{ const t=tk(S.cur)||S.tickets[0]; return H.rail(t); });
  const ind=document.getElementById('ind'); mount(ind,H.indicators);
  mount(document.getElementById('count'),()=>{ const v=visible().length; return n2(v,'ticket','tickets')+(v!==S.tickets.length?` de ${S.tickets.length}`:''); });
  document.getElementById('bInd').onclick=e=>{ S.indOpen=!S.indOpen; ind.hidden=!S.indOpen; e.currentTarget.setAttribute('aria-pressed',S.indOpen); e.currentTarget.classList.toggle('on',S.indOpen); };
  document.getElementById('bRail').onclick=()=>{ S.railOpen=!S.railOpen; refresh(); syncRail(); };
  document.getElementById('bFlt').onclick=e=>{ S.fltOpen=!S.fltOpen; document.getElementById('frow').hidden=!S.fltOpen; e.currentTarget.setAttribute('aria-pressed',S.fltOpen); };
  document.getElementById('q').addEventListener('input',e=>{ S.q=e.target.value; refresh(); });
  document.querySelectorAll('[data-toast]').forEach(b=>b.onclick=()=>toast(b.dataset.toast));
  syncRail(); updateBulk();
}

window.FP={S,H,tk,mount,mountTable,refresh,wireCommon,setTheme,mountScreen,openImp,openTent,ME};
})();
