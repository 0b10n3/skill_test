# Metodologia do Syntaxis Skill Check

> Referência viva, incorporada ao repositório no Épico 13 a partir de
> `AVALIACAO.md` (removido da raiz após esta incorporação — ver
> `specs/epicos/epico-13-qa-regressao-golive-v2.md`). Este documento é a
> fonte de verdade da metodologia daqui para frente; qualquer evolução do
> instrumento (novo item, novo peso, novo limiar de revisão) entra por PR
> aqui.

## 1. Princípio central

O Syntaxis Skill Check não mede "quanto a pessoa sabe de finanças" em
abstrato — mede a distância entre o perfil atual do participante e o perfil
esperado pelo mercado para o próximo degrau da carreira dele. Todo texto do
relatório usa a moldura "para um analista **[nível]**, o mercado espera...".

## 2. Framework de competências

Cinco dimensões, 3 questões cada, 15 questões no total:

| #   | Dimensão (`category`) | Cobertura                                                                                     |
| --- | --------------------- | --------------------------------------------------------------------------------------------- |
| D1  | `mercados-produtos`   | Renda fixa bancária, títulos públicos, debêntures, crédito estruturado (FIDC/CRI/CRA), SFN    |
| D2  | `matematica-quant`    | Matemática financeira, valor do dinheiro no tempo, duration/convexidade, estatística aplicada |
| D3  | `dados-programacao`   | Excel avançado, SQL, Python/pandas, engenharia de dados, qualidade/governança de dados        |
| D4  | `ia-aplicada`         | ML e IA generativa em finanças: casos de uso, limites, explicabilidade, viés                  |
| D5  | `risco-regulacao`     | Risco de mercado/crédito/liquidez, marcação a mercado, compliance, regulação (CVM/BCB/ANBIMA) |

Referenciais: nova grade de certificações ANBIMA (por competência
prática, não por cargo), CFA Institute Candidate Body of Knowledge, Guia
Salarial Robert Half e currículo Syntaxis.

## 3. Blueprint por senioridade

O banco (`content/questions.json`) tem 49 itens de conhecimento + 1 item de
senioridade (`q00`), dimensionado para que a seleção de 15 questões por
nível (3 por dimensão) seja **determinística e exata**. Distribuição de
dificuldade por nível:

| Senioridade | easy | medium | hard |
| ----------- | ---- | ------ | ---- |
| Aspirante   | 9    | 6      | 0    |
| Estagiário  | 6    | 7      | 2    |
| Júnior      | 2    | 8      | 5    |
| Pleno       | 0    | 6      | 9    |
| Sênior      | 0    | 4      | 11   |

Validado em CI por `scripts/validate-questions.mjs` (`npm run validate:questions`).

## 4. Modelo de pontuação

- `scoreDimensao[d] = acertos em d / 3`, arredondado a 2 casas (0 / 0.33 / 0.67 / 1).
- `scoreGlobal = acertos / 15`.
- **Classificação global** (por percentual de acerto, arredondado):
  - ≥ 80% (12–15 acertos) → **Alto**
  - 47–79% (7–11 acertos) → **Médio**
  - ≤ 46% (0–6 acertos) → **Baixo**

## 5. Peso de impacto e prioridade de desenvolvimento

Cada dimensão carrega um peso de impacto por nível — a importância da
dimensão **para o próximo degrau**, não para o nível atual
(`lib/diagnostico/career-impact-weights.ts`):

| Dimensão             | Aspirante→Estag. | Estag.→Júnior | Júnior→Pleno | Pleno→Sênior | Sênior→Liderança |
| -------------------- | ---------------- | ------------- | ------------ | ------------ | ---------------- |
| D1 mercados-produtos | 0.30             | 0.25          | 0.20         | 0.15         | 0.15             |
| D2 matematica-quant  | 0.25             | 0.25          | 0.25         | 0.20         | 0.15             |
| D3 dados-programacao | 0.20             | 0.25          | 0.25         | 0.25         | 0.20             |
| D4 ia-aplicada       | 0.10             | 0.10          | 0.15         | 0.20         | 0.25             |
| D5 risco-regulacao   | 0.15             | 0.15          | 0.15         | 0.20         | 0.25             |

```
prioridade[d] = (1 − scoreDimensao[d]) × pesoDeImpacto[nível][d]
```

As 2 dimensões de maior prioridade viram a seção "onde investir primeiro"
do relatório.

## 6. Pontos fortes e pontos de atenção

- **Forte:** `scoreDimensao ≥ 0.67`. **Atenção:** `scoreDimensao ≤ 0.33`.
- 1–2 dimensões em cada lista, nunca vazias — desempate simétrico por peso
  de impacto (maior peso primeiro), com fallback para o topo/base do
  ranking geral no caso degenerado de tudo empatado
  (`lib/diagnostico/compute-diagnostico.ts`).

## 7. Ciclo de qualidade do instrumento (telemetria de itens)

Cada submissão registra, por item respondido, o id e a alternativa
escolhida (`lib/diagnostico/persist-diagnostico.ts`, log estruturado
`[diagnostico]`, sem PII). `scripts/item-stats.mjs` agrega esses logs em
taxa de acerto e distribuição por alternativa, por item e por nível:

```bash
vercel logs <deployment> --json | node scripts/item-stats.mjs
# ou, com logs salvos localmente:
node scripts/item-stats.mjs caminho/para/logs.ndjson
```

**Quando revisar um item** (a cada ~200 respostas por nível):

- **Índice de dificuldade:** item com taxa de acerto > 90% ou < 25% no
  nível-alvo entra em revisão (não discrimina bem quem domina o conteúdo
  de quem não domina).
- **Distrator morto:** alternativa escolhida por < 5% dos respondentes →
  reescrever.
- Itens são **aposentados por substituição** quando revisados, nunca
  editados silenciosamente — preserva a comparabilidade histórica dos
  resultados já emitidos. O banco anterior vai para `data/archive/` (ver
  `data/archive/README.md`).

## 8. Limitações declaradas

- 15 questões produzem um **diagnóstico direcional**, não uma medida
  psicométrica de precisão certificatória (instrumentos certificatórios
  usam 50–120 itens).
- Múltipla escolha mede conhecimento e julgamento aplicado, **não**
  habilidade prática de programar, modelar ou comunicar.
- A senioridade é autodeclarada; o resultado deve ser lido como "em
  relação à expectativa do nível que você declarou".

## 9. Referências

- Haladyna, Downing & Rodriguez (2002). _A review of multiple-choice item-writing guidelines for classroom assessment._
- Rodriguez (2005). _Three options are optimal for multiple-choice items._
- ANBIMA. Novas certificações (CPA, C-Pro R, C-Pro I) — grade 2026.
- CFA Institute. _Candidate Body of Knowledge (CBOK)._
- Robert Half. _Guia Salarial Brasil 2026._
