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

## Cancelamento de cooperado · abertura (registro da CAN)

- Tela navegável (cancelamento-abertura.html), fiel ao Figma "Cancelamento de Cooperado", página ↳ Abertura do Cancelamento: 6 passos (Informações do Titular, Abrangência, Tipo, Detalhes, Faturas, Revisar e registrar) e a confirmação
- Stepper à esquerda (passo feito volta ao clicar), formulário no meio, Resumo do pedido e "O que acontece após o registro" à direita
- Regras do PRD: titularidade = 4 tipos e todas as UCs; uma UC = 6 tipos; a última UC ativa vira Cancelamento Total (saída de cooperado); 5 tipos exigem as 3 últimas faturas (bloqueia), os outros só avisam e pedem ciência; clicar no mês que falta inclui a fatura
- Casos para testar: Ricardo Menezes Prado (3 UCs, falta set/26 no Galpão), Ricardo Alves Pinto (1 UC, faturas completas), Ricardo Souza Lima (1 UC já em cancelamento: escolher a Praia converte para Total)
- Dados fictícios
