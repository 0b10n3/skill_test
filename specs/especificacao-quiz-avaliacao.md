# ESPECIFICAÇÃO — Estrutura do Quiz e Lógica de Avaliação

## Syntaxis Skill Check (v2 — quiz adaptativo por senioridade)

Esta é a revisão da especificação anterior. Mudança central: **a senioridade deixa de ser uma etapa de onboarding separada e passa a ser a primeira pergunta do próprio quiz**, e o conteúdo das perguntas seguintes passa a ser **selecionado dinamicamente conforme a senioridade declarada**, refletindo o que o mercado espera de cada nível.

---

## 1. RACIONAL DE MERCADO (o que moldou o conteúdo do quiz)

Mantém-se o racional já levantado na v1 (IA operacional no dia a dia das instituições financeiras, SQL/Python como diferencial salarial no Brasil, demanda por perfil híbrido produto+dados, explicabilidade/governança de IA ganhando relevância). O que muda nesta versão é reconhecer que **essas expectativas não são as mesmas em todos os níveis de carreira**:

- Um aspirante precisa entender o que é e para que serve cada ferramenta/produto.
- Um estagiário/júnior precisa operar essas ferramentas e produtos no dia a dia.
- Um pleno precisa ter autonomia analítica e aplicar isso de forma independente.
- Um sênior precisa enxergar risco, estratégia e governança por trás de cada decisão — inclusive quando não é ele quem "roda o código", mas quem responde pelas consequências da decisão.

O quiz deve refletir essa progressão, e não tratar um estagiário e um analista sênior com a mesma régua de conteúdo.

---

## 2. ESTRUTURA DO QUIZ

### 2.1 Pergunta 1 — Senioridade (não pontua, mas já é parte do quiz)

A primeira pergunta exibida, dentro do próprio fluxo do quiz (não mais uma tela de onboarding separada), pergunta a senioridade atual do participante:

> "Como você descreveria seu momento atual no mercado financeiro?"

| id           | label                                                             |
| ------------ | ----------------------------------------------------------------- |
| `aspirante`  | Aspirante / Investidor — ainda não trabalho no mercado financeiro |
| `estagiario` | Estagiário                                                        |
| `junior`     | Analista Júnior                                                   |
| `pleno`      | Analista Pleno                                                    |
| `senior`     | Analista Sênior                                                   |

Essa resposta **não entra no cálculo do score** (é classificatória, não uma pergunta de conhecimento), mas determina imediatamente **quais das próximas perguntas serão exibidas**.

### 2.2 Banco de perguntas por categoria e por senioridade

Em vez de um conjunto único de perguntas para todo mundo, cada pergunta de conhecimento carrega um campo `targetSeniority`: os níveis de senioridade para os quais aquele conteúdo é apropriado. O banco desta v1 tem **7 perguntas por categoria** (28 no total), distribuídas em faixas de profundidade que avançam de fundamentos até estratégia/governança:

| Faixa (não é campo do JSON, é lógica de organização) | Profundidade                                           | Níveis-alvo típicos           |
| ---------------------------------------------------- | ------------------------------------------------------ | ----------------------------- |
| Fundamentos                                          | "o que é" / "para que serve"                           | aspirante, estagiário         |
| Fundamentos ampliados                                | ainda conceitual, mas já checável em nível operacional | aspirante, estagiário, júnior |
| Operacional/Aplicado                                 | uso prático no dia a dia                               | estagiário, júnior, pleno     |
| Aplicado avançado                                    | autonomia analítica, entende limitações                | júnior, pleno, sênior         |
| Estratégico/Governança                               | risco, decisão, liderança, compliance                  | pleno, sênior                 |

Ao selecionar as perguntas de uma sessão, o app filtra o banco de cada categoria pelas perguntas cujo `targetSeniority` inclui o nível declarado em Q1, e sorteia 3 delas (se houver exatamente 3 elegíveis, usa as 3; se houver mais, sorteia para variar entre sessões). Isso garante que:

- **Aspirante e Sênior**, que são as pontas do espectro, sempre têm pelo menos 3 perguntas elegíveis por categoria (o banco foi desenhado propositalmente para isso — ver seção 7).
- **Estagiário, Júnior e Pleno**, no meio do espectro, têm um pool um pouco maior (4–5 perguntas elegíveis por categoria), o que já dá alguma variedade entre sessões diferentes.

Resultado: cada sessão mostra **1 pergunta de senioridade + 12 perguntas de conhecimento (3 por categoria, adaptadas ao nível) + 1 pergunta de autoavaliação = 14 perguntas**, dentro da janela de 10–15 definida no objetivo do produto.

### 2.3 Três tipos de pergunta no schema

- **`seniority`**: pergunta única, fixa, sempre a primeira (`q00`). Não pontua. Define o filtro de conteúdo.
- **`knowledge`**: pergunta objetiva com `correctOptionId` e `targetSeniority`. Pontua.
- **`self_assessment`**: pergunta de autopercepção sobre uso de ferramentas de dados, sempre a última do quiz. Não pontua — alimenta apenas a personalização da narrativa do resultado (ver seção 6, inalterada da v1).

---

## 3. BOAS PRÁTICAS DE ITEM-WRITING APLICADAS

Mantêm-se as práticas já definidas na v1 (4 alternativas, distratores plausíveis, sem pegadinha, sem números que ficam obsoletos, explicação reservada para uso futuro em feedback). Nesta v2, adiciona-se um critério: **o distrator de cada pergunta deve refletir um erro plausível para o nível de senioridade-alvo daquela pergunta** — por exemplo, uma pergunta de nível "Fundamentos" (aspirante/estagiário) usa distratores que testam confusão conceitual básica, enquanto uma pergunta "Estratégico/Governança" (pleno/sênior) usa distratores que soam operacionalmente corretos mas ignoram o risco ou a implicação regulatória — é isso que torna a pergunta genuinamente mais difícil, não apenas o vocabulário mais rebuscado.

---

## 4. LÓGICA DE PONTUAÇÃO

### 4.1 O que pontua e o que não pontua

Inalterado: apenas `knowledge` pontua (1 ponto por acerto, sem punição por erro), sempre calculado no servidor, gabarito nunca exposto ao client antes da submissão.

### 4.2 Cálculo do score

```
scoreGeral (%) = (Σ acertos em knowledge / 12) × 100
scorePorCategoria (%) = (acertos na categoria / 3) × 100
```

### 4.3 Classificação Baixo / Médio / Alto — agora com régua única

Na v1, como todo mundo respondia as mesmas 12 perguntas, era preciso ajustar a faixa de corte por senioridade (senão um sênior e um aspirante seriam julgados pela mesma régua num teste que não diferenciava o nível deles). **Nesta v2 isso não é mais necessário**: como o próprio conteúdo das 12 perguntas já é calibrado ao nível declarado, a dificuldade already embute a expectativa de cada senioridade. Usar faixas de corte diferentes por cima disso seria ajustar duas vezes a mesma coisa. Por isso, a régua de classificação agora é **única para todos os níveis**:

| Faixa | Score      |
| ----- | ---------- |
| Baixo | 0% – 39%   |
| Médio | 40% – 69%  |
| Alto  | 70% – 100% |

"Alto" para um aspirante significa dominar bem os fundamentos esperados de quem está começando; "Alto" para um sênior significa dominar bem conteúdo de risco/estratégia/governança — são padrões de exigência diferentes por construção do conteúdo, não por um número de corte diferente.

---

## 5. RANDOMIZAÇÃO E INTEGRIDADE DO TESTE

- **Seleção por categoria**: filtra por `targetSeniority` incluindo o nível de Q1 → sorteia 3 entre as elegíveis (seção 2.2).
- **Ordem de exibição**: Q1 (senioridade) sempre primeiro; as 12 perguntas de conhecimento selecionadas são embaralhadas entre categorias (não agrupadas visualmente por categoria, para não sinalizar ao participante "agora vem a parte de tecnologia"); a pergunta de autoavaliação sempre por último.
- **Ordem das alternativas**: embaralhada a cada sessão, como na v1.
- Reforçando o requisito de segurança já definido: `correctOptionId` e `targetSeniority` completo do banco nunca trafegam para o client antes da submissão — o client só recebe as perguntas já filtradas e sem gabarito.

---

## 6. PERSONALIZAÇÃO DO RESULTADO COM BASE NO ITEM DE AUTOAVALIAÇÃO

Inalterado em relação à v1: o `profileTag` da pergunta de autoavaliação cruzado com `scorePorCategoria` de `dados-tecnologia` e `ia-aplicada-financas` alimenta a narrativa do resultado (não a classificação), via `buildResultNarrative()`.

---

## 7. LIMITAÇÕES CONHECIDAS DESTA V2 E EVOLUÇÃO FUTURA

- **Aspirante e Sênior têm o pool mais restrito** (exatamente 3 perguntas elegíveis por categoria, ver seção 2.2) — praticamente sem variação entre sessões para esses dois níveis. É o primeiro lugar a expandir o banco quando houver volume de uso.
- A régua única (seção 4.3) só é válida **enquanto a diferença de dificuldade entre níveis for real e consistente** — se no futuro o banco crescer de forma desbalanceada (ex: perguntas "fáceis demais" adicionadas só para sênior), a régua deixa de ser justa e precisa ser revisitada.
- Assim como na v1, 3 itens por categoria por sessão é uma leitura diagnóstica rápida, não um teste psicometricamente robusto — a limitação sobre o radar chart (seção 4.2 da v1) permanece válida.
- Evolução natural: ampliar o banco por nível (especialmente aspirante e sênior) e, com dados reais de resposta, migrar de faixas fixas para calibração por índice de dificuldade e discriminação por item (item analysis).

---

## 8. SCHEMA DO JSON (contrato de dados) — atualizado

```ts
type QuestionType = 'seniority' | 'knowledge' | 'self_assessment';
type SeniorityLevel = 'aspirante' | 'estagiario' | 'junior' | 'pleno' | 'senior';
type Category =
  | 'produtos-renda-fixa'
  | 'matematica-financeira-estatistica'
  | 'dados-tecnologia'
  | 'ia-aplicada-financas'
  | 'perfil-senioridade' // usado só pelo item type "seniority"
  | 'perfil-tecnico'; // usado só pelo item type "self_assessment"
type Difficulty = 'easy' | 'medium' | 'hard';

interface Option {
  id: string; // "a".."d", ou os próprios ids de SeniorityLevel no item de senioridade
  text: string;
  profileTag?: string; // só em perguntas self_assessment
}

interface Question {
  id: string; // "q00" (senioridade), "q01".."q28" (conhecimento), "q29" (autoavaliação)
  type: QuestionType;
  category: Category;
  difficultyLevel?: Difficulty; // ausente em seniority e self_assessment
  targetSeniority?: SeniorityLevel[]; // obrigatório e só existe em type === "knowledge"
  question: string;
  options: Option[];
  correctOptionId?: string; // obrigatório se type === "knowledge"
  explanation?: string; // obrigatório se type === "knowledge"
}
```

O arquivo `content/questions.json` (entregue em anexo, 30 itens) segue exatamente esse contrato.

---

## Fontes consultadas

- https://www.databricks.com/blog/8-ai-and-data-trends-shaping-financial-services-2026
- https://blastgroup.org/content/quanto-ganha-quem-sabe-sql-no-brasil-2025-2026/
- https://radleyjames.com/news-and-insights/industry-knowledge/how-has-the-data-science-career-path-changed-in-2026
- https://paytrack.com.br/blog/profissional-financeiro/
- https://uwaterloo.ca/centre-for-teaching-excellence/catalogs/tip-sheets/designing-multiple-choice-questions
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10461025/
