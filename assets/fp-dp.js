/* De → para: o que muda no stg para ficar como o Figma. [item, de (stg), para (Figma), ref, novo?] */
window.FPDP={
cabecalho:{rows:[
 ['Ações do cabeçalho','3 botões com texto: Indicadores, Configuração e detecção, Adicionar Faturamento Pendente','3 botões só com ícone, 40 × 40, fundo cinza (gráfico, engrenagem, +), com o nome no tooltip','L1'],
 ['Abas','Triagem e meus · Meus · Triagem · Todos','Sem abas. Filtro "Visão" com Triagem e Meus marcados por padrão','L2'],
 ['Busca','Campo sem lupa; botão "Filtrar" separado','Lupa à esquerda e ícone de filtro dentro do campo; 52 px de altura','L3'],
 ['Botão do Resumo','Não existe (o Resumo abre pela linha)','Botão 52 × 52 ao lado da busca para abrir e fechar o Resumo','L3'],
 ['Barra de filtros','Escondida até clicar em "Filtrar"; selects com rótulo cinza','Sempre visível, com o componente Filter: vazio mostra o nome + chevron; com valor mostra nome · valores · ×; "Limpar filtros" no fim','L2/L4'],
 ['Filtro de período','"Período de abertura"','"Aberto em" (mesmo nome da coluna)','L4']]},
indicadores:{rows:[
 ['Layout','8 cards em 4 colunas, na largura toda; gráfico embaixo','Tiles 4 × 2 à esquerda e o gráfico ao lado, com 620 px','—'],
 ['Card','Rótulo cinza de 12 px, número verde de 24 px, legenda','Tile da lib (como no Cadastro), cinza (hover:secondary) sem borda: título em negrito, número em H5 e legenda cinza','I1'],
 ['Destaque','Todos os números em verde','Título e número em laranja quando pedem atenção (Sem responsável e Sem atendimento acima de 0); "—" em cinza claro','I1'],
 ['Legendas','"Nenhuma tentativa registrada", "Cooperado informou que enviará"','"Nenhuma tentativa", "Cooperado vai enviar", "Resolvidos sobre abertos"','I1'],
 ['Legenda de Resolvidos','"1 abertos · 10/09/2026 a 09/10/2026" (concordância errada)','Só o período: "10/09/2026 a 09/10/2026"','bug'],
 ['Título do painel','"Indicadores" em verde','"Indicadores" em texto escuro (Body/Small-Bold)','R3'],
 ['Tipo do gráfico','Barras horizontais, rótulos verdes à esquerda e "n · %" à direita','Colunas de 0 a 7 com o valor em cima; a 7ª em vermelho; hover destaca a coluna','I1'],
 ['Título do gráfico','"Tickets ativos por tentativas", 12 px cinza','"Tickets ativos por tentativas realizadas", em negrito, com "27 tickets ativos · 3 no limite de 7 tentativas"','I1'],
 ['Limite','Não destacado','"7 = limite atingido, libera a demissão" em vermelho, abaixo do eixo','I1']],
 keep:'Fica como está no stg: os 8 indicadores, o "Atualizado às" com o botão de atualizar e a abertura pelo botão Indicadores do cabeçalho.'},
tabela:{rows:[
 ['Subtítulo do cooperado','Número da instalação (UC 000592841803102)','Quantidade de UCs: "1 UC", "2 UCs"','—',1],
 ['Bolinhas de tentativa','Vazadas, com contorno; a 1ª cinza','Preenchidas com a cor da etapa: cinza até 2, laranja de 3 a 6, vermelho na 7ª; vazias em cinza claro','L11'],
 ['Seleção','Checkbox colado ao número do ticket, sem "selecionar todos"','Coluna própria de 48 px, com "selecionar todos" (indeterminado quando há parte marcada); linha marcada em verde-claro (row:selected)','L7'],
 ['"…" da linha','Abre o Resumo do ticket','Abre o menu do ticket: Transferir responsável, Devolver à triagem, Resolver manualmente, Editar descrição, Cancelar ticket','L10'],
 ['Badge "Em Atendimento"','Fundo #292524 fixo nos dois temas','Cor primária da lib (escura no claro, clara no escuro)','cores'],
 ['Colunas em tela estreita','Todas visíveis, com rolagem horizontal','Somem nesta ordem até o Cooperado ter 240 px: Carteira, Aberto em, Status, Responsável, Faturas, Tentativa','regra'],
 ['Rodapé','"1 ticket aberto" + "Total de 1 registros em 1 página"','Um contador só, com a concordância certa','L12 (bug)']],
 keep:'Fica como está no stg: colunas novas, ordenação em Ticket/Situação/Tentativa/Aberto em, cooperado em caixa alta (L5, L8, L9).'},
lote:{rows:[
 ['Ações em lote','Não existem: cada ticket é alterado um por um','Barra flutuante no rodapé quando há linha marcada: "3 selecionados", Definir responsável, Mover de carteira, Devolver à triagem, Resolver, Mais (Exportar, Registrar tentativa, Cancelar tickets) e × para limpar','—',1],
 ['Definir responsável','Só pelo Resumo, um ticket por vez','Pop-over "Responsável" acima da barra, com a equipe e "Remover responsável"; o mesmo pop-over do "…" da linha','—',1],
 ['Confirmação','—','Aviso com Desfazer depois de cada ação; a seleção continua para a próxima ação e só guarda tickets visíveis com os filtros','—',1],
 ['Histórico','—','Cada ticket alterado ganha o evento no histórico (Responsável definido, Carteira alterada, Devolvido à triagem, Resolvido manualmente) com o de → para','—',1]]},
ticket:{rows:[
 ['Barra do Resumo','Translúcida, com borda; título e ícone verdes; 45 px','Cinza (secondary), sem borda, 52 px; "Resumo do ticket" em texto escuro; botão para fechar o painel','R3'],
 ['Card do ticket','Solto no topo, sem card; "TESTE" em verde abaixo da data','Card cinza (hover:secondary) sem borda; número, status ao lado e "…" à direita; sem o título','R1',1],
 ['Meta','"Aberto em 08/10/2026"','"Aberto em 08/10/2026 · 12 faturas"','R1'],
 ['Menu do "…"','Ícones à esquerda; "Cancelar ticket" em vermelho','Ícones à direita (Dropdown Menu da lib); "Cancelar ticket" separado no fim, em vermelho','R2'],
 ['Card do cooperado','Borda verde translúcida','Card cinza sem borda, com cada dado num item branco (ícone em círculo, rótulo e valor)','R5',1],
 ['Valores','Nome, CPF, carteira e responsável em verde negrito','Texto escuro, peso normal; só o nome em negrito','R3'],
 ['Situação','Badge','Item com ícone de ampulheta e o texto','R5'],
 ['Ícone do cooperado','Sempre de pessoa','Conforme o tipo: pessoa (PF) ou maleta (PJ)','R5']],
 keep:'Fica como está no stg: o status colado ao número, o chevron que recolhe cada seção, as opções do menu (R2) e os atalhos de copiar e abrir.'},
faturas:{rows:[
 ['Item de fatura','Linha com círculo e texto em verde','Card de Atividade branco: quadrado laranja com ampulheta, competência em cima e "UC · motivo" embaixo','R6',1],
 ['Leitura prevista e atraso','Sempre visíveis, numa linha só','No hover ou no foco do card, em chips: "Leitura prevista 03/10/2026" e "6 dias em atraso" (laranja)','—'],
 ['Enviar a fatura','Só pela área de anexar do ticket','Botão redondo escuro no canto de cada card; abre o envio já ligado àquela fatura','—',1],
 ['Muitas faturas','Lista inteira, sem limite','5 por vez; "Carregar mais 5 · faltam 7" com chevron; some quando acaba','—',1],
 ['Importar','Uma fatura por vez','"Importar faturas" (botão com borda, largura toda) abre o envio em lote','—',1],
 ['Subtítulo','—','"5 UCs · CPFL Paulista"','—',1],
 ['Título','Verde','"12 faturas pendentes" em texto escuro','R3']],
 keep:'Fica como está no stg: o chevron que recolhe a seção e o conteúdo da leitura prevista e dos dias em atraso (R6).'},
tentativas:{rows:[
 ['Título','Verde','Texto escuro, com "4 de 7 realizadas · última há 2 dias" embaixo','R3'],
 ['Bolinhas','Vazadas, com contorno','Preenchidas com a cor da etapa e "4/7" na mesma cor','L11'],
 ['Fundo','Card com borda','Card cinza sem borda, como os outros do Resumo','cores']],
 keep:'Fica como está no stg: os botões, a dica e o Solicitar demissão bloqueado até a 7ª tentativa.'},
historico:{rows:[
 ['Componente','Lista de cards com borda dentro do card "Histórico de tentativas"','Componente Atividade do Leitor: painel cinza, cabeçalho com título e minimizar, cards brancos sem borda ligados por uma linha','R7/R8'],
 ['Título da seção','Verde','"Histórico de tentativas" em texto escuro','R3/R8'],
 ['Ícone do evento','Quadrado escuro para todos','Quadrado conforme o tipo: escuro (registro e canal), verde (início), cinza (alteração)','—'],
 ['Autor','Avatar e o nome ao lado da hora','Avatar à direita, com o nome no hover; o sistema aparece com o raio','—'],
 ['Horário','Relativo ("Há 12h"), 10 px','Data e hora ("09/10 às 00:12"), 11 px','—'],
 ['Ver evidência e Desfazer','Sempre visíveis','No hover ou no foco do card, na faixa onde o Leitor mostra o de → para; Desfazer só na última tentativa','R7'],
 ['Alteração de responsável','"Assumido por Adam William Sori"','"Responsável definido", com "Sem responsável → Marina Duarte" no hover','—']],
 keep:'Fica como está no stg: os tipos de evento (R8).'},
registrar:{rows:[
 ['Título','Poppins 20 px','Poppins 24 px (Heading/H5)','—'],
 ['Canal','Ícones verdes; nenhum canal marcado','Ícones na cor do texto; o canal escolhido com borda verde de 2 px','—'],
 ['"Mais detalhes"','Linha divisória acima, chevron à direita','Botão link com o chevron logo depois do texto, sem linha','—'],
 ['Altura dos campos','40 px','44 px','—'],
 ['Largura do modal','560 px','480 px','—'],
 ['Rótulo de duração','"Duração da ligação"','"Duração"','—']],
 keep:'Fica como está no stg: os campos de Mais detalhes, os formatos aceitos na evidência (T1, T2) e o placeholder da observação.'},
importar:{rows:[
 ['Importação em lote','Não existe','Modal "Importar faturas" (560 px) com o componente da Nova fatura do Leitor: área de arrastar, vários arquivos de uma vez','—',1],
 ['Ligação com a fatura','—','Cada arquivo vai para uma fatura pendente; a competência é lida do nome do arquivo ("set2025", "2025-09") e pode ser trocada em "Vai para UC · competência"','—',1],
 ['Erros','—','Por arquivo, sem travar os outros: formato não aceito ou maior que 20 MB ("Diminua o arquivo ou tire uma foto da fatura")','—',1],
 ['Envio','—','"Enviar 2 faturas" conta só os válidos; cada fatura enviada sai da lista e entra no histórico; sem pendentes, o ticket é resolvido por importação manual','—',1],
 ['Uma fatura','—','O botão do card abre o mesmo modal com o título "Enviar fatura" e o destino já escolhido','—',1]]},
cores:{rows:[
 ['Neutros','Duas famílias: cinza azulado (zinc) em bordas, abas e fundo escuro; cinza quente no resto','Só a stone (tokens enershare/*)','cores'],
 ['Fundo no escuro','oklch(0.14 0.004 286), azulado','#0c0a09 (enershare/foreground)','cores'],
 ['Painéis do Resumo e tiles','Translúcidos, com borda','enershare/hover:secondary (#f5f5f4 · #1c1917), sem borda, com itens em enershare/foreground','cores',1],
 ['Borda no claro','oklch(0.92 0.004 286) em botões e abas','#d6d3d1 (enershare/border); #57534e no escuro','cores'],
 ['Alerta no escuro','Laranja #f97316','Âmbar #fbbf24 (feedback/alert)','cores'],
 ['Badges','Cores fixas, iguais nos dois temas','Variables da lib, que mudam com o tema','cores'],
 ['Verde da marca','oklch(0.61 0.13 125) · oklch(0.91 0.21 127)','#71902f · #baf743 (enershare/brand:primary)','cores']]}
};

Object.assign(window.FPDP,{
kanban:{rows:[
 ['Visão em kanban','Não existe (fora do escopo desta entrega)','Botão ao lado da busca alterna lista e kanban; o endereço guarda a visão (#kanban)','—',1],
 ['Colunas','—','Sem Atendimento, 1ª a 7ª tentativa e Demissões; ícone na cor da etapa (cinza, cinza escuro, laranja de 3 a 5, vermelho em 6, 7 e Demissões) e a contagem','—',1],
 ['Card','—','Ticket e avatar do responsável, nome do cooperado, "2 UCs · concessionária" e chips de situação, UCs e faturas pendentes; o aberto no Resumo com borda verde','—',1],
 ['Arrastar','—','Só para a próxima coluna, e abre Registrar tentativa; para Demissões só a partir da 7ª, e abre Solicitar demissão; o resto avisa e não move','—',1]],
 keep:'O kanban foi deixado de fora no stg; fica registrado aqui para a próxima entrega.'},
estados:{rows:[
 ['Faturas lidas','Fatura lida some da lista','Fica na lista com o check verde e "UC · Fatura lida"; o título vira "1 de 3 faturas lidas"','—',1],
 ['Limite de tentativas','Registrar continua ativo','Na 7ª: "7 de 7 realizadas · limite atingido", Registrar desabilitado e Solicitar demissão liberado','—'],
 ['Herdado','Sem indicação','Etiqueta "Herdado" no card de tentativas, "herdadas da Carteira Norte" e a carteira com "· antes Norte"','—',1],
 ['Demissão solicitada','Sem indicação no Resumo','Card rosa "Demissão solicitada" com Ver cancelamento; o card de tentativas sai','—',1],
 ['Resolvido','Card de tentativas continua','Sem tentativas e sem importar; situação com check verde; histórico com "Fatura importada por…" ou "Fatura capturada automaticamente"','—']]},
evidencia:{rows:[
 ['Abertura','Ver evidência sempre visível no card','No hover do card do histórico; abre o modal com canal, data e autor','R7'],
 ['Arquivo','—','Linha do arquivo com o tipo (PNG, PDF), tamanho e data; Baixar e Fechar','—']]},
demissao:{rows:[
 ['Solicitar demissão','Desabilitado: "Disponível na integração com a SPEC de Cancelamento"','Modal próprio a partir da 7ª tentativa: motivo, temperatura, meio de contato, data e descrição; avisos do que acontece ao registrar','A1',1],
 ['Botão','—','"Registrar demissão" em vermelho (destructive), desabilitado até escolher a temperatura','—',1]]},
adicionar:{rows:[
 ['Estilo','Campos e rótulos fora do padrão das outras telas','Mesmo modal dos outros: título H5 verde, campos de 44 px, Cancelar e Criar ticket','C1'],
 ['Ticket ativo','—','Ao escolher um cooperado com ticket ativo, o aviso diz qual e as faturas entram nele','—',1]]},
config:{rows:[
 ['Estrutura','Uma tela única','Três abas: Detecção, Parâmetros, Temas de atendimento','C1'],
 ['Detecção','—','Parâmetros vigentes em bloco cinza; Simular sempre disponível, Executar só com a detecção ligada','C1'],
 ['Parâmetros','—','Switches da lib com descrição, campos em duas colunas com ajuda embaixo e elegibilidade em chips; valida ao salvar','C1']]}
});