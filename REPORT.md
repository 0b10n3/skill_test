# REPORT.md — Design do Relatório de Resultados | Syntaxis Skill Check

> **Propósito deste arquivo:** especificação de design e conteúdo da página `/resultado`. Complementa `AVALIACAO.md` (que define o modelo de pontuação e diagnóstico) e serve de base para o épico de implementação do relatório. Pode ser removido do repositório após a implementação.

---

## 1. Princípios de design

1. **O relatório é o produto.** O quiz é o meio; o relatório é o que o participante compartilha, imprime, guarda. Deve parecer um *diagnóstico profissional de carreira*, não uma tela de "você acertou X de 15".
2. **Diagnóstico antes de nota.** A hierarquia da informação é: (1) onde você está em relação ao mercado → (2) o que te destaca → (3) o que te trava → (4) o que fazer a respeito. O score numérico é coadjuvante.
3. **Sempre em relação ao nível declarado.** Todo texto do relatório usa a moldura "para um analista **[nível]**, o mercado espera...". É isso que torna um score 60% significativo (bom para aspirante, alerta para sênior).
4. **Nenhum resultado é humilhante, nenhum é vazio.** Score baixo é enquadrado como mapa de desenvolvimento (gap = oportunidade priorizada); score alto recebe desafio do próximo nível — nunca "parabéns, não há o que melhorar". Tom: direto, respeitoso, sem infantilizar.
5. **Identidade "O Sinal no Escuro".** O relatório usa integralmente os tokens da marca Syntaxis (cores, tipografia, espaçamento do design system). Nada de verde/vermelho genérico de quiz: a paleta semântica de forte/fraco deriva dos tokens da marca.
6. **Single-viewport por seção no mobile.** Cada bloco do relatório ocupa no máximo uma dobra em 375px; o usuário navega por scroll com âncoras, mantendo o padrão de viewport do design system do app.

---

## 2. Estrutura do relatório (ordem das seções)

### S1 — Cabeçalho de identidade do diagnóstico
- Logo Syntaxis + título "Skill Check — Diagnóstico de Competências".
- Nome do participante (do formulário de lead), nível declarado, data.
- **Selo de classificação global**: badge `ALTO` / `MÉDIO` / `BAIXO` com microcopy de uma linha:
  - ALTO: "Perfil acima da expectativa para [nível]."
  - MÉDIO: "Perfil dentro da expectativa para [nível], com gaps específicos."
  - BAIXO: "Gaps estruturais em relação à expectativa para [nível]."
- O selo NUNCA aparece sozinho: sempre acompanhado da frase-contexto, para evitar leitura de "nota escolar".

### S2 — Radar de competências (peça central)
- **Radar chart de 5 eixos**, um por dimensão (`mercados-produtos`, `matematica-quant`, `dados-programacao`, `ia-aplicada`, `risco-regulacao`), com rótulos humanizados:
  - "Mercados & Produtos", "Matemática & Quant", "Dados & Programação", "IA Aplicada", "Risco & Regulação".
- **Duas séries sobrepostas:**
  1. **Seu perfil** (linha/área preenchida na cor primária da marca): `scoreDimensao` de 0 a 100%.
  2. **Expectativa do nível** (linha tracejada neutra): referência fixa por nível — o "contorno alvo" (default: 67% em todos os eixos, i.e. 2 de 3; configurável por nível/eixo no futuro).
- A sobreposição transforma o radar de "gráfico de nota" em **gráfico de gap**: onde a área do perfil não alcança a linha tracejada, o olho identifica o gap sem ler nada.
- Abaixo do radar: legenda das duas séries + 1 frase gerada dinamicamente resumindo o formato do perfil, ex.: "Seu perfil é forte em produtos e quant, com espaço claro para evoluir em dados."
- Acessibilidade: o radar tem alternativa textual completa (tabela dimensão × score × expectativa) via `aria` / bloco visually-hidden, e as duas séries se distinguem por traço (sólido vs. tracejado), não só por cor.

### S3 — Score cards por dimensão
- 5 cards horizontais (grid 1 col mobile / 5 col desktop), cada um com:
  - Nome da dimensão + ícone.
  - Score: "2/3" + barra de progresso.
  - Etiqueta: `Ponto forte` (≥2/3), `Em desenvolvimento` (1/3... exatamente: forte ≥ 0.67; neutro = 0.33–0.66 → com 3 itens: forte 2–3, atenção 0–1, conforme regra do AVALIACAO.md §5.5), `Ponto de atenção` (≤1/3).
  - Microcopy de 1 linha por combinação dimensão × faixa (matriz de 15 textos fixos, escritos no tom da marca — sem texto gerado em runtime).

### S4 — Pontos fortes e pontos de atenção
- Duas colunas (empilhadas no mobile): **"O que te destaca"** e **"O que pode te travar"**.
- Cada lado lista 1–2 dimensões (regra de seleção no AVALIACAO.md §5.5) com:
  - Texto de 2–3 frases explicando **por que essa competência importa para o nível do participante** (não genérico: "Para um pleno, dados & programação é o que separa quem executa análise de quem desenha a solução...").
  - Nos pontos de atenção: menção concreta de 1–2 tópicos errados pelo participante (derivados das `category`+`explanation` das questões erradas), formulados como tema, nunca como "você errou a questão X": "Vale revisitar: marcação a mercado vs. curva; descasamento de liquidez em fundos."
- Aqui está o maior valor percebido do relatório: é o momento "isso foi escrito para mim".

### S5 — Skills de maior impacto para sua promoção (seção-assinatura)
- Título: **"Onde investir primeiro para chegar a [próximo nível]"** (aspirante→primeira vaga; sênior→liderança técnica/gestão).
- Exibe as **2 dimensões de maior `prioridade`** (fórmula do AVALIACAO.md §5.4: gap × peso de impacto do nível), cada uma como um card destacado com:
  1. Nome da dimensão + posição (#1, #2).
  2. **Por que agora:** 1–2 frases conectando a dimensão à realidade de mercado do próximo degrau (base: pesquisa de demanda — ex.: "Do júnior ao pleno, domínio de SQL/Python é hoje o critério de desempate mais citado em processos seletivos do mercado brasileiro").
  3. **Primeiro passo concreto:** uma ação de 1 linha (ex.: "Automatize uma rotina real sua em Python esta semana").
  4. **Trilha Syntaxis correspondente** → CTA (ver S7).
- Elemento visual: mini-gráfico de barras "impacto na sua promoção" mostrando `prioridade` das 5 dimensões, com as 2 primeiras em destaque — dá transparência ao ranking e reforça que o método é criterioso, não marketing.

### S6 — Gabarito comentado (colapsado)
- Accordion "Revisar minhas respostas" fechado por padrão.
- Por questão: enunciado, resposta do participante, resposta correta, `explanation`.
- Agrupado por dimensão; questões erradas primeiro.
- Fica DEPOIS do diagnóstico e ANTES do CTA final: quem abre está engajado; o conteúdo pedagógico das explicações é amostra do produto Syntaxis.

### S7 — CTA personalizado (nível × classificação)
- Bloco final com oferta da matriz nível × classificação (Baixo/Médio/Alto) já prevista no produto:
  - Copy do CTA referencia a dimensão #1 do S5 ("Comece pela trilha de Dados & Programação para nível pleno").
- Botões: primário (oferta) + secundário ("Receber este relatório por e-mail" — reforço do opt-in MailerLite).
- **Compartilhamento:** botão "Compartilhar meu radar" que gera imagem (OG/social card) contendo APENAS radar + classificação + logo — sem dados de contato. É o loop de aquisição orgânica do produto.

### S8 — Rodapé de método
- 3–4 linhas: o que o diagnóstico mede, com quantas questões, e as limitações declaradas (AVALIACAO.md §7) em linguagem acessível.
- Link "Como funciona a metodologia" (página/modal estático derivado do AVALIACAO.md).
- Este rodapé é obrigatório: a honestidade metodológica é parte do posicionamento de autoridade técnica da Syntaxis.

---

## 3. Especificações visuais

- **Tokens:** todas as cores, fontes e espaçamentos vêm do `tokens.json` do design system "O Sinal no Escuro". O relatório não introduz cor nova; estados semânticos (forte/atenção) usam variações tonais dos tokens existentes.
- **Radar:** biblioteca de gráficos já usada no app (Recharts, se o stack atual for esse); animação de entrada única (área cresce do centro, ~600ms, `prefers-reduced-motion` respeitado); sem animações contínuas.
- **Tipografia:** títulos de seção na fonte display da marca; corpo na fonte de leitura; números de score em tabular lining para alinhamento.
- **Impressão/PDF:** CSS `@media print` dedicado — relatório completo em 2 páginas A4, radar renderizado, accordion do gabarito expandido, CTAs suprimidos. (Versão "PDF por e-mail" pode reusar esse print stylesheet.)
- **Estados de dado:** o relatório deve renderizar corretamente os extremos — 0/15, 15/15, todas as dimensões empatadas — sem seção vazia e sem texto sem sentido (regras de desempate do AVALIACAO.md §5.5).

## 4. Conteúdo editorial fixo (não gerado em runtime)

Para garantir qualidade e tom, os textos do relatório vêm de uma matriz editorial estática (arquivo de conteúdo no repo), não de geração dinâmica:

- 15 microcopies de score card (5 dimensões × 3 faixas).
- 25 textos de "por que importa" (5 dimensões × 5 níveis) usados em S4/S5.
- 25 "primeiros passos" (5 dimensões × 5 níveis).
- 15 copies de CTA (5 níveis × 3 classificações).
- 5 frases-resumo de formato de radar (por dimensão dominante).

Total: ~85 blocos curtos de texto, todos revisáveis em um único arquivo de conteúdo — o que também facilita testes A/B de copy no futuro.

## 5. Métricas de sucesso do relatório

- % de participantes que rolam até S5 (scroll depth).
- % que abrem o gabarito (S6).
- CTR do CTA primário por célula nível × classificação.
- % de uso do "Compartilhar meu radar".
- Taxa de opt-in confirmado pós-relatório.
