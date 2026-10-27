# Leitor de Faturas · protótipo do detalhe

Protótipo navegável do detalhe de uma fatura lida pelo sistema (Enershare / COGECOM).

- Listagem (index.html), fiel ao Figma: busca, filtro por situação, ordenação, seleção, menu da linha (revisar, atribuir, recusar com motivo) e estados vazia, carregando e busca sem resultado; a fatura da Padaria Estrela do Sul abre o detalhe
- Detalhe (detalhe.html): abas do painel de dados: Resumo, Itens, Leituras, Consumo, Identificação (alerta na aba com item pendente)
- Planilhas de Itens e Leituras: colunas de seleção (Categoria, Modalidade, Tipo tarifa, Posto) com rótulo traduzido e o código do sistema como atalho no menu; PIS e COFINS separados; em Itens a planilha vem antes dos Totais
- Larguras: Detalhes com mínimo de 600 px, abas na linha do título só com 820 px ou mais, card nunca abaixo de 280 px (1 a 4 colunas) — ver REGRAS.md
- Tab bar flutuante para abrir/minimizar Detalhes, Atividade e Pendências
- Pendências com navegação (1 de 3) e campo conforme o tipo de dado (percentual, número, seleção)
- Correções entram na Atividade; sem pendências e com a UC validada, aparece Faturar

Todos os dados são fictícios (fatura Grupo A, A4 horária verde).

## Faturamento Pendente (Tickets)

- Tela navegável (faturamento-pendente.html): filtros com o Filter da lib, tabela com quantidade de UCs, seleção e ações em lote, Resumo do ticket com faturas em 5 por vez, importação em lote, registrar tentativa e histórico no componente Atividade do Leitor
- Componentes (faturamento-pendente-componentes.html): cada componente do Figma em código, com o de → para do que muda no stg
- Claro e escuro; dados fictícios. Figma: Tickets, página Faturamento Pendente

## Contas a Faturar · detalhe do faturamento

- Listagem simples (faturamento.html): uma linha por fatura, com fase (3 passos), status, valor e vencimento; filtros Fase, Status e Concessionária; sem modais nas células
- Detalhe (faturamento-detalhe.html): header com cooperado, UC, concessionária, carteira, status atual e ações (principal = próximo passo; menu agrupado por fase, com fase não alcançada bloqueada)
- Prévias no mesmo painel, uma aba por fase: Fatura concessionária → Estudo (prévia sem cobrança) → Fatura a receber (fatura COGECOM com boleto + fatura da concessionária). A aba da fase mais avançada abre ativa; fase não alcançada fica desabilitada
- Detalhes acompanham a fase escolhida; Atividade junta os eventos das três fases
- Estados de demonstração em `?estado=`: aguardando, lida, falha-calculo, estudo, emissao, aberto, atrasado, liquidado
- Dados fictícios (mesma fatura do Leitor: Padaria Estrela do Sul, Luz do Vale, mar/2025)

## Cancelamento de cooperado

Protótipos do projeto Cancelamento Cooperado (Linear P-COG-1). Dados fictícios.

### Abertura do cancelamento (cancelamento-abertura.html) · atualizado em 27/10/2026

- Tela navegável fiel ao Figma "Cancelamento de Cooperado", página ↳ Abertura do Cancelamento: Informações da Matrícula → Abrangência → Tipo e motivo → Faturas → Revisar e registrar → Registrado
- Cancelamento Total (Solicitação do Cooperado ou Demissão) ou inativação de uma ou várias UCs, com tipo por UC, seleção em lote, busca e filtros
- Status Cancelamento Pendente (rascunho salvo a cada passo); faturas bloqueiam só em Mudança de Endereço, Troca de Titularidade e Parcial com Realocação; consumo de saldo por UC; Reclame Aqui
- Modo debug (tecla D ou botão "Debug"): caminho no PRD, campos, regras aplicadas, automações e posição no diagrama do fluxo
- Matrículas de exemplo: Ricardo Menezes Prado (3 UCs), Eletro Ricardo (1 UC), Supermercado Bom Preço (52 UCs), Armazém Ricardo e Ana Beatriz Costa (Cancelamento Pendente)

### Simulador de regras (cancelamento-simulador.html) · versão de 21/10/2026

- Você faz o papel do CS, registra a CAN e vê as automações e o caminho de cada UC: Análise de Saldo (SLA de 17 h úteis), Negociação, Realocação/Compensação, fatura do saldo final, Financeiro e Anulação
- Ainda sem as mudanças posteriores a 21/10 (consumo de saldo como critério por UC, regra nova das faturas, Reclame Aqui)
