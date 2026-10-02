# Leitor de Faturas · Detalhe — regras de layout, animação e variantes

Referência do protótipo `detalhe.html` (https://bourdonner.github.io/leitor-faturas-prototipo/detalhe.html).
Base visual: Style Guide Enershare. Dados do protótipo são fictícios.

---

## 1. Breakpoints

| Variante | Largura da janela | Ideia central |
|---|---|---|
| **Desktop** | ≥ 1200 px | Até 3 painéis lado a lado: Fatura · Detalhes · Atividade |
| **Tablet** | 768 – 1199 px | Detalhes fixo; Fatura e Atividade abrem como gaveta à direita |
| **Mobile** | < 768 px | Uma tela por vez; a tab bar troca de tela |

O modo é recalculado a cada `resize`. Ao mudar de modo, a tela volta para Detalhes e as gavetas fecham.

---

## 2. Desktop (≥ 1200 px)

### Painéis
| Painel | Largura | Mínimo |
|---|---|---|
| Fatura (PDF) | ocupa o espaço livre | 400 px |
| Detalhes | 690 px (encolhe até o mínimo) | 520 px |
| Atividade | 284 px fixo | 284 px |

- Espaço entre painéis: 24 px.
- Sem Fatura, Detalhes ocupa o espaço livre. Sem Detalhes, Fatura ocupa o espaço livre.

### Prioridade quando falta largura
1. **Detalhes**
2. **Fatura**
3. **Atividade**

O painel de menor prioridade sai primeiro. Se a pessoa abre um painel que não cabe, os outros fecham do menos para o mais prioritário até ele caber.

### Tab bar
- Pílula branca com **Fatura · Detalhes · Atividade** (ícone + nome).
- **Pendências** é um botão separado, ao lado (10 px), com contador. Some quando não há pendências.
- Ativo = pílula interna `stone/100` (#f5f5f4) + texto em negrito.
- Pendências abre/fecha o card flutuante de pendências.

---

## 3. Tablet (768 – 1199 px)

- **Detalhes** ocupa toda a área e não fecha.
- **Fatura** (até 440 px / 62 %) e **Atividade** (até 340 px / 50 %) abrem como **gaveta** à direita, uma de cada vez.
- Tocar de novo no item (ou no botão da gaveta) fecha.
- Gaveta e card flutuante de Pendências são **exclusivos**: abrir um fecha o outro.
- Grades de 3 colunas viram 2.
- Topo compacto: breadcrumb de 40 px, título 18 px, chips em uma linha só (rolam de lado).
- Rolar para baixo esconde o topo (breadcrumb + título + chips) e a tab bar; rolar para cima, chegar ao topo ou trocar de tela traz de volta.
- Tab bar igual ao desktop (pílula + botão Pendências separado).

---

## 4. Mobile (< 768 px)

### Estrutura (Figma 1815:29980)
- **Header**: menu (56 px) · nome (Inter Bold 16) + subtítulo (10 px, caixa alta) · badges.
  - Badges redondos 34 px, sobrepostos (−12 px): **UC**, **distribuidora**, **referência**.
  - Por cima de todos: pílula cinza de **pendências** com ícone + quantidade (vira check verde sem número quando zera).
  - Separador de 1 px abaixo.
- **Navegação interna**: caixa `rgba(245,245,244,.4)`, borda `#f5f5f4`, raio 8, padding 4 (hoje: abas Resumo/Itens/Consumo/Identificação).
- Conteúdo com **24 px** de margem lateral, fundo branco, títulos de seção Poppins SemiBold 20.
- Sidebar e card flutuante de pendências ficam escondidos.

### Tab bar
- Pílula com **Fatura · Detalhes** só com ícone (nome escondido visualmente, mantido para leitor de tela); botões de 76 px, ícone 26 px.
- **Pendências** em botão separado de 68 px.
- **Atividade não fica na tab bar**: está no painel do header.
- Um toque troca de tela (não alterna).

### Telas
| Tela | Conteúdo |
|---|---|
| Fatura | Nome do arquivo + **Baixar** ao lado. Sem botões de zoom e sem "abrir em nova aba". Zoom por **pinça** (1×–4×, mantém o ponto entre os dedos) e **toque duplo** (cabe na tela ↔ 2×). |
| Detalhes | Cards em 1 coluna. |
| Pendências | Lista em tela cheia: cada item com campo (com máscara), "Ver no Campo" e Confirmar. Vazia → "Sem pendências". |

### Painel do header (Figma 1823:29368 / 1823:29509)
- Tocar em qualquer badge abre um painel sobre o fundo desfocado (`rgba(245,245,244,.4)` + blur 6 px).
- Navegação "‹ título ×"; badges-pílula (status, referência, distribuidora ↗, UC ↗); botões quadrados 56 px: **histórico**, baixar, abrir PDF.
- **Histórico** abre a **Atividade** dentro do painel; "‹" volta ao resumo.
- Fecha com ×, toque fora ou Esc; o foco volta ao badge.

### Header e tab bar ao rolar
- Rolar para baixo: header **sobe** e tab bar **desce** (somem).
- Rolar para cima, chegar ao topo ou trocar de tela: voltam.
- Rolagem lateral (planilha) não conta.

---

## 5. Componentes e estados

### Card de dado (Figma 1754:743)
- **Um rótulo + um valor + unidade.** Precisa de legenda? Vira outro card (ex.: "ICMS (alíquota)" e "ICMS (valor)").
- Fundo `#fafaf9` em **todos os estados** (o painel é `#f5f5f4`).
- Valor dentro de campo somente leitura (`rgba(245,245,244,.4)`, 40 px) + botão **copiar** 40×40 ao lado. Copiar leva **só o valor**.
- `R$` antes do valor; demais unidades depois.
- Estados:
  - **Visualização**: lápis no cabeçalho.
  - **Edição**: campo com borda, unidade dentro do campo, **salvar** (verde) e **fechar** no cabeçalho. Enter salva, Esc cancela.
  - **Pendente**: borda laranja, badge de alerta, campo vazio, "Não encontrado na fatura", salvar/limpar.
  - **Corrigido**: borda verde.
- Visualização e edição têm a **mesma altura**.
- Mobile: botões do cabeçalho com toque de 40 px (ícone 18 px); o lápis ocupa 80 px para o título ter a mesma largura nos dois modos.

### Campos (máscaras)
| Tipo | Comportamento |
|---|---|
| Moeda (R$) / Percentual (%) | 2 casas, digitando da direita ("512399" → 5.123,99) |
| kWh / kW / dias | inteiro com milhar |
| Data | dd/mm/aaaa, valida data real |
| CNPJ / CEP / código de barras | pontuação automática, valida completo |
| Nº de instalação, nota fiscal, série | só dígitos, tamanho original |
| Planilha | quantidade e valores aceitam negativo ("−"); tarifas com 5 casas |

Inválido → borda vermelha + aviso, não salva. No iOS os campos usam 16 px para o Safari não dar zoom.

### Select (Style Guide: Select + Dropdown Menu)
- Gatilho 40 px, fundo `#fafaf9`, borda `#d6d3d1`, chevron 16 px.
- Menu branco, raio 6, sombra nível 4, itens com 32 px à esquerda para o check da opção escolhida.
- Teclado: setas, Enter, Esc, letra pula para a opção. Abre para cima se não couber.

### Planilha (Itens da nota fiscal)
- Coluna Item fixa (desktop/tablet); **no mobile rola com as demais** e ocupa no máximo **metade** da tabela, com nome longo cortado no meio ("Energia in…onta TUSD").
- **Unidade dentro da célula**, em cinza: "540 kWh", "1,48213 R$/kWh", "R$ 800,35". Sem coluna "Unid.".
- Duplo clique (ou Enter/F2) edita; setas navegam; total recalcula. No mobile, célula **pendente** abre com **um toque**.
- Célula alterada: fundo verde-claro. Célula pendente: fundo laranja-claro + ícone.
- Barra de rolagem no estilo Scroll-area (alça 8 px, `#d6d3d1`, com folga).

### Gráfico (12 meses)
- Dentro de um card (padding 20). Título, valor do mês e variação vs. mês anterior.
- Interativo: hover/foco mostra o mês; clique fixa; setas navegam. Mês atual em verde.
- Sem indicação de média.

### Atividade
- Todo evento mostra o autor no canto: **sistema** = círculo preto com a marca Enershare; **pessoa** = iniciais com cor própria; nome no hover.
- Status do sistema em 1–2 palavras + data.
- Evento de edição: no hover (ou foco/toque) mostra **de → para** (antigo riscado, novo em negrito sobre verde-claro). Pendência resolvida: "não encontrado → valor".

### Pendência fora da área visível (Figma 1823:30676)
- Quando o item pendente está escondido pela rolagem, aparece na borda do container um **marcador laranja + seta** apontando para ele.
- Vale para rolagem lateral (planilha) e vertical (painel).
- Tocar rola até o item e faz ele piscar.

### Fatura (PDF)
- Páginas empilhadas em **rolagem contínua** (sem "Página 1 de N").
- Desktop/tablet: zoom por botões, abrir, baixar, minimizar.

---

## 6. Animações

| Elemento | Gatilho | Duração | Curva | Movimento |
|---|---|---|---|---|
| Painel (desktop) | abrir/fechar | 350 ms | ease | largura + opacidade + sobe 24 px / escala .96 |
| Painel (abrir) | abrir | 400 ms | cubic-bezier(.2,.9,.3,1.1) | sobe 32 px, escala .95 → 1 |
| Item da tab bar | abrir | 450 ms | cubic-bezier(.3,1.5,.5,1) | ícone pula 6 px e escala 1,12 |
| Item da tab bar | fechar | 350 ms | ease | ícone encolhe para .78 |
| Pílula ativa da tab bar | ativar | 350 ms | cubic-bezier(.3,1.5,.5,1) | escala .55 → 1 |
| Gaveta (tablet) | abrir/fechar | 350 ms | cubic-bezier(.2,.9,.3,1) | desliza da direita |
| Header / tab bar (mobile e tablet) | rolar | 280 ms | ease | header sobe, tab bar desce |
| Painel do header (mobile) | abrir | 200 / 250 ms | ease / cubic-bezier(.2,.9,.3,1.1) | fundo aparece; painel desce 8 px e escala .98 → 1 |
| Menu do select | abrir | 120 ms | ease | desce 4 px |
| Marcador de pendência | contínuo | 1 s / 1,4 s | ease-in-out / ease-out | balança 4 px na direção da seta + anel pulsando |
| De → para (Atividade) | hover/foco | 200 ms | ease | expande e aparece |
| Card (foco vindo de pendência) | "Ver no Campo" | 1,2 s | — | anel laranja |
| Toast | ação | 250 ms | — | desce e aparece |

Com **reduzir movimento** ativado no sistema, as animações são desligadas.

---

## 7. Textos fixos

- Ajuda da planilha: "Clique duas vezes numa célula para editar".
- Pendente: "Não encontrado na fatura".
- Lista vazia: "Sem pendências — Todos os dados da fatura foram conferidos."
- Não existe "Aprovar fatura".
