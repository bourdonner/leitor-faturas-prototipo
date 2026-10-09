/* Faturamento Pendente (Tickets) — estado, componentes e interações.
   Usado por faturamento-pendente.html (tela) e faturamento-pendente-componentes.html (componentes soltos).
   Os componentes são funções que devolvem HTML; as ações usam data-a + data-tk e passam por um único handler.
   Os modais são gerados aqui (FP.modals) e entram no primeiro elemento .fp marcado com data-fp-root. Dados fictícios. */
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
const title=s=>s.toLowerCase().replace(/(^|\s)\S/g,m=>m.toUpperCase()).replace(/\b(Do|Da|De|Dos|Das)\b/g,m=>m.toLowerCase());
const n2=(n,s,p)=>n+' '+(n===1?s:p);

/* ---------- dados fictícios ---------- */
const MES=['01','02','03','04','05','06','07','08','09','10','11','12'];
function genFat(n, ucs, seed, conc){
  const out=[]; let m=8, y=2025;
  for(let i=0;i<n;i++){
    const uc=ucs[i%ucs.length]; const mot=MOTIVOS[(i+seed)%3];
    const comp=MES[m]+'/'+y; const prev=pad(3+((i+seed)%20))+'/'+MES[(m+1)%12]+'/'+(m===11?y+1:y);
    out.push({id:'f'+seed+'-'+i,comp,uc,mot,prev,late:4+((i*7+seed)%40),lida:false});
    m++; if(m>11){m=0;y++;}
  }
  return out;
}
// [id, situação, tentativas, cooperado, PJ, UCs, nº faturas, responsável, carteira, status, aberto em, concessionária, extra]
const T=[
 ['TK-04182','Sem Atendimento',0,'FERNANDA LIMA',0,['3302114'],1,null,'Carteira Sul','Aberto','08/10/2026',0],
 ['TK-04175','Aguardando Fatura',4,'SOLARIS ENERGIAS RENOVÁVEIS',1,['1234531','8890742','5512093','7720114','6631880'],12,'Juliana Rocha','Grandes Contas','Em andamento','01/10/2026',0],
 ['TK-04170','Aguardando Fatura',5,'ANA SOUZA',0,['4410298','4410299'],3,'Rafael Nunes','Carteira Norte','Em andamento','07/10/2026',1,{lidas:1}],
 ['TK-04168','Resolvido',5,'LUIZA CASTRO',0,['9910233','9910234'],3,'Marina Duarte','Carteira Sul','Resolvido','25/09/2026',0,{lidas:3,by:'import'}],
 ['TK-04166','Em Atendimento',7,'QUANTUM SOLUTIONS',1,['2201551','2201552','2201553'],4,'Carlos Mendes','Suporte N1','Em andamento','22/09/2026',2],
 ['TK-04165','Resolvido',2,'VERIDIAN ELECTRIC',1,['7740021','7740022'],3,'Marina Duarte','Carteira Sul','Resolvido','26/09/2026',0,{lidas:3,by:'captura'}],
 ['TK-04163','Em Atendimento',3,'NOVATECH ENERGY',1,['7781002','7781003'],2,'Juliana Rocha','Carteira Sul','Em andamento','29/09/2026',3,{herd:'Carteira Norte'}],
 ['TK-04159','Demissão',7,'STELLARIS INDUSTRIES',1,['5150020','5150021','5150022'],2,'Rafael Nunes','Carteira Norte','Em andamento','28/09/2026',1,{dem:1}],
 ['TK-04155','Sem Atendimento',0,'MARCOS PEREIRA',0,['8012775'],1,null,'Carteira Sul','Aberto','04/10/2026',2],
 ['TK-04151','Em Atendimento',2,'HELIOS COMÉRCIO',1,['6620117','6620118'],2,'Carlos Mendes','Suporte N1','Em andamento','04/10/2026',0],
 ['TK-04148','Aguardando Fatura',6,'PADARIA ESTRELA DO SUL',1,['3390451','3390452'],3,'Juliana Rocha','Grandes Contas','Em andamento','03/10/2026',0],
 ['TK-04144','Em Atendimento',2,'CARLA MENDONÇA',0,['1180994'],1,'Rafael Nunes','Carteira Norte','Em andamento','03/10/2026',3],
 ['TK-04140','Em Atendimento',3,'VERDE VALE AGRO',1,['4471200'],1,null,'Carteira Sul','Aberto','02/10/2026',2],
 ['TK-04137','Aguardando Fatura',3,'JOÃO BATISTA',0,['2259031'],2,'Juliana Rocha','Carteira Sul','Em andamento','02/10/2026',1],
 ['TK-04134','Em Atendimento',1,'APEX DYNAMIC CORP',1,['1120765','1120766'],4,'Marina Duarte','Grandes Contas','Em andamento','01/10/2026',2],
 ['TK-04131','Em Atendimento',4,'BIANCA SANTOS',0,['9930142'],1,'Carlos Mendes','Carteira Norte','Em andamento','30/09/2026',1],
 ['TK-04128','Em Atendimento',5,'GABRIEL ALMEIDA',0,['7712043'],2,'Rafael Nunes','Carteira Sul','Em andamento','29/09/2026',3],
 ['TK-04125','Sem Atendimento',0,'ZENITH GLOBAL GROUP',1,['9987453','9987454','9987455'],6,null,'Grandes Contas','Aberto','08/10/2026',3]
];
const CH=[['call','Telefone'],['chat','WhatsApp'],['mail','E-mail']];
const RES=['Caixa postal','Sem retorno','Sem contato','Cooperado enviará','Sem retorno','Sem contato','Sem retorno'];
function genHist(t,x){
  const h=[];
  if(t.id==='TK-04175'){
    h.push({ic:'chat',c:'c-def',t:'4ª tentativa · Cooperado enviará',d:'07/10 às 10:40',who:'Juliana Rocha',ev:{ch:'WhatsApp',n:4,dt:'07/10/2026 às 10:40',file:'print-whatsapp-tk04175.png'}});
    h.push({ic:'call',c:'c-def',t:'3ª tentativa · Sem contato',d:'04/10 às 10:40',who:'Juliana Rocha',ev:{ch:'Telefone',n:3,dt:'04/10/2026 às 10:40',file:'protocolo-8842-119.pdf'}});
    h.push({ic:'mail',c:'c-def',t:'2ª tentativa · Sem retorno',d:'01/10 às 10:40',who:'Carlos Mendes',ev:{ch:'E-mail',n:2,dt:'01/10/2026 às 10:40',file:'email-enviado-tk04175.pdf'}});
    h.push({ic:'call',c:'c-def',t:'1ª tentativa · Caixa postal',d:'28/09 às 10:40',who:'Juliana Rocha',ev:{ch:'Telefone',n:1,dt:'28/09/2026 às 10:40',file:'print-chamada-tk04175.png'}});
    h.push({ic:'play_arrow',c:'c-ok',t:'Atendimento iniciado',d:'27/09 às 10:40',who:'Juliana Rocha'});
    h.push({ic:'person_add',c:'c-edit',t:'Responsável definido',d:'26/09 às 10:40',who:'Juliana Rocha',from:'Sem responsável',to:'Juliana Rocha'});
    h.push({ic:'note_add',c:'c-def',t:'Fatura 02/2026 adicionada',d:'26/09 às 10:40',who:'Juliana Rocha'});
    h.push({ic:'login',c:'c-def',t:'Pendência gerada automaticamente',d:'25/09 às 10:40',who:null});
    return h;
  }
  if(x.by==='import') h.push({ic:'note_add',c:'c-ok',t:'Fatura importada por '+t.resp,d:'Hoje',who:t.resp});
  if(x.by==='captura') h.push({ic:'bolt',c:'c-ok',t:'Fatura capturada automaticamente',d:'Hoje',who:null});
  if(x.dem) h.push({ic:'person_remove',c:'c-alert',t:'Demissão solicitada',d:'08/10 às 16:20',who:t.resp});
  if(x.herd) h.push({ic:'swap_horiz',c:'c-edit',t:'Ticket transferido da '+x.herd,d:'08/10 às 10:40',who:null,from:x.herd,to:t.cart});
  for(let i=t.tent;i>=1;i--){ const ch=CH[(i+t.seed)%3]; const lida=x.lidas&&i===t.tent&&!x.by;
    h.push({ic:ch[0],c:'c-def',t:i+'ª tentativa · '+(lida?'Fatura lida':RES[(i-1)%RES.length]),d:lida?'Hoje':pad(Math.min(28,2+i*3))+'/'+(i>3?'10':'09')+' às 10:40',who:t.resp||PEOPLE[i%4],ev:{ch:ch[1],n:i,dt:pad(Math.min(28,2+i*3))+'/'+(i>3?'10':'09')+'/2026 às 10:40',file:'evidencia-'+t.id.toLowerCase()+'-'+i+(ch[0]==='call'?'.pdf':'.png')}}); }
  if(t.tent) h.push({ic:'play_arrow',c:'c-ok',t:'Atendimento iniciado',d:t.aberto.slice(0,5)+' às 09:10',who:t.resp||'Carlos Mendes'});
  if(t.resp&&!x.herd) h.push({ic:'person_add',c:'c-edit',t:'Responsável definido',d:t.aberto.slice(0,5)+' às 08:02',who:t.resp,from:'Sem responsável',to:t.resp});
  h.push({ic:'login',c:'c-def',t:'Pendência gerada automaticamente',d:t.aberto.slice(0,5)+' às 06:00',who:null});
  return h;
}
const S={ tickets:[], sel:new Set(), cur:'TK-04175', railOpen:true, indOpen:false, fltOpen:true, q:'', view:'list',
  f:{visao:['Triagem','Meus']}, shown:{},
  cfg:{det:false,obs:true,dmin:'',dias:10,lim:7,jan:30,anexar:true} };
T.forEach((r,i)=>{
  const x=r[12]||{};
  const t={id:r[0],sit:r[1],tent:r[2],coop:r[3],pj:!!r[4],ucs:r[5],resp:r[7],cart:r[8],status:r[9],aberto:r[10],seed:i,conc:CONCS[r[11]],
    herd:x.herd||null,dem:!!x.dem,by:x.by||null,
    doc:r[4]?pad(10+i)+'.345.678/0001-'+pad(90-i):'1'+pad(10+i)+'.456.789-'+pad(10+i)};
  t.fat=genFat(r[6],r[5],i,t.conc);
  if(t.id==='TK-04175'){ [['09/2025','1234531','Erro de leitura'],['10/2025','1234531','Erro de leitura'],['11/2025','8890742','Fatura não emitida'],['12/2025','5512093','Coleta não executada'],['01/2026','7720114','Erro de leitura']].forEach((y,k)=>{t.fat[k].comp=y[0];t.fat[k].uc=y[1];t.fat[k].mot=y[2];}); }
  for(let k=0;k<(x.lidas||0);k++) t.fat[k].lida=true;
  t.hist=genHist(t,x);
  S.tickets.push(t);
});
const tk=id=>S.tickets.find(t=>t.id===id);
const pend=t=>t.fat.filter(f=>!f.lida);
const closed=t=>t.status==='Resolvido'||t.status==='Cancelado';

/* ---------- peças ---------- */
const H={};
H.badge=(txt,map)=>`<span class="bdg ${map[txt]||'b-grey'}">${esc(txt)}</span>`;
H.dots=n=>{ const c=n>=7?'r':n>=3?'o':'g'; let s=''; for(let i=1;i<=7;i++) s+=`<i class="${i<=n?c:''}"></i>`; return `<span class="dots ${n>=3?c:''}" aria-label="${n} de 7 tentativas">${s}<span>${n}/7</span></span>`; };
H.ucs=n=>n+(n===1?' UC':' UCs');
H.ent=t=>`<div class="ent"><span class="ic ${t.pj?'':'pf'}"><span class="msr fill">${t.pj?'bolt':'person'}</span></span><div class="t"><div>${esc(t.coop)}</div><div class="s">${H.ucs(t.ucs.length)}</div></div></div>`;
H.faturas=n=>n===0?'—':n+(n===1?' fatura':' faturas');
H.av=(name,sz)=>name?`<span class="avt" style="${sz?`width:${sz}px;height:${sz}px`:''}" title="${esc(name)}" aria-label="Responsável: ${esc(name)}">${ini(name)}</span>`:`<span class="avt none" title="Sem responsável" aria-label="Sem responsável"><span class="msr">person</span></span>`;
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
 {k:'fat',w:'96px',hide:5,h:()=>'Faturas',c:t=>H.faturas(pend(t).length)},
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
 {k:'mot',l:'Motivo da falha',o:MOTIVOS,m:(t,v)=>pend(t).some(f=>v.includes(f.mot))},
 {k:'ab',l:'Aberto em',o:['Últimos 7 dias','Últimos 30 dias'],m:(t,v)=>v.includes('Últimos 30 dias')||(t.aberto.slice(3,5)==='10'&&Number(t.aberto.slice(0,2))>=3)}
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

/* kanban: uma coluna por etapa de tentativas, mais Demissões; tickets resolvidos e cancelados não entram */
const STAGES=[{k:0,l:'Sem Atendimento',ic:'forum',c:'k-g'},...[1,2,3,4,5,6,7].map(n=>({k:n,l:n+'ª tentativa',ic:'phone_missed',c:n>=6?'k-r':n>=3?'k-o':'k-d'})),{k:'dem',l:'Demissões',ic:'person_remove',c:'k-r'}];
const stageOf=t=>t.dem||t.sit==='Demissão'?'dem':t.tent;
H.kcard=t=>`<div class="kc ${S.railOpen&&S.cur===t.id?'cur':''}" draggable="true" tabindex="0" data-a="row" data-tk="${t.id}" aria-label="${t.id}, ${esc(title(t.coop))}">
  <div class="kt"><span class="cap">${t.id}</span>${H.av(t.resp,20)}</div><b>${esc(title(t.coop))}</b><div class="ks">${H.ucs(t.ucs.length)} · ${t.conc}</div>
  <div class="kchips"><span title="Situação: ${esc(t.sit)}"><span class="kd ${SIT[t.sit]}"></span></span><span title="${H.ucs(t.ucs.length)}"><span class="msr">electric_meter</span>${t.ucs.length}</span><span title="${n2(pend(t).length,'fatura pendente','faturas pendentes')}"><span class="msr">receipt_long</span>${pend(t).length}</span></div></div>`;
H.kanban=()=>{ const v=visible().filter(t=>!closed(t));
  return STAGES.map(s=>{ const items=v.filter(t=>stageOf(t)===s.k);
    return `<section class="kcol" data-stage="${s.k}" aria-label="${s.l}"><header><span class="ki ${s.c}"><span class="msr">${s.ic}</span></span><b>${s.l}</b><span class="kn">${items.length}</span><button class="ib" data-a="add" aria-label="Adicionar ticket"><span class="msr">add</span></button></header>
      <div class="klist">${items.map(H.kcard).join('')||'<div class="kempty">Nenhum ticket</div>'}</div></section>`; }).join(''); };

/* indicadores (calculados dos tickets) */
H.indicators=()=>{
  const at=S.tickets.filter(t=>!closed(t)); const res=S.tickets.filter(t=>t.status==='Resolvido');
  const pd=at.reduce((a,t)=>a+pend(t).length,0);
  const tile=(t,n,c,cl)=>`<div class="tile ${cl||''}"><div class="tt">${t}</div><div class="nn">${n}</div><div class="cc">${c}</div></div>`;
  const semR=at.filter(t=>!t.resp).length, semA=at.filter(t=>t.tent===0).length;
  const by=[0,1,2,3,4,5,6,7].map(n=>at.filter(t=>t.tent===n).length); const max=Math.max(1,...by); const lim=by[7];
  return `<div class="ind-h"><b>Indicadores</b><span class="cap">Atualizado às 11:14</span><button class="ib" data-a="indref" aria-label="Atualizar indicadores"><span class="msr">refresh</span></button></div>
  <div class="ind-b"><div class="tiles">
    ${tile('Abertos',at.length,n2(pd,'fatura pendente','faturas pendentes'))}${tile('Sem responsável',semR,'Aguardando triagem',semR?'al':'')}${tile('Sem atendimento',semA,'Nenhuma tentativa',semA?'al':'')}
    ${tile('Em atendimento',at.filter(t=>t.sit==='Em Atendimento').length,'Com tentativas de contato')}${tile('Aguardando fatura',at.filter(t=>t.sit==='Aguardando Fatura').length,'Cooperado vai enviar')}
    ${tile('Resolvidos',res.length,'10/09/2026 a 09/10/2026')}${tile('Taxa de resolução',Math.round(100*res.length/Math.max(1,S.tickets.length))+'%','Resolvidos sobre abertos')}${res.length?tile('Tempo médio de resolução','2,4 dias','Da abertura à resolução'):tile('Tempo médio de resolução','—','Sem resolvidos no período','zero')}
  </div><div class="chart"><b>Tickets ativos por tentativas realizadas</b><span class="cap">${at.length} tickets ativos · ${lim} no limite de 7 tentativas</span>
    <div class="plot">${by.map((v,i)=>`<div class="col ${i===7?'lim':''}" tabindex="0" aria-label="${i===0?'Nenhuma tentativa':i+(i===1?' tentativa':' tentativas')}: ${v} tickets"><span class="v">${v}</span><span class="bar" style="height:${Math.max(2,Math.round(132*v/max))}px"></span></div>`).join('')}</div>
    <div class="axis">${by.map((v,i)=>`<span class="${i===7?'lim':''}">${i===0?'Nenhuma':i}</span>`).join('')}</div>
    <div class="cfoot"><span>Tentativas realizadas</span><span class="lim">7 = limite atingido, libera a demissão</span></div></div></div>`;
};

/* resumo */
H.rbar=()=>`<div class="rbar"><span class="msr">article_shortcut</span><span class="grow">Resumo do ticket</span><button class="ib" data-a="railclose" aria-label="Fechar resumo"><span class="msr">right_panel_close</span></button></div>`;
H.pnlHead=(key,ttl,cap,pre)=>`<div class="ph2"><div class="grow">${pre||''}<div class="ttl">${ttl}</div>${cap?`<div class="cap">${cap}</div>`:''}</div><button class="ib" data-a="fold" data-k="${key}" aria-label="Recolher ${ttl}" aria-expanded="true"><span class="msr chev">expand_less</span></button></div>`;
H.ticket=t=>`<div class="pnl" data-tk="${t.id}"><div class="tkhead"><span class="ttl" style="flex:none">${t.id}</span>${H.badge(t.status,STA)}<span style="flex:1"></span><button class="more" data-a="tkmenu" data-tk="${t.id}" aria-label="Ações do ticket" aria-haspopup="menu"><span class="msr">more_horiz</span></button></div><div class="cap" style="font-size:14px;line-height:20px">Aberto em ${t.aberto} · ${t.fat.length?H.faturas(t.fat.length):'sem faturas'}</div></div>`;
H.demCard=t=>t.dem?`<div class="pnl dem"><b>Demissão solicitada</b><button class="b danger full" data-a="toast" data-msg="Abriria o cancelamento na SPEC de Cancelamento">Ver cancelamento</button></div>`:'';
H.coop=t=>{ const it=(ic,l,v,act,cl)=>`<div class="it"><span class="ci ${cl||''}"><span class="msr fill">${ic}</span></span><div class="grow"><div class="cap">${l}</div><div class="v">${v}</div></div>${act||''}</div>`;
  const sit=t.dem?'Demissão solicitada':t.sit; const ok=t.status==='Resolvido';
  return `<div class="pnl tight" data-fold="coop"><div class="ph2" style="padding:0 4px 4px"><span class="who" style="padding:0;flex:1;min-width:0"><span class="av"><span class="msr fill">${t.pj?'work':'person'}</span></span><span style="min-width:0"><span class="nm" style="display:block">${esc(title(t.coop))}</span><span class="cap">Titular</span></span></span><button class="ib" data-a="toast" data-msg="Abriria o cadastro do cooperado" aria-label="Abrir cadastro"><span class="msr">open_in_new</span></button><button class="ib" data-a="fold" data-k="coop" aria-label="Recolher cooperado" aria-expanded="true"><span class="msr chev">expand_less</span></button></div>
  <div class="bd">${it(ok?'check':'hourglass_top','Situação',esc(sit),'',ok?'ok':'')}${it('badge',t.pj?'CNPJ':'CPF',t.doc,`<button class="ib" data-a="copy" data-v="${t.doc}" aria-label="Copiar ${t.pj?'CNPJ':'CPF'}"><span class="msr">content_copy</span></button>`)}${it(t.herd?'mail':'groups','Carteira',esc(t.cart)+(t.herd?` · antes ${esc(t.herd.replace('Carteira ',''))}`:''),'<button class="ib" data-a="toast" data-msg="Abriria a carteira" aria-label="Abrir carteira"><span class="msr">open_in_new</span></button>')}${it('id_card','Responsável',t.resp?esc(t.resp):'Sem responsável')}</div></div>`; };
H.fatCard=(t,f)=>f.lida
  ?`<div class="ev"><span class="i c-ok"><span class="msr fill">check</span></span><div class="n">${f.comp}</div><div class="d">UC ${f.uc} · Fatura lida</div></div>`
  :`<div class="ev hv" tabindex="0" aria-label="${f.comp}, UC ${f.uc}, ${f.mot}. Leitura prevista ${f.prev}, ${f.late} dias em atraso"><span class="i c-alert"><span class="msr fill">hourglass_top</span></span>${closed(t)?'':`<button class="act2" data-a="up1" data-tk="${t.id}" data-f="${f.id}" aria-label="Enviar fatura ${f.comp}"><span class="msr">upload</span></button>`}<div class="n">${f.comp}</div><div class="d">UC ${f.uc} · ${f.mot}</div><div class="dif"><span class="k">Leitura prevista ${f.prev}</span><span class="late">${f.late} dias em atraso</span></div></div>`;
H.faturasPnl=t=>{ const n=t.fat.length; const L=n-pend(t).length; const sh=Math.min(n,S.shown[t.id]||5); const rest=n-sh; const ucs=[...new Set(t.fat.map(f=>f.uc))].length;
  if(!n) return `<div class="pnl" data-fold="fat">${H.pnlHead('fat','Nenhuma fatura pendente','Todas as faturas foram recebidas')}</div>`;
  const ttl=L?`${L} de ${n} faturas lidas`:n2(n,'fatura pendente','faturas pendentes');
  return `<div class="pnl" data-fold="fat">${H.pnlHead('fat',ttl,H.ucs(ucs)+' · '+t.conc)}<div class="bd"><div class="evs gap">${t.fat.slice(0,sh).map(f=>H.fatCard(t,f)).join('')}</div>
  ${rest>0?`<button class="b gh" data-a="more5" data-tk="${t.id}">Carregar mais ${Math.min(5,rest)} · ${rest===1?'falta 1':'faltam '+rest}<span class="msr">expand_more</span></button>`:''}
  ${closed(t)?'':`<button class="b out full" data-a="imp" data-tk="${t.id}">Importar faturas</button>`}</div></div>`; };
H.tentPnl=t=>{ if(closed(t)||t.dem) return '';
  const lim=t.tent>=S.cfg.lim; const p=pend(t).length, L=t.fat.length-p;
  const cap=t.herd?`${t.tent} de 7 realizadas · herdadas da ${t.herd}`:lim?'7 de 7 realizadas · limite atingido':t.tent?`${t.tent} de 7 realizadas · `+(L?`faltam ${n2(p,'fatura','faturas')}`:'última há 2 dias'):'Nenhuma tentativa registrada';
  return `<div class="pnl" data-fold="tent">${H.pnlHead('tent','Tentativas de contato',cap,t.herd?'<span class="bdg b-alert" style="margin-bottom:6px">Herdado</span>':'')}<div class="bd">${H.dots(t.tent)}
  ${lim?`<button class="b pri full" disabled>Registrar tentativa</button><button class="b out full" data-a="dem" data-tk="${t.id}">Solicitar demissão</button>`
       :`<button class="b pri full" data-a="tent" data-tk="${t.id}">Registrar tentativa</button><button class="b out full" disabled>Solicitar demissão</button><div class="cap" style="text-align:center">Libera na 7ª tentativa sem retorno</div>`}</div></div>`; };
H.ev=(t,e,i)=>{ const who=e.who?`<span class="who2" data-name="${esc(e.who)}">${ini(e.who)}</span>`:'<span class="who2 sys" data-name="Sistema"><span class="msr fill">bolt</span></span>';
  let dif='';
  if(e.from) dif=`<div class="dif"><span class="o ${e.from==='Sem responsável'?'none':''}">${esc(e.from)}</span><span class="msr">arrow_forward</span><span class="t">${esc(e.to)}</span></div>`;
  else if(e.ev) dif=`<div class="dif"><button class="b out" data-a="evid" data-tk="${t.id}" data-i="${i}"><span class="msr">visibility</span>Ver evidência</button>${t.hist.findIndex(x=>x.ev)===i&&!closed(t)?`<button class="b gh" data-a="undo-tent" data-tk="${t.id}"><span class="msr">undo</span>Desfazer</button>`:''}</div>`;
  return `<div class="ev ${dif?'hv':''} ${e.isNew?'new':''}" ${dif?'tabindex="0"':''}><span class="i ${e.c}"><span class="msr fill">${e.ic}</span></span>${who}<div class="n">${esc(e.t)}</div><div class="d">${e.d}</div>${dif}</div>`; };
H.hist=t=>`<div class="act-p" data-fold="hist"><div class="act-h"><span class="grow">Histórico de tentativas</span><button class="ib w" data-a="fold" data-k="hist" aria-label="Minimizar histórico" aria-expanded="true"><span class="msr">close_fullscreen</span></button></div><div class="act-l evs">${t.hist.map((e,i)=>(i?'<div class="lnk"></div>':'')+H.ev(t,e,i)).join('')}</div></div>`;
H.rail=t=>H.rbar()+H.ticket(t)+H.demCard(t)+H.coop(t)+H.faturasPnl(t)+H.tentPnl(t)+H.hist(t);

/* ---------- modais ---------- */
const sel=(id,opts,ph)=>`<select class="sel" id="${id}">${ph?`<option value="" selected disabled>${ph}</option>`:''}${opts.map(o=>`<option>${o}</option>`).join('')}</select>`;
const COOPS=['Fernanda Lima · 123.456.789-09','Solaris Energias Renováveis · 12.345.678/0001-90','Omni Power Systems · 23.456.789/0001-01','Rafael Cunha · 234.567.890-12','Larissa Costa · 345.678.901-23','Juliana Nascimento · 456.789.012-34'];
const MODALS=`
<div class="ov" id="ovTent" role="dialog" aria-modal="true" aria-labelledby="tT"><form class="dlg" id="fTent" novalidate>
  <div class="dh"><h2 id="tT">Registrar tentativa de contato</h2><p id="tSub"></p></div>
  <div class="db">
    <div><span class="lbl">Canal utilizado</span><div class="chs" role="radiogroup" aria-label="Canal" id="chs">
      <button type="button" class="chn" role="radio" aria-checked="true" data-v="Telefone"><span class="msr">call</span>Telefone</button>
      <button type="button" class="chn" role="radio" aria-checked="false" data-v="WhatsApp"><span class="msr">chat</span>WhatsApp</button>
      <button type="button" class="chn" role="radio" aria-checked="false" data-v="E-mail"><span class="msr">mail</span>E-mail</button></div></div>
    <div><label class="lbl" for="tRes">Resultado da tentativa</label>${sel('tRes',['Sem contato','Caixa postal','Sem retorno','Cooperado informou que enviará','Número errado'],'Selecione o resultado')}</div>
    <div id="evF"><span class="lbl" id="evL">Evidência (obrigatória)</span><div class="fileline"><label class="inp file"><b>Escolher arquivo</b><span id="evName">Nenhum arquivo selecionado</span><input type="file" id="evIn" accept="image/png,image/jpeg,application/pdf" hidden></label><button type="button" class="b pri" id="evBtn">Anexar</button></div><div class="help" id="evH">Print de tela, protocolo da ligação ou comprovante de envio · PNG, JPG ou PDF até 10 MB</div></div>
    <button type="button" class="b gh more-t" id="mdT" aria-expanded="false" style="padding:0">Mais detalhes (opcional)<span class="msr chev">expand_more</span></button>
    <div id="md" hidden style="display:flex;flex-direction:column;gap:16px">
      <div class="row2"><div><label class="lbl" for="tDt">Data e hora do contato</label><input class="inp" id="tDt" value="09/10/2026 11:12"></div><div class="w140"><label class="lbl" for="tDur">Duração</label><input class="inp" id="tDur" placeholder="min:seg"></div></div>
      <div><label class="lbl" for="tPr">Protocolo da ligação</label><input class="inp" id="tPr" placeholder="Ex.: 8842-119"><div class="help">Quando informado, o protocolo conta como evidência.</div></div>
      <div><label class="lbl" for="tObs">Observação</label><textarea class="ta" id="tObs" placeholder="Contexto do contato (opcional)"></textarea></div>
    </div>
  </div>
  <div class="df"><button type="button" class="b out" data-close>Cancelar</button><button type="submit" class="b pri" id="tSave">Salvar tentativa</button></div>
  <button type="button" class="ib x" data-close aria-label="Fechar"><span class="msr">close</span></button>
</form></div>

<div class="ov" id="ovImp" role="dialog" aria-modal="true" aria-labelledby="iT"><form class="dlg w560" id="fImp" novalidate>
  <div class="dh"><h2 id="iT">Importar faturas</h2><p id="iSub"></p></div>
  <div class="db" id="iBody"></div>
  <div class="df"><button type="button" class="b out" data-close>Cancelar</button><button type="submit" class="b pri" id="iSend" disabled>Enviar faturas</button></div>
  <button type="button" class="ib x" data-close aria-label="Fechar"><span class="msr">close</span></button>
</form></div>
<input type="file" id="iIn" multiple accept="application/pdf,image/jpeg,image/png,image/webp,.pdf,.jpg,.jpeg,.png,.webp" hidden>

<div class="ov" id="ovEv" role="dialog" aria-modal="true" aria-labelledby="eT"><div class="dlg w560">
  <div class="dh"><h2 id="eT">Evidência</h2><p id="eSub"></p></div>
  <div class="db"><div class="evimg" id="eImg" role="img" aria-label="Imagem da evidência"></div>
    <div class="fi"><span class="ty ext" id="eExt">PNG</span><div class="tx"><div class="nm" id="eName"></div><div class="sz" id="eMeta"></div></div></div></div>
  <div class="df"><button type="button" class="b out" data-a="toast" data-msg="Baixaria a evidência">Baixar</button><button type="button" class="b pri" data-close>Fechar</button></div>
  <button type="button" class="ib x" data-close aria-label="Fechar"><span class="msr">close</span></button>
</div></div>

<div class="ov" id="ovDem" role="dialog" aria-modal="true" aria-labelledby="dT"><form class="dlg" id="fDem" novalidate>
  <div class="dh"><h2 id="dT">Solicitar demissão</h2><p id="dSub"></p></div>
  <div class="db">
    <p class="cap" style="font-size:14px;line-height:20px;margin:0" id="dIntro"></p>
    <div><label class="lbl" for="dMot">Motivo</label>${sel('dMot',['Demissão - Falta de contato com cooperado','Demissão - Pedido do cooperado','Demissão - Inadimplência'])}</div>
    <div><label class="lbl" for="dTemp">Temperatura do cooperado</label>${sel('dTemp',['Frio','Morno','Quente'],'Selecione a temperatura')}</div>
    <div><label class="lbl" for="dMeio">Meio de contato</label>${sel('dMeio',['Telefone','WhatsApp','E-mail'])}</div>
    <div><label class="lbl" for="dData">Data da solicitação do cooperado</label><input class="inp" id="dData" value="08/10/2026"></div>
    <div><label class="lbl" for="dDesc">Descrição</label><input class="inp" id="dDesc" value="Sem retorno em 7 tentativas (telefone, WhatsApp e e-mail)"></div>
    <p class="cap" style="font-size:13px;line-height:20px;margin:0">Atenção: para o cancelamento seguir bem, recomenda-se que as três últimas faturas das UCs estejam no Enershare. Isso não impede o registro.</p>
    <p class="cap" style="font-size:13px;line-height:20px;margin:0">Ao registrar: status Em Cancelamento, Fora de Fornecimento ativada, faturamento e cobrança bloqueados (90 dias) e WhatsApp e e-mail enviados ao cooperado.</p>
  </div>
  <div class="df"><button type="button" class="b out" data-close>Cancelar</button><button type="submit" class="b danger" id="dSave" disabled>Registrar demissão</button></div>
  <button type="button" class="ib x" data-close aria-label="Fechar"><span class="msr">close</span></button>
</form></div>

<div class="ov" id="ovAdd" role="dialog" aria-modal="true" aria-labelledby="aT"><form class="dlg" id="fAdd" novalidate>
  <div class="dh"><h2 id="aT">Adicionar Faturamento Pendente</h2><p>Selecione o cooperado e as faturas que não foram recebidas.</p></div>
  <div class="db">
    <div><label class="lbl" for="aCoop">Cooperado</label>${sel('aCoop',COOPS,'Busque pelo nome ou documento')}<div class="help" id="aH">Se o cooperado já tiver um ticket ativo, as faturas entram nele.</div></div>
    <div><label class="lbl" for="aTit">Título (opcional)</label><input class="inp" id="aTit" placeholder="Ex.: Faturas de julho não recebidas"></div>
    <div><label class="lbl" for="aDesc">Descrição (opcional)</label><textarea class="ta" id="aDesc" placeholder="Contexto para quem for atender o ticket"></textarea></div>
  </div>
  <div class="df"><button type="button" class="b out" data-close>Cancelar</button><button type="submit" class="b pri" id="aSave" disabled>Criar ticket</button></div>
  <button type="button" class="ib x" data-close aria-label="Fechar"><span class="msr">close</span></button>
</form></div>

<div class="ov" id="ovCfg" role="dialog" aria-modal="true" aria-labelledby="cT"><div class="dlg w560">
  <div class="dh"><h2 id="cT">Configuração e detecção</h2><p>Parâmetros, temas de atendimento e detecção manual</p></div>
  <div class="tabs" role="tablist" aria-label="Seções"><button role="tab" data-tab="det" aria-selected="true">Detecção</button><button role="tab" data-tab="par" aria-selected="false">Parâmetros</button><button role="tab" data-tab="tem" aria-selected="false">Temas de atendimento</button></div>
  <div id="cfgBody"></div>
  <button type="button" class="ib x" data-close aria-label="Fechar"><span class="msr">close</span></button>
</div></div>`;

function cfgTab(tab){ const c=S.cfg; const b=document.getElementById('cfgBody'); if(!b) return;
  document.querySelectorAll('#ovCfg [role=tab]').forEach(x=>x.setAttribute('aria-selected',String(x.dataset.tab===tab)));
  const sw=(k,t,d)=>`<label class="swr"><span class="sw ${c[k]?'on':''}"><input type="checkbox" data-cfg="${k}" ${c[k]?'checked':''}><i></i></span><span><b>${t}</b><span class="cap">${d}</span></span></label>`;
  const chips=(l,v,more)=>`<div><span class="lbl">${l}</span><div class="msel">${v.map(x=>`<span class="chip">${x}</span>`).join('')}${more?`<span class="cap">+${more}</span>`:''}<span class="msr" style="margin-left:auto">expand_more</span></div></div>`;
  if(tab==='det') b.innerHTML=`<div class="db"><p class="cap" style="font-size:13px;line-height:20px;margin:0">Simule para medir quantos tickets e faturas seriam gerados, sem alterar nada. Execute para abrir tickets e anexar faturas conforme os parâmetros vigentes.</p>
    <div class="vig"><b>Parâmetros vigentes</b><div class="kv"><span>Detecção ativa</span><b>${c.det?'Sim':'Não'}</b><span>Modo observação</span><b>${c.obs?'Sim':'Não'}</b><span>Data mínima de leitura</span><b>${c.dmin||'Não informada'}</b><span>Dias após a leitura</span><b>${c.dias}</b></div>
    <p class="cap" style="margin:0">${c.det?(c.obs?'Modo observação: a execução só mede o impacto e registra o resultado.':'A execução abre tickets e anexa faturas.'):'A detecção está desligada: só a simulação está disponível. Ligue na aba Parâmetros para executar.'}</p></div>
    <div id="simR"></div></div>
    <div class="df"><button class="b out" data-a="sim">Simular detecção</button><button class="b pri" data-a="exec" ${c.det?'':'disabled'}>Executar detecção</button></div>`;
  if(tab==='par') b.innerHTML=`<div class="db"><b>Detecção</b>${sw('det','Detecção ativa','Desligada, as execuções reais são recusadas e só a simulação fica disponível.')}${sw('obs','Modo observação','As execuções só medem o impacto e registram o resultado, sem abrir tickets.')}
    <div class="row2"><div><label class="lbl" for="cDmin">Data mínima de leitura</label><input class="inp" id="cDmin" placeholder="dd/mm/aaaa" value="${c.dmin}"><div class="help">Leituras anteriores a esta data são ignoradas. Obrigatória com a detecção ligada fora do modo observação.</div></div><div><label class="lbl" for="cDias">Dias após a leitura</label><input class="inp" id="cDias" value="${c.dias}" inputmode="numeric"><div class="help">A medição vira pendência quando passa este número de dias sem fatura.</div></div></div>
    <b>Atendimento</b><div class="row2"><div><label class="lbl" for="cLim">Limite de tentativas de contato</label><input class="inp" id="cLim" value="${c.lim}" inputmode="numeric"><div class="help">Máximo de tentativas válidas por ticket (1 a 20).</div></div><div><label class="lbl" for="cJan">Janela de resolvidos (dias)</label><input class="inp" id="cJan" value="${c.jan}" inputmode="numeric"><div class="help">Por quantos dias os resolvidos continuam visíveis (1 a 365).</div></div></div>
    ${sw('anexar','Anexar faturas com limite atingido','Ligado, novas faturas pendentes continuam entrando no ticket que já atingiu o limite de tentativas.')}
    <b>Elegibilidade</b>${chips('Status da medição',['Pendente','Coleta manual/e-mail','Coletando','Falha na coleta'],4)}${chips('Status da UC',['Em fornecimento','Fora de fornecimento'])}${chips('Status do cooperado',['Ativo'])}
    <p class="err" id="cErr" hidden></p></div>
    <div class="df"><button class="b out" data-a="cfgreset">Descartar alterações</button><button class="b pri" data-a="cfgsave">Salvar parâmetros</button></div>`;
  if(tab==='tem') b.innerHTML=`<div class="db"><div style="display:flex;gap:16px;align-items:flex-start"><p class="cap" style="font-size:13px;line-height:20px;margin:0;flex:1">Os temas classificam os atendimentos e definem as regras de evidência, os canais aceitos e o prazo para desfazer um registro.</p><button class="b pri" data-a="toast" data-msg="Abriria Novo tema"><span class="msr">add</span>Novo tema</button></div>
    ${[['Atendimento geral','Evidência opcional · Até 5 arquivos de 10 MB · Todos os canais · Desfazer em até 30 min'],['Faturamento pendente','Evidência obrigatória · Até 5 arquivos de 10 MB · Telefone, WhatsApp e e-mail · Desfazer em até 30 min']].map(x=>`<div class="vig row"><div style="flex:1"><div style="display:flex;gap:8px;align-items:center"><b>${x[0]}</b><span class="bdg b-ok">Ativo</span></div><p class="cap" style="margin:4px 0 0">${x[1]}</p></div><button class="b gh" data-a="toast" data-msg="Abriria Editar tema"><span class="msr">edit</span>Editar</button></div>`).join('')}</div>
    <div class="df" style="justify-content:flex-end"><button class="b pri" data-close>Fechar</button></div>`;
}

/* ---------- montagem ---------- */
const mounts=[]; // {el, fn}
const folded={};
function mount(el,fn){ mounts.push({el,fn}); paint(el,fn); }
function paint(el,fn){ el.innerHTML=fn(); el.querySelectorAll('[data-fold]').forEach(p=>{ if(folded[p.dataset.fold]) setFold(p,true); }); }
function refresh(){ if(document.getElementById('tbl')){ const v=new Set(visible().map(t=>t.id)); [...S.sel].forEach(id=>{ if(!v.has(id)) S.sel.delete(id); }); }
  mounts.forEach(m=>{ if(document.contains(m.el)) paint(m.el,m.fn); }); updateBulk(); }
function setFold(p,c){ p.classList.toggle('closed',c); const b=p.querySelector('[data-a="fold"]'); if(b) b.setAttribute('aria-expanded',String(!c)); }

function hiddenFor(w){ const hide=[]; const order=COLS.filter(c=>c.hide).sort((a,b)=>a.hide-b.hide);
  const used=()=>COLS.filter(c=>c.k!=='coop'&&!hide.includes(c.k)).reduce((a,c)=>a+FIXW[c.k],0);
  for(const c of order){ if(w-used()>=240) break; hide.push(c.k); }
  return hide; }
function mountTable(el){ let hid=[]; const fn=()=>H.table(hid); mount(el,fn);
  if(window.ResizeObserver){ new ResizeObserver(()=>{ const n=hiddenFor(el.parentElement.clientWidth-2); if(n.join()!==hid.join()){ hid=n; paint(el,fn); } }).observe(el.parentElement); } }

/* pop-over */
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

/* ações / undo */
function snapshot(){ return JSON.stringify(S.tickets); }
function restore(s){ const arr=JSON.parse(s); S.tickets.splice(0,S.tickets.length,...arr); refresh(); }
function act(ids, fn, msg){ const snap=snapshot(); ids.forEach(id=>{ const t=tk(id); if(t) fn(t); }); refresh();
  if(window.toast) toast(msg,{action:{label:'Desfazer',onClick:()=>restore(snap)}}); }
const NOW='09/10 às 11:20';
function scopeIds(scope){ return scope==='bulk'?[...S.sel]:[scope]; }
function doResp(scope,v){ const ids=scopeIds(scope); act(ids,t=>{ if(t.resp===(v||null)) return; t.hist.unshift({ic:'person_add',c:'c-edit',t:v?'Responsável definido':'Responsável removido',d:NOW,who:ME,from:t.resp||'Sem responsável',to:v||'Sem responsável',isNew:1}); t.resp=v||null; if(t.status==='Aberto'&&v) t.status='Em andamento'; },
  v?`${n2(ids.length,'ticket','tickets')} com ${v}`:`Responsável removido de ${n2(ids.length,'ticket','tickets')}`); }
function doCart(scope,v){ const ids=scopeIds(scope); act(ids,t=>{ if(t.cart===v) return; t.hist.unshift({ic:'swap_horiz',c:'c-edit',t:'Carteira alterada',d:NOW,who:ME,from:t.cart,to:v,isNew:1}); t.cart=v; },`${n2(ids.length,'ticket movido','tickets movidos')} para ${v}`); }
function doTriagem(scope){ const ids=scopeIds(scope); act(ids,t=>{ if(t.resp) t.hist.unshift({ic:'undo',c:'c-edit',t:'Devolvido à triagem',d:NOW,who:ME,from:t.resp,to:'Sem responsável',isNew:1}); t.resp=null; },`${n2(ids.length,'ticket devolvido','tickets devolvidos')} à triagem`); }
function doResolver(scope){ const ids=scopeIds(scope); act(ids,t=>{ if(t.status==='Resolvido') return; t.status='Resolvido'; t.sit='Resolvido'; t.hist.unshift({ic:'check_circle',c:'c-ok',t:'Resolvido manualmente',d:NOW,who:ME,isNew:1}); },n2(ids.length,'ticket resolvido','tickets resolvidos')); }
function updateBulk(){ const b=document.getElementById('bulk'); if(!b) return; const n=S.sel.size; b.classList.toggle('on',n>0); const l=document.getElementById('bulkN'); if(l) l.textContent=n2(n,'selecionado','selecionados'); }

/* modal: base */
function openOv(id){ const o=document.getElementById(id); o.classList.add('on'); o._ret=document.activeElement; setTimeout(()=>{ const f=o.querySelector('h2'); f.tabIndex=-1; f.focus(); },0); }
function closeOv(o){ o.classList.remove('on'); if(o._ret&&o._ret.focus&&document.contains(o._ret)) o._ret.focus(); }

/* registrar tentativa: sem evidência, o campo fica em erro e Salvar desabilita (Figma 61:9375) */
let tentTk=null, evFile=null, evTried=false;
function evState(){ const ok=!!evFile||!!document.getElementById('tPr').value.trim(); const err=evTried&&!ok;
  document.getElementById('evF').classList.toggle('bad',err);
  document.getElementById('evH').textContent=err?'Anexe uma evidência para registrar a tentativa':'Print de tela, protocolo da ligação ou comprovante de envio · PNG, JPG ou PDF até 10 MB';
  document.getElementById('tSave').disabled=err; return ok; }
function openTent(id){ tentTk=id; const t=tk(id); evFile=null; evTried=false;
  document.getElementById('tSub').textContent=`Tentativa ${t.tent+1} de 7 · ${t.id} · ${title(t.coop)}`;
  document.getElementById('evName').textContent='Nenhum arquivo selecionado'; document.getElementById('tPr').value=''; document.getElementById('tRes').selectedIndex=0;
  evState(); openOv('ovTent'); }
function saveTent(){ evTried=true; if(!evState()) return; const t=tk(tentTk);
  const ch=document.querySelector('#chs [aria-checked="true"]').dataset.v; let res=document.getElementById('tRes').value||'Sem contato'; const ic={Telefone:'call',WhatsApp:'chat','E-mail':'mail'}[ch];
  const snap=snapshot();
  t.tent++; t.hist.unshift({ic,c:'c-def',t:`${t.tent}ª tentativa · ${res.replace('Cooperado informou que enviará','Cooperado enviará')}`,d:'09/10 às 11:12',who:ME,ev:{ch,n:t.tent,dt:'09/10/2026 às 11:12',file:evFile?evFile.name:'protocolo-'+document.getElementById('tPr').value.trim()+'.txt'},isNew:1});
  if(t.sit==='Sem Atendimento'){ t.hist.splice(1,0,{ic:'play_arrow',c:'c-ok',t:'Atendimento iniciado',d:'09/10 às 11:12',who:ME}); }
  t.sit=res==='Cooperado informou que enviará'?'Aguardando Fatura':'Em Atendimento'; t.status='Em andamento'; if(!t.resp) t.resp=ME;
  closeOv(document.getElementById('ovTent')); refresh();
  toast(t.tent>=7?'7ª tentativa registrada':'Tentativa registrada',{desc:t.tent>=7?'Limite atingido: a demissão está liberada.':`${t.tent} de 7 · ${t.id}`,action:{label:'Desfazer',onClick:()=>restore(snap)}}); }

/* evidência */
function openEv(id,i){ const t=tk(id); const e=t.hist[i]; if(!e||!e.ev) return; const ext=(e.ev.file.split('.').pop()||'png').toUpperCase();
  document.getElementById('eT').textContent=`Evidência da ${e.ev.n}ª tentativa`;
  document.getElementById('eSub').textContent=`${e.ev.ch} · ${e.ev.dt} · ${e.who||'Sistema'}`;
  document.getElementById('eExt').textContent=ext; document.getElementById('eName').textContent=e.ev.file;
  document.getElementById('eMeta').textContent=`${ext==='PDF'?'318 KB':'1,2 MB'} · ${e.ev.dt.slice(0,10)}`;
  document.getElementById('eImg').className='evimg '+(ext==='PDF'?'pdf':''); openOv('ovEv'); }

/* demissão */
let demTk=null;
function openDem(id){ demTk=id; const t=tk(id);
  document.getElementById('dSub').textContent=`${t.id} · ${title(t.coop)} · ${t.tent} de 7 tentativas`;
  document.getElementById('dIntro').textContent=`Abre um pedido de cancelamento da titularidade, do tipo Demissão Cooperado, com ${t.ucs.length===1?'a UC':'as '+t.ucs.length+' UCs'} do titular.`;
  document.getElementById('dTemp').selectedIndex=0; document.getElementById('dSave').disabled=true; openOv('ovDem'); }
function saveDem(){ const t=tk(demTk); const snap=snapshot();
  t.dem=true; t.sit='Demissão'; t.hist.unshift({ic:'person_remove',c:'c-alert',t:'Demissão solicitada',d:NOW,who:ME,isNew:1});
  closeOv(document.getElementById('ovDem')); refresh(); toast('Demissão registrada',{desc:`${t.id} foi para Demissões. O cooperado recebe WhatsApp e e-mail.`,action:{label:'Desfazer',onClick:()=>restore(snap)}}); }

/* adicionar */
function openAdd(){ document.getElementById('aCoop').selectedIndex=0; document.getElementById('aSave').disabled=true; document.getElementById('aTit').value=''; document.getElementById('aDesc').value=''; addHint(); openOv('ovAdd'); }
function addHint(){ const v=document.getElementById('aCoop').value; const name=v.split(' · ')[0]; const ex=S.tickets.find(t=>!closed(t)&&title(t.coop)===title(name));
  const h=document.getElementById('aH'); h.textContent=ex?`${name} já tem o ${ex.id} ativo: as faturas entram nele.`:'Se o cooperado já tiver um ticket ativo, as faturas entram nele.'; h.style.color=ex?'var(--alert)':''; return ex; }
function saveAdd(){ const v=document.getElementById('aCoop').value; if(!v) return; const name=v.split(' · ')[0]; const ex=addHint(); const snap=snapshot();
  if(ex){ const f=genFat(1,ex.ucs,ex.seed+7); f[0].comp='03/2026'; f[0].id='fn'+Date.now(); ex.fat.push(f[0]); ex.hist.unshift({ic:'note_add',c:'c-def',t:'Fatura 03/2026 adicionada',d:NOW,who:ME,isNew:1}); S.cur=ex.id; }
  else { const id='TK-0'+(4183+S.tickets.length); const doc=v.split(' · ')[1]; const pj=doc.length>14; const ucs=['9'+String(Date.now()).slice(-6)];
    const t={id,sit:'Sem Atendimento',tent:0,coop:name.toUpperCase(),pj,ucs,resp:null,cart:'Carteira Sul',status:'Aberto',aberto:'09/10/2026',seed:S.tickets.length,conc:CONCS[0],herd:null,dem:false,by:null,doc};
    t.fat=genFat(2,ucs,t.seed); t.hist=[{ic:'note_add',c:'c-def',t:'Ticket aberto manualmente por '+ME,d:NOW,who:ME,isNew:1}]; S.tickets.unshift(t); S.cur=id; }
  S.railOpen=true; closeOv(document.getElementById('ovAdd')); refresh(); syncRail();
  toast(ex?'Faturas adicionadas ao ticket ativo':'Ticket criado',{desc:ex?ex.id:`${S.cur} · ${name}. Ele aparece na Triagem.`,action:{label:'Desfazer',onClick:()=>restore(snap)}}); }

/* configuração */
let cfgDraft=null;
function openCfg(tab){ cfgDraft=JSON.stringify(S.cfg); cfgTab(tab||'det'); openOv('ovCfg'); }

/* importar faturas (mesmo componente da Nova fatura do Leitor) */
let imp={tk:null,files:[],only:null};
const MAXB=20*1024*1024;
const fmtB=b=>b>=1048576?(b/1048576).toFixed(1).replace('.',',')+' MB':Math.max(1,Math.round(b/1024))+' KB';
const MON={jan:'01',fev:'02',mar:'03',abr:'04',mai:'05',jun:'06',jul:'07',ago:'08',set:'09',out:'10',nov:'11',dez:'12'};
function guess(name,t,taken){ const n=name.toLowerCase(); let c=null; let m=n.match(/(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)[^0-9]?(\d{4})/); if(m) c=MON[m[1]]+'/'+m[2];
  m=!c&&n.match(/(\d{4})[-_.](\d{2})/); if(m) c=m[2]+'/'+m[1]; m=!c&&n.match(/(\d{2})[-_.](\d{4})/); if(m) c=m[1]+'/'+m[2];
  const free=pend(t).filter(f=>!taken.includes(f.id)); const hit=c&&free.find(f=>f.comp===c); return (hit||free[0]||{}).id||null; }
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
function renderImp(){ const t=tk(imp.tk); const b=document.getElementById('iBody'); if(!b||!t) return;
  const opt=f=>pend(t).map(x=>`<option value="${x.id}" ${x.id===f.target?'selected':''}>UC ${x.uc} · ${x.comp}</option>`).join('');
  const drop=(mini)=>`<div class="drop ${mini?'mini':''}" id="iDrop"><span class="msr big">upload_file</span>${mini?'<span>Arraste mais arquivos ou</span> <button type="button" class="pick" data-a="ipick">escolha no computador</button>':`<span class="t1">Arraste as faturas aqui</span><span class="or">ou</span><button type="button" class="b out" data-a="ipick">Escolher no computador</button><span class="capx">PDF, JPG ou PNG até 20 MB · vários arquivos de uma vez</span><button type="button" class="b gh sm" data-a="isample" style="margin-top:4px">Usar arquivos de exemplo</button>`}</div>`;
  const items=imp.files.map((f,i)=>`<div class="fi ${f.st==='err'?'err':''}"><span class="ty"><span class="msr ${f.st==='err'?'fill':''}">${f.st==='err'?'warning':f.img?'image':'picture_as_pdf'}</span></span><div class="tx"><div class="l1"><span class="nm">${esc(f.name)}</span><span class="sz">· ${fmtB(f.size)}</span></div>
    ${f.st==='err'?`<div class="st">${f.msg}</div>`:f.st==='up'?`<div class="st">Enviando… ${Math.round(f.pct)}%</div><div class="trk"><i style="width:${f.pct}%"></i></div>`:`<div class="st">Vai para <select data-a="itarget" data-i="${i}" aria-label="Fatura de destino">${opt(f)}</select></div>`}</div>
    <button type="button" class="ac" data-a="irm" data-i="${i}" aria-label="Remover ${esc(f.name)}"><span class="msr">close</span></button></div>`).join('');
  b.innerHTML=imp.files.length?`<div class="files">${items}</div>${drop(true)}`:drop(false);
  const ok=imp.files.filter(f=>f.st==='ok').length, up=imp.files.some(f=>f.st==='up');
  const s=document.getElementById('iSend'); s.disabled=!ok||up; s.textContent=up?'Enviando…':ok?`Enviar ${n2(ok,'fatura','faturas')}`:'Enviar faturas';
  const d=document.getElementById('iDrop'); if(d){ d.ondragover=e=>{ e.preventDefault(); d.classList.add('over'); }; d.ondragleave=()=>d.classList.remove('over'); d.ondrop=e=>{ e.preventDefault(); d.classList.remove('over'); addFiles(e.dataTransfer.files); }; } }
function sendImp(){ const t=tk(imp.tk); const snap=snapshot(); const ok=imp.files.filter(f=>f.st==='ok'); const ids=[...new Set(ok.map(f=>f.target))];
  ids.forEach(id=>{ const f=t.fat.find(x=>x.id===id); if(!f) return; f.lida=true; t.hist.unshift({ic:'note_add',c:'c-ok',t:`Fatura ${f.comp} importada`,d:'09/10 às 11:25',who:ME,isNew:1}); });
  if(!pend(t).length){ t.status='Resolvido'; t.sit='Resolvido'; t.hist.unshift({ic:'check_circle',c:'c-ok',t:'Resolvido por importação manual',d:'09/10 às 11:25',who:ME,isNew:1}); }
  closeOv(document.getElementById('ovImp')); refresh();
  toast(`${n2(ids.length,'fatura enviada','faturas enviadas')} para leitura`,{desc:pend(t).length?`${n2(pend(t).length,'fatura continua pendente','faturas continuam pendentes')} em ${t.id}.`:`${t.id} resolvido.`,action:{label:'Desfazer',onClick:()=>restore(snap)}}); }
function sampleFiles(){ const t=tk(imp.tk); const p=pend(t); const f0=p[0]; if(!f0) return;
  const mk=(n,s,ty)=>({name:n,size:s,type:ty});
  const toName=f=>{ const [m,y]=f.comp.split('/'); return Object.keys(MON).find(k=>MON[k]===m)+y; };
  addFiles([mk(`fatura-${t.conc.split(' ')[0].toLowerCase()}-${toName(f0)}.pdf`,1258291,'application/pdf'),mk('IMG_4821.jpg',3565158,'image/jpeg'),mk('fatura-digitalizada.pdf',26004684,'application/pdf')].slice(0,p.length>1?3:2)); }

/* kanban: arrastar para a próxima coluna registra a tentativa; para Demissões, solicita a demissão */
let dragId=null;
function wireKanban(root){
  root.addEventListener('dragstart',e=>{ const c=e.target.closest('.kc'); if(!c) return; dragId=c.dataset.tk; c.classList.add('drag'); e.dataTransfer.effectAllowed='move'; try{ e.dataTransfer.setData('text/plain',dragId); }catch(err){} });
  root.addEventListener('dragend',e=>{ const c=e.target.closest('.kc'); if(c) c.classList.remove('drag'); root.querySelectorAll('.kcol.over').forEach(x=>x.classList.remove('over')); });
  root.addEventListener('dragover',e=>{ const col=e.target.closest('.kcol'); if(!col||!dragId) return; e.preventDefault(); root.querySelectorAll('.kcol.over').forEach(x=>x!==col&&x.classList.remove('over')); col.classList.add('over'); });
  root.addEventListener('drop',e=>{ const col=e.target.closest('.kcol'); if(!col||!dragId) return; e.preventDefault(); col.classList.remove('over'); const t=tk(dragId); dragId=null; const to=col.dataset.stage; const from=stageOf(t);
    if(String(to)===String(from)) return;
    if(to==='dem'){ if(t.tent>=S.cfg.lim) openDem(t.id); else toast('Demissão libera na 7ª tentativa',{err:true,desc:`${t.id} está com ${t.tent} de 7.`}); return; }
    if(Number(to)===t.tent+1&&from!=='dem') openTent(t.id); else toast('Os tickets avançam uma tentativa por vez',{err:true,desc:`Arraste ${t.id} para a ${t.tent+1}ª tentativa para registrar o contato.`}); });
}

/* handler único */
function onClick(e){
  const a=e.target.closest('[data-a]');
  if(popEl&&!popEl.hidden&&!e.target.closest('#pop')&&!(popAnchor&&popAnchor.contains(e.target))) closePop();
  if(!a) return; const k=a.dataset.a, id=a.dataset.tk;
  switch(k){
    case 'row': S.cur=id; S.railOpen=true; refresh(); syncRail(); break;
    case 'sel': e.stopPropagation(); S.sel.has(id)?S.sel.delete(id):S.sel.add(id); refresh(); break;
    case 'selall': { const v=visible(); const all=v.every(t=>S.sel.has(t.id)); v.forEach(t=>all?S.sel.delete(t.id):S.sel.add(t.id)); refresh(); break; }
    case 'rowmenu': case 'tkmenu': e.stopPropagation(); if(popAnchor===a){ closePop(); break; } openPop(a,H.menuTicket(tk(id)),{alignRight:true}); break;
    case 'm-resp': openPop(popAnchor||a,respMenu(id),{alignRight:true}); break;
    case 'm-triagem': closePop(); doTriagem(id); break;
    case 'm-resolver': closePop(); doResolver(id); break;
    case 'm-desc': closePop(); toast('Abriria Editar descrição'); break;
    case 'm-cancelar': closePop(); act([id],t=>{ t.status='Cancelado'; t.hist.unshift({ic:'close',c:'c-edit',t:'Ticket cancelado',d:NOW,who:ME,isNew:1}); },`${id} cancelado`); break;
    case 'bcancel': { closePop(); const ids=[...S.sel]; act(ids,t=>{ t.status='Cancelado'; },n2(ids.length,'ticket cancelado','tickets cancelados')); break; }
    case 'setresp': closePop(); doResp(a.dataset.scope,a.dataset.v); break;
    case 'setcart': closePop(); doCart(a.dataset.scope,a.dataset.v); break;
    case 'flt': { if(e.target.closest('[data-a="fclr"]')) return; if(popAnchor===a){ closePop(); break; } const f=FLT.find(x=>x.k===a.dataset.k); const v=S.f[f.k]||[];
      openPop(a,`${f.o.length>6?'<label class="ps"><span class="msr">search</span><input data-a="fsearch" placeholder="Pesquisar" aria-label="Pesquisar opções"></label>':''}<div role="group" aria-label="${f.l}">${f.o.map(o=>`<button class="opt" data-a="fopt" data-k="${f.k}" data-v="${esc(o)}" role="menuitemcheckbox" aria-checked="${v.includes(o)}"><span class="cbx ${v.includes(o)?'on':''}">${v.includes(o)?'<span class="mss">check</span>':''}</span><span class="grow">${esc(o)}</span></button>`).join('')}</div>`,{w:240}); break; }
    case 'fopt': { const f=a.dataset.k, v=a.dataset.v; const cur=S.f[f]||[]; S.f[f]=cur.includes(v)?cur.filter(x=>x!==v):[...cur,v]; const on=S.f[f].includes(v); a.setAttribute('aria-checked',on); const c=a.querySelector('.cbx'); c.classList.toggle('on',on); c.innerHTML=on?'<span class="mss">check</span>':''; refresh(); const nb=document.querySelector(`.flt[data-k="${f}"]`); if(nb){ popAnchor=nb; nb.classList.add('open'); } break; }
    case 'fclr': e.stopPropagation(); S.f[a.dataset.k]=[]; closePop(); refresh(); break;
    case 'fclrall': S.f={}; refresh(); break;
    case 'railclose': S.railOpen=false; refresh(); syncRail(); break;
    case 'fold': { const p=a.closest('[data-fold]'); const c=!p.classList.contains('closed'); folded[p.dataset.fold]=c; setFold(p,c); break; }
    case 'more5': { a.innerHTML='<span class="msr spin">progress_activity</span>Carregando…'; a.disabled=true; setTimeout(()=>{ S.shown[id]=(S.shown[id]||5)+5; refresh(); },450); break; }
    case 'imp': openImp(id); break;
    case 'up1': e.stopPropagation(); openImp(id,a.dataset.f); break;
    case 'tent': openTent(id); break;
    case 'dem': openDem(id); break;
    case 'evid': openEv(id,Number(a.dataset.i)); break;
    case 'add': openAdd(); break;
    case 'cfg': openCfg(); break;
    case 'undo-tent': { const t=tk(id); const snap=snapshot(); const i=t.hist.findIndex(x=>x.ev); if(i<0) break; t.hist.splice(i,1); t.tent=Math.max(0,t.tent-1); refresh(); toast('Tentativa desfeita',{action:{label:'Refazer',onClick:()=>restore(snap)}}); break; }
    case 'copy': { const v=a.dataset.v; try{ navigator.clipboard.writeText(v).then(()=>toast('Copiado',v),()=>toast(v)); }catch(err){ toast(v); } break; }
    case 'toast': toast(a.dataset.msg); break;
    case 'indref': toast('Indicadores atualizados'); break;
    case 'ipick': document.getElementById('iIn').click(); break;
    case 'isample': sampleFiles(); break;
    case 'irm': imp.files.splice(Number(a.dataset.i),1); renderImp(); break;
    case 'sim': { const c=S.cfg; document.getElementById('simR').innerHTML=`<div class="simr"><span class="msr">science</span><span><b>Simulação de 09/10 às 11:20</b><span class="cap">4 tickets novos e 7 faturas seriam gerados; 2 faturas entrariam em tickets ativos. Nada foi alterado.</span></span></div>`; break; }
    case 'exec': toast(S.cfg.obs?'Detecção executada em modo observação':'Detecção executada',S.cfg.obs?'Impacto registrado: 4 tickets e 7 faturas. Nenhum ticket foi aberto.':'4 tickets abertos e 7 faturas anexadas.'); break;
    case 'cfgreset': S.cfg=JSON.parse(cfgDraft); cfgTab('par'); toast('Alterações descartadas'); break;
    case 'cfgsave': { const c=S.cfg; const g=x=>document.getElementById(x).value.trim(); const lim=Number(g('cLim')), jan=Number(g('cJan')), dias=Number(g('cDias')); const er=document.getElementById('cErr');
      const msg=!(lim>=1&&lim<=20)?'O limite de tentativas vai de 1 a 20.':!(jan>=1&&jan<=365)?'A janela de resolvidos vai de 1 a 365 dias.':(c.det&&!c.obs&&!g('cDmin'))?'Informe a data mínima de leitura para ligar a detecção fora do modo observação.':'';
      if(msg){ er.textContent=msg; er.hidden=false; break; } er.hidden=true; c.lim=lim; c.jan=jan; c.dias=dias; c.dmin=g('cDmin'); cfgDraft=JSON.stringify(c); refresh(); toast('Parâmetros salvos'); break; }
  }
}
function onBulk(e){ const a=e.target.closest('[data-bulk]'); if(!a) return; const k=a.dataset.bulk;
  if(k==='limpar'){ S.sel.clear(); refresh(); return; }
  if(k==='resp'){ if(popAnchor===a) return closePop(); openPop(a,respMenu('bulk'),{up:true}); return; }
  if(k==='cart'){ if(popAnchor===a) return closePop(); openPop(a,cartMenu('bulk'),{up:true}); return; }
  if(k==='triagem') return doTriagem('bulk');
  if(k==='resolver') return doResolver('bulk');
  if(k==='mais'){ if(popAnchor===a) return closePop(); openPop(a,`<button class="opt" data-a="toast" data-msg="${n2(S.sel.size,'ticket exportado','tickets exportados')} (CSV)"><span class="grow">Exportar selecionados</span><span class="msr">download</span></button><div class="sepl"></div><button class="opt dg" data-a="bcancel"><span class="grow">Cancelar tickets</span><span class="msr">close</span></button>`,{up:true,alignRight:true}); }
}
function syncRail(){ const r=document.getElementById('rail'); if(!r) return; r.hidden=!S.railOpen; const b=document.getElementById('bRail'); if(b){ b.classList.toggle('on',S.railOpen); b.setAttribute('aria-pressed',S.railOpen); } }

function wireCommon(){
  if(wireCommon.done) return; wireCommon.done=1;
  const root=document.querySelector('[data-fp-root]'); if(root&&!document.getElementById('ovTent')) root.insertAdjacentHTML('beforeend','<div class="pop" id="pop" hidden role="menu"></div>'+MODALS);
  document.addEventListener('click',onClick);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if(popEl&&!popEl.hidden){ const a=popAnchor; closePop(); a&&a.focus(); return; } const o=document.querySelector('.ov.on'); if(o) closeOv(o); }
    if((e.key==='Enter'||e.key===' ')&&e.target.matches('.tr.row,.kc')){ e.preventDefault(); e.target.click(); } });
  document.addEventListener('input',e=>{ if(e.target.matches('[data-a="fsearch"]')){ const q=e.target.value.toLowerCase(); popEl.querySelectorAll('.opt').forEach(o=>o.hidden=!o.textContent.toLowerCase().includes(q)); }
    if(e.target.id==='tPr') evState(); });
  document.addEventListener('change',e=>{ const t=e.target;
    if(t.matches('[data-a="itarget"]')) imp.files[Number(t.dataset.i)].target=t.value;
    if(t.matches('[data-cfg]')){ S.cfg[t.dataset.cfg]=t.checked; t.closest('.sw').classList.toggle('on',t.checked); }
    if(t.id==='dTemp') document.getElementById('dSave').disabled=!t.value;
    if(t.id==='aCoop'){ document.getElementById('aSave').disabled=!t.value; addHint(); } });
  const bulk=document.getElementById('bulk'); if(bulk) bulk.addEventListener('click',onBulk);
  document.querySelectorAll('.ov').forEach(o=>{ o.addEventListener('click',e=>{ if(e.target===o||e.target.closest('[data-close]')) closeOv(o); }); });
  document.getElementById('fTent').addEventListener('submit',e=>{ e.preventDefault(); saveTent(); });
  document.getElementById('chs').addEventListener('click',e=>{ const b=e.target.closest('.chn'); if(!b) return; document.querySelectorAll('#chs .chn').forEach(x=>x.setAttribute('aria-checked',String(x===b))); });
  const pick=()=>document.getElementById('evIn').click();
  document.getElementById('evBtn').onclick=pick; document.querySelector('#evF .file').onclick=e=>{ e.preventDefault(); pick(); };
  document.getElementById('evIn').onchange=e=>{ const f=e.target.files[0]; if(!f) return; if(f.size>10*1024*1024){ toast('Arquivo maior que 10 MB',{err:true}); return; } evFile=f; document.getElementById('evName').textContent=f.name; evState(); };
  const md=document.getElementById('mdT'); md.onclick=()=>{ const box=document.getElementById('md'); box.hidden=!box.hidden; md.setAttribute('aria-expanded',String(!box.hidden)); md.querySelector('.chev').style.transform=box.hidden?'':'rotate(180deg)'; };
  document.getElementById('fImp').addEventListener('submit',e=>{ e.preventDefault(); sendImp(); }); document.getElementById('iIn').onchange=e=>{ addFiles(e.target.files); e.target.value=''; };
  document.getElementById('fDem').addEventListener('submit',e=>{ e.preventDefault(); saveDem(); });
  document.getElementById('fAdd').addEventListener('submit',e=>{ e.preventDefault(); saveAdd(); });
  document.querySelector('#ovCfg .tabs').addEventListener('click',e=>{ const b=e.target.closest('[data-tab]'); if(b) cfgTab(b.dataset.tab); });
  document.querySelectorAll('.proto [data-th]').forEach(b=>b.onclick=()=>setTheme(b.dataset.th));
  let th=null; try{ th=localStorage.getItem('fp-theme'); }catch(err){} setTheme(th||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
}
function setTheme(t){ document.querySelectorAll('.fp').forEach(el=>el.classList.toggle('dk',t==='dark')); document.body.classList.toggle('dk',t==='dark');
  document.querySelectorAll('.proto [data-th]').forEach(b=>b.classList.toggle('on',b.dataset.th===t)); try{ localStorage.setItem('fp-theme',t); }catch(err){} }

function setView(v){ S.view=v; const k=v==='kanban';
  document.getElementById('vList').hidden=k; document.getElementById('vKan').hidden=!k; document.getElementById('frow').hidden=!S.fltOpen;
  const b=document.getElementById('bView'); b.innerHTML=`<span class="msr">${k?'view_list':'view_kanban'}</span>`; b.dataset.tip=k?'Ver em lista':'Ver em kanban'; b.setAttribute('aria-label',b.dataset.tip);
  if(k){ S.sel.clear(); } refresh(); try{ history.replaceState(null,'',k?'#kanban':'#lista'); }catch(err){} }

function mountScreen(){
  wireCommon();
  mount(document.getElementById('frow'),H.filters);
  mountTable(document.getElementById('tbl'));
  const kb=document.getElementById('kan'); mount(kb,H.kanban); wireKanban(kb);
  const rail=document.getElementById('rail'); mount(rail,()=>{ const t=tk(S.cur)||S.tickets[0]; return H.rail(t); });
  const ind=document.getElementById('ind'); mount(ind,H.indicators);
  mount(document.getElementById('count'),()=>{ const v=visible().length; return n2(v,'ticket','tickets')+(v!==S.tickets.length?` de ${S.tickets.length}`:''); });
  document.getElementById('bInd').onclick=e=>{ S.indOpen=!S.indOpen; ind.hidden=!S.indOpen; e.currentTarget.setAttribute('aria-pressed',S.indOpen); e.currentTarget.classList.toggle('on',S.indOpen); };
  document.getElementById('bRail').onclick=()=>{ S.railOpen=!S.railOpen; refresh(); syncRail(); };
  document.getElementById('bView').onclick=()=>setView(S.view==='list'?'kanban':'list');
  document.getElementById('bFlt').onclick=e=>{ S.fltOpen=!S.fltOpen; document.getElementById('frow').hidden=!S.fltOpen; e.currentTarget.setAttribute('aria-pressed',S.fltOpen); };
  document.getElementById('q').addEventListener('input',e=>{ S.q=e.target.value; refresh(); });
  syncRail(); updateBulk(); if(location.hash==='#kanban') setView('kanban');
}

window.FP={S,H,tk,mount,mountTable,refresh,wireCommon,wireKanban,setTheme,mountScreen,openImp,openTent,openEv,openDem,openAdd,openCfg,ME};
})();
