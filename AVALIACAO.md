# AVALIACAO.md — Metodologia de Avaliação de Skills | Syntaxis Skill Check

> **Propósito deste arquivo:** especificação de referência (SSOT) da metodologia de avaliação do Syntaxis Skill Check. Serve de fundamento para `QUESTIONS.json` (banco de questões), `REPORT.md` (design do relatório) e para os épicos de implementação (`epico-10` em diante). Pode ser removido do repositório após a implementação.

---

## 1. Visão geral

O Syntaxis Skill Check é uma avaliação diagnóstica (não certificatória) de skills técnicas para profissionais do mercado financeiro brasileiro. O participante declara sua senioridade e responde **15 questões de múltipla escolha** calibradas para as expectativas de mercado daquele nível. O resultado é um relatório individual com radar de competências, pontos fortes e fracos, e as skills de maior alavancagem para promoção.

**Princípio central:** a avaliação não mede "quanto a pessoa sabe de finanças" em abstrato — mede **a distância entre o perfil atual do participante e o perfil esperado pelo mercado para o próximo degrau da carreira dele**. É isso que torna o resultado acionável (e comercialmente relevante para a Syntaxis).

---

## 2. Fundamentos e referências

### 2.1 Construção de itens de múltipla escolha (psicometria aplicada)

A metodologia segue as diretrizes consolidadas de item-writing da literatura de avaliação educacional, em especial a taxonomia de Haladyna, Downing & Rodriguez (2002) e suas revisões posteriores:

1. **Blueprint antes dos itens.** Todo item nasce de uma matriz de especificação (test blueprint) que cruza *dimensão de competência × nível cognitivo × senioridade*. Nenhuma questão é escrita "solta" — cada uma ocupa uma célula da matriz (ver §4). Isso garante cobertura balanceada e independência local entre itens.
2. **Um objetivo por item.** Cada questão avalia um único conceito/habilidade. Itens que misturam dois conceitos não discriminam bem quem domina apenas um deles.
3. **Enunciado (stem) como problema completo.** O participante deve conseguir formular mentalmente a resposta antes de ler as alternativas. Preferência por vignettes/cenários realistas de mesa de operação, área de crédito ou time de dados — que avaliam aplicação, não decoreba.
4. **Distratores plausíveis, derivados de erros reais.** Os distratores codificam concepções erradas frequentes no mercado brasileiro (ex.: "FGC garante rentabilidade", "renda fixa nunca perde valor", "marcação a mercado altera o valor de face"). Distrator implausível é alternativa desperdiçada.
5. **Sem "todas as anteriores" / "nenhuma das anteriores".** A literatura psicométrica mostra que essas alternativas aumentam dificuldade sem aumentar poder discriminativo (o participante acerta por eliminação, não por conhecimento positivo).
6. **Stem positivo.** Evitar "qual NÃO é..." — quando inevitável, destacar a negação.
7. **Alternativas homogêneas em tamanho e estrutura.** A alternativa correta não pode ser identificável por ser "a mais longa e cheia de ressalvas". Regra prática: distratores com comprimento e especificidade comparáveis à resposta correta.
8. **4 alternativas (1 correta + 3 distratores).** A meta-análise de Rodriguez (2005) indica que 3 alternativas já otimizam a relação qualidade psicométrica × tempo; mantemos 4 por convenção do mercado brasileiro (padrão ANBIMA/CFA), com a exigência de que os 3 distratores sejam genuinamente funcionais.
9. **Dificuldade-alvo moderada.** Calibrar para acerto médio esperado de 55–75% dentro do nível-alvo. Itens com acerto ~90% ou ~20% não diferenciam participantes.
10. **Explicação pedagógica em todo item.** Cada questão carrega `explanation` — o feedback é parte do produto educacional (efeito de teste como aprendizagem) e alimenta o relatório.

### 2.2 Níveis cognitivos (Bloom revisado, versão operacional)

Cada item é classificado em um de três níveis, com distribuição que muda por senioridade:

| Nível cognitivo | O que exige | Exemplo |
|---|---|---|
| **Lembrar/Compreender** | Definições, características, "o que é" | O que caracteriza renda fixa |
| **Aplicar** | Usar o conceito num caso concreto, calcular, escolher a ferramenta | Dado um cenário de alta de juros, qual título sofre mais |
| **Analisar/Avaliar** | Comparar estruturas, diagnosticar risco, decidir sob trade-off | Debênture vs. cota de FIDC do ponto de vista de risco de crédito |

### 2.3 Referenciais de conteúdo (mercado brasileiro)

O quadro de competências foi ancorado em referenciais reconhecidos, para que a avaliação "converse" com o que o mercado de fato cobra:

- **ANBIMA — nova grade de certificações (2026): CPA, C-Pro R, C-Pro I, CFG, CGA.** A reestruturação da ANBIMA passou a certificar por *atividade exercida* e competência prática, não por cargo/instituição — mesmo princípio adotado aqui (avaliar por expectativa de função, não por título). Os blocos programáticos (Sistema Financeiro Nacional, produtos de investimento, análise de carteiras, gestão de risco) informam as dimensões 1, 2 e 5 do framework.
- **CFA Institute — Candidate Body of Knowledge**, para a progressão de profundidade quantitativa e de análise de renda fixa entre níveis.
- **Guia Salarial Robert Half 2026 (Brasil)** e levantamentos de mercado correlatos: as competências técnicas mais demandadas no setor financeiro brasileiro combinam análise de dados (SQL, Python, Power BI), análise financeira, gestão de riscos, regulação e aplicações de IA generativa — profissionais que unem finanças + tecnologia + regulação seguem escassos e disputados. Isso fundamenta o peso das dimensões 3 e 4 do framework.
- **Currículo Syntaxis** (renda fixa bancária, TPF, debêntures, crédito estruturado/FIDC, Python, SQL, Databricks, estatística e ciência de dados aplicada), que define o recorte de conteúdo dentro de cada dimensão.

---

## 3. Framework de competências (eixos do radar)

Cinco dimensões, escolhidas para (a) cobrir o que o mercado brasileiro cobra por nível, (b) mapear 1:1 nos eixos do radar do relatório e (c) mapear na oferta de cursos da Syntaxis:

| # | Dimensão (`category` no JSON) | O que cobre |
|---|---|---|
| D1 | `mercados-produtos` | Renda fixa bancária, títulos públicos federais, debêntures, crédito estruturado (FIDC/CRI/CRA), funcionamento do SFN |
| D2 | `matematica-quant` | Matemática financeira, valor do dinheiro no tempo, duration/convexidade, probabilidade e estatística aplicada |
| D3 | `dados-programacao` | Excel avançado, SQL, Python/pandas, noções de engenharia de dados (Databricks/cloud), qualidade e governança de dados |
| D4 | `ia-aplicada` | Machine learning e IA generativa em finanças: casos de uso, limites, explicabilidade (XAI), viés, produtividade com LLMs |
| D5 | `risco-regulacao` | Risco de mercado/crédito/liquidez, marcação a mercado, compliance, regulação (CVM/BCB/ANBIMA), governança de modelos |

**Consequência de design:** 15 questões = **3 questões por dimensão**. Com 3 itens por eixo, o score por eixo tem granularidade de 0–3 (0%, 33%, 67%, 100%) — suficiente para diagnóstico direcional num instrumento de funil de marketing, e honesto quanto ao que 15 questões conseguem medir (ver §7, Limitações).

---

## 4. Blueprint por senioridade

A mesma dimensão é avaliada em todos os níveis, mas com **conteúdo e nível cognitivo diferentes**. A tabela abaixo é a matriz de especificação que o banco de questões (`QUESTIONS.json`) implementa.

### 4.1 Perfil esperado por nível (síntese da pesquisa)

- **Aspirante / não profissional:** alfabetização financeira sólida — entender produtos, juros compostos, risco básico, para que serve dado/IA no setor. Distância a fechar: vocabulário e fundamentos para conseguir a primeira posição.
- **Estagiário:** fundamentos operacionais — características formais dos produtos (tributação, garantias, indexadores), matemática financeira aplicada, Excel/SQL básico, noção de compliance. Distância: sair do conceitual para o operacional.
- **Júnior:** execução com autonomia — precificação básica, marcação a mercado, SQL de verdade, Python para análise, estatística descritiva/inferencial, entender o risco do que opera. Distância: profundidade técnica e leitura de risco.
- **Pleno:** análise e estruturação — duration/convexidade, estruturas de crédito (subordinação, waterfall), modelagem, pipeline de dados, avaliação crítica de modelos de ML, interlocução com risco/compliance. Distância: sair da execução para o desenho de soluções.
- **Sênior:** decisão e governança — trade-offs de alocação e estrutura, governança de modelos e de dados, regulação como variável estratégica, liderança técnica na adoção de IA. Distância: julgamento sob incerteza e responsabilidade regulatória.

### 4.2 Distribuição de dificuldade e nível cognitivo por senioridade

| Senioridade | easy | medium | hard | Mix cognitivo dominante |
|---|---|---|---|---|
| Aspirante | 9 | 6 | 0 | Compreender > Aplicar |
| Estagiário | 6 | 7 | 2 | Compreender ≈ Aplicar |
| Júnior | 2 | 8 | 5 | Aplicar > Analisar |
| Pleno | 0 | 6 | 9 | Aplicar ≈ Analisar |
| Sênior | 0 | 4 | 11 | Analisar/Avaliar |

*("easy/medium/hard" é sempre relativo ao instrumento como um todo; para o participante, a prova do seu nível deve parecer moderadamente desafiadora — acerto médio esperado de 55–75%.)*

### 4.3 Seleção das 15 questões

- O campo `targetSeniority` de cada item lista os níveis para os quais o item é válido (itens podem ser compartilhados entre níveis adjacentes — prática padrão de bancos de itens, que também permitirá equating futuro entre níveis).
- O motor de seleção do app filtra o banco por `targetSeniority` contendo o nível declarado e monta a prova com **exatamente 3 itens por dimensão**, respeitando a distribuição de dificuldade do nível (§4.2).
- O banco em `QUESTIONS.json` foi dimensionado para que essa seleção seja **determinística e exata** (cada nível tem exatamente 3 itens por dimensão disponíveis). Se o banco crescer no futuro, a seleção passa a sortear dentro de cada célula *dimensão × dificuldade*.

---

## 5. Modelo de pontuação

### 5.1 Score bruto e score por dimensão

- Cada item vale 1 ponto (sem penalidade por erro — instrumento diagnóstico, não seletivo).
- `scoreDimensao[d] = acertos em d / 3` (0, 0.33, 0.67, 1).
- `scoreGlobal = acertos / 15`.

### 5.2 Classificação global (mantida do app atual)

| Faixa | Classificação |
|---|---|
| ≥ 80% (12–15) | **Alto** — perfil acima da expectativa do nível |
| 47–79% (7–11) | **Médio** — perfil dentro da expectativa, com gaps específicos |
| ≤ 46% (0–6) | **Baixo** — gaps estruturais para o nível declarado |

### 5.3 Pesos de impacto para promoção (núcleo do diagnóstico)

Para responder "quais skills mais alavancam sua promoção", cada dimensão carrega um **peso de impacto por nível** (`careerImpactWeight`), derivado da pesquisa de demanda de mercado (§2.3): é a importância da dimensão **para o próximo degrau**, não para o atual.

| Dimensão | Aspirante→Estag. | Estag.→Júnior | Júnior→Pleno | Pleno→Sênior | Sênior→Liderança |
|---|---|---|---|---|---|
| D1 mercados-produtos | 0.30 | 0.25 | 0.20 | 0.15 | 0.15 |
| D2 matematica-quant | 0.25 | 0.25 | 0.25 | 0.20 | 0.15 |
| D3 dados-programacao | 0.20 | 0.25 | 0.25 | 0.25 | 0.20 |
| D4 ia-aplicada | 0.10 | 0.10 | 0.15 | 0.20 | 0.25 |
| D5 risco-regulacao | 0.15 | 0.15 | 0.15 | 0.20 | 0.25 |

**Racional:** no início da carreira, fundamentos de produto e matemática abrem portas; do júnior ao pleno, dados/programação é o maior diferenciador competitivo no mercado brasileiro atual; do pleno para cima, IA aplicada e risco/regulação/governança são o que separa executores de decisores (consistente com Robert Half 2026 e com a reformulação da ANBIMA).

### 5.4 Índice de prioridade de desenvolvimento

Para cada dimensão:

```
prioridade[d] = (1 − scoreDimensao[d]) × careerImpactWeight[nivel][d]
```

Ordena-se `prioridade` decrescente. As **2 primeiras dimensões** são apresentadas no relatório como "skills de maior impacto para sua promoção" — é o gap ponderado pela relevância de mercado. Uma dimensão com score baixo mas peso baixo perde para uma dimensão com score médio e peso alto: exatamente o comportamento desejado.

### 5.5 Pontos fortes e fracos

- **Ponto forte:** dimensão com `scoreDimensao ≥ 0.67` (2–3 acertos). Empate: maior peso de impacto primeiro.
- **Ponto fraco:** dimensão com `scoreDimensao ≤ 0.33` (0–1 acerto).
- Sempre exibir ao menos 1 forte e 1 fraco (se tudo empatar, usar prioridade §5.4 como desempate) — o relatório nunca pode ser vazio.

---

## 6. Ciclo de vida do instrumento (qualidade contínua)

1. **Revisão editorial pré-lançamento:** todo item revisado por um segundo par de olhos contra o checklist §2.1 (idealmente alguém *menos* especialista, para pegar ambiguidade).
2. **Telemetria de itens:** o app registra, por item: taxa de acerto, distribuição de respostas por alternativa e senioridade do respondente.
3. **Análise psicométrica periódica** (a cada ~200 respostas por nível):
   - *Índice de dificuldade (p):* itens com p > 0.90 ou p < 0.25 no nível-alvo entram em revisão.
   - *Discriminação (correlação item-total, point-biserial):* itens com r < 0.15 entram em revisão.
   - *Análise de distratores:* distrator escolhido por < 5% dos respondentes é distrator morto → reescrever.
4. **Versionamento do banco:** `QUESTIONS.json` versionado no repositório; itens substituídos são aposentados, nunca editados silenciosamente (preserva comparabilidade histórica dos resultados).

---

## 7. Limitações declaradas (honestidade do instrumento)

Estas limitações devem aparecer, em linguagem acessível, no rodapé do relatório:

- 15 questões produzem um **diagnóstico direcional**, não uma medida psicométrica de precisão certificatória (a confiabilidade de um teste cresce com o número de itens — instrumentos certificatórios usam 50–120).
- Múltipla escolha mede conhecimento e julgamento aplicado, **não** habilidade prática de programar, modelar ou comunicar — por isso o relatório recomenda próximos passos práticos, não "aprova/reprova".
- A senioridade é autodeclarada; o resultado deve ser lido como "em relação à expectativa do nível que você declarou".

---

## 8. Referências

- Haladyna, T. M., Downing, S. M., & Rodriguez, M. C. (2002). *A review of multiple-choice item-writing guidelines for classroom assessment.* Applied Measurement in Education, 15(3), 309–334.
- Rodriguez, M. C. (2005). *Three options are optimal for multiple-choice items: A meta-analysis of 80 years of research.* Educational Measurement: Issues and Practice, 24(2), 3–13.
- Butler, A. C. (2018). *Multiple-choice testing in education: Are the best practices for assessment also good for learning?* Journal of Applied Research in Memory and Cognition, 7(3), 323–331.
- Brame, C. J. (2013). *Writing good multiple choice test questions.* Vanderbilt University Center for Teaching.
- Anderson, L. W., & Krathwohl, D. R. (2001). *A taxonomy for learning, teaching, and assessing: A revision of Bloom's taxonomy.*
- ANBIMA. *Novas certificações (CPA, C-Pro R, C-Pro I) — grade 2026 e conteúdos programáticos.* anbima.com.br / anbimaedu.com.br.
- CFA Institute. *Candidate Body of Knowledge (CBOK).*
- Robert Half. *Guia Salarial Brasil 2026* — competências técnicas mais demandadas no setor financeiro.
