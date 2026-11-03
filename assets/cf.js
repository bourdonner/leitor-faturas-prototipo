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
/* triagem stg × v2 (03/11): só faturamentos depois da leitura; status do faturamento e da conta a receber seguem o stg */
const EST={'Aguardando':'b-grey','Em cálculo':'b-grey','Calculado':'b-dark','Falha no cálculo':'b-danger'};
const REC={'Novo':'b-grey','Processando':'b-grey','Emissão pendente':'b-alert','Agrupado':'b-grey','Agendado':'b-grey','Gerando boleto':'b-grey','Próximo':'b-dark','Aberto':'b-dark','Atrasado':'b-danger','Parcelamento':'b-alert','Liquidado':'b-ok','Cancelado':'b-grey','Erro':'b-danger','Sem cobrança':'b-grey','Refaturamento':'b-alert'};
/* status do faturamento (measurement do stg) → rótulo e cor */
const MS={parsed:['Leitura concluída','b-dark'],calculating:['Calculando','b-grey'],calculated:['Calculada','b-dark'],calculation_failed:['Falha no cálculo','b-danger'],
  billing:['Faturando','b-grey'],billing_failed:['Falha ao faturar','b-danger'],completed:['Faturado','b-ok'],completed_no_bill:['Faturado (legado)','b-ok'],
  from_hipatia:['Via Hipatia','b-grey'],archived:['Arquivado','b-grey'],unavailable:['Indisponível','b-alert'],error:['Erro','b-danger']};
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
  far:{n:'Farmácias Farmix Ltda',pj:1,doc:'67.890.123/0001-45',cart:'Carteira Norte',grp:'Grupo Farmix'},
  ana:{n:'Ana Paula Ferreira',pj:0,doc:'456.123.789-32',cart:null,grp:null,reg:1},
  ind:{n:'Indústria Metalúrgica Ponta Ltda',pj:1,doc:'78.901.234/0001-56',cart:'Carteira Sul',grp:'Grupo Ponta'},
  res:{n:'Restaurante Sabor da Serra',pj:1,doc:'89.012.345/0001-67',cart:'Carteira Norte',grp:null},
  joa:{n:'João Pedro Martins',pj:0,doc:'567.234.891-43',cart:'Carteira Cooperados PR',grp:null}
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
  '3011122334':{st:'Em fornecimento',leg:null,ap:'Filial Água Verde',conc:'Força Sul',rede:'Trifásico',sub:'B3',mod:'Geração Distribuída',ger:'Sem produção',comp:'Geração compartilhada',auto:false,saldo:50,man:false,rat:true},
  '3021456789':{st:'Em fornecimento',leg:null,ap:'Casa',conc:'Luz do Vale',rede:'Monofásico',sub:'B1',mod:'Geração Distribuída',ger:'Produção solar',comp:'Autoconsumo local',auto:true,saldo:60,man:false,rat:false},
  '3022567890':{st:'Em fornecimento',leg:'FS-330871',ap:'Galpão 2',conc:'Força Sul',rede:'Trifásico',sub:'A4',mod:'Geração Distribuída',ger:'Sem produção',comp:'Geração compartilhada',auto:false,saldo:60,man:true,rat:true},
  '3023678901':{st:'Fora de fornecimento',leg:null,ap:null,conc:'Luz do Vale',rede:'Trifásico',sub:'B3',mod:'Geração Distribuída',ger:'Sem produção',comp:'Geração compartilhada',auto:false,saldo:50,man:false,rat:false},
  '3024789012':{st:'Em cancelamento',leg:'LV-009912',ap:null,conc:'Luz do Vale',rede:'Bifásico',sub:'B1',mod:'Geração Distribuída',ger:'Sem produção',comp:'Geração compartilhada',auto:false,saldo:12,man:false,rat:true}
};
/* do stg: painéis solares, economia garantida (%) e motivo do faturamento manual */
Object.entries(UCS).forEach(([k,u])=>{ u.sol=u.ger==='Produção solar'; u.eg=u.sub==='A4'?20:u.mod==='Geração Distribuída'&&!u.auto?15:null; });
UCS['3014567891'].mm='Demanda contratada lida à parte (Grupo A)';
UCS['3012233445'].mm='Cobrança junto com a matriz do grupo';
UCS['3022567890'].mm='Rateio externo com a usina do cliente';
/* cidade da UC */
const CID={'3014567890':'Curitiba - PR','3014567891':'São José dos Pinhais - PR','3000451278':'Ponta Grossa - PR','3009876543':'Londrina - PR','3012233445':'Curitiba - PR','3005566778':'Maringá - PR','3017788990':'Cascavel - PR','3003344556':'Guarapuava - PR','3020011223':'Joinville - SC','3011122334':'Curitiba - PR','3021456789':'Colombo - PR','3022567890':'Ponta Grossa - PR','3023678901':'Campo Largo - PR','3024789012':'Foz do Iguaçu - PR'};
/* faturamentos:[id, ref, titular, uc, leitura{st,dt}, concessionária{inj,cons,val}, estudo{st,val,eco,taxa}, receber{st,tit,ven,pag,banco}, revisão, comentários, estado do detalhe] */
/* ms = status do faturamento no stg; sem informar, sai do estudo e da conta a receber */
const R=(id,ref,t,uc,lei,fc,est,rec,rev,cm,e,x={})=>({id,ref,t,uc,lei,fc,est,rec,rev:!!rev,cm:cm||[],e,
  ms:x.ms||(rec?'completed':{'Calculado':'calculated','Em cálculo':'calculating','Falha no cálculo':'calculation_failed'}[est.st]||'parsed'),hip:!!x.hip});
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
  R('FT-10198','Fev/2025','pad','3014567890',{st:'Processado',dt:'24/02/2025'},{inj:2980,cons:2390,val:1288.40},{st:'Calculado',val:1764.12,eco:298.50,taxa:19.90},{st:'Liquidado',tit:'000181220',ven:'05/03/2025',pag:'Boleto',banco:'Sicredi'},0,[],'liquidado'),
  R('FT-10241','Mar/2025','ana','3021456789',{st:'Processado',dt:'26/03/2025'},{inj:620,cons:410,val:238.90},{st:'Calculado',val:298.10,eco:61.40,taxa:9.90},{st:'Aberto',tit:'000184530',ven:'08/04/2025',pag:'Pix',banco:'Banco do Brasil'},0,[],'aberto'),
  R('FT-10242','Mar/2025','ind','3022567890',{st:'Processado',dt:'25/03/2025'},{inj:15800,cons:16450,val:9820.40},{st:'Calculado',val:12904.70,eco:2210.80,taxa:19.90},{st:'Emissão pendente',tit:null,ven:'10/04/2025',pag:'Boleto',banco:'Itaú'},1,
    [{who:'Ana Ribeiro',t:'Rateio externo e faturamento manual: conferir a demanda contratada antes de emitir.',d:'28/03 às 16:40'},{sys:1,t:'Marcado para revisão',d:'28/03 às 16:41',who:'Ana Ribeiro'}],'emissao'),
  R('FT-10243','Mar/2025','res','3023678901',{st:'Processado',dt:'21/03/2025'},{inj:1720,cons:1880,val:1044.20},{st:'Falha no cálculo'},null,1,
    [{sys:1,t:'UC fora de fornecimento: consumo do mês não informado',d:'21/03 às 09:15'}],'falha-calculo'),
  R('FT-10244','Mar/2025','joa','3024789012',{st:'Processado',dt:'27/03/2025'},{inj:380,cons:350,val:201.75},{st:'Calculado',val:236.40,eco:28.30,taxa:9.90},{st:'Sem cobrança',tit:null,ven:null,pag:null,banco:null},0,
    [{who:'Juliana Rocha',t:'UC em cancelamento: último mês sem cobrança.',d:'28/03 às 11:02'}],'liquidado'),
  R('FT-10199','Fev/2025','ofi','3009876543',{st:'Processado',dt:'21/02/2025'},{inj:1380,cons:1410,val:790.12},{st:'Calculado',val:921.30,eco:110.80,taxa:19.90},{st:'Atrasado',tit:'000181544',ven:'05/03/2025',pag:'Boleto',banco:'Sicredi'},1,
    [{sys:1,t:'Marcado para revisão',d:'10/03 às 08:30',who:'Juliana Rocha'}],'atrasado'),
  R('FT-10200','Fev/2025','mar','3000451278',{st:'Processado',dt:'24/02/2025'},{inj:290,cons:270,val:176.40},{st:'Calculado',val:204.90,eco:22.70,taxa:9.90},{st:'Liquidado',tit:'000181302',ven:'07/03/2025',pag:'Pix',banco:'Banco do Brasil'},0,[],'liquidado'),
  R('FT-10201','Fev/2025','ind','3022567890',{st:'Processado',dt:'24/02/2025'},{inj:15200,cons:15900,val:9480.10},{st:'Calculado',val:12450.00,eco:2130.60,taxa:19.90},{st:'Liquidado',tit:'000181388',ven:'10/03/2025',pag:'Boleto',banco:'Itaú'},0,[],'liquidado'),
  R('FT-10202','Fev/2025','cli','3012233445',{st:'Processado',dt:'22/02/2025'},{inj:2050,cons:1990,val:1088.70},{st:'Calculado',val:1301.20,eco:198.40,taxa:19.90},{st:'Aberto',tit:'000181410',ven:'02/04/2025',pag:'Débito automático',banco:'Itaú'},0,[],'aberto'),
  R('FT-10203','Fev/2025','bea','3003344556',{st:'Processado',dt:'27/02/2025'},{inj:520,cons:600,val:598.10},{st:'Calculado',val:640.30,eco:12.40,taxa:9.90},{st:'Sem cobrança',tit:null,ven:null,pag:null,banco:null},0,[],'liquidado'),
  R('FT-10160','Jan/2025','pad','3014567891',{st:'Processado',dt:'27/01/2025'},{inj:8100,cons:7700,val:5020.30},{st:'Calculado',val:6705.20,eco:1140.10,taxa:19.90},{st:'Liquidado',tit:'000179870',ven:'05/02/2025',pag:'Boleto',banco:'Sicredi'},0,[],'liquidado'),
  R('FT-10161','Jan/2025','res','3023678901',{st:'Processado',dt:'22/01/2025'},{inj:1690,cons:1810,val:1012.80},{st:'Calculado',val:1190.40,eco:160.20,taxa:19.90},{st:'Atrasado',tit:'000179911',ven:'05/02/2025',pag:'Boleto',banco:'Sicredi'},1,
    [{who:'Carlos Mendes',t:'Cliente pediu segunda via; UC saiu de fornecimento em março.',d:'20/02 às 15:12'}],'atrasado')
];
/* status que vieram do stg na triagem de 03/11 */
ROWS.push(
  R('FT-10204','Fev/2025','raf','3005566778',{st:'Processado',dt:'26/02/2025'},{inj:250,cons:236,val:158.30},{st:'Calculado',val:181.20,eco:20.40,taxa:9.90},null,0,[],'estudo',{ms:'billing'}),
  R('FT-10205','Fev/2025','mer','3017788990',{st:'Processado',dt:'26/02/2025'},{inj:1930,cons:1850,val:978.40},{st:'Calculado',val:1150.60,eco:170.30,taxa:19.90},null,1,
    [{sys:1,t:'Falha ao faturar: titular sem forma de pagamento',d:'27/02 às 07:40'}],'estudo',{ms:'billing_failed'}),
  R('FT-10206','Fev/2025','esc','3020011223',{st:'Processado',dt:'27/02/2025'},{inj:5050,cons:5390,val:3040.20},{st:'Calculado',val:3610.80,eco:540.10,taxa:19.90},null,0,
    [{sys:1,t:'Arquivado: fatura duplicada',d:'03/03 às 10:12',who:'Ana Ribeiro'}],'estudo',{ms:'archived'}),
  R('FT-10207','Fev/2025','far','3011122334',{st:'Indisponível',dt:null},null,{st:'Aguardando'},null,0,
    [{sys:1,t:'Fatura indisponível no portal da concessionária',d:'25/02 às 06:00'}],'aguardando',{ms:'unavailable'}),
  R('FT-10208','Fev/2025','ana','3021456789',{st:'Erro',dt:null},null,{st:'Aguardando'},null,0,
    [{sys:1,t:'Erro ao acessar a conta da concessionária',d:'26/02 às 06:00'}],'aguardando',{ms:'error'}),
  R('FT-10209','Fev/2025','joa','3024789012',{st:'Processado',dt:'25/02/2025'},{inj:360,cons:340,val:196.10},{st:'Calculado',val:229.80,eco:27.10,taxa:9.90},null,0,[],'estudo',{ms:'from_hipatia',hip:1}),
  R('FT-10120','Dez/2024','pad','3014567890',{st:'Processado',dt:'23/12/2024'},{inj:2850,cons:2300,val:1240.10},{st:'Calculado',val:1701.30,eco:285.20,taxa:19.90},{st:'Liquidado',tit:'000177010',ven:'05/01/2025',pag:'Boleto',banco:'Sicredi'},0,[],'liquidado',{ms:'completed_no_bill'}),
  R('FT-10162','Jan/2025','cli','3012233445',{st:'Processado',dt:'22/01/2025'},{inj:2010,cons:1960,val:1070.30},{st:'Em cálculo'},null,0,[],'lida',{ms:'parsed'}),
  R('FT-10163','Jan/2025','far','3011122334',{st:'Processado',dt:'24/01/2025'},{inj:4100,cons:3900,val:2270.40},{st:'Calculado',val:2750.10,eco:395.60,taxa:19.90},{st:'Agrupado',tit:'000179955',ven:'10/02/2025',pag:'Boleto',banco:'Itaú'},0,[],'aberto'),
  R('FT-10164','Jan/2025','ofi','3009876543',{st:'Processado',dt:'21/01/2025'},{inj:1400,cons:1380,val:801.50},{st:'Calculado',val:935.20,eco:115.40,taxa:19.90},{st:'Parcelamento',tit:'000179962',ven:'05/04/2025',pag:'Boleto',banco:'Sicredi'},0,
    [{who:'Juliana Rocha',t:'Parcelado em 3x a pedido do cooperado.',d:'15/02 às 11:20'}],'atrasado'),
  R('FT-10165','Jan/2025','mar','3000451278',{st:'Processado',dt:'24/01/2025'},{inj:300,cons:275,val:179.80},{st:'Calculado',val:208.40,eco:23.10,taxa:9.90},{st:'Refaturamento',tit:'000179980',ven:'07/02/2025',pag:'Pix',banco:'Banco do Brasil'},1,
    [{sys:1,t:'Refaturamento aberto após recálculo',d:'12/02 às 09:00'}],'aberto'),
  R('FT-10166','Jan/2025','raf','3005566778',{st:'Processado',dt:'27/01/2025'},{inj:255,cons:238,val:159.10},{st:'Calculado',val:184.90,eco:20.80,taxa:9.90},{st:'Cancelado',tit:'000179991',ven:'07/02/2025',pag:'Pix',banco:'Banco do Brasil'},0,[],'liquidado')
);
/* resumo: saldo de créditos (meses) e data de pagamento */
const SAL={'FT-10231':12,'FT-10232':9,'FT-10233':4,'FT-10234':0,'FT-10235':7,'FT-10236':3,'FT-10237':6,'FT-10238':2,'FT-10239':10,'FT-10240':8,'FT-10198':11,'FT-10241':5,'FT-10242':14,'FT-10243':0,'FT-10244':1,'FT-10199':0,'FT-10200':4,'FT-10201':13,'FT-10202':6,'FT-10203':2,'FT-10160':12,'FT-10161':0};
const PAGO={'FT-10235':'01/04/2025','FT-10198':'03/03/2025','FT-10200':'06/03/2025','FT-10201':'10/03/2025','FT-10160':'04/02/2025','FT-10120':'04/01/2025'};
const HOJE=new Date(2025,3,2);
const toD=d=>{ const [a,b,c]=d.split('/').map(Number); return new Date(c,b-1,a); };
const dias=d=>Math.round((HOJE-toD(d))/864e5);
const addD=(d,n)=>{ const x=toD(d); x.setDate(x.getDate()+n); return x.toLocaleDateString('pt-BR'); };
const pct=n=>n.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';
const S={sel:new Set(),cur:'FT-10232',railOpen:true,fltOpen:false,q:'',f:{},xf:new Set(),dw:null,fold:new Set(),sort:{k:'ref',dir:'desc'}};
const row=id=>ROWS.find(r=>r.id===id);
const MES=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const refN=s=>{ const [m,a]=s.split('/'); return +a*12+MES.indexOf(m); };

/* datas de criação, coleta e atualização (filtros do stg) */
ROWS.forEach(r=>{ const base=r.lei.dt||'25/02/2025'; r.col=r.lei.dt; r.cri=addD(base,-1); r.upd=r.cm.length?addD(base,3):addD(base,1); });
/* dados extras da fatura da concessionária (stg): ponta e fora de ponta, injeção externa, saldo a expirar, compensação */
const FCX=r=>{ const f=r.fc; if(!f) return null; const u=UCS[r.uc];
  const cp=Math.round(f.cons*.18), ip=Math.round(f.inj*.06), ext=u.rat?Math.round(f.inj*.25):0;
  return {cp,cf:f.cons-cp,ip,ifp:f.inj-ip,ext,comp:Math.min(f.inj+ext,f.cons),exp:Math.round((SAL[r.id]||0)*f.inj*.04)}; };

/* etapa: 0 leitura · 1 estudo · 2 conta a receber */
const FAIL_MS=['calculation_failed','billing_failed','error'], FAIL_REC=['Atrasado','Erro'], DONE_REC=['Liquidado','Sem cobrança','Cancelado'];
const etapa=r=>({unavailable:0,error:0,parsed:1,calculating:1,calculated:1,calculation_failed:1,from_hipatia:1,archived:-1}[r.ms] ?? 2);
const fase=r=>r.ms==='archived'?'Arquivado':['Leitura','Estudo','Conta a receber'][etapa(r)];
const statusTxt=r=>r.rec&&r.ms!=='archived'?r.rec.st:MS[r.ms][0];
const valor=r=>r.est&&r.est.val!=null?r.est.val:r.fc?r.fc.val:0;

/* ---------- peças ---------- */
const H={};
H.badge=(txt,map)=>`<span class="bdg ${map[txt]||'b-grey'}">${esc(txt)}</span>`;
H.stat=r=>r.rec&&r.ms!=='archived'?H.badge(r.rec.st,REC):`<span class="bdg ${MS[r.ms][1]}">${esc(MS[r.ms][0])}</span>`;
/* pontos da etapa: anteriores em verde, atual escura (vermelha se falhou), seguintes apagadas; arquivado fica todo apagado */
H.steps=r=>{ const i=etapa(r);
  const fail=FAIL_MS.includes(r.ms)||(r.rec&&FAIL_REC.includes(r.rec.st)), done=r.ms==='completed_no_bill'||(r.rec&&DONE_REC.includes(r.rec.st));
  return `<span class="steps" aria-hidden="true">${[0,1,2].map(k=>`<i class="${i<0?'':k<i||done?'d':k===i?(fail?'e':'c'):''}"></i>`).join('')}</span>`; };
H.tit=r=>{ const t=TIT[r.t]; return `<div class="ent"><span class="ic ${t.pj?'':'pf'}"><span class="msr fill">${t.pj?'bolt':'person'}</span></span><div class="t"><div>${esc(t.n.toUpperCase())}</div><div class="s">${esc(t.doc)}</div></div>${t.grp?`<button class="grp" data-a="grupo" data-v="${esc(t.grp)}" title="${esc(t.grp)}" aria-label="Abrir ${esc(t.grp)}"><span class="msr fill">groups</span></button>`:''}</div>`; };
H.ust=u=>{ const s=UST[u.st]; return `<span class="ust ${s[0]}" title="${u.st}" aria-label="${u.st}"><span class="msr fill">${s[1]}</span></span>`; };
H.uc=r=>`<div class="ent">${H.ust(UCS[r.uc])}<div class="t"><div>${r.uc}</div><div class="s">${esc(CID[r.uc])}</div></div></div>`;
H.est=r=>H.badge(r.est.st,EST);
const sortBtn=(k,l)=>{ const on=S.sort.k===k; return `<button class="so${on?' on':''}" data-a="sortby" data-k="${k}" aria-label="Ordenar por ${l}">${l}<span class="msr">${on?(S.sort.dir==='asc'?'arrow_upward':'arrow_downward'):'import_export'}</span></button>`; };

const COLS=[
 {k:'ck',w:'48px',h:()=>{ const v=visible(); const n=v.filter(r=>S.sel.has(r.id)).length; const st=n===0?'':n===v.length?'on':'mid'; return `<button class="cbx ${st}" data-a="selall" role="checkbox" aria-checked="${n===0?'false':n===v.length?'true':'mixed'}" aria-label="Selecionar todos">${st==='on'?'<span class="mss">check</span>':''}</button>`; },
   c:r=>`<button class="cbx ${S.sel.has(r.id)?'on':''}" data-a="sel" data-id="${r.id}" role="checkbox" aria-checked="${S.sel.has(r.id)}" aria-label="Selecionar ${r.id}">${S.sel.has(r.id)?'<span class="mss">check</span>':''}</button>`},
 {k:'ref',w:'110px',h:()=>sortBtn('ref','Ref.'),c:r=>r.ref},
 {k:'tit',w:'minmax(240px,1fr)',h:()=>sortBtn('tit','Titular'),c:H.tit,cel:1},
 {k:'uc',w:'minmax(220px,1fr)',h:()=>'Unidade consumidora',c:H.uc,cel:1},
 {k:'est',w:'150px',h:()=>'Estudo',c:H.est},
 {k:'eta',w:'160px',h:()=>'Etapa',c:r=>`<div class="two eta">${H.steps(r)}<span>${fase(r)}</span></div>`},
 {k:'rec',w:'170px',h:()=>'Status',c:H.stat},
 {k:'rev',w:'48px',h:()=>'<span class="msr" title="Revisão manual" aria-label="Revisão manual">flag</span>',c:r=>r.rev?'<span class="rvf" title="Revisão manual" aria-label="Revisão manual"><span class="msr fill">flag</span></span>':''},
 {k:'act',w:'56px',h:()=>'',c:r=>`<button class="more" data-a="rowmenu" data-id="${r.id}" aria-label="Ações de ${r.id}" aria-haspopup="menu"><span class="msr">more_horiz</span></button>`}
];

/* ---------- filtros: os principais ficam na linha; os do stg entram por "Mais filtros" ---------- */
const uniq=a=>[...new Set(a.filter(Boolean))];
const PER=['Últimos 7 dias','Últimos 30 dias','Mais de 30 dias'];
const perM=(d,v)=>!!d&&v.some(p=>p===PER[0]?dias(d)<=7:p===PER[1]?dias(d)<=30:dias(d)>30);
const FLT=[
 {k:'rev',l:'Revisão',o:['Revisão manual','Sem revisão'],m:(r,v)=>v.includes(r.rev?'Revisão manual':'Sem revisão')},
 {k:'ref',l:'Referência',o:()=>uniq(ROWS.map(r=>r.ref)).sort((a,b)=>refN(b)-refN(a)),m:(r,v)=>v.includes(r.ref)},
 {k:'fase',l:'Fase',o:['Leitura','Estudo','Conta a receber','Arquivado'],m:(r,v)=>v.includes(fase(r))},
 {k:'st',l:'Status',o:()=>[...Object.values(MS).map(x=>x[0]).filter(x=>x!=='Faturado'),...Object.keys(REC)],m:(r,v)=>v.includes(statusTxt(r))},
 {k:'est',l:'Estudo',o:Object.keys(EST),m:(r,v)=>v.includes(r.est.st)},
 {k:'rec',l:'Conta a receber',o:['Sem conta a receber',...Object.keys(REC)],m:(r,v)=>v.includes(r.rec?r.rec.st:'Sem conta a receber')},
 {k:'cart',l:'Carteira',o:CARTS,m:(r,v)=>v.includes(TIT[r.t].cart)},
 {k:'conc',l:'Concessionária',o:CONCS,m:(r,v)=>v.includes(UCS[r.uc].conc)},
 {k:'man',l:'Faturamento',o:['Manual','Automático'],m:(r,v)=>v.includes(UCS[r.uc].man?'Manual':'Automático')},
 /* extras (stg) */
 {k:'stt',x:1,l:'Status do titular',o:['Ativo','Em processo de registro'],m:(r,v)=>v.includes(TIT[r.t].reg?'Em processo de registro':'Ativo')},
 {k:'stu',x:1,l:'Status da UC',o:Object.keys(UST),m:(r,v)=>v.includes(UCS[r.uc].st)},
 {k:'ncr',x:1,t:'txt',l:'Nº da conta a receber',ph:'Ex.: 000184512',m:(r,v)=>!!(r.rec&&r.rec.tit&&r.rec.tit.includes(v[0]))},
 {k:'ven',x:1,t:'date',l:'Vencimento',m:(r,v)=>!!(r.rec&&r.rec.ven===v[0])},
 {k:'gt',x:1,l:'Grupo tarifário',o:()=>uniq(Object.values(UCS).map(u=>u.sub)).sort(),m:(r,v)=>v.includes(UCS[r.uc].sub)},
 {k:'cg',x:1,l:'Com grupo de titulares',o:['Sim','Não'],m:(r,v)=>v.includes(TIT[r.t].grp?'Sim':'Não')},
 {k:'dcr',x:1,l:'Data de criação',o:PER,m:(r,v)=>perM(r.cri,v)},
 {k:'dat',x:1,l:'Data de atualização',o:PER,m:(r,v)=>perM(r.upd,v)},
 {k:'dco',x:1,l:'Data de coleta',o:PER,m:(r,v)=>perM(r.col,v)},
 {k:'uni',x:1,l:'Unidade',o:()=>Object.keys(UCS),m:(r,v)=>v.includes(r.uc)},
 {k:'tit',x:1,l:'Titular',o:()=>Object.values(TIT).map(t=>t.n).sort(),m:(r,v)=>v.includes(TIT[r.t].n)},
 {k:'gti',x:1,l:'Grupo de titulares',o:()=>uniq(Object.values(TIT).map(t=>t.grp)).sort(),m:(r,v)=>v.includes(TIT[r.t].grp)}
];
const opts=f=>typeof f.o==='function'?f.o():f.o;
const SORT={ref:(a,b)=>refN(a.ref)-refN(b.ref)||a.id.localeCompare(b.id),tit:(a,b)=>TIT[a.t].n.localeCompare(TIT[b.t].n,'pt-BR'),val:(a,b)=>valor(a)-valor(b)};
function visible(){ const q=S.q.trim().toLowerCase();
  const v=ROWS.filter(r=>{ const t=TIT[r.t], u=UCS[r.uc];
    if(q&&![r.id,r.ref,t.n,t.doc,r.uc,u.leg,u.ap,u.conc,CID[r.uc],r.rec&&r.rec.tit].join(' ').toLowerCase().includes(q)) return false;
    for(const f of FLT){ const v=S.f[f.k]; if(v&&v.length&&!f.m(r,v)) return false; } return true; });
  const s=SORT[S.sort.k]; v.sort((a,b)=>S.sort.dir==='asc'?s(a,b):s(b,a)); return v; }

H.filters=()=>FLT.filter(f=>!f.x||S.xf.has(f.k)).map(f=>{ const v=S.f[f.k]||[]; const has=v.length>0;
  return `<button class="flt ${has?'has':''}" data-a="flt" data-k="${f.k}" aria-haspopup="dialog"><span class="lb">${f.l}</span>${has?'<span class="sep"></span>'+v.slice(0,2).map(x=>`<span class="chip">${esc(x)}</span>`).join('')+(v.length>2?`<span class="exc">+${v.length-2}</span>`:'')+`<span class="x" data-a="fclr" data-k="${f.k}" role="button" aria-label="Limpar ${f.l}"><span class="msr">close</span></span>`:'<span class="msr">expand_more</span>'}</button>`; }).join('')
  +(FLT.some(f=>f.x&&!S.xf.has(f.k))?'<button class="flt more-f" data-a="morefl" aria-haspopup="menu"><span class="msr">add</span><span class="lb">Mais filtros</span></button>':'')
  +(Object.values(S.f).some(v=>v&&v.length)?'<button class="fclear" data-a="fclrall">Limpar filtros</button>':'');
H.table=()=>{ const gt=COLS.map(c=>c.w).join(' '); const v=visible();
  const head=`<div class="tr th" role="row" style="grid-template-columns:${gt}">${COLS.map(c=>`<div role="columnheader" class="c-${c.k}">${c.h()}</div>`).join('')}</div>`;
  const rows=v.map(r=>`<div class="tr row ${S.sel.has(r.id)?'is-sel':''} ${S.railOpen&&S.cur===r.id?'cur':''}" role="row" tabindex="0" data-a="row" data-id="${r.id}" style="grid-template-columns:${gt}">${COLS.map(c=>`<div role="cell" class="c-${c.k}${c.cel?' cel':''}">${c.c(r)}</div>`).join('')}</div>`).join('');
  return head+(rows||'<div class="empty">Nenhum faturamento com esses filtros.</div>'); };

/* ---------- resumo ---------- */
const IT=o=>`<div class="rs-it${o.cpt?' cpt':''}${o.dst?' dst':''}">${o.cpt?'':`<span class="ci ${o.cls||''}"><span class="msr fill${o.spin?' spin':''}">${o.ic}</span></span>`}<div class="grow"><div class="lb">${o.l}</div><div class="v ${o.tone||''}">${o.tone==='na'?'Indisponível':`<span>${o.v}</span>`}${o.x&&o.tone!=='na'?`<i></i><span class="x">${o.x}</span>`:''}</div></div>${o.tone==='na'?'':o.act||''}</div>`;
const two=(a,b)=>`<div class="rs-two">${a}${b}</div>`;
const cp=(v,lbl)=>`<button class="ib" data-a="copy" data-v="${esc(v)}" aria-label="Copiar ${lbl}"><span class="msr">content_copy</span></button>`;
const lk=(msg,lbl)=>`<button class="ib" data-a="toast" data-msg="${esc(msg)}" aria-label="${esc(lbl)}"><span class="msr">open_in_new</span></button>`;
const FOLDS=['tit','uc','fc','est','rec','cm'];
const fold=(k,ttl)=>`<button class="ib" data-a="fold" data-k="${k}" aria-label="${S.fold.has(k)?'Expandir':'Recolher'} ${ttl}" aria-expanded="${!S.fold.has(k)}"><span class="msr chev">expand_less</span></button>`;
const shut=k=>S.fold.has(k)?' closed':'';
const kv=rows=>`<div class="kvl">${rows.map(x=>`<div><span>${x[0]}</span><b class="${x[2]||''}">${x[1]}</b></div>`).join('')}</div>`;
const cl=(k,inner)=>`<div class="rs-cl"${S.fold.has(k)?' inert':''}><div class="rs-in">${inner}</div></div>`;
const card=(k,h,body,keep)=>{ const main=keep&&body.endsWith(keep)?body.slice(0,-keep.length):body;
  return `<section class="rs-card${shut(k)}" data-fold="${k}" aria-label="${esc(h.t)}"><div class="rs-hd${h.big?'':' sm'}"><span class="eb${h.off?' off':''}"><span class="msr fill">${h.ic}</span></span><div class="t"><b>${esc(h.t)}</b>${h.d?`<span class="cap">${esc(h.d)}</span>`:''}</div>${h.open||''}${fold(k,h.t.toLowerCase())}</div><div class="rs-bd${keep?' keep':''}">${main?cl(k,main):''}${keep||''}</div></section>`; };
H.rbar=()=>{ const all=FOLDS.every(k=>!S.fold.has(k)); return `<div class="rbar"><span class="msr">article_shortcut</span><span class="grow">Resumo do faturamento</span><button class="ib tip" data-a="foldall" data-tip="${all?'Recolher tudo':'Expandir tudo'}" aria-label="${all?'Recolher todas as seções':'Expandir todas as seções'}"><span class="msr">${all?'unfold_less':'unfold_more'}</span></button></div>`; };
/* topo: faixa "Revisão manual" (se pedida) + fatura de ref. com status e ações */
H.head=r=>`<section class="rs-card rs-fat">${r.rev?'<div class="rs-rev" role="status"><span class="grow">Revisão manual</span><span class="msr fill">flag</span></div>':''}
  <div class="rs-tk"><div class="row"><b>${r.ref}</b>${H.stat(r)}<button class="more" data-a="rowmenu" data-id="${r.id}" aria-label="Ações do faturamento" aria-haspopup="menu"><span class="msr">more_horiz</span></button></div>
  ${r.rev?`<button class="b sec full" data-a="revoff" data-id="${r.id}">Marcar como revisado</button>`:''}<a class="b pri full" href="faturamento-detalhe.html?estado=${r.e}" style="text-decoration:none">Abrir detalhamento</a></div></section>`;
H.titP=r=>{ const t=TIT[r.t];
  return card('tit',{ic:t.pj?'work':'person',t:t.n,d:'Titular',big:1,open:lk('Abriria o cadastro do titular','Abrir cadastro do titular')},
    (t.reg?IT({ic:'how_to_reg',cls:'al',l:'Status',v:'Em processo de registro'}):IT({ic:'check',cls:'ok',l:'Status',v:'Ativo'}))
    +IT({ic:'badge',l:t.pj?'CNPJ':'CPF',v:t.doc,act:cp(t.doc,t.pj?'CNPJ':'CPF')})
    +IT({ic:'groups',l:'Grupo',v:t.grp?esc(t.grp):'Titular não vinculado a um grupo',act:t.grp?`<button class="ib" data-a="grupo" data-v="${esc(t.grp)}" aria-label="Abrir ${esc(t.grp)}"><span class="msr">open_in_new</span></button>`:''})
    +IT({ic:'wallet',l:'Carteira',v:t.cart?esc(t.cart):'Titular não vinculado a uma carteira',act:t.cart?lk('Abriria a '+t.cart,'Abrir carteira'):''})); };
const UCI={on:['check','ok'],off:['power_off','al'],can:['block','dg']};
H.ucP=r=>{ const u=UCS[r.uc]; const s=UCI[UST[u.st][0]];
  const dst=(u.rat?IT({dst:1,ic:'call_split',cls:'al',l:'Rateio externo',v:'Ativo'}):'')+(u.man?IT({dst:1,ic:'edit_note',cls:'al',l:'Faturamento manual',v:u.mm?esc(u.mm):'Ativo'}):'');
  return card('uc',{ic:'electric_meter',t:r.uc,d:'Unidade consumidora'+(u.ap?' · '+u.ap:''),big:1,open:`<button class="ib" data-a="ucdw" data-id="${r.id}" aria-label="Detalhes e configurações da UC"><span class="msr">open_in_new</span></button>`},
    IT({ic:s[0],cls:s[1],l:'Status',v:u.st})
    +IT({ic:'electrical_services',l:'Distribuidora',v:esc(u.conc),act:lk('Abriria a distribuidora '+u.conc,'Abrir distribuidora')})
    +IT({ic:'offline_bolt',l:'Saldo máximo',v:u.saldo+' meses',act:`<button class="ib" data-a="ucdw" data-id="${r.id}" aria-label="Ver configurações de saldo"><span class="msr">open_in_new</span></button>`})
    +IT({ic:'energy_savings_leaf',l:'Modalidade',v:esc(u.mod)})
    +two(IT({cpt:1,l:'Painéis solares',v:u.sol?'Sim':'Não'}),IT({cpt:1,l:'Economia garantida',v:u.eg?pct(u.eg):'Não tem'}))+dst, dst); };
H.fcP=r=>{ const u=UCS[r.uc], f=r.fc||{inj:0,cons:0,val:0}, x=FCX(r)||{}, na=!r.fc||r.lei.st!=='Processado'?'na':'';
  return card('fc',{ic:'receipt_long',t:'Fatura da concessionária',off:!!na},
    (r.hip?IT({ic:'cloud_sync',cls:'bl',l:'Origem',v:'Via Hipatia'}):'')
    +IT({ic:'event',l:'Data da leitura',v:r.lei.dt||'—',tone:na})
    +(u.ger==='Produção solar'?IT({ic:'solar_power',cls:'al',l:'Produção solar',v:kwh(Math.round(f.inj*1.08)),tone:na}):'')
    +IT({ic:'bolt',l:'Consumo',v:kwh(f.cons),tone:na})
    +two(IT({cpt:1,l:'Consumo ponta',v:kwh(x.cp||0),tone:na}),IT({cpt:1,l:'Consumo fora ponta',v:kwh(x.cf||0),tone:na}))
    +two(IT({ic:'incomplete_circle',l:'Injeção',v:kwh(f.inj),tone:na}),IT({ic:'trending_up',l:'Taxa de injeção',v:f.cons?pct(Math.round(f.inj/f.cons*100)):'—',tone:na}))
    +two(IT({cpt:1,l:'Injeção ponta',v:kwh(x.ip||0),tone:na}),IT({cpt:1,l:'Injeção fora ponta',v:kwh(x.ifp||0),tone:na}))
    +IT({ic:'call_split',l:'Injeção externa',v:kwh(x.ext||0),tone:na})
    +IT({ic:'sync_alt',l:'Compensação',v:kwh(x.comp||0),tone:na})
    +IT({ic:'payments',l:'Valor da fatura',v:brl(f.val),tone:na,act:cp(brl(f.val),'valor da fatura')})
    +two(IT({ic:'offline_bolt',l:'Saldo',v:n2(SAL[r.id]||0,'mês','meses'),tone:na,act:lk('Abriria o extrato de saldo','Abrir saldo')}),IT({ic:'hourglass_bottom',cls:x.exp?'al':'',l:'Saldo a expirar',v:kwh(x.exp||0),tone:na}))); };
H.estP=r=>{ const e=r.est, ok=e.val!=null, na=ok?'':'na', pos=ok?'':'na', x=FCX(r)||{};
  const proj=ok?e.val+e.eco:0, amb=ok?e.val*.012:0, ver=ok?e.val*.03:0;
  const st=e.st==='Em cálculo'?IT({ic:'progress_activity',cls:'bl',spin:1,l:'Status',v:'Calculando o estudo'})
    :e.st==='Falha no cálculo'?IT({ic:'block',cls:'dg',l:'Falha no cálculo',v:esc((r.cm.find(c=>c.sys)||{}).t||'Não foi possível calcular')})
    :e.st==='Aguardando'?IT({ic:'hourglass_empty',cls:'gr',l:'Status',v:'Aguardando a fatura da concessionária'}):'';
  return card('est',{ic:'calculate',t:'Estudo',off:!ok},
    st+two(IT({cpt:1,l:'Valor projetado',v:brl(proj),tone:na}),IT({cpt:1,l:'Valor total',v:brl(e.val),tone:na}))
    +IT({ic:'sync_alt',l:'Taxa de compensação',v:ok&&r.fc?pct(Math.round(x.comp/r.fc.cons*1000)/10):'—',tone:na})
    +IT({ic:'flag',cls:'al',l:'Bandeira tarifária amarela',v:brl(amb),x:'12 dias',tone:na})
    +IT({ic:'flag',cls:'dg',l:'Bandeira tarifária vermelha',v:brl(ver),x:'18 dias',tone:na})
    +IT({ic:'savings',l:'Desconto total',v:brl(e.eco),x:ok?pct(e.eco/proj*100):'',tone:pos})
    +two(IT({cpt:1,l:'Desc. energia injetada',v:brl(ok?e.eco-e.taxa:0),tone:pos}),IT({cpt:1,l:'Desconto titular',v:TIT[r.t].pj?'10%':'15%',tone:pos}))
    +(e.st==='Falha no cálculo'?'<button class="b sec full" data-a="genstudy" data-id="'+r.id+'">Gerar estudo</button>':'')); };
H.recP=r=>{ const c=r.rec;
  if(!c){ const w={billing:{ic:'progress_activity',cls:'bl',spin:1,v:'Faturando'},billing_failed:{ic:'block',cls:'dg',v:esc((r.cm.find(x=>x.sys)||{}).t||'Falha ao faturar')},calculated:{ic:'hourglass_empty',cls:'gr',v:'Aguardando faturar'},from_hipatia:{ic:'cloud_sync',cls:'bl',v:'Faturado pela Hipatia'},archived:{ic:'archive',cls:'gr',v:'Faturamento arquivado'}}[r.ms]||{ic:'hourglass_empty',cls:'gr',v:'Aguardando estudo'};
    return card('rec',{ic:'request_quote',t:'Conta a receber',off:1},IT({...w,l:'Status'})+IT({ic:'event',l:'Vencimento',tone:'na'})
      +(r.ms==='billing_failed'?'<button class="b sec full" data-a="bill" data-id="'+r.id+'">Faturar de novo</button>':'')); }
  const ST={'Emissão pendente':{ic:'pending_actions',cls:'al',v:'Emissão pendente'},'Gerando boleto':{ic:'progress_activity',cls:'bl',spin:1,v:'O boleto está sendo gerado'},
    'Novo':{ic:'fiber_new',cls:'gr',v:'Conta a receber criada'},'Processando':{ic:'progress_activity',cls:'bl',spin:1,v:'Processando'},'Agrupado':{ic:'groups',cls:'gr',v:'Agrupada no ciclo do grupo'},
    'Agendado':{ic:'schedule',cls:'gr',v:'Emissão agendada'},'Próximo':{ic:'event_upcoming',v:'Vence em breve'},'Parcelamento':{ic:'splitscreen',cls:'al',v:'Em parcelamento'},
    'Cancelado':{ic:'cancel',cls:'gr',v:'Recebimento cancelado'},'Erro':{ic:'error',cls:'dg',v:'Erro na emissão'},'Refaturamento':{ic:'replay',cls:'al',v:'Em refaturamento'},
    'Aberto':{ic:'attach_money',v:'Aguardando pagamento'},'Atrasado':{ic:'attach_money',cls:'dg',v:'Fatura atrasada',x:c.ven?'vencida há '+n2(dias(c.ven),'dia','dias'):''},
    'Liquidado':{ic:'check',cls:'ok',v:'Fatura paga',x:PAGO[r.id]},'Sem cobrança':{ic:'do_not_disturb_on',v:'Faturamento sem cobrança'}}[c.st];
  return card('rec',{ic:'request_quote',t:'Conta a receber'},IT({...ST,l:'Status'})
    +(c.tit?IT({ic:'tag',l:'Nº do título',v:c.tit,act:cp(c.tit,'número do título')}):'')
    +(c.st==='Sem cobrança'?'':IT({ic:'event',cls:c.st==='Atrasado'?'dg':'',l:'Vencimento',v:c.ven||'—'}))); };
H.cm=r=>{ const ev=c=>{ const who=c.who?`<span class="who2" data-name="${esc(c.who)}">${ini(c.who)}</span>`:'<span class="who2 sys" data-name="Sistema"><span class="msr fill">bolt</span></span>';
    return `<div class="ev ${c.isNew?'new':''}"><span class="i ${c.sys?(c.t.includes('revis')?'c-alert':'c-def'):'c-edit'}"><span class="msr fill">${c.sys?(c.t.includes('revis')?'flag':'bolt'):'chat'}</span></span>${who}<div class="n">${esc(c.t)}</div><div class="d">${c.d}</div></div>`; };
  return `<div class="act-p${shut('cm')}" data-fold="cm"><div class="act-h"><span class="grow">Comentários</span><span class="cap">${r.cm.length||''}</span>${fold('cm','comentários')}</div>${cl('cm',`<div class="act-l evs">${r.cm.map((c,i)=>(i?'<div class="lnk"></div>':'')+ev(c)).join('')}</div>
  <form class="cmp" data-id="${r.id}"><label class="sr" for="cmT" style="position:absolute;left:-9999px">Comentário</label><textarea class="ta" id="cmT" placeholder="Escreva um comentário"></textarea><div class="row"><button class="b pri sm" type="submit">Comentar</button></div></form>`)}</div>`; };
/* a barra fica fora da rolagem; só os cards rolam, num espaço com cantos de 12px */
H.rail=r=>H.rbar()+`<div class="rail-sc" id="railSc">${H.head(r)+H.titP(r)+H.ucP(r)+H.fcP(r)+H.estP(r)+H.recP(r)+H.cm(r)}</div>`;
/* degradê do cabeçalho grudado só aparece quando ele está de fato grudado */
function markStuck(){ const sc=document.getElementById('railSc'); if(!sc) return; const top=sc.getBoundingClientRect().top;
  sc.querySelectorAll('.rs-hd,.act-h').forEach(h=>{ const box=h.parentElement.getBoundingClientRect(); h.classList.toggle('stuck',box.top<top-0.5&&h.getBoundingClientRect().top<=top+0.5); }); }

/* ---------- drawer da UC ---------- */
H.drawer=r=>{ const u=UCS[r.uc]; const yn=b=>b?'Sim':'Não';
  return `<div class="dwh"><div class="grow"><div class="cap">Unidade consumidora</div><h2 id="dwT">${r.uc}</h2></div><button class="ib" data-a="dwclose" aria-label="Fechar"><span class="msr">close</span></button></div>
  <div class="dwb">
    <div class="pnl tight" style="padding:16px"><div class="ttl">Detalhes da UC</div>${kv([['Status',u.st],['Concessionária',u.conc],['Código legado',u.leg||'—',u.leg?'':'mut'],['Apelido',u.ap||'—',u.ap?'':'mut'],['Padrão de rede',u.rede],['Subgrupo tarifário',u.sub],['Modalidade',u.mod],['Painéis solares',yn(u.sol)]])}</div>
    <div class="pnl tight" style="padding:16px"><div class="ttl">Configurações</div>${kv([['Faturamento manual',yn(u.man),u.man?'al':''],...(u.man&&u.mm?[['Motivo',esc(u.mm)]]:[]),['Geração',u.ger],['Tipo de compensação',u.comp],['Autoconsumo',yn(u.auto)],['Saldo máximo',u.saldo+' meses'],['Economia garantida',u.eg?pct(u.eg):'Não tem',u.eg?'':'mut'],['Rateio externo',u.rat?'Ativo':'Inativo',u.rat?'al':'']])}</div>
  </div>
  <div class="dwf"><button class="b out" data-a="toast" data-msg="Abriria a instalação no Cadastro"><span class="msr">open_in_new</span>Abrir instalação</button><button class="b pri" data-a="dwclose">Fechar</button></div>`; };
function openDw(id){ S.dw=id; const d=document.getElementById('dw'); d.innerHTML=H.drawer(row(id)); d.classList.add('on'); document.getElementById('dwOv').classList.add('on'); d._ret=document.activeElement; setTimeout(()=>d.querySelector('h2').focus(),0); }
function closeDw(){ const d=document.getElementById('dw'); d.classList.remove('on'); document.getElementById('dwOv').classList.remove('on'); S.dw=null; if(d._ret&&document.contains(d._ret)) d._ret.focus(); }

/* ---------- ações por status (mapa fO do stg, sem "Agendar coleta" no menu) ---------- */
const MACT={calculated:['download','bill','cancel_study','archive'],calculating:['download','archive'],calculation_failed:['genstudy','archive'],parsed:['download','genstudy','archive'],
  billing:['archive'],billing_failed:['bill','archive'],completed:['download','recalc','archive'],completed_no_bill:['archive'],archived:['unarchive'],error:['archive'],
  unavailable:['upload','calcman','archive'],from_hipatia:[]};
const BACT={'Emissão pendente':['issue','due','cancelrec'],'Erro':['issue'],'Aberto':['extend','barcode','cancelrec'],'Atrasado':['extend','barcode','cancelrec'],'Próximo':['extend','barcode','cancelrec'],'Agendado':['due','cancelrec'],'Parcelamento':['barcode']};
const canGroup=r=>r.ms==='completed'&&!!r.rec&&!!TIT[r.t].grp;
const AL={download:['Download da fatura','download'],upload:['Upload da fatura','upload'],genstudy:['Gerar estudo','calculate'],calcman:['Calcular estudo manual','edit_square'],bill:['Faturar','request_quote'],
  cancel_study:['Cancelar estudo','cancel',1],issue:['Emitir cobrança','send'],due:['Alterar vencimento','event'],extend:['Prorrogar vencimento','event_upcoming'],barcode:['Atualizar código de barras','barcode'],
  cancelrec:['Cancelar recebimento','money_off',1],group:['Associar ao ciclo do grupo','groups'],archive:['Arquivar','archive',1],unarchive:['Desarquivar','unarchive']};
const RECALC=[['Ajustar injeção','tune'],['Importar nova fatura','upload_file'],['Recálculo simples','calculate']];
const mi=(l,ic,a,id,o={})=>`<button class="opt${o.dg?' dg':''}" role="menuitem" data-a="${a}" data-id="${id}"${o.t?` data-t="${esc(o.t)}"`:''}><span class="grow">${l}</span><span class="msr">${ic}</span></button>`;
H.menu=r=>{ const m=MACT[r.ms]||[], b=r.rec?BACT[r.rec.st]||[]:[]; const out=[];
  out.push(mi(r.rev?'Marcar como revisado':'Pedir revisão manual',r.rev?'flag':'outlined_flag',r.rev?'revoff':'revon',r.id));
  out.push(mi('Abrir detalhamento','open_in_new','det',r.id),mi('Detalhes e configurações da UC','tune','ucdw',r.id));
  const st=m.filter(k=>!['archive','unarchive','recalc'].includes(k));
  if(st.length) out.push('<div class="sepl"></div>',...st.map(k=>mi(AL[k][0],AL[k][1],k,r.id,{dg:AL[k][2]})));
  if(m.includes('recalc')) out.push('<div class="sepl"></div><div class="ph">Recalcular</div>',...RECALC.map(x=>mi(x[0],x[1],'recalc',r.id,{t:x[0]})));
  if(b.length||canGroup(r)) out.push('<div class="sepl"></div><div class="ph">Conta a receber</div>',...b.map(k=>mi(AL[k][0],AL[k][1],k,r.id,{dg:AL[k][2]})),...(canGroup(r)?[mi(AL.group[0],AL.group[1],'group',r.id)]:[]));
  out.push('<div class="sepl"></div>',mi('Copiar ID','content_copy','copyid',r.id),mi('Copiar link','link','link',r.id));
  if(m.includes('archive')||m.includes('unarchive')) out.push('<div class="sepl"></div>',m.includes('archive')?mi('Arquivar','archive','archive',r.id,{dg:1}):mi('Desarquivar','unarchive','unarchive',r.id));
  return out.join(''); };

/* ---------- ações em lote (regras e mensagens do stg) ---------- */
const all=(rs,fn)=>rs.length>0&&rs.every(fn);
const nao=(n,a,b)=>`${n} ${n===1?'item não '+a:'itens não '+b}`;
const BULK=[
 {k:'revon',l:'Pedir revisão',ic:'flag',ok:()=>true},
 {k:'revoff',l:'Marcar como revisado',ic:'done_all',ok:()=>true},
 {k:'schedule',l:'Agendar coleta',ic:'schedule',ok:rs=>all(rs,r=>['error','unavailable','archived'].includes(r.ms)),why:()=>"Todas as linhas devem ter status 'Erro', 'Indisponível' ou 'Arquivado' para agendar a coleta"},
 {k:'genstudy',l:'Gerar estudo',ic:'calculate',ok:rs=>all(rs,r=>['parsed','calculation_failed'].includes(r.ms)),why:()=>"Todas as linhas devem ter status 'Leitura concluída' ou 'Falha no cálculo' para gerar estudos"},
 {k:'bill',l:'Faturar',ic:'request_quote',ok:rs=>all(rs,r=>['calculated','billing_failed'].includes(r.ms)),why:()=>"Todas as linhas devem ter status 'Calculada' ou 'Falha ao faturar' para serem faturadas"},
 {k:'issue',l:'Emitir',ic:'send',ok:rs=>rs.length>0&&!rs.some(r=>TIT[r.t].grp)&&all(rs,r=>r.rec&&r.rec.st==='Emissão pendente'),why:rs=>{ const a=rs.filter(r=>!r.rec).length; if(a) return nao(a,'possui conta a receber','possuem conta a receber'); const g=rs.filter(r=>TIT[r.t].grp).length; if(g) return `${nao(g,'pode','podem')} ser emitido${g>1?'s':''} sozinho${g>1?'s':''}: titular de grupo emite pelo ciclo do grupo`; const p=rs.filter(r=>r.rec.st!=='Emissão pendente').length; return `Apenas cobranças com status 'Emissão pendente' podem ser emitidas. ${p} ${p===1?'item não é elegível':'itens não são elegíveis'}`; }},
 {k:'group',l:'Associar ao ciclo do grupo',ic:'groups',ok:rs=>all(rs,canGroup),why:rs=>{ const a=rs.filter(r=>r.ms!=='completed').length; if(a) return `Apenas faturamentos com status 'Faturado' podem ser associados. ${a} ${a===1?'item não é elegível':'itens não são elegíveis'}`; const g=rs.filter(r=>!TIT[r.t].grp).length; return `${nao(g,'pode','podem')} ser agrupado${g>1?'s':''} por não ter grupo de titulares`; }},
 {k:'due',l:'Alterar vencimento',ic:'event',ok:rs=>all(rs,r=>r.rec&&r.rec.st==='Emissão pendente'),why:rs=>{ const a=rs.filter(r=>!r.rec).length; return a?nao(a,'possui conta a receber','possuem conta a receber'):"Apenas cobranças com status 'Emissão pendente' podem ter o vencimento alterado"; }},
 {k:'recalc',l:'Recalcular',ic:'calculate',ok:rs=>all(rs,r=>r.ms==='completed'),why:()=>"Apenas faturamentos com status 'Faturado' podem ser recalculados"},
 {k:'archive',l:'Arquivar',ic:'archive',dg:1,ok:rs=>all(rs,r=>(MACT[r.ms]||[]).includes('archive')),why:rs=>{ const n=rs.filter(r=>!(MACT[r.ms]||[]).includes('archive')).length; return `${nao(n,'pode','podem')} ser arquivado${n>1?'s':''}`; }},
 {k:'unarchive',l:'Desarquivar',ic:'unarchive',ok:rs=>all(rs,r=>r.ms==='archived'),why:rs=>{ const n=rs.filter(r=>r.ms!=='archived').length; return `${nao(n,'pode','podem')} ser desarquivado${n>1?'s':''}`; }},
 {k:'exp',l:'Exportar',ic:'download',ok:()=>true}
];
/* lote: ação disponível com rótulo; indisponível vira só ícone, com tooltip (nome + motivo) no hover e no foco */
H.bulk=()=>{ const rs=[...S.sel].map(row); return BULK.map(b=>{ const ok=b.ok(rs);
  return ok?`<button class="b gh${b.dg?' dg':''}" data-bulk="${b.k}"><span class="msr">${b.ic}</span>${b.l}</button>`
    :`<button class="b gh dis ico" data-bulk="${b.k}" aria-disabled="true" aria-label="${esc(b.l)}: ${esc(b.why(rs))}" data-tl="${esc(b.l)}" data-tw="${esc(b.why(rs))}"><span class="msr">${b.ic}</span></button>`; }).join(''); };

const snap=()=>JSON.stringify(ROWS.map(r=>[r.rev,r.cm,r.ms,r.prev||null]));
const restore=s=>{ JSON.parse(s).forEach((x,i)=>{ ROWS[i].rev=x[0]; ROWS[i].cm=x[1]; ROWS[i].ms=x[2]; ROWS[i].prev=x[3]; }); refresh(); };
function setRev(ids,on){ const s=snap(); let n=0;
  ids.forEach(id=>{ const r=row(id); if(r.rev===on) return; n++; r.rev=on; r.cm.push({sys:1,t:on?'Marcado para revisão manual':'Revisão concluída',d:NOW,who:ME,isNew:1}); });
  refresh(); if(n) toast(on?n2(n,'faturamento marcado para revisão manual','faturamentos marcados para revisão manual'):n2(n,'faturamento revisado','faturamentos revisados'),{action:{label:'Desfazer',onClick:()=>restore(s)}}); }
function setArchived(ids,on,obs){ const s=snap();
  ids.forEach(id=>{ const r=row(id); if(on){ r.prev=r.ms; r.ms='archived'; } else { r.ms=r.prev||(r.rec?'completed':'calculated'); r.prev=null; }
    r.cm.push({sys:1,t:(on?'Arquivado':'Desarquivado')+(obs?': '+obs:''),d:NOW,who:ME,isNew:1}); });
  refresh(); toast(on?n2(ids.length,'faturamento arquivado','faturamentos arquivados'):n2(ids.length,'faturamento desarquivado','faturamentos desarquivados'),{action:{label:'Desfazer',onClick:()=>restore(s)}}); }
function setMs(ids,ms,msg,log){ ids.forEach(id=>{ const r=row(id); r.ms=ms; if(ms==='calculating') r.est={st:'Em cálculo'}; if(log) r.cm.push({sys:1,t:log,d:NOW,isNew:1}); }); refresh(); toast(msg); }
const obsPop=(ids,on)=>`<div class="ph">${on?'Arquivar':'Desarquivar'} ${n2(ids.length,'faturamento','faturamentos')}</div><div class="obs"><label for="obsT">Observação opcional</label><textarea class="ta" id="obsT" placeholder="${on?'Ex.: arquivamento pedido após conferência':'Ex.: desarquivado para revisão'}"></textarea><div class="row"><button class="b sec sm" data-a="popclose">Cancelar</button><button class="b ${on?'dgb':'pri'} sm" data-a="${on?'archgo':'unarchgo'}" data-ids="${ids.join(',')}">${on?'Arquivar':'Desarquivar'}</button></div></div>`;

/* ---------- montagem ---------- */
const mounts=[];
function mount(el,fn){ mounts.push({el,fn}); el.innerHTML=fn(); }
function refresh(){ const v=new Set(visible().map(r=>r.id)); [...S.sel].forEach(id=>{ if(!v.has(id)) S.sel.delete(id); });
  const ta=document.getElementById('cmT'); const draft=ta?ta.value:'';
  const sc0=document.getElementById('railSc'), st0=sc0?sc0.scrollTop:0, cur0=S.cur;
  mounts.forEach(m=>{ m.el.innerHTML=m.fn(); });
  const sc1=document.getElementById('railSc'); if(sc1&&S.cur===cur0) sc1.scrollTop=st0; markStuck();
  const ta2=document.getElementById('cmT'); if(ta2&&draft&&ta2.closest('form').dataset.id===S.cur) ta2.value=draft;
  updateBulk(); syncRail(); syncFlt(); }
/* linha de filtros: escondida por padrão; o funil mostra o estado e avisa quando há filtro ativo escondido */
function syncFlt(){ const b=document.getElementById('bFlt'); if(!b) return; document.getElementById('frow').hidden=!S.fltOpen;
  b.setAttribute('aria-pressed',String(S.fltOpen)); b.querySelector('.msr').classList.toggle('fill',S.fltOpen);
  const n=Object.values(S.f).filter(v=>v&&v.length).length; b.classList.toggle('dot',!S.fltOpen&&n>0);
  b.setAttribute('aria-label',(S.fltOpen?'Esconder filtros':'Mostrar filtros')+(n?` (${n} ativo${n>1?'s':''})`:'')); }
function updateBulk(){ const b=document.getElementById('bulk'); const n=S.sel.size; b.classList.toggle('on',n>0); document.getElementById('bulkN').textContent=n2(n,'selecionado','selecionados'); document.getElementById('bulkA').innerHTML=n?H.bulk():''; }
function syncRail(){ const r=document.getElementById('rail'); r.classList.toggle('off',!S.railOpen); r.inert=!S.railOpen; r.setAttribute('aria-hidden',!S.railOpen); const b=document.getElementById('bRail'); b.classList.toggle('on',S.railOpen); b.setAttribute('aria-pressed',S.railOpen);
  b.querySelector('.msr').textContent=S.railOpen?'right_panel_close':'right_panel_open'; b.dataset.tip=S.railOpen?'Minimizar resumo':'Abrir resumo'; b.setAttribute('aria-label',b.dataset.tip); }

let popEl=null, popAnchor=null;
function openPop(anchor,html,opts={}){ closePop(); popEl=document.getElementById('pop'); popEl.innerHTML=html; popEl.hidden=false; popAnchor=anchor; anchor.classList.add('open'); anchor.setAttribute('aria-expanded','true');
  popEl.style.minWidth=(opts.w||224)+'px'; const r=anchor.getBoundingClientRect(); const pw=popEl.offsetWidth, ph=popEl.offsetHeight;
  let x=opts.alignRight?r.right-pw:r.left; x=Math.max(8,Math.min(x,innerWidth-pw-8)); const up=opts.up||r.bottom+ph+8>innerHeight;
  popEl.style.position='fixed'; popEl.style.left=x+'px';
  if(up){ popEl.style.top='auto'; popEl.style.bottom=(innerHeight-r.top+6)+'px'; } else { popEl.style.bottom='auto'; popEl.style.top=(r.bottom+6)+'px'; }
  const f=popEl.querySelector('textarea,input,button'); if(f) f.focus({preventScroll:true}); }
function closePop(){ if(popEl){ popEl.hidden=true; popEl.innerHTML=''; } if(popAnchor){ popAnchor.classList.remove('open'); popAnchor.setAttribute('aria-expanded','false'); popAnchor=null; } }
const sortPop=()=>[['ref','Referência'],['tit','Titular'],['val','Valor']].map(([k,l])=>{ const on=S.sort.k===k; return `<button class="opt" data-a="sortby" data-k="${k}" role="menuitemradio" aria-checked="${on}"><span class="grow">${l}</span>${on?`<span class="msr">${S.sort.dir==='asc'?'arrow_upward':'arrow_downward'}</span>`:''}</button>`; }).join('');
function fltPop(a,f){ const v=S.f[f.k]||[];
  if(f.t==='txt') return openPop(a,`<div class="ph">${f.l}</div><div class="obs"><input class="fin" id="fIn" data-k="${f.k}" inputmode="numeric" placeholder="${esc(f.ph||'')}" value="${esc(v[0]||'')}" aria-label="${f.l}"><div class="row"><button class="b pri sm" data-a="fapply" data-k="${f.k}">Aplicar</button></div></div>`,{w:260});
  if(f.t==='date'){ const iso=v[0]?v[0].split('/').reverse().join('-'):''; return openPop(a,`<div class="ph">${f.l}</div><div class="obs"><input class="fin" type="date" id="fIn" data-k="${f.k}" value="${iso}" aria-label="${f.l}"><div class="row"><button class="b pri sm" data-a="fapply" data-k="${f.k}">Aplicar</button></div></div>`,{w:260}); }
  const o=opts(f);
  openPop(a,`${o.length>6?'<label class="ps"><span class="msr">search</span><input data-a="fsearch" placeholder="Pesquisar" aria-label="Pesquisar opções"></label>':''}<div role="group" aria-label="${f.l}">${o.map(x=>`<button class="opt" data-a="fopt" data-k="${f.k}" data-v="${esc(x)}" role="menuitemcheckbox" aria-checked="${v.includes(x)}"><span class="cbx ${v.includes(x)?'on':''}">${v.includes(x)?'<span class="mss">check</span>':''}</span><span class="grow">${esc(x)}</span></button>`).join('')}</div>`,{w:240}); }
function applyTxt(k){ const i=document.getElementById('fIn'); if(!i) return; let val=i.value.trim(); if(i.type==='date'&&val) val=val.split('-').reverse().join('/'); S.f[k]=val?[val]:[]; closePop(); refresh(); }
const copyTxt=(v,msg)=>{ try{ navigator.clipboard.writeText(v).then(()=>toast(msg||'Copiado',v),()=>toast(v)); }catch(err){ toast(v); } };

let lastRow={id:null,t:0};
/* aplica o estado de recolhido direto no DOM, para a transição acontecer; atualiza chevrons e o "recolher tudo" */
function applyFold(keys){
  keys.forEach(k=>{ const s=document.querySelector('#rail [data-fold="'+k+'"]'); if(!s) return; const shut=S.fold.has(k);
    s.classList.toggle('closed',shut); const c=s.querySelector('.rs-cl'); if(c) c.inert=shut;
    const b=s.querySelector('[data-a="fold"]'); if(b){ b.setAttribute('aria-expanded',String(!shut)); b.setAttribute('aria-label',(shut?'Expandir ':'Recolher ')+(b.getAttribute('aria-label')||'').replace(/^(Expandir|Recolher) /,'')); } });
  const al=FOLDS.every(f=>!S.fold.has(f)), fb=document.querySelector('#rail [data-a="foldall"]');
  if(fb){ fb.dataset.tip=al?'Recolher tudo':'Expandir tudo'; fb.setAttribute('aria-label',al?'Recolher todas as seções':'Expandir todas as seções'); fb.querySelector('.msr').textContent=al?'unfold_less':'unfold_more'; }
  setTimeout(markStuck,320);
}
function onClick(e){
  const a=e.target.closest('[data-a]');
  if(popEl&&!popEl.hidden&&!e.target.closest('#pop')&&!(popAnchor&&popAnchor.contains(e.target))) closePop();
  if(!a) return; const k=a.dataset.a, id=a.dataset.id, r=id?row(id):null;
  switch(k){
    /* duplo clique abre o detalhamento: o 1º clique redesenha a tabela, então o dblclick nativo não chega na linha; compara id e tempo */
    case 'row': { if(matchMedia('(max-width:767px)').matches){ location.href='faturamento-detalhe.html?estado='+row(id).e; break; } const t=Date.now(); if(lastRow.id===id&&t-lastRow.t<450){ lastRow={id:null,t:0}; location.href='faturamento-detalhe.html?estado='+row(id).e; break; } lastRow={id,t}; S.cur=id; S.railOpen=true; refresh(); break; }
    case 'sel': e.stopPropagation(); S.sel.has(id)?S.sel.delete(id):S.sel.add(id); refresh(); break;
    case 'selall': { const v=visible(); const al=v.every(x=>S.sel.has(x.id)); v.forEach(x=>al?S.sel.delete(x.id):S.sel.add(x.id)); refresh(); break; }
    case 'rowmenu': e.stopPropagation(); if(popAnchor===a){ closePop(); break; } openPop(a,H.menu(r),{alignRight:true,w:270}); break;
    case 'revon': closePop(); setRev([id],true); break;
    case 'revoff': closePop(); setRev([id],false); break;
    case 'det': closePop(); location.href='faturamento-detalhe.html?estado='+r.e; break;
    case 'ucdw': e.stopPropagation(); closePop(); openDw(id); break;
    case 'dwclose': closeDw(); break;
    case 'recalc': closePop(); toast((a.dataset.t||'Recálculo')+' solicitado',id); break;
    case 'link': closePop(); toast('Link copiado'); break;
    case 'copyid': closePop(); copyTxt(id,'ID copiado'); break;
    case 'download': closePop(); toast('Baixaria o PDF da fatura da concessionária',id); break;
    case 'upload': closePop(); toast('Abriria o envio da fatura da concessionária',id); break;
    case 'calcman': closePop(); toast('Abriria o cálculo manual do estudo',id); break;
    case 'genstudy': closePop(); setMs([id],'calculating','Estudo enviado para processamento','Estudo enviado para cálculo'); break;
    case 'bill': closePop(); setMs([id],'billing','Faturamento enviado para processamento','Faturamento iniciado'); break;
    case 'cancel_study': closePop(); toast('Pediria confirmação para cancelar o estudo',id); break;
    case 'issue': closePop(); toast('Cobrança enviada para emissão',id); break;
    case 'due': closePop(); toast('Abriria a alteração de vencimento',id); break;
    case 'extend': closePop(); toast('Abriria a prorrogação de vencimento',id); break;
    case 'barcode': closePop(); toast('Abriria a atualização do código de barras',id); break;
    case 'cancelrec': closePop(); toast('Pediria confirmação para cancelar o recebimento',id); break;
    case 'group': closePop(); toast('Fatura associada ao ciclo do '+TIT[r.t].grp,id); break;
    case 'archive': case 'unarchive': { const anchor=popAnchor||a; closePop(); openPop(anchor,obsPop([id],k==='archive'),{alignRight:true,w:300}); break; }
    case 'archgo': case 'unarchgo': { const ids=a.dataset.ids.split(','); const obs=(document.getElementById('obsT')||{}).value||''; closePop(); setArchived(ids,k==='archgo',obs.trim()); if(S.sel.size){ S.sel.clear(); refresh(); } break; }
    case 'popclose': closePop(); break;
    case 'grupo': e.stopPropagation(); toast('Abriria o '+a.dataset.v); break;
    case 'sortby': { const sk=a.dataset.k; S.sort=S.sort.k===sk?{k:sk,dir:S.sort.dir==='asc'?'desc':'asc'}:{k:sk,dir:sk==='tit'?'asc':'desc'}; const inPop=a.closest('#pop'); refresh(); if(inPop){ const b=document.getElementById('bSort'); popEl.innerHTML=sortPop(); popAnchor=b; b.classList.add('open'); } break; }
    case 'sortmenu': if(popAnchor===a){ closePop(); break; } openPop(a,sortPop(),{alignRight:true,w:200}); break;
    case 'incmenu': if(popAnchor===a){ closePop(); break; } openPop(a,mi('Importar faturas','upload_file','toast','')+mi('Importar faturas agrupadas','folder_zip','toast','')+mi('Importar faturas por imagem','image','imgimp',''),{alignRight:true,w:260});
      popEl.querySelectorAll('[data-a="toast"]').forEach((b,i)=>b.dataset.msg=['Abriria a importação de faturas','Abriria a importação de faturas agrupadas'][i]); break;
    case 'imgimp': closePop(); location.href='index.html'; break;
    case 'expmenu': if(popAnchor===a){ closePop(); break; } openPop(a,mi('Exportar lista (CSV)','table_view','toast','')+mi('Baixar relatório de status','summarize','toast',''),{alignRight:true,w:250});
      popEl.querySelectorAll('[data-a="toast"]').forEach((b,i)=>b.dataset.msg=['Exportaria a lista filtrada (CSV)','Baixaria o relatório de status do período'][i]); break;
    case 'morefl': { if(popAnchor===a){ closePop(); break; } openPop(a,FLT.filter(f=>f.x&&!S.xf.has(f.k)).map(f=>`<button class="opt" data-a="addfl" data-k="${f.k}"><span class="grow">${f.l}</span></button>`).join(''),{w:240}); break; }
    case 'addfl': { const fk=a.dataset.k; S.xf.add(fk); closePop(); refresh(); const nb=document.querySelector(`.flt[data-k="${fk}"]`); if(nb) fltPop(nb,FLT.find(x=>x.k===fk)); break; }
    case 'flt': { if(e.target.closest('[data-a="fclr"]')) return; if(popAnchor===a){ closePop(); break; } fltPop(a,FLT.find(x=>x.k===a.dataset.k)); break; }
    case 'fapply': applyTxt(a.dataset.k); break;
    case 'fopt': { const f=a.dataset.k, v=a.dataset.v; const cur=S.f[f]||[]; S.f[f]=cur.includes(v)?cur.filter(x=>x!==v):[...cur,v]; const on=S.f[f].includes(v); a.setAttribute('aria-checked',on); const c=a.querySelector('.cbx'); c.classList.toggle('on',on); c.innerHTML=on?'<span class="mss">check</span>':''; refresh(); const nb=document.querySelector(`.flt[data-k="${f}"]`); if(nb){ popAnchor=nb; nb.classList.add('open'); } break; }
    case 'fclr': { e.stopPropagation(); const fk=a.dataset.k; S.f[fk]=[]; S.xf.delete(fk); closePop(); refresh(); break; }
    case 'fclrall': S.f={}; S.xf.clear(); refresh(); break;
    case 'fold': { const f=a.dataset.k; S.fold.has(f)?S.fold.delete(f):S.fold.add(f); applyFold([f]); break; }
    case 'foldall': { const al=FOLDS.every(f=>!S.fold.has(f)); S.fold=new Set(al?FOLDS:[]); applyFold(FOLDS); break; }
    case 'copy': copyTxt(a.dataset.v); break;
    case 'toast': closePop(); toast(a.dataset.msg); break;
  }
}
function onBulk(e){ const a=e.target.closest('[data-bulk]'); if(!a) return; const k=a.dataset.bulk; const ids=[...S.sel], rs=ids.map(row);
  if(k==='limpar'){ S.sel.clear(); refresh(); return; }
  const b=BULK.find(x=>x.k===k); if(b&&!b.ok(rs)){ toast(b.why(rs)); return; }
  if(k==='revon') setRev(ids,true);
  if(k==='revoff') setRev(ids,false);
  if(k==='schedule') toast(n2(ids.length,'coleta agendada','coletas agendadas'));
  if(k==='genstudy') setMs(ids,'calculating',`Estudo enviado para processamento para ${n2(ids.length,'item','itens')}`,'Estudo enviado para cálculo');
  if(k==='bill') setMs(ids,'billing',`Faturamento enviado para ${n2(ids.length,'item','itens')}`,'Faturamento iniciado');
  if(k==='issue') toast(n2(ids.length,'cobrança enviada para emissão','cobranças enviadas para emissão'));
  if(k==='group') toast(n2(ids.length,'fatura associada ao ciclo do grupo','faturas associadas ao ciclo do grupo'));
  if(k==='due') toast('Abriria a alteração de vencimento de '+n2(ids.length,'cobrança','cobranças'));
  if(k==='recalc') toast(n2(ids.length,'recálculo solicitado','recálculos solicitados'));
  if(k==='archive'||k==='unarchive') openPop(a,obsPop(ids,k==='archive'),{up:true,w:300});
  if(k==='exp') toast(n2(ids.length,'faturamento exportado','faturamentos exportados')+' (CSV)'); }
function setTheme(t){ document.querySelectorAll('.fp').forEach(el=>el.classList.toggle('dk',t==='dark')); document.body.classList.toggle('dk',t==='dark');
  document.querySelectorAll('.proto [data-th]').forEach(b=>b.classList.toggle('on',b.dataset.th===t)); try{ localStorage.setItem('fp-theme',t); }catch(err){} }

function mountScreen(){
  mount(document.getElementById('frow'),H.filters);
  mount(document.getElementById('tbl'),H.table);
  mount(document.getElementById('rail'),()=>H.rail(row(S.cur)||ROWS[0]));
  mount(document.getElementById('count'),()=>{ const v=visible().length; return n2(v,'faturamento','faturamentos')+(v!==ROWS.length?` de ${ROWS.length}`:''); });
  document.addEventListener('click',onClick);
  document.addEventListener('scroll',e=>{ if(e.target.id==='railSc') markStuck(); },true);
  document.getElementById('bulk').addEventListener('click',onBulk);
  const bt=document.createElement('div'); bt.className='btip'; bt.setAttribute('role','tooltip'); bt.hidden=true; document.getElementById('app').appendChild(bt);
  const showT=b=>{ bt.innerHTML='<b>'+b.dataset.tl+'</b><span>'+b.dataset.tw+'</span>'; bt.hidden=false; const r=b.getBoundingClientRect();
    const x=Math.max(8,Math.min(r.left+r.width/2-bt.offsetWidth/2,innerWidth-bt.offsetWidth-8)); bt.style.left=x+'px'; bt.style.top=(r.top-bt.offsetHeight-8)+'px'; };
  const hideT=()=>{ bt.hidden=true; };
  const bulkEl=document.getElementById('bulk');
  bulkEl.addEventListener('mouseover',e=>{ const b=e.target.closest('.ico[data-tl]'); b?showT(b):hideT(); });
  bulkEl.addEventListener('mouseleave',hideT);
  bulkEl.addEventListener('focusin',e=>{ const b=e.target.closest('.ico[data-tl]'); b?showT(b):hideT(); });
  bulkEl.addEventListener('focusout',hideT);
  bulkEl.addEventListener('click',hideT);
  document.getElementById('dwOv').addEventListener('click',closeDw);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if(popEl&&!popEl.hidden){ const a=popAnchor; closePop(); a&&a.focus(); return; } if(S.dw) closeDw(); }
    if(e.key==='Enter'&&e.target.id==='fIn'){ e.preventDefault(); applyTxt(e.target.dataset.k); return; }
    if((e.key==='Enter'||e.key===' ')&&e.target.matches('.tr.row')){ e.preventDefault(); e.target.click(); } });
  document.addEventListener('input',e=>{ if(e.target.matches('[data-a="fsearch"]')){ const q=e.target.value.toLowerCase(); popEl.querySelectorAll('.opt').forEach(o=>o.hidden=!o.textContent.toLowerCase().includes(q)); } });
  document.addEventListener('submit',e=>{ const f=e.target.closest('.cmp'); if(!f) return; e.preventDefault(); const ta=f.querySelector('textarea'); const t=ta.value.trim(); if(!t){ ta.focus(); return; }
    row(f.dataset.id).cm.push({who:ME,t,d:NOW,isNew:1}); ta.value=''; refresh(); toast('Comentário adicionado'); });
  document.getElementById('bRail').onclick=()=>{ S.railOpen=!S.railOpen; refresh(); };
  document.getElementById('bFlt').onclick=()=>{ S.fltOpen=!S.fltOpen; syncFlt(); };
  syncFlt();
  document.getElementById('q').addEventListener('input',e=>{ S.q=e.target.value; refresh(); });
  document.querySelectorAll('.proto [data-th]').forEach(b=>b.onclick=()=>setTheme(b.dataset.th));
  let th=null; try{ th=localStorage.getItem('fp-theme'); }catch(err){} setTheme(th||'light');
  updateBulk(); syncRail();
}
window.CF={mountScreen,S,ROWS};
})();
